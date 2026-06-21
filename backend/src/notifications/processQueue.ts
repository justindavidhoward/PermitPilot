import { query, initDb } from '../db';

async function processQueue() {
  await initDb();
  console.log('Checking for pending emails...');
  
  const pendingEmails = await query(`
    SELECT * FROM notification_queue 
    WHERE status = 'pending'
    ORDER BY created_at ASC
  `);

  if (!pendingEmails || pendingEmails.length === 0) {
    console.log('No pending emails.');
    return;
  }

  console.log(`Found ${pendingEmails.length} pending emails.`);
  
  for (const email of pendingEmails) {
    console.log('--- EMAIL PENDING ---');
    console.log(`ID: ${email.id}`);
    console.log(`To: ${email.to_email}`);
    console.log(`Subject: ${email.subject}`);
    console.log(`Body:\n${email.body}`);
    console.log('---------------------');
    
    // In this simulation, we mark it as "processing" 
    // and wait for the agent to call the real sendEmail tool.
    await query(`
      UPDATE notification_queue 
      SET status = 'processing' 
      WHERE id = '${email.id}'
    `);
  }
  
  console.log('\nPlease use the sendEmail tool to send these emails, then run the completion script.');
}

processQueue().catch(console.error);
