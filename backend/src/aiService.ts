import { Email } from '../../shared/types';

export async function classifyEmail(email: Email): Promise<string[]> {
  const categories: string[] = [];
  
  // Simple rule-based classification
  if (email.subject?.toLowerCase().includes('invoice')) {
    categories.push('finance');
  }
  if (email.from?.includes('@company.com')) {
    categories.push('internal');
  }
  
  return categories.length ? categories : ['general'];
}

export async function summarizeEmail(email: Email): Promise<string> {
  // Simple extractive summarization
  const sentences = email.body?.split(/[.!?]+/) || [];
  return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '');
}

export async function extractRelations(email: Email): Promise<string[]> {
  // Extract keywords from subject
  return email.subject?.match(/\b\w{4,}\b/g)?.slice(0, 3) || [];
}