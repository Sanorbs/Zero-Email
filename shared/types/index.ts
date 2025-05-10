export interface Email {
  id: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  date: Date;
  metadata: EmailMetadata; // Made mandatory
}

export interface EmailMetadata {
  read: boolean;
  starred: boolean;
  importance: number;
  categories: string[];
  summary: string;
  relations: string[];
  needsAction: boolean;
  processedAt: Date;
}

export interface SearchQuery {
  text: string;
  filters?: {
    dateRange?: { start: Date; end: Date };
    importanceThreshold?: number;
    categories?: string[];
  };
}