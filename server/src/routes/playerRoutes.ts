import { Router, Request, Response } from 'express';
import { supabase } from '../db/supabase.js';
import { logger } from '../utils/logger.js';

const router = Router();

// GET /api/players
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const position = req.query.position ? parseInt(req.query.position as string, 10) : undefined;
    const teamId = req.query.team ? parseInt(req.query.team as string, 10) : undefined;
    const maxCost = req.query.maxCost ? parseInt(req.query.maxCost as string, 10) : undefined;
    const search = req.query.search ? (req.query.search as string).trim() : undefined;
    const sort = (req.query.sort as string) || 'total_points';
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '50', 10);
    const offset = (page - 1) * limit;

    let query = supabase
      .from('players')
      .select('*, fpl_teams(name, short_name)', { count: 'exact' });

    if (position) query = query.eq('position', position);
    if (teamId) query = query.eq('team_id', teamId);
    if (maxCost) query = query.lte('now_cost', maxCost);
    if (search) query = query.ilike('web_name', `%${search}%`);

    if (sort === 'price') {
      query = query.order('now_cost', { ascending: false });
    } else if (sort === 'name') {
      query = query.order('web_name', { ascending: true });
    } else {
      query = query.order('total_points', { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data: players, count, error } = await query;

    if (error) {
      logger.error(error, 'Error fetching players');
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to fetch players.' } });
      return;
    }

    res.status(200).json({
      players: players || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err) {
    logger.error(err, 'Error in /api/players');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch players.' } });
  }
});

// GET /api/players/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { data: player, error } = await supabase
      .from('players')
      .select('*, fpl_teams(name, short_name)')
      .eq('id', id)
      .single();

    if (error || !player) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Player not found.' } });
      return;
    }

    const { data: history } = await supabase
      .from('player_gw_stats')
      .select('*')
      .eq('player_id', id)
      .order('gw', { ascending: true });

    res.status(200).json({ player, history: history || [] });
  } catch (err) {
    logger.error(err, 'Error in /api/players/:id');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch player details.' } });
  }
});

export default router;
