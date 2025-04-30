chrome.runtime.onInstalled.addListener(() => {
  console.log('ZEMS extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'PROCESS_EMAIL') {
    processEmail(request.email)
      .then(sendResponse)
      .catch(error => {
        console.error('Email processing failed:', error);
        sendResponse({ error: 'Processing failed' });
      });
    return true; // Keep the message channel open
  }

  if (request.type === 'CREATE_REMINDER') {
    console.log(`Reminder set for: ${request.emailId} at ${request.time}`);
    // Optionally store in chrome.storage or call an API
  }
});

async function processEmail(email) {
  // First store locally
  const result = await chrome.storage.local.get(['zemsEmails']);
  const emails = result.zemsEmails || [];
  
  // Add new email if not already exists
  if (!emails.some(e => e.id === email.id)) {
    emails.unshift({
      ...email,
      metadata: await analyzeEmail(email)
    });
    await chrome.storage.local.set({ zemsEmails: emails });
  }
  
  return emails.find(e => e.id === email.id);
}
