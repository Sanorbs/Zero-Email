// Content Script for Gmail Email Processing

// 1. Email Extraction Function
function extractCurrentEmail() {
  try {
    const emailElement = document.querySelector('[data-legacy-thread-id]');
    if (!emailElement) return null;

    return {
      id: emailElement.dataset.legacyThreadId,
      from: document.querySelector('[email]')?.textContent.trim() || 
           document.querySelector('.gD')?.textContent.trim() || 
           'Unknown',
      subject: document.querySelector('h2[data-thread-perm-id]')?.textContent.trim() || 
              document.querySelector('h2')?.textContent.trim() || 
              'No Subject',
      body: document.querySelector('.ii.gt')?.textContent.trim() || 
           document.querySelector('.a3s.aiL')?.textContent.trim() || 
           '',
      date: document.querySelector('.g3')?.title || 
           document.querySelector('.xW.xY')?.textContent.trim() || 
           new Date().toISOString(),
      metadata: {
        read: !document.querySelector('[aria-label="Mark as unread"]'),
        starred: !!document.querySelector('[aria-label="Remove star"]')
      }
    };
  } catch (error) {
    console.error('ZEMS: Email extraction error', error);
    return null;
  }
}

// 2. Extension Context Validation
function isExtensionContextValid() {
  try {
    return !!chrome.runtime?.id;
  } catch (e) {
    return false;
  }
}

// 3. Safe Message Sending
function safeSendMessage(message, callback) {
  if (!isExtensionContextValid()) {
    console.warn('ZEMS: Context invalid - reloading');
    window.location.reload();
    return;
  }
  
  try {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        console.error('ZEMS: Message failed', chrome.runtime.lastError);
        return;
      }
      callback?.(response);
    });
  } catch (error) {
    console.error('ZEMS: Message sending failed', error);
  }
}

// 4. Email Processing Handler
function processEmail() {
  if (!isExtensionContextValid()) return;
  
  const email = extractCurrentEmail();
  if (email) {
    console.log('ZEMS: Extracted email', email);
    safeSendMessage({
      type: 'PROCESS_EMAIL',
      email: email
    }, (response) => {
      if (response?.success) {
        console.log('ZEMS: Email processed successfully');
      }
    });
  }
}

// 5. MutationObserver Initialization
function initializeObserver() {
  const observer = new MutationObserver(() => {
    if (isExtensionContextValid()) {
      processEmail();
    }
  });

  try {
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true
    });
    console.log('ZEMS: Content script initialized');
  } catch (error) {
    console.error('ZEMS: Observer failed to start', error);
  }
}

// 6. Main Execution
if (isExtensionContextValid()) {
  if (document.readyState === 'complete') {
    initializeObserver();
  } else {
    window.addEventListener('load', initializeObserver);
  }
}