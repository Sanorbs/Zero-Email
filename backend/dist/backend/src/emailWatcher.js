"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchEmailRelations = watchEmailRelations;
const emailStorage_1 = require("./emailStorage");
const reminderService_1 = require("./reminderService");
async function watchEmailRelations(email) {
    try {
        // Initialize relations if empty
        email.metadata.relations = email.metadata.relations || [];
        // Find related emails (simplified example)
        const relatedEmails = findRelatedEmails(email);
        for (const relatedEmail of relatedEmails) {
            // Initialize relations if empty
            relatedEmail.metadata.relations = relatedEmail.metadata.relations || [];
            if (!relatedEmail.metadata.relations.includes(email.id)) {
                relatedEmail.metadata.relations.push(email.id);
                await (0, emailStorage_1.storeEmail)(relatedEmail);
            }
        }
        // Update current email's relations
        email.metadata.relations = [
            ...new Set([
                ...relatedEmails.map(e => e.id),
                ...email.metadata.relations
            ])
        ];
        await (0, emailStorage_1.storeEmail)(email);
        await (0, reminderService_1.scheduleReminders)(email);
    }
    catch (error) {
        console.error('Error watching email relations:', error);
    }
}
function findRelatedEmails(email) {
    // Implementation depends on your relation logic
    return []; // Return array of related emails
}
