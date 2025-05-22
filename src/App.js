import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [authCode, setAuthCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Google OAuth configuration using your client ID from .env
  const googleConfig = {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI_FE,
    // Multiple scopes separated by spaces
    scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/adwords',
    responseType: 'code',
    accessType: 'offline',
    prompt: 'consent'
  };

  // Check URL for authorization code on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      setAuthCode(code);
      // Clean URL for better UX
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Function to initiate Google OAuth flow
  const handleConnect = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
      `client_id=${encodeURIComponent(googleConfig.clientId)}` +
      `&redirect_uri=${encodeURIComponent(googleConfig.redirectUri)}` +
      `&scope=${encodeURIComponent(googleConfig.scope)}` +
      `&response_type=${googleConfig.responseType}` +
      `&access_type=${googleConfig.accessType}` +
      `&prompt=${googleConfig.prompt}`;
    
    window.location.href = authUrl;
  };

  // Function to copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(authCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="container">
      <header>
        <h1>Google Marketing APIs Authorization</h1>
        <p className="subtitle">OAuth code generator for Google Analytics, Search Console, and Google Ads</p>
      </header>
      
      {!authCode ? (
        <div className="connect-section">
          <p>Click the button below to connect with your Google account and authorize access to your Google marketing data.</p>

          <div className="permissions-info">
            <h3>Permissions Requested:</h3>
            <ul>
              <li>Google Analytics (read-only access)</li>
              <li>Google Search Console (read-only access)</li>
              <li>Google Ads (read-only access)</li>
            </ul>
          </div>

          <button className="connect-button" onClick={handleConnect}>Connect with Google</button>
        </div>
      ) : (
        <div className="code-section">
          <h2>Authorization Code Generated</h2>
          <p className="instructions">Use this code in your <strong>POST</strong> request to: <code>http://localhost:3000/google/oauth</code></p>
          
          <div className="code-display">
            <p className="code-label">Your authorization code:</p>
            <div className="code-box">
              <code>{authCode}</code>
            </div>
          </div>
          
          <div className="buttons">
            <button className="copy-button" onClick={copyToClipboard}>
              {copied ? '✓ Copied!' : 'Copy Code'}
            </button>
            <button className="reset-button" onClick={() => setAuthCode('')}>
              Start Over
            </button>
          </div>

          <div className="api-example">
            <h3>API Request Example:</h3>
            <pre>
{`PUT http://localhost:3000/google/oauth
Content-Type: application/json
Authorization: Bearer YOUR_AUTH_TOKEN

{
  "code": "${authCode}"
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;