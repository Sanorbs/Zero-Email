function injectEmailObserver() {
    // Watch for email view changes in Gmail/Outlook
    const observer = new MutationObserver(() => {
      const email = extractCurrentEmail();
      if (email) {
        chrome.runtime.sendMessage({
          type: 'PROCESS_EMAIL',
          email
        }, (processed) => {
          displayEmailEnhancements(processed);
        });
      }
    });
  
    observer.observe(document.body, { subtree: true, childList: true });
  }
  
  function extractCurrentEmail() {
    // Extract email data from Gmail/Outlook DOM
    // This will be email client specific
    return {
      id: window.location.href,
      from: document.querySelector('.from')?.textContent,
      subject: document.querySelector('.subject')?.textContent,
      body: document.querySelector('.email-body')?.textContent,
      date: document.querySelector('.date')?.textContent
    };
  }
  
  function displayEmailEnhancements(processed) {
    // Add metadata to UI
    const summaryEl = document.createElement('div');
    summaryEl.className = 'zems-summary';
    summaryEl.textContent = processed.metadata.summary;
    document.body.appendChild(summaryEl);
  }
  
  // Start observing when DOM is ready
  if (document.readyState === 'complete') {
    injectEmailObserver();
  } else {
    window.addEventListener('load', injectEmailObserver);
  }