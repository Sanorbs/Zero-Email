function checkEmailClient() {
  if (window.location.href.includes('mail.google.com')) {
    return 'gmail';
  } else if (window.location.href.includes('outlook.office.com')) {
    return 'outlook';
  }
  return null;
}
function injectEmailObserver() {
  const observer = new MutationObserver(() => {
    const email = extractCurrentEmail();
    if (email && !window.lastProcessedEmailId !== email.id) {
      window.lastProcessedEmailId = email.id;

      chrome.runtime.sendMessage(
        { type: 'PROCESS_EMAIL', email },
        (processed) => {
          if (processed?.metadata) {
            displayEmailEnhancements({ ...email, ...processed });
          }
        }
      );
    }
  });

  observer.observe(document.body, { subtree: true, childList: true });
}

function extractCurrentEmail(client) {
  switch(client) {
    case 'gmail':
      return {
        id: document.querySelector('[data-message-id]')?.dataset.messageId,
        from: document.querySelector('.gD')?.textContent,
        subject: document.querySelector('[data-thread-perm-id] h2')?.textContent,
        body: document.querySelector('.ii.gt')?.textContent,
        date: document.querySelector('.g3')?.title || document.querySelector('.xW.xY')?.textContent
      };
    case 'outlook':
      return {
        id: window.location.href.split('#')[1],
        from: document.querySelector('.ms-font-weight-semibold')?.textContent,
        subject: document.querySelector('[role=heading]')?.textContent,
        body: document.querySelector('#ReadingPaneContainerId')?.textContent,
        date: document.querySelector('.ms-font-s')?.textContent
      };
    default:
      return null;
  }
}

function displayEmailEnhancements(processed) {
  document.querySelectorAll('.zems-enhancement').forEach(el => el.remove());

  const emailHeader = document.querySelector('[data-message-id]');
  if (!emailHeader) return;

  const summaryCard = document.createElement('div');
  summaryCard.className = 'zems-summary-card zems-enhancement';
  summaryCard.style.cssText = `
    padding: 12px;
    border: 1px solid #ccc;
    background: #f9f9f9;
    border-radius: 8px;
    margin-top: 10px;
    font-family: sans-serif;
  `;

  summaryCard.innerHTML = `
    <h4>ZEMS Summary</h4>
    <p>${processed.metadata.summary}</p>
    <div class="zems-metadata-tags">
      ${(processed.metadata.categories || []).map(cat =>
        `<span style="background:#eee;padding:4px 8px;margin-right:4px;border-radius:4px;">${cat}</span>`
      ).join('')}
      ${processed.metadata.importance > 0.7 ?
        '<span style="background:#ffcccc;padding:4px 8px;margin-right:4px;border-radius:4px;">important</span>' : ''}
    </div>
    <div class="zems-action-buttons">
      <button class="zems-action-button primary">Follow Up</button>
      <button class="zems-action-button secondary">Snooze</button>
    </div>
  `;

  emailHeader.parentNode.insertBefore(summaryCard, emailHeader.nextSibling);

  // Optional: visually highlight high importance
  if (processed.metadata.importance > 0.7) {
    const emailContent = document.querySelector('.ii.gt');
    if (emailContent) {
      emailContent.style.border = '2px solid red';
    }
  }

  // Button logic
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
      }
    });
  });
  
  
}


// Start observing Gmail
if (window.location.href.includes('mail.google.com')) {
  injectEmailObserver();
}
window.addEventListener('load', () => {
  injectEmailObserver();
});