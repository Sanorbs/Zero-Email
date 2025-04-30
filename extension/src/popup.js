document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const resultsContainer = document.getElementById('results-container');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const statusIndicator = document.getElementById('status-indicator');
  const processedCount = document.getElementById('processed-count');
  const settingsButton = document.getElementById('settings-button');
  
  // State
  let currentFilter = 'all';
  let emails = [];
  
  // Initialize
  loadInitialData();
  setupEventListeners();
  
  function loadInitialData() {
    // Load from Chrome storage or make API call
    chrome.storage.local.get(['zemsEmails', 'zemsStats'], (result) => {
      if (result.zemsEmails) {
        emails = result.zemsEmails;
        renderResults(filterEmails(emails, currentFilter));
      }
      
      if (result.zemsStats) {
        processedCount.textContent = `${result.zemsStats.processedToday} processed today`;
      } else {
        processedCount.textContent = '0 processed today';
      }
    });
    
    // Check service status
    checkServiceStatus();
  }
  
  function checkServiceStatus() {
    // Simulate status check
    setTimeout(() => {
      statusIndicator.textContent = 'Active';
      statusIndicator.style.backgroundColor = '#10b981';
    }, 500);
  }
  
  function setupEventListeners() {
    // Search functionality
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
    
    // Filter buttons
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        renderResults(filterEmails(emails, currentFilter));
      });
    });
    
    // Settings button
    settingsButton.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }
  
  function handleSearch() {
    const query = searchInput.value.trim();
    if (query === '') return;
    
    // Show loading state
    resultsContainer.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="2"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        <p>Searching for "${query}"...</p>
      </div>
    `;
    
    // Simulate search (in a real app, this would call your backend)
    setTimeout(() => {
      const filtered = emails.filter(email => 
        email.subject.toLowerCase().includes(query.toLowerCase()) || 
        email.body.toLowerCase().includes(query.toLowerCase())
      );
      renderResults(filtered);
    }, 800);
  }
  
  function filterEmails(emails, filter) {
    switch (filter) {
      case 'important':
        return emails.filter(email => email.metadata.importance > 0.7);
      case 'unread':
        return emails.filter(email => !email.metadata.read);
      case 'action':
        return emails.filter(email => email.metadata.needsAction);
      default:
        return emails;
    }
  }
  
  function renderResults(filteredEmails) {
    if (filteredEmails.length === 0) {
      resultsContainer.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <p>No emails found</p>
        </div>
      `;
      return;
    }
    
    resultsContainer.innerHTML = '';
    
    filteredEmails.forEach(email => {
      const emailEl = document.createElement('div');
      emailEl.className = 'email-result';
      
      // Format date
      const date = new Date(email.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      // Create tags based on metadata
      const tags = [];
      if (email.metadata.importance > 0.7) tags.push('important');
      if (!email.metadata.read) tags.push('unread');
      if (email.metadata.needsAction) tags.push('action');
      
      emailEl.innerHTML = `
        <div class="email-header">
          <div class="email-sender" title="${email.from}">${email.from}</div>
          <div class="email-date">${formattedDate}</div>
        </div>
        <div class="email-subject" title="${email.subject}">${email.subject}</div>
        <div class="email-preview">${email.metadata.summary || email.body.substring(0, 100)}...</div>
        <div class="email-meta">
          ${tags.map(tag => `<div class="email-tag ${tag}">${tag}</div>`).join('')}
        </div>
      `;
      
      emailEl.addEventListener('click', () => {
        chrome.tabs.create({ url: `https://mail.google.com/mail/u/0/#inbox/${email.id}` });
      });
      
      resultsContainer.appendChild(emailEl);
    });
  }
  
  // Simulate some demo data if empty
  if (emails.length === 0) {
    emails = [
      {
        id: '182d3b37',
        from: 'john.doe@company.com',
        subject: 'Project deadline extension',
        body: 'Hello team, I wanted to inform you that the deadline for the current project has been extended by two weeks. Please adjust your schedules accordingly.',
        date: new Date(),
        metadata: {
          importance: 0.8,
          summary: 'Project deadline extended by two weeks',
          read: true,
          needsAction: true,
          categories: ['work', 'important']
        }
      },
      {
        id: '273a4c28',
        from: 'notifications@linkedin.com',
        subject: 'You have 5 new connection requests',
        body: 'You have 5 new connection requests waiting for your response on LinkedIn.',
        date: new Date(Date.now() - 86400000),
        metadata: {
          importance: 0.3,
          summary: '5 new LinkedIn connection requests',
          read: false,
          needsAction: false,
          categories: ['social']
        }
      },
      {
        id: '364b5d19',
        from: 'support@acme.com',
        subject: 'Your recent order #45892',
        body: 'Thank you for your order! Your package has been shipped and will arrive in 3-5 business days.',
        date: new Date(Date.now() - 172800000),
        metadata: {
          importance: 0.5,
          summary: 'Order confirmation and shipping details',
          read: true,
          needsAction: false,
          categories: ['shopping']
        }
      }
    ];
    
    renderResults(emails);
  }
});