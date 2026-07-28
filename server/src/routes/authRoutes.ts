import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { supabase } from '../db/supabase.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/authMiddleware.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many authentication attempts. Please try again after 15 minutes.',
    },
  },
});

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  teamName: z.string().min(2, 'Team name must be at least 2 characters').max(30),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

function generateTokens(user: { id: number; email: string; role: string; team_name: string }) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, team_name: user.team_name },
    config.jwtSecret,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    config.jwtRefreshSecret,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
}

// POST /api/auth/register
router.post('/register', authLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { code: 'INVALID_INPUT', details: parseResult.error.flatten() },
      });
      return;
    }

    const { email, password, teamName } = parseResult.data;

    // Check existing email
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      res.status(409).json({
        error: { code: 'EMAIL_EXISTS', message: 'Email is already registered.' },
      });
      return;
    }

    // Check if first user -> assign admin
    const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const role = count === 0 ? 'admin' : 'user';

    const passwordHash = await bcrypt.hash(password, 12);

    const { data: newUser, error: createErr } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        team_name: teamName,
        role,
        bank: 1000, // £100.0M in tenths
        free_transfers: 1,
        squad_complete: false,
      })
      .select('id, email, role, team_name, bank, free_transfers, squad_complete, created_at')
      .single();

    if (createErr || !newUser) {
      logger.error(createErr, 'Failed to create user');
      res.status(500).json({
        error: { code: 'CREATE_FAILED', message: 'Failed to create user account.' },
      });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(newUser);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'none' as const : 'lax' as const,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      user: newUser,
      accessToken,
    });
  } catch (err) {
    logger.error(err, 'Error in /register');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Registration failed.' } });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { code: 'INVALID_INPUT', details: parseResult.error.flatten() },
      });
      return;
    }

    const { email, password } = parseResult.data;

    const { data: user } = await supabase
      .from('users')
      .select('id, email, password_hash, role, team_name, bank, free_transfers, squad_complete')
      .eq('email', email.toLowerCase())
      .single();

    if (!user) {
      res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'none' as const : 'lax' as const,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const { password_hash, ...userWithoutPassword } = user;
    res.status(200).json({
      user: userWithoutPassword,
      accessToken,
    });
  } catch (err) {
    logger.error(err, 'Error in /login');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Login failed.' } });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ error: { code: 'NO_REFRESH_TOKEN', message: 'Refresh token required.' } });
    return;
  }

  try {
    const payload = jwt.verify(refreshToken, config.jwtRefreshSecret) as { id: number };

    const { data: user } = await supabase
      .from('users')
      .select('id, email, role, team_name')
      .eq('id', payload.id)
      .single();

    if (!user) {
      res.status(401).json({ error: { code: 'USER_NOT_FOUND', message: 'User no longer exists.' } });
      return;
    }

    const tokens = generateTokens(user);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'none' as const : 'lax' as const,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken: tokens.accessToken });
  } catch (err) {
    res.status(403).json({ error: { code: 'INVALID_REFRESH_TOKEN', message: 'Invalid refresh token.' } });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { data: user } = await supabase
      .from('users')
      .select('id, email, team_name, role, bank, free_transfers, squad_complete, created_at')
      .eq('id', userId)
      .single();

    if (!user) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found.' } });
      return;
    }

    res.status(200).json({ user });
  } catch (err) {
    logger.error(err, 'Error in /me');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch profile.' } });
  }
});

export default router;
