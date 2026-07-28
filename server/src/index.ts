import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import authRoutes from './routes/authRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import squadRoutes from './routes/squadRoutes.js';
import transferRoutes from './routes/transferRoutes.js';
import chipRoutes from './routes/chipRoutes.js';
import pointsRoutes from './routes/pointsRoutes.js';
import leagueRoutes from './routes/leagueRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { startScheduler } from './jobs/scheduler.js';

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(
  cors({
    origin: true, // Allow configured origins in production
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/squad', squadRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/chips', chipRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/leagues', leagueRoutes);
app.use('/api/admin', adminRoutes);

// Start Background Jobs Scheduler
startScheduler();

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info({ method: req.method, url: req.url }, 'Incoming request');
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
    service: 'fpl-clone-server',
  });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err, 'Unhandled Application Error');
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: config.nodeEnv === 'development' ? err.message : 'An unexpected error occurred.',
    },
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    logger.info(`Server running on http://localhost:${config.port} in ${config.nodeEnv} mode`);
  });
}

export default app;
