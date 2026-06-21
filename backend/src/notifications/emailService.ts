import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

export class EmailService {
  static async queueEmail(options: EmailOptions): Promise<void> {
    const id = uuidv4();
    console.log(`Queuing email to ${options.to} with subject: ${options.subject}`);
    
    await query(`
      INSERT INTO notification_queue (id, to_email, subject, body, status)
      VALUES (
        '${id}', 
        '${options.to.replace(/'/g, "''")}', 
        '${options.subject.replace(/'/g, "''")}', 
        '${options.body.replace(/'/g, "''")}', 
        'pending'
      )
    `);
  }

  static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const subject = 'Welcome to PermitPilot!';
    const body = `Hi ${name || 'there'},\n\nWelcome to PermitPilot! We're excited to help you navigate your building permits.\n\nTo get started, log in to your dashboard and create your first project.\n\nBest,\nThe PermitPilot Team`;
    
    await this.queueEmail({ to: email, subject, body });
  }

  static async sendChecklistReadyEmail(email: string, projectName: string): Promise<void> {
    const subject = `Your Permit Checklist is Ready: ${projectName}`;
    const body = `Hi,\n\nGood news! Our AI has analyzed your project "${projectName}" and your permit checklist is now ready.\n\nLog in to PermitPilot to view the required permits, estimated fees, and upcoming inspections.\n\nBest,\nThe PermitPilot Team`;
    
    await this.queueEmail({ to: email, subject, body });
  }

  static async sendStatusUpdateEmail(email: string, projectName: string, permitName: string, newStatus: string): Promise<void> {
    const subject = `Status Update: ${permitName} for ${projectName}`;
    const body = `Hi,\n\nThe status of your permit requirement "${permitName}" for project "${projectName}" has been updated to: ${newStatus}.\n\nLog in to PermitPilot to see more details.\n\nBest,\nThe PermitPilot Team`;
    
    await this.queueEmail({ to: email, subject, body });
  }

  static async sendInspectionReminderEmail(email: string, projectName: string, inspectionName: string, scheduledAt: string): Promise<void> {
    const subject = `Upcoming Inspection: ${inspectionName} for ${projectName}`;
    const body = `Hi,\n\nThis is a reminder that you have an inspection scheduled for tomorrow:\n\nProject: ${projectName}\nInspection: ${inspectionName}\nDate/Time: ${scheduledAt}\n\nPlease ensure someone is on site and the work is accessible.\n\nBest,\nThe PermitPilot Team`;
    
    await this.queueEmail({ to: email, subject, body });
  }
}
