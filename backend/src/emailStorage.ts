import { Email } from '../../shared/types';

export class EmailStorage {
  private storage: Email[] = [];

  constructor(private dbPath: string) {
    console.log(`Initialized in-memory email storage at ${dbPath}`);
    // In production, connect to a real DB here using dbPath
  }

  async saveEmail(email: Email): Promise<void> {
    const index = this.storage.findIndex(e => e.id === email.id);
    if (index >= 0) {
      this.storage[index] = email;
    } else {
      this.storage.push(email);
    }
    console.log(`Stored email: ${email.subject}`);
  }

  async getEmail(id: string): Promise<Email | null> {
    const email = this.storage.find(e => e.id === id);
    return email ? { ...email } : null;
  }

  async searchEmails(query: string): Promise<Email[]> {
    const q = query.toLowerCase();
    return this.storage.filter(email =>
      email.subject.toLowerCase().includes(q) ||
      email.body.toLowerCase().includes(q) ||
      email.from.toLowerCase().includes(q)
    );
  }

  async close(): Promise<void> {
    console.log('Closed email storage');
    // Clean up or disconnect from DB here if needed
  }
}
