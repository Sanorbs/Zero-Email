"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSearch = void 0;
class EmailSearch {
    constructor(emails) {
        this.index = [];
        this.index = emails;
    }
    search(query) {
        return this.index.filter(email => {
            const matchesText = email.subject.toLowerCase().includes(query.text.toLowerCase()) ||
                email.body.toLowerCase().includes(query.text.toLowerCase());
            const matchesFilters = ((!query.filters?.dateRange ||
                (new Date(email.date) >= query.filters.dateRange.start &&
                    new Date(email.date) <= query.filters.dateRange.end)) &&
                (!query.filters?.importanceThreshold ||
                    email.metadata.importance >= query.filters.importanceThreshold) &&
                (!query.filters?.categories ||
                    query.filters.categories.some(cat => email.metadata.categories.includes(cat))));
            return matchesText && matchesFilters;
        });
    }
}
exports.EmailSearch = EmailSearch;
