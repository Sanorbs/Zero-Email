"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleReminders = scheduleReminders;
// In-memory reminders
const pendingReminders = new Map();
async function scheduleReminders(email) {
    try {
        // Clear existing reminder if any
        if (pendingReminders.has(email.id)) {
            clearTimeout(pendingReminders.get(email.id));
        }
        // Only schedule if email needs action and has metadata
        if (email.metadata?.needsAction) {
            const reminderTime = calculateReminderTime(email);
            const timeout = setTimeout(() => {
                sendReminderNotification(email);
                pendingReminders.delete(email.id);
            }, reminderTime.getTime() - Date.now());
            pendingReminders.set(email.id, timeout);
        }
    }
    catch (error) {
        console.error('Failed to schedule reminder:', error);
    }
}
function calculateReminderTime(email) {
    // Default to 48 hours if no importance is set
    const defaultHours = 48;
    // Use optional chaining and nullish coalescing for safe access
    const hours = (email.metadata?.importance ?? 0) > 0.7 ? 24 : defaultHours;
    const reminderTime = new Date();
    reminderTime.setHours(reminderTime.getHours() + hours);
    return reminderTime;
}
function sendReminderNotification(email) {
    console.log(`REMINDER: Action needed for email: ${email.subject}`);
    // Actual notification implementation would go here
}
