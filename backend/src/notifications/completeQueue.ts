import { query, initDb } from '../db';

async function completeQueue() {
  await initDb();
  console.log('Marking processing emails as sent...');
  
  await query(`
    UPDATE notification_queue 
    SET status = 'sent', sent_at = CURRENT_TIMESTAMP
    WHERE status = 'processing'
  `);
  
  console.log('Done.');
}

completeQueue().catch(console.error);
