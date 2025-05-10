import { Email } from '../../shared/types';
import { classifyEmail, summarizeEmail, extractRelations } from './aiService';
import { storeEmail } from './emailStorage';
import { scheduleReminders } from './reminderService';

export async function processEmail(email: Email): Promise<Email> {
  // Parallel processing
  const [categories, summary, relations] = await Promise.all([
    classifyEmail(email),
    summarizeEmail(email),
    extractRelations(email)
  ]);

  const processedEmail: Email = {
    ...email,
    metadata: {
      ...email.metadata,
      categories,
      summary,
      relations,
      importance: calculateImportance(email),
      processedAt: new Date()
    }
  };

  await storeEmail(processedEmail);
  await scheduleReminders(processedEmail);
  
  return processedEmail;
}

function calculateImportance(email: Email): number {
  let score = 0;
  if (email.from?.includes('@company.com')) score += 0.3;
  if (email.subject?.toLowerCase().includes('urgent')) score += 0.4;
  if (email.metadata?.categories?.includes('finance')) score += 0.3;
  return Math.min(score, 1);
}