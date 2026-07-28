import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

export interface AuthPayload {
  id: number;
  email: string;
  role: 'user' | 'admin';
  team_name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Authentication token required.' },
    });
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthPayload;
    req.user = payload;
    next();
  } catch (err) {
    logger.warn({ error: (err as Error).message }, 'Invalid or expired JWT token');
    res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Invalid or expired token.' },
    });
  }
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Admin privileges required.' },
    });
    return;
  }
  next();
}
