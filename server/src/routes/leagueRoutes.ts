import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../db/supabase.js';
import { logger } from '../utils/logger.js';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/authMiddleware.js';

const router = Router();

const CreateLeagueSchema = z.object({
  name: z.string().min(3, 'League name must be at least 3 characters').max(40),
});

const JoinLeagueSchema = z.object({
  code: z.string().min(4).max(10),
});

function generateLeagueCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function computeLiveScoresMap(targetGw?: number): Promise<Map<number, number>> {
  const liveSquadScoreMap = new Map<number, number>();

  try {
    let resolvedGw = targetGw;
    if (!resolvedGw) {
      const { data: currentGw } = await supabase
        .from('gameweeks')
        .select('id')
        .eq('is_current', true)
        .maybeSingle();
      resolvedGw = currentGw?.id || 1;
    }

    // 1. Fetch live player stats for this GW
    const { data: playerGwStats } = await supabase
      .from('player_gw_stats')
      .select('player_id, total_points')
      .eq('gw', resolvedGw);

    const playerLiveStatsMap = new Map<number, number>();
    (playerGwStats || []).forEach((s: any) => {
      playerLiveStatsMap.set(s.player_id, s.total_points || 0);
    });

    // 2. Fetch chips
    const { data: activeChips } = await supabase
      .from('chips_used')
      .select('user_id, chip')
      .eq('gw', resolvedGw);

    const userChipMap = new Map<number, string>();
    (activeChips || []).forEach((c: any) => {
      userChipMap.set(c.user_id, c.chip);
    });

    // 3. Fetch all user squads
    const { data: allSquads } = await supabase
      .from('squad')
      .select('user_id, player_id, slot, is_captain, is_vice, players(position)')
      .order('slot', { ascending: true });

    (allSquads || []).forEach((item: any) => {
      if (item.slot <= 5) {
        const is3xc = userChipMap.get(item.user_id) === '3xc';
        const multiplier = item.is_captain ? (is3xc ? 3 : 2) : 1;
        const pts = playerLiveStatsMap.get(item.player_id) ?? 0;

        const current = liveSquadScoreMap.get(item.user_id) || 0;
        liveSquadScoreMap.set(item.user_id, current + (pts * multiplier));
      }
    });
  } catch (err) {
    logger.error(err, 'Error computing live squad scores map');
  }

  return liveSquadScoreMap;
}

// GET /api/leagues/leaderboard (Global Overall, Weekly, or Monthly Leaderboard)
router.get('/leaderboard', async (req: Request, res: Response): Promise<void> => {
  try {
    const type = (req.query.type as string) || 'overall'; // 'overall' | 'weekly' | 'monthly'
    let targetGw = req.query.gw ? parseInt(req.query.gw as string, 10) : undefined;
    if (!targetGw) {
      const { data: currentGwRecord } = await supabase
        .from('gameweeks')
        .select('id')
        .eq('is_current', true)
        .maybeSingle();
      targetGw = currentGwRecord?.id || 1;
    }
    const targetMonth = (req.query.month as string) || 'august';

    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '50', 10);
    const offset = (page - 1) * limit;

    // Fetch all users
    const { data: usersData, count, error } = await supabase
      .from('users')
      .select('id, team_name, email', { count: 'exact' });

    if (error || !usersData) {
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to fetch leaderboard.' } });
      return;
    }

    let query = supabase.from('gw_scores').select('user_id, gw, net_points');

    if (type === 'weekly') {
      query = query.eq('gw', targetGw);
    } else if (type === 'monthly') {
      const monthGwMap: Record<string, [number, number]> = {
        august: [1, 3],
        september: [4, 6],
        october: [7, 10],
        november: [11, 13],
        december: [14, 19],
        january: [20, 24],
        february: [25, 27],
        march: [28, 30],
        april: [31, 34],
        may: [35, 38],
      };
      const [startGw, endGw] = monthGwMap[targetMonth.toLowerCase()] || [1, 38];
      query = query.gte('gw', startGw).lte('gw', endGw);
    }

    const { data: totalScores } = await query;

    const scoreMap = new Map<number, number>();
    (totalScores || []).forEach((s: any) => {
      const current = scoreMap.get(s.user_id) || 0;
      scoreMap.set(s.user_id, current + s.net_points);
    });

    const liveScores = await computeLiveScoresMap(targetGw);

    const leaderboard = usersData
      .map((u: any) => {
        const scoreFromTable = scoreMap.get(u.id);
        const finalScore = (scoreFromTable !== undefined && scoreFromTable !== 0)
          ? scoreFromTable
          : (liveScores.get(u.id) || 0);

        return {
          userId: u.id,
          teamName: u.team_name,
          totalPoints: finalScore,
        };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(offset, offset + limit)
      .map((item, idx) => ({ rank: offset + idx + 1, ...item }));

    res.status(200).json({
      leaderboard,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err) {
    logger.error(err, 'Error in GET /api/leagues/leaderboard');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch leaderboard.' } });
  }
});

// GET /api/leagues (User's mini-leagues)
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { data: memberships } = await supabase
      .from('league_members')
      .select('league_id, joined_gw, leagues(*)')
      .eq('user_id', userId);

    res.status(200).json({ leagues: memberships || [] });
  } catch (err) {
    logger.error(err, 'Error in GET /api/leagues');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch leagues.' } });
  }
});

