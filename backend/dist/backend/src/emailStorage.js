"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeEmail = storeEmail;
exports.getEmails = getEmails;
// In-memory storage (replace with database in production)
const emailStorage = [];
async function storeEmail(email) {
    try {
        // Check if email already exists
        const existingIndex = emailStorage.findIndex(e => e.id === email.id);
        if (existingIndex >= 0) {
            // Update existing email
            emailStorage[existingIndex] = email;
        }
        else {
            // Add new email
            emailStorage.push(email);
        }
        // In a real implementation, you would save to a database here
        console.log(`Stored email: ${email.subject}`);
    }
    catch (error) {
        console.error('Failed to store email:', error);
        throw error;
    }
}
async function getEmails() {
    return [...emailStorage]; // Return a copy
}
