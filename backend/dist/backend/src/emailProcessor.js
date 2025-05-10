"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEmail = processEmail;
const aiService_1 = require("./aiService");
const emailStorage_1 = require("./emailStorage");
const reminderService_1 = require("./reminderService");
async function processEmail(email) {
    // Parallel processing
    const [categories, summary, relations] = await Promise.all([
        (0, aiService_1.classifyEmail)(email),
        (0, aiService_1.summarizeEmail)(email),
        (0, aiService_1.extractRelations)(email)
    ]);
    const processedEmail = {
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
    await (0, emailStorage_1.storeEmail)(processedEmail);
    await (0, reminderService_1.scheduleReminders)(processedEmail);
    return processedEmail;
}
function calculateImportance(email) {
    let score = 0;
    if (email.from?.includes('@company.com'))
        score += 0.3;
    if (email.subject?.toLowerCase().includes('urgent'))
        score += 0.4;
    if (email.metadata?.categories?.includes('finance'))
        score += 0.3;
    return Math.min(score, 1);
}
