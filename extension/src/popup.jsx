import React, { useState, useEffect } from 'react';

const ZemsPopup = () => {
  const [emails, setEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_EMAILS' }, (response) => {
      setEmails(response.emails || []);
      setLoading(false);
    });
  }, []);

  const filteredEmails = emails.filter(email => {
    const matchesSearch = searchQuery === '' || 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' ||
      (filter === 'important' && email.metadata?.importance > 0.7) ||
      (filter === 'unread' && !email.metadata?.read) ||
      (filter === 'action' && email.metadata?.needsAction);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="zems-popup">
      <header>
        <h1>ZEMS</h1>
        <div className="status-indicator">Active</div>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search emails..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-buttons">
        {['all', 'important', 'unread', 'action'].map((f) => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading emails...</div>
      ) : (
        <div className="email-list">
          {filteredEmails.map((email) => (
            <div 
              key={email.id} 
              className="email-item"
              onClick={() => 
                chrome.tabs.create({ url: `https://mail.google.com/mail/u/0/#inbox/${email.id}` })
              }
            >
              <div className="email-header">
                <span className="sender">{email.from}</span>
                <span className="date">
                  {new Date(email.date).toLocaleDateString()}
                </span>
              </div>
              <div className="subject">{email.subject}</div>
              <div className="summary">{email.metadata?.summary}</div>
              <div className="tags">
                {email.metadata?.categories?.map(cat => (
                  <span key={cat} className="tag">{cat}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ZemsPopup;