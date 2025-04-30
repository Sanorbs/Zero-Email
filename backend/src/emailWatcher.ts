import { Email } from '../../shared/types';
import { EmailStorage } from './emailStorage';
import { ReminderService } from './reminderService';

export class EmailWatcher {
  constructor(
    private storage: EmailStorage,
    private reminderService: ReminderService
  ) {}

  async processNewEmail(email: Email): Promise<void> {
    // Ensure metadata.relations exists
    email.metadata.relations = email.metadata.relations || [];
    
    await this.storage.saveEmail(email);
    this.reminderService.scheduleReminder(email);
    await this.updateRelatedEmails(email);
  }

  private async updateRelatedEmails(email: Email): Promise<void> {
    const relatedEmails = await this.findRelatedEmails(email);
    
    const updatePromises = relatedEmails.map(async (relatedEmail) => {
      // Ensure relations array exists
      relatedEmail.metadata.relations = relatedEmail.metadata.relations || [];
      
      if (!relatedEmail.metadata.relations.includes(email.id)) {
        relatedEmail.metadata.relations.push(email.id);
        await this.storage.saveEmail(relatedEmail);
      }
    });
    email.metadata.relations = email.metadata.relations || [];
    // Update current email relations
    email.metadata.relations = [
      ...new Set([
        ...email.metadata.relations,
        ...relatedEmails.map(e => e.id)
      ])
    ];
    
    await Promise.all([...updatePromises, this.storage.saveEmail(email)]);
  }

  private async findRelatedEmails(email: Email): Promise<Email[]> {
    const subjectBase = email.subject?.replace(/^(Re:|Fwd:)\s*/i, '') || '';
    const [subjectResults, senderResults] = await Promise.all([
      this.storage.searchEmails(subjectBase),
      this.storage.searchEmails(email.from || '')
    ]);

    const related = [...subjectResults, ...senderResults]
      .filter(e => e.id !== email.id)
      .map(e => ({
        ...e,
        metadata: {
          ...e.metadata,
          relations: e.metadata.relations || []
        }
      }));

    return Array.from(new Map(related.map(e => [e.id, e])).values());
  }
}