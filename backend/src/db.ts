import { exec } from 'child_process';
import { promisify } from 'util';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const execPromise = promisify(exec);

// Detect PostgreSQL connection: check various env var formats (Railway, standard, etc.)
const dbUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL || '';

// Fallback: construct from individual Railway PostgreSQL variables
const pgHost = process.env.PGHOST || process.env.RAILWAY_PRIVATE_DOMAIN || process.env.RAILWAY_TCP_PROXY_DOMAIN || '';
const pgPort = process.env.PGPORT || process.env.RAILWAY_TCP_PROXY_PORT || '5432';
const pgUser = process.env.PGUSER || '';
const pgPass = process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD || '';
const pgDb = process.env.PGDATABASE || process.env.PGNAME || '';

const constructedUrl = (pgHost && pgUser && pgPass && pgDb)
  ? `postgresql://${pgUser}:${pgPass}@${pgHost}:${pgPort}/${pgDb}`
  : '';

const finalDbUrl = dbUrl || constructedUrl;
const isPostgres = !!finalDbUrl;
let pool: Pool | null = null;

if (isPostgres) {
  console.log('Connecting to PostgreSQL at:', pgHost || 'via URL');
  pool = new Pool({
    connectionString: finalDbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

export function getDatabaseUrl(): string {
  return finalDbUrl;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  if (isPostgres && pool) {
    try {
      const res = await pool.query(sql, params);
      return res.rows as any;
    } catch (error: any) {
      console.error('PostgreSQL query error:', error.message);
      throw error;
    }
  }

  // Fallback to team-db (sqlite-like CLI)
  // Note: team-db doesn't support parameterized queries easily via CLI
  // So we interpolate params if any (this is a simple fallback)
  let interpolatedSql = sql;
  if (params.length > 0) {
    params.forEach((param, index) => {
      const value = typeof param === 'string' ? `'${param.replace(/'/g, "''")}'` : param;
      interpolatedSql = interpolatedSql.replace(`$${index + 1}`, value);
    });
  }

  const escapedSql = interpolatedSql.replace(/"/g, '\\"');
  const command = `team-db "${escapedSql}"`;
  
  try {
    const { stdout, stderr } = await execPromise(command);
    
    if (stderr && !stderr.includes('Bun') && stderr.trim().length > 0) {
      console.error('DB Error stderr:', stderr);
    }
    
    if (!stdout.trim()) {
      return [] as any;
    }
    
    return JSON.parse(stdout);
  } catch (error: any) {
    console.error('Execution error:', error.message);
    throw error;
  }
}