// POST /api/leagues (Create private mini-league)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const parseResult = CreateLeagueSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { code: 'INVALID_INPUT', details: parseResult.error.flatten() },
      });
      return;
    }

    const { name } = parseResult.data;

    // Get current GW for start_gw
    const { data: currentGw } = await supabase
      .from('gameweeks')
      .select('id')
      .eq('is_current', true)
      .single();

    const startGw = currentGw ? currentGw.id : 1;
    const code = generateLeagueCode();

    const { data: newLeague, error: createErr } = await supabase
      .from('leagues')
      .insert({
        name,
        code,
        owner_id: userId,
        start_gw: startGw,
      })
      .select('*')
      .single();

    if (createErr || !newLeague) {
      logger.error(createErr, 'Failed to create league');
      res.status(500).json({ error: { code: 'CREATE_FAILED', message: 'Failed to create mini-league.' } });
      return;
    }

    // Auto-join owner to league
    await supabase.from('league_members').insert({
      league_id: newLeague.id,
      user_id: userId,
      joined_gw: startGw,
    });

    res.status(201).json({ league: newLeague });
  } catch (err) {
    logger.error(err, 'Error in POST /api/leagues');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to create league.' } });
  }
});

// POST /api/leagues/join (Join mini-league via invite code)
router.post('/join', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const parseResult = JoinLeagueSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { code: 'INVALID_INPUT', details: parseResult.error.flatten() },
      });
      return;
    }

    const { code } = parseResult.data;

    const { data: league } = await supabase
      .from('leagues')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .single();

    if (!league) {
      res.status(404).json({ error: { code: 'LEAGUE_NOT_FOUND', message: 'Invalid league code.' } });
      return;
    }

    // Check existing membership
    const { data: existing } = await supabase
      .from('league_members')
      .select('*')
      .eq('league_id', league.id)
      .eq('user_id', userId)
      .single();

    if (existing) {
      res.status(400).json({ error: { code: 'ALREADY_MEMBER', message: 'You are already a member of this league.' } });
      return;
    }

    const { data: currentGw } = await supabase
      .from('gameweeks')
      .select('id')
      .eq('is_current', true)
      .single();

    const joinedGw = currentGw ? currentGw.id : 1;

    await supabase.from('league_members').insert({
      league_id: league.id,
      user_id: userId,
      joined_gw: joinedGw,
    });

    res.status(200).json({ message: `Successfully joined league "${league.name}".`, league });
  } catch (err) {
    logger.error(err, 'Error in POST /api/leagues/join');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to join league.' } });
  }
});

// GET /api/leagues/:id/standings
router.get('/:id/standings', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const leagueId = parseInt(String(req.params.id), 10);

    const { data: league } = await supabase
      .from('leagues')
      .select('*')
      .eq('id', leagueId)
      .single();

    if (!league) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'League not found.' } });
      return;
    }

    const { data: members } = await supabase
      .from('league_members')
      .select('user_id, joined_gw, users(team_name)')
      .eq('league_id', leagueId);

    if (!members || members.length === 0) {
      res.status(200).json({ league, standings: [] });
      return;
    }

    const memberUserIds = members.map((m: any) => m.user_id);

    const { data: scores } = await supabase
      .from('gw_scores')
      .select('user_id, gw, net_points')
      .in('user_id', memberUserIds)
      .gte('gw', league.start_gw);

    const scoreMap = new Map<number, number>();
    (scores || []).forEach((s: any) => {
      const current = scoreMap.get(s.user_id) || 0;
      scoreMap.set(s.user_id, current + s.net_points);
    });

    const liveScores = await computeLiveScoresMap(league.start_gw || 1);

    const standings = members
      .map((m: any) => {
        const scoreFromTable = scoreMap.get(m.user_id);
        const finalScore = (scoreFromTable !== undefined && scoreFromTable !== 0)
          ? scoreFromTable
          : (liveScores.get(m.user_id) || 0);

        return {
          userId: m.user_id,
          teamName: (m.users as any)?.team_name || 'Team',
          joinedGw: m.joined_gw,
          totalPoints: finalScore,
        };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((item, idx) => ({ rank: idx + 1, ...item }));

    res.status(200).json({ league, standings });
  } catch (err) {
    logger.error(err, 'Error in GET /api/leagues/:id/standings');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch league standings.' } });
  }
});

export default router;
