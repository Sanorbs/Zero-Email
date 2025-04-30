import { Email } from '../../shared/types';
import sqlite3, { Database, RunResult } from 'sqlite3';
import { open, ISqlite } from 'sqlite';

// Type definitions for SQLite rows
interface EmailRow {
  id: string;
  sender: string;
  recipients: string;
  subject: string;
  body: string;
  date: string;
  importance: number;
  categories: string;
  summary: string;
  relations: string;
}

export class EmailStorage {
  private db: Database;

  constructor(dbPath: string = ':memory:') {
    this.db = new sqlite3.Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `CREATE TABLE IF NOT EXISTS emails (
          id TEXT PRIMARY KEY,
          sender TEXT NOT NULL,
          recipients TEXT NOT NULL,
          subject TEXT,
          body TEXT,
          date TEXT NOT NULL,
          importance REAL,
          categories TEXT,
          summary TEXT,
          relations TEXT
        )`,
        (err: Error | null) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async saveEmail(email: Email): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO emails 
        (id, sender, recipients, subject, body, date, importance, categories, summary, relations)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          email.id,
          email.from,
          JSON.stringify(email.to),
          email.subject,
          email.body,
          email.date.toISOString(),
          email.metadata.importance,
          JSON.stringify(email.metadata.categories),
          email.metadata.summary,
          JSON.stringify(email.metadata.relations),
        ],
        (err: Error | null) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async getEmail(id: string): Promise<Email | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM emails WHERE id = ?',
        [id],
        (err: Error | null, row: EmailRow) => {
          if (err) return reject(err);
          if (!row) return resolve(null);

          const email: Email = {
            id: row.id,
            from: row.sender,
            to: JSON.parse(row.recipients),
            subject: row.subject,
            body: row.body,
            date: new Date(row.date),
            metadata: {
              importance: row.importance,
              categories: JSON.parse(row.categories),
              summary: row.summary,
              relations: JSON.parse(row.relations),
            },
          };

          resolve(email);
        }
      );
    });
  }

  async searchEmails(query: string): Promise<Email[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM emails 
        WHERE body LIKE ? OR subject LIKE ? OR sender LIKE ?
        ORDER BY importance DESC, date DESC
        LIMIT 50`,
        [`%${query}%`, `%${query}%`, `%${query}%`],
        (err: Error | null, rows: EmailRow[]) => {
          if (err) return reject(err);

          const emails = rows.map((row: EmailRow) => ({
            id: row.id,
            from: row.sender,
            to: JSON.parse(row.recipients),
            subject: row.subject,
            body: row.body,
            date: new Date(row.date),
            metadata: {
              importance: row.importance,
              categories: JSON.parse(row.categories),
              summary: row.summary,
              relations: JSON.parse(row.relations),
            },
          }));

          resolve(emails);
        }
      );
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}