import cron from 'node-cron';
import { SyncService } from '../services/syncService.js';
import { ScoringService } from '../services/scoringService.js';
import { supabase } from '../db/supabase.js';
import { logger } from '../utils/logger.js';

export function startScheduler(): void {
  logger.info('Initializing node-cron background scheduler');

  // 1. Hourly Bootstrap Sync (0 * * * *)
  cron.schedule('0 * * * *', async () => {
    logger.info('Cron: Running hourly bootstrap sync');
    try {
      await SyncService.syncBootstrap();
    } catch (err) {
      logger.error(err, 'Cron: Hourly bootstrap sync failed');
    }
  });

  // 2. 2-Minute Live Sync during match windows (*/2 * * * *)
  cron.schedule('*/2 * * * *', async () => {
    try {
      const { data: currentGw } = await supabase
        .from('gameweeks')
        .select('*')
        .eq('is_current', true)
        .single();

      if (!currentGw) return;

      // Check if any match in current GW is started and not finished
      const { data: activeFixtures } = await supabase
        .from('fixtures')
        .select('id')
        .eq('gw', currentGw.id)
        .eq('started', true)
        .eq('finished', false);

      if (activeFixtures && activeFixtures.length > 0) {
        logger.info({ gw: currentGw.id }, 'Cron: Active matches detected, syncing live stats');
        await SyncService.syncLive(currentGw.id);
        await ScoringService.calculateScores(currentGw.id, false);
      }
    } catch (err) {
      logger.error(err, 'Cron: Live sync failed');
    }
  });

  // 3. 1-Minute Deadline Lock check (* * * * *)
  cron.schedule('* * * * *', async () => {
    try {
      const { data: currentGw } = await supabase
        .from('gameweeks')
        .select('*')
        .eq('is_current', true)
        .single();

      if (!currentGw) return;

      const deadline = new Date(currentGw.deadline_time).getTime();
      const now = Date.now();

      if (now >= deadline) {
        // Check if snapshot already taken
        const { count } = await supabase
          .from('gw_picks')
          .select('*', { count: 'exact', head: true })
          .eq('gw', currentGw.id);

        if (count === 0) {
          logger.info({ gw: currentGw.id }, 'Cron: Gameweek deadline passed, snapshotting user picks');
          await ScoringService.snapshotPicks(currentGw.id);
        }
      }
    } catch (err) {
      logger.error(err, 'Cron: Deadline snapshot check failed');
    }
  });
}
