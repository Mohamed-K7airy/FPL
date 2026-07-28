-- Supabase PostgreSQL Schema for FPL Clone
-- File: supabase/migrations/20260726000000_init_schema.sql

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══ Users ═══
CREATE TABLE IF NOT EXISTS users (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  team_name     TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user', -- 'user' | 'admin'
  bank          INTEGER NOT NULL DEFAULT 1000, -- 1000 = £100.0M
  free_transfers INTEGER NOT NULL DEFAULT 1,
  squad_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══ FPL Mirror Data ═══
CREATE TABLE IF NOT EXISTS fpl_teams (
  id         INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  short_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS players (
  id          INTEGER PRIMARY KEY,
  code        INTEGER,
  web_name    TEXT NOT NULL,
  full_name   TEXT NOT NULL,
  team_id     INTEGER NOT NULL REFERENCES fpl_teams(id),
  position    INTEGER NOT NULL, -- 1 GKP, 2 DEF, 3 MID, 4 FWD
  now_cost    INTEGER NOT NULL, -- 75 = £7.5M
  status      TEXT NOT NULL,
  news        TEXT,
  chance_of_playing INTEGER,
  total_points INTEGER NOT NULL DEFAULT 0,
  form        NUMERIC(4, 1),
  synced_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_pos ON players(position);

CREATE TABLE IF NOT EXISTS gameweeks (
  id            INTEGER PRIMARY KEY,
  name          TEXT NOT NULL,
  deadline_time TIMESTAMPTZ NOT NULL,
  is_current    BOOLEAN NOT NULL DEFAULT FALSE,
  is_next       BOOLEAN NOT NULL DEFAULT FALSE,
  finished      BOOLEAN NOT NULL DEFAULT FALSE,
  data_checked  BOOLEAN NOT NULL DEFAULT FALSE,
  avg_score     INTEGER
);

CREATE TABLE IF NOT EXISTS fixtures (
  id           INTEGER PRIMARY KEY,
  gw           INTEGER REFERENCES gameweeks(id),
  kickoff_time TIMESTAMPTZ,
  team_h       INTEGER REFERENCES fpl_teams(id),
  team_a       INTEGER REFERENCES fpl_teams(id),
  started      BOOLEAN NOT NULL DEFAULT FALSE,
  finished     BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_fixtures_gw ON fixtures(gw);

CREATE TABLE IF NOT EXISTS player_gw_stats (
  gw            INTEGER NOT NULL REFERENCES gameweeks(id),
  player_id     INTEGER NOT NULL REFERENCES players(id),
  minutes       INTEGER NOT NULL DEFAULT 0,
  total_points  INTEGER NOT NULL DEFAULT 0,
  bonus         INTEGER NOT NULL DEFAULT 0,
  goals         INTEGER NOT NULL DEFAULT 0,
  assists       INTEGER NOT NULL DEFAULT 0,
  clean_sheets  INTEGER NOT NULL DEFAULT 0,
  saves         INTEGER NOT NULL DEFAULT 0,
  yellow_cards  INTEGER NOT NULL DEFAULT 0,
  red_cards     INTEGER NOT NULL DEFAULT 0,
  played        BOOLEAN NOT NULL DEFAULT FALSE,
  is_final      BOOLEAN NOT NULL DEFAULT FALSE,
  synced_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (gw, player_id)
);

-- ═══ User Squad ═══
CREATE TABLE IF NOT EXISTS squad (
  user_id        BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  player_id      INTEGER NOT NULL REFERENCES players(id),
  slot           INTEGER NOT NULL, -- 1..11 starters, 12..15 bench
  is_captain     BOOLEAN NOT NULL DEFAULT FALSE,
  is_vice        BOOLEAN NOT NULL DEFAULT FALSE,
  purchase_price INTEGER NOT NULL,
  PRIMARY KEY (user_id, player_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_squad_slot ON squad(user_id, slot);

-- ═══ Gameweek Deadline Snapshot ═══
CREATE TABLE IF NOT EXISTS gw_picks (
  gw          INTEGER NOT NULL REFERENCES gameweeks(id),
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  player_id   INTEGER NOT NULL REFERENCES players(id),
  slot        INTEGER NOT NULL,
  is_captain  BOOLEAN NOT NULL DEFAULT FALSE,
  is_vice     BOOLEAN NOT NULL DEFAULT FALSE,
  multiplier  INTEGER NOT NULL DEFAULT 1,
  auto_subbed BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (gw, user_id, player_id)
);

CREATE TABLE IF NOT EXISTS gw_scores (
  gw              INTEGER NOT NULL REFERENCES gameweeks(id),
  user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  raw_points      INTEGER NOT NULL DEFAULT 0,
  transfer_cost   INTEGER NOT NULL DEFAULT 0,
  net_points      INTEGER NOT NULL DEFAULT 0,
  total_points    INTEGER NOT NULL DEFAULT 0,
  chip            TEXT,
  is_final        BOOLEAN NOT NULL DEFAULT FALSE,
  calculated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (gw, user_id)
);

CREATE INDEX IF NOT EXISTS idx_gw_scores_rank ON gw_scores(gw, total_points DESC);

CREATE TABLE IF NOT EXISTS transfers (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gw          INTEGER NOT NULL REFERENCES gameweeks(id),
  player_out  INTEGER NOT NULL REFERENCES players(id),
  player_in   INTEGER NOT NULL REFERENCES players(id),
  cost        INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══ Mini-Leagues ═══
CREATE TABLE IF NOT EXISTS leagues (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  code       TEXT NOT NULL UNIQUE,
  owner_id   BIGINT NOT NULL REFERENCES users(id),
  start_gw   INTEGER NOT NULL REFERENCES gameweeks(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS league_members (
  league_id BIGINT NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  user_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_gw INTEGER NOT NULL REFERENCES gameweeks(id),
  PRIMARY KEY (league_id, user_id)
);

-- ═══ Logging & Chips ═══
CREATE TABLE IF NOT EXISTS sync_log (
  id          BIGSERIAL PRIMARY KEY,
  kind        TEXT NOT NULL,
  gw          INTEGER,
  status      TEXT NOT NULL,
  message     TEXT,
  duration_ms INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chips_used (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chip    TEXT NOT NULL, -- 'wildcard' | 'freehit' | 'bboost' | '3xc'
  gw      INTEGER NOT NULL REFERENCES gameweeks(id),
  half    INTEGER NOT NULL, -- 1 or 2
  PRIMARY KEY (user_id, chip, half)
);
