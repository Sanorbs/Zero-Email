import React from 'react';
import ReactDOM from 'react-dom';
import './popup.css';

const Popup = () => {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);

  const handleSearch = async () => {
    // Search functionality here
  };

  return (
    <div className="popup-container">
      <h1>ZEMS Search</h1>
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your emails naturally..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="results">
        {/* Render search results here */}
      </div>
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById('root'));