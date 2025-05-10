// Email processing queue
let processingQueue = [];
const PROCESSING_INTERVAL = 5000; // 5 seconds

// Process queue periodically
setInterval(async () => {
  if (processingQueue.length === 0) return;
  
  const email = processingQueue.shift();
  try {
    const response = await fetch('http://localhost:3000/api/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(email)
    });
    
    const processedEmail = await response.json();
    chrome.storage.local.get(['zemsEmails'], (result) => {
      const emails = result.zemsEmails || [];
      emails.push(processedEmail);
      chrome.storage.local.set({ zemsEmails: emails });
    });
  } catch (error) {
    console.error('ZEMS: Processing failed', error);
  }
}, PROCESSING_INTERVAL);

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'PROCESS_EMAIL':
      processingQueue.push(request.email);
      sendResponse({ success: true });
      break;
      
    case 'GET_EMAILS':
      chrome.storage.local.get(['zemsEmails'], (result) => {
        sendResponse({ emails: result.zemsEmails || [] });
      });
      return true; // Async response
      
    case 'SEARCH_EMAILS':
      chrome.storage.local.get(['zemsEmails'], (result) => {
        const emails = result.zemsEmails || [];
        const filtered = emails.filter(email => 
          email.subject.toLowerCase().includes(request.query.toLowerCase()) ||
          email.from.toLowerCase().includes(request.query.toLowerCase())
        );
        sendResponse({ results: filtered });
      });
      return true;
  }
  // Track content script connections
const ports = new Set();

chrome.runtime.onConnect.addListener((port) => {
  ports.add(port);
  port.onDisconnect.addListener(() => {
    ports.delete(port);
  });
});

// Handle extension reload
chrome.runtime.onSuspend.addListener(() => {
  console.log('ZEMS: Extension unloading - cleaning up');
  ports.forEach(port => port.disconnect());
});
});