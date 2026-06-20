import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'permitpilot.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function getDatabase() {
  return db;
}

export function query<T = any>(sql: string, params: any[] = []): T {
  try {
    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH')) {
      const stmt = db.prepare(sql);
      return (params.length > 0 ? stmt.all(...params) : stmt.all()) as T;
    } else {
      const stmt = db.prepare(sql);
      const result = params.length > 0 ? stmt.run(...params) : stmt.run();
      return result as any;
    }
  } catch (error: any) {
    console.error('SQLite query error:', error.message);
    throw error;
  }
}

export function getDatabaseUrl(): string {
  return DB_PATH;
}

export function close() {
  db.close();
}