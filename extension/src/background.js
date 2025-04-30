chrome.runtime.onInstalled.addListener(() => {
    console.log('ZEMS extension installed');
  });
  
  // Listen for emails from content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'PROCESS_EMAIL') {
      processEmail(request.email).then(sendResponse);
      return true; // Required for async response
    }
  });
  
  async function processEmail(email) {
    // Send to backend or process locally
    const response = await fetch('http://localhost:3000/api/process', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    return response.json();
  }