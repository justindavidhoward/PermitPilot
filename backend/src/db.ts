import { exec } from 'child_process';
import { promisify } from 'util';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const execPromise = promisify(exec);

const dbUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL || '';
const isPostgres = !!dbUrl;
let pool: Pool | null = null;

if (isPostgres) {
  pool = new Pool({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
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
