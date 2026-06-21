import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const url = process.env.TEAM_DB_URL;
const authToken = process.env.TEAM_DB_AUTH_TOKEN;

if (!url) {
  throw new Error('TEAM_DB_URL is not defined in environment variables');
}

const client = createClient({
  url,
  authToken,
});

async function notifyDbEvent(sql: string) {
  const eventsUrl = process.env.TEAM_DB_EVENTS_URL;
  const eventsToken = process.env.TEAM_DB_EVENTS_TOKEN;
  if (!eventsUrl || !eventsToken) return;
  try {
    await fetch(eventsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${eventsToken}`,
      },
      body: JSON.stringify({
        sql: Buffer.from(sql).toString('base64'),
        member: process.env.USER ?? 'backend-api',
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch (error: any) {
    console.warn('DB notification failed:', error.message);
  }
}

export async function initDb(): Promise<void> {
  // No-op for remote client, but keeping for compatibility
  console.log('Turso client initialized with URL:', url);
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  try {
    const result = await client.execute({ sql, args: params });
    
    // Fire and forget notification
    notifyDbEvent(sql).catch(() => {});

    const trimmed = sql.trim().toUpperCase();
    const isSelect = trimmed.startsWith('SELECT') || trimmed.startsWith('WITH') || trimmed.startsWith('PRAGMA');

    if (isSelect) {
      return result.rows as any;
    } else {
      return { 
        changes: result.rowsAffected, 
        lastInsertRowid: result.lastInsertRowid?.toString() 
      } as any;
    }
  } catch (error: any) {
    console.error('Turso query error:', error.message);
    console.error('SQL:', sql);
    throw error;
  }
}

export function close() {
  client.close();
}
