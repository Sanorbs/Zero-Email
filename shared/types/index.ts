export interface Email {
    id: string;
    from: string;
    to: string[];
    subject: string;
    body: string;
    date: Date;
    metadata: {
      importance?: number;
      categories?: string[];
      summary?: string;
      relations?: string[];
    };
  }
  
  export interface SearchQuery {
    text: string;
    filters?: {
      dateRange?: { start: Date; end: Date };
      importanceThreshold?: number;
      categories?: string[];
    };
  }