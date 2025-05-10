import { EmailStorage } from '../backend/src/emailStorage';
import { Email } from '../shared/types';

describe('EmailStorage', () => {
  let storage: EmailStorage;
  const testEmail: Email = {
    id: 'test1',
    from: 'test@example.com',
    to: ['me@example.com'],
    subject: 'Test Email',
    body: 'This is a test email body',
    date: new Date().toISOString(),
    metadata: {
      importance: 0.8,
      categories: ['work', 'important'],
      summary: 'Test summary',
      relations: [],
      read: false,
      starred: false,
      needsAction: false,
      processedAt: new Date()
    }
  };

  beforeAll(async () => {
    storage = new EmailStorage(':memory:');
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  afterAll(async () => {
    await storage.close();
  });

  test('should save and retrieve email', async () => {
    await storage.saveEmail(testEmail);
    const retrieved = await storage.getEmail(testEmail.id);
    
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(testEmail.id);
    expect(retrieved?.from).toBe(testEmail.from);
    expect(retrieved?.metadata.categories).toEqual(testEmail.metadata.categories);
  });

  test('should search emails', async () => {
    await storage.saveEmail(testEmail);
    const results = await storage.searchEmails('test');
    
    expect(results.length).toBe(1);
    expect(results[0].id).toBe(testEmail.id);
  });

  test('should return null for non-existent email', async () => {
    const result = await storage.getEmail('nonexistent');
    expect(result).toBeNull();
  });
});
