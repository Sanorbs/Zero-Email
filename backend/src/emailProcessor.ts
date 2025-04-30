import { Email } from '../../shared/types';
import { classifyEmail, summarizeEmail, extractRelations } from './aiService';

export async function processEmail(rawEmail: any): Promise<Email> {
  const email: Email = {
    id: rawEmail.id,
    from: rawEmail.from,
    to: rawEmail.to,
    subject: rawEmail.subject,
    body: rawEmail.body,
    date: new Date(rawEmail.date),
    metadata: {}
  };

  // Parallel processing of email features
  const [categories, summary, importance, relations] = await Promise.all([
    classifyEmail(email),
    summarizeEmail(email),
    calculateImportance(email),
    extractRelations(email)
  ]);

  email.metadata = {
    importance,
    categories,
    summary,
    relations
  };

  return email;
}

async function calculateImportance(email: Email): Promise<number> {
  // Implement importance scoring (sender, content, urgency indicators, etc.)
  return 0.5; // Placeholder
}