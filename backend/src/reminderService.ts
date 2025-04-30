import { Email } from '../../shared/types';

export class ReminderService {
  private pendingActions = new Map<string, NodeJS.Timeout>();

  scheduleReminder(email: Email): void {
    if (this.needsReminder(email)) {
      const reminderTime = this.calculateReminderTime(email);
      const timeout = setTimeout(() => {
        this.sendReminder(email);
      }, reminderTime.getTime() - Date.now());
      
      this.pendingActions.set(email.id, timeout);
    }
  }

  private needsReminder(email: Email): boolean {
    // Provide a default value (0) if importance is undefined
    const importance = email.metadata.importance ?? 0;
    
    // Analyze email for action items
    return importance > 0.7 || 
           this.containsActionItems(email.body) ||
           this.hasUrgentKeywords(email);
  }

  private calculateReminderTime(email: Email): Date {
    // Calculate based on content urgency
    const now = new Date();
    
    // Provide a default value (0) if importance is undefined
    const importance = email.metadata.importance ?? 0;
    
    // More important emails get reminded sooner
    const hoursToAdd = importance > 0.8 ? 2 :  // High importance: 2 hours
                      importance > 0.5 ? 24 : // Medium importance: 1 day
                      48;                     // Low importance: 2 days
    
    return new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
  }

  private sendReminder(email: Email): void {
    // Send notification to extension
    console.log(`Reminder for email: ${email.subject}`);
    this.pendingActions.delete(email.id);
  }

  private containsActionItems(body: string): boolean {
    // Simple check for action-oriented language
    const actionPhrases = [
      'please respond', 'action required', 'need your input',
      'by tomorrow', 'deadline', 'follow up', 'urgent'
    ];
    return actionPhrases.some(phrase => 
      body.toLowerCase().includes(phrase)
    );
  }

  private hasUrgentKeywords(email: Email): boolean {
    const urgentKeywords = ['urgent', 'asap', 'immediately', 'important'];
    return (
      urgentKeywords.some(keyword => 
        email.subject.toLowerCase().includes(keyword)) ||
      urgentKeywords.some(keyword => 
        email.body.toLowerCase().includes(keyword))
    );
  }

  cancelReminder(emailId: string): void {
    const timeout = this.pendingActions.get(emailId);
    if (timeout) {
      clearTimeout(timeout);
      this.pendingActions.delete(emailId);
    }
  }
}