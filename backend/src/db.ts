import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function query<T = any>(sql: string): Promise<T> {
  // Use a more robust way to escape quotes for the shell
  const escapedSql = sql.replace(/"/g, '\\"');
  const command = `team-db "${escapedSql}"`;
  
  try {
    const { stdout, stderr } = await execPromise(command);
    
    // Ignore Bun warnings/info in stderr
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
