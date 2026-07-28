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

// GET /api/leagues/leaderboard (Global Overall Leaderboard)
router.get('/leaderboard', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '50', 10);
    const offset = (page - 1) * limit;

    // Fetch total accumulated points per user from gw_scores
    const { data: usersData, count, error } = await supabase
      .from('users')
      .select('id, team_name, email', { count: 'exact' });

    if (error || !usersData) {
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to fetch leaderboard.' } });
      return;
    }

    const { data: totalScores } = await supabase
      .from('gw_scores')
      .select('user_id, net_points');

    const scoreMap = new Map<number, number>();
    (totalScores || []).forEach((s: any) => {
      const current = scoreMap.get(s.user_id) || 0;
      scoreMap.set(s.user_id, current + s.net_points);
    });

    const leaderboard = usersData
      .map((u: any) => ({
        userId: u.id,
        teamName: u.team_name,
        totalPoints: scoreMap.get(u.id) || 0,
      }))
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

    const standings = members
      .map((m: any) => ({
        userId: m.user_id,
        teamName: m.users.team_name,
        joinedGw: m.joined_gw,
        totalPoints: scoreMap.get(m.user_id) || 0,
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((item, idx) => ({ rank: idx + 1, ...item }));

    res.status(200).json({ league, standings });
  } catch (err) {
    logger.error(err, 'Error in GET /api/leagues/:id/standings');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch league standings.' } });
  }
});

export default router;
