import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'permitpilot.db');

let db: SqlJsDatabase | null = null;

export async function initDb(): Promise<void> {
  if (db) return;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  // Load existing database or create new one
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Enable WAL mode and foreign keys
  db.run('PRAGMA foreign_keys = ON;');
  db.run('PRAGMA journal_mode = WAL;');

  console.log('SQLite database initialized at:', DB_PATH);
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

export function query<T = any>(sql: string, params: any[] = []): T {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }

  try {
    const trimmed = sql.trim().toUpperCase();
    const isSelect = trimmed.startsWith('SELECT') || trimmed.startsWith('WITH');
    const isInsert = trimmed.startsWith('INSERT');

    if (isSelect || trimmed.startsWith('PRAGMA')) {
      // For SELECT queries, use exec and parse results
      const results = db.exec(sql);
      if (results.length === 0) return [] as any;
      return results[0].values.map((row: any[]) => {
        const obj: any = {};
        results[0].columns.forEach((col: string, i: number) => {
          obj[col] = row[i];
        });
        return obj;
      }) as any;
    } else {
      // For INSERT/UPDATE/DELETE, use run
      db.run(sql, params);
      saveDb();

      if (isInsert) {
        // Get the last insert id
        const result = db.exec('SELECT last_insert_rowid() as id');
        return { changes: db.getRowsModified(), lastInsertRowid: result[0]?.values[0]?.[0] } as any;
      }
      return { changes: db.getRowsModified() } as any;
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
  if (db) {
    saveDb();
    db.close();
    db = null;
  }
}