import { Email, SearchQuery } from '../../shared/types';
import lunr from 'lunr';

interface IndexedEmail {
    id: string;
    subject: string;
    body: string;
    from: string;
    categories: string;
}

export class EmailIndex {
    private index: lunr.Index;
    private emails: Record<string, Email> = {};

    constructor() {
        this.index = this.buildIndex();
    }

    private buildIndex(): lunr.Index {
        const builder = new lunr.Builder();
        builder.ref('id');
        builder.field('subject');
        builder.field('body');
        builder.field('from');
        builder.field('categories');

        // Add emails to index
        Object.values(this.emails).forEach((email: Email) => {
            builder.add({
                id: email.id,
                subject: email.subject || '',
                body: email.body || '',
                from: email.from || '',
                categories: email.metadata.categories?.join(' ') || ''
            });
        });

        return builder.build();
    }

    addEmail(email: Email): void {
        this.emails[email.id] = email;
        this.index = this.buildIndex();
    }

    search(query: SearchQuery): Email[] {
        const results = this.index.search(query.text);
        return results
            .map(result => this.emails[result.ref])
            .filter((email): email is Email => !!email);
    }
}