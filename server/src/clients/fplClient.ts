import { logger } from '../utils/logger.js';

const FPL_BASE_URL = 'https://fantasy.premierleague.com/api';

const DEFAULT_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept: 'application/json',
};

async function fetchWithRetry<T>(
  url: string,
  retries = 3,
  backoffMs = 1000
): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      attempt++;
      const res = await fetch(url, { headers: DEFAULT_HEADERS });
      if (!res.ok) {
        throw new Error(`FPL API HTTP Error ${res.status}: ${res.statusText}`);
      }
      const data = (await res.json()) as T;
      return data;
    } catch (err) {
      logger.warn(
        { url, attempt, error: (err as Error).message },
        'FPL API fetch attempt failed'
      );
      if (attempt >= retries) throw err;
      await new Promise((r) => setTimeout(r, backoffMs * Math.pow(2, attempt - 1)));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts.`);
}

export class FplClient {
  static async getBootstrapStatic(): Promise<any> {
    logger.info('Fetching bootstrap-static from FPL API');
    return fetchWithRetry<any>(`${FPL_BASE_URL}/bootstrap-static/`);
  }

  static async getFixtures(gw?: number): Promise<any[]> {
    const url = gw
      ? `${FPL_BASE_URL}/fixtures/?event=${gw}`
      : `${FPL_BASE_URL}/fixtures/`;
    logger.info({ gw }, 'Fetching fixtures from FPL API');
    return fetchWithRetry<any[]>(url);
  }

  static async getEventLive(gw: number): Promise<any> {
    logger.info({ gw }, 'Fetching live event stats from FPL API');
    return fetchWithRetry<any>(`${FPL_BASE_URL}/event/${gw}/live/`);
  }

  static async getEventStatus(): Promise<any> {
    return fetchWithRetry<any>(`${FPL_BASE_URL}/event-status/`);
  }
}
