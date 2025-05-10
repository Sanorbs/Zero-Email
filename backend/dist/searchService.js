"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailIndex = void 0;
const lunr_1 = __importDefault(require("lunr"));
class EmailIndex {
    constructor() {
        this.emails = {};
        this.index = this.buildIndex();
    }
    buildIndex() {
        const builder = new lunr_1.default.Builder();
        builder.ref('id');
        builder.field('subject');
        builder.field('body');
        builder.field('from');
        builder.field('categories');
        // Add emails to index
        Object.values(this.emails).forEach((email) => {
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
    addEmail(email) {
        this.emails[email.id] = email;
        this.index = this.buildIndex();
    }
    search(query) {
        const results = this.index.search(query.text);
        return results
            .map(result => this.emails[result.ref])
            .filter((email) => !!email);
    }
}
exports.EmailIndex = EmailIndex;
