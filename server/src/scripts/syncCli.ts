import { SyncService } from '../services/syncService.js';
import { logger } from '../utils/logger.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'bootstrap';
  const gwArg = args[1] ? parseInt(args[1], 10) : undefined;

  logger.info({ command, gwArg }, 'Starting CLI FPL Sync');

  try {
    if (command === 'bootstrap') {
      const res = await SyncService.syncBootstrap();
      logger.info(res, 'Bootstrap sync completed');
    } else if (command === 'fixtures') {
      const count = await SyncService.syncFixtures(gwArg);
      logger.info({ count }, 'Fixtures sync completed');
    } else if (command === 'live') {
      if (!gwArg) {
        throw new Error('Gameweek argument is required for live sync (e.g. tsx src/scripts/syncCli.ts live 1)');
      }
      const count = await SyncService.syncLive(gwArg);
      logger.info({ count, gw: gwArg }, 'Live stats sync completed');
    } else if (command === 'all') {
      await SyncService.syncBootstrap();
      await SyncService.syncFixtures();
      logger.info('All initial syncs completed');
    } else {
      logger.error('Unknown command. Available commands: bootstrap, fixtures [gw], live <gw>, all');
    }
  } catch (err) {
    logger.error(err, 'CLI Sync Execution Error');
    process.exit(1);
  }
}

main();
