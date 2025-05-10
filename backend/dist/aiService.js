"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyEmail = classifyEmail;
exports.summarizeEmail = summarizeEmail;
exports.extractRelations = extractRelations;
async function classifyEmail(email) {
    const categories = [];
    // Simple rule-based classification
    if (email.subject?.toLowerCase().includes('invoice')) {
        categories.push('finance');
    }
    if (email.from?.includes('@company.com')) {
        categories.push('internal');
    }
    return categories.length ? categories : ['general'];
}
async function summarizeEmail(email) {
    // Simple extractive summarization
    const sentences = email.body?.split(/[.!?]+/) || [];
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '');
}
async function extractRelations(email) {
    // Extract keywords from subject
    return email.subject?.match(/\b\w{4,}\b/g)?.slice(0, 3) || [];
}
