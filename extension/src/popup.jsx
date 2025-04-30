import React, { useState, useEffect } from 'react';

const ZemsPopup = () => {
  // State
  const [searchInput, setSearchInput] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Loading...');
  const [processedCount, setProcessedCount] = useState('0 processed today');

  // Initialize
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    // Load from Chrome storage or make API call
    chrome.storage.local.get(['zemsEmails', 'zemsStats'], (result) => {
      if (result.zemsEmails) {
        setEmails(result.zemsEmails);
      } else {
        // Use demo data if empty
        setEmails(getDemoEmails());
      }
      
      if (result.zemsStats) {
        setProcessedCount(`${result.zemsStats.processedToday} processed today`);
      }
    });
    
    checkServiceStatus();
  };

  const checkServiceStatus = () => {
    // Simulate status check
    setTimeout(() => {
      setStatus('Active');
    }, 500);
  };

  const handleSearch = () => {
    const query = searchInput.trim();
    if (query === '') return;
    
    setIsLoading(true);
    
    // Simulate search (in a real app, this would call your backend)
    setTimeout(() => {
      const filtered = emails.filter(email => 
        email.subject.toLowerCase().includes(query.toLowerCase()) || 
        email.body.toLowerCase().includes(query.toLowerCase())
      );
      setIsLoading(false);
      setEmails(filtered);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const openSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  const openEmail = (emailId) => {
    chrome.tabs.create({ url: `https://mail.google.com/mail/u/0/#inbox/${emailId}` });
  };

  const filterEmails = (emails, filter) => {
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
  };

  const getDemoEmails = () => {
    return [
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
  };

  const renderEmailTags = (email) => {
    const tags = [];
    if (email.metadata.importance > 0.7) tags.push('important');
    if (!email.metadata.read) tags.push('unread');
    if (email.metadata.needsAction) tags.push('action');

    return tags.map(tag => (
      <div key={tag} className={`email-tag ${tag}`}>{tag}</div>
    ));
  };

  const filteredEmails = filterEmails(emails, currentFilter);

  return (
    <div className="zems-container">
      <header className="zems-header">
        <h1>ZEMS</h1>
        <div className="zems-status" style={{ backgroundColor: status === 'Active' ? '#10b981' : '' }}>
          {status}
        </div>
      </header>
      
      <div className="zems-search-container">
        <input
          type="text"
          id="search-input"
          placeholder="Search all emails..."
          autoComplete="off"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button id="search-button" onClick={handleSearch}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
      
      <div className="zems-quick-filters">
        <button
          className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${currentFilter === 'important' ? 'active' : ''}`}
          onClick={() => handleFilterChange('important')}
        >
          Important
        </button>
        <button
          className={`filter-btn ${currentFilter === 'unread' ? 'active' : ''}`}
          onClick={() => handleFilterChange('unread')}
        >
          Unread
        </button>
        <button
          className={`filter-btn ${currentFilter === 'action' ? 'active' : ''}`}
          onClick={() => handleFilterChange('action')}
        >
          Action Needed
        </button>
      </div>
      
      <div className="zems-results" id="results-container">
        {isLoading ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <p>Searching for "{searchInput}"...</p>
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <p>No emails found</p>
          </div>
        ) : (
          filteredEmails.map(email => {
            const date = new Date(email.date);
            const formattedDate = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });
            
            return (
              <div key={email.id} className="email-result" onClick={() => openEmail(email.id)}>
                <div className="email-header">
                  <div className="email-sender" title={email.from}>{email.from}</div>
                  <div className="email-date">{formattedDate}</div>
                </div>
                <div className="email-subject" title={email.subject}>{email.subject}</div>
                <div className="email-preview">
                  {email.metadata.summary || email.body.substring(0, 100)}...
                </div>
                <div className="email-meta">
                  {renderEmailTags(email)}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <div className="zems-footer">
        <button id="settings-button" onClick={openSettings}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
        <div className="zems-stats">{processedCount}</div>
      </div>
    </div>
  );
};

export default ZemsPopup;