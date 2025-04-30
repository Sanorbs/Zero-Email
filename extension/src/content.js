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
  
  // ... (previous content script code)

function displayEmailEnhancements(processed) {
  // Remove any existing enhancements
  document.querySelectorAll('.zems-enhancement').forEach(el => el.remove());
  
  // Find the email header element (Gmail-specific selector)
  const emailHeader = document.querySelector('[data-message-id]');
  if (!emailHeader) return;
  
  // Create summary card
  const summaryCard = document.createElement('div');
  summaryCard.className = 'zems-summary-card zems-enhancement';
  summaryCard.innerHTML = `
    <h4>ZEMS Summary</h4>
    <p>${processed.metadata.summary}</p>
    <div class="zems-metadata-tags">
      ${processed.metadata.categories.map(cat => 
        `<span class="zems-metadata-tag ${cat}">${cat}</span>`
      ).join('')}
      ${processed.metadata.importance > 0.7 ? 
        '<span class="zems-metadata-tag important">important</span>' : ''}
    </div>
    <div class="zems-action-buttons">
      <button class="zems-action-button primary">Follow Up</button>
      <button class="zems-action-button secondary">Snooze</button>
    </div>
  `;
  
  // Insert after email header
  emailHeader.parentNode.insertBefore(summaryCard, emailHeader.nextSibling);
  
  // Highlight important emails
  if (processed.metadata.importance > 0.7) {
    const emailContent = document.querySelector('.ii.gt');
    if (emailContent) {
      emailContent.classList.add('zems-email-highlight');
    }
  }
  
  // Add action button listeners
  document.querySelectorAll('.zems-action-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (button.textContent === 'Follow Up') {
        chrome.runtime.sendMessage({
          type: 'CREATE_REMINDER',
          emailId: processed.id,
          time: 'tomorrow'
        });
        button.textContent = 'Reminder Set';
        button.disabled = true;
      } else if (button.textContent === 'Snooze') {
        // Handle snooze
      }
    });
  });
}