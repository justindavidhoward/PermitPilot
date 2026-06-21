import { query, initDb } from '../db';
import { EmailService } from './emailService';

async function sendReminders() {
  await initDb();
  console.log('Checking for inspections scheduled for tomorrow...');
  
  try {
    const inspections = await query(`
      SELECT i.*, p.title as project_title, u.email as user_email
      FROM inspections i
      JOIN projects p ON i.project_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE date(i.scheduled_at) = date('now', '+1 day')
      AND i.status = 'pending'
    `);

    if (!inspections || inspections.length === 0) {
      console.log('No inspections scheduled for tomorrow.');
      return;
    }

    console.log(`Found ${inspections.length} inspections. Sending reminders...`);
    
    for (const inspection of inspections) {
      console.log(`Queuing reminder for ${inspection.user_email} - ${inspection.name}`);
      await EmailService.sendInspectionReminderEmail(
        inspection.user_email,
        inspection.project_title,
        inspection.name,
        inspection.scheduled_at
      );
      
      // Optionally mark as "reminder_sent" so we don't send it again if the script runs multiple times
      // But status is currently used for the inspection itself (pending, completed, etc.)
      // We could add a 'reminder_sent' column but for MVP this is fine if run once a day.
    }
    
    console.log('All reminders queued successfully.');
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
}

sendReminders().catch(console.error);
