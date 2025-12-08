import Nav from './nav';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import './discussion.css';

function Discussion() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  // Simple heuristic analysis for “Quick Insights”
  const getHeuristics = (inputUrl) => {
    const insights = [];
    const u = (inputUrl || '').toLowerCase();

    if (u.length > 75) {
      insights.push('URL length is unusually long – long URLs are often used to hide malicious parts.');
    } else if (u.length < 25) {
      insights.push('URL length is short, which is common for many legitimate domains.');
    }

    const suspiciousWords = ['login', 'verify', 'secure', 'update', 'account', 'bank', 'confirm', 'password'];
    if (suspiciousWords.some(w => u.includes(w))) {
      insights.push('Contains sensitive action keywords like login/verify/update – verify the domain carefully.');
    }

    if (/@/.test(u)) {
      insights.push('Contains "@" symbol – often used in phishing to obfuscate the real destination.');
    }

    if (/(http:\/\/\d+\.\d+\.\d+\.\d+)/.test(u) || /^[0-9.]+$/.test(u.split('/')[2] || '')) {
      insights.push('Domain looks like an IP address – phishing URLs sometimes use raw IPs instead of names.');
    }

    const dotCount = (u.match(/\./g) || []).length;
    if (dotCount > 4) {
      insights.push('Has many dots/subdomains – attackers use long fake subdomains to mimic real sites.');
    }

    if (!insights.length) {
      insights.push('No strong lexical red flags detected, but always verify the domain and context.');
    }

    return insights;
  };

  const handleDetect = async () => {
    setErrorMsg('');
    setResult(null);

    if (!url.trim()) {
      setErrorMsg('Please enter a URL to check.');
      handleError('Please enter a URL to check.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('http://localhost:8080/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        console.error('Detection error:', data);
        setErrorMsg(data.error || 'Something went wrong while checking this URL.');
        handleError(data.error || 'Detection failed.');
        return;
      }

      const finalResult = {
        ...data,
        insights: getHeuristics(data.url || url),
      };

      setResult(finalResult);
      handleSuccess('URL analyzed successfully.');

      setHistory(prev => [
        {
          url: finalResult.url || url,
          prediction: finalResult.prediction,
          confidence: finalResult.confidence,
          time: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 9), // keep last 10
      ]);
    } catch (err) {
      console.error('Detect request failed:', err);
      setErrorMsg('Unable to connect to server. Please try again.');
      handleError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = () => {
    if (!result || !result.prediction) return 'status-badge';
    const p = result.prediction.toLowerCase();
    if (p.includes('phish')) return 'status-badge danger';
    if (p.includes('safe') || p.includes('legit')) return 'status-badge success';
    return 'status-badge warning';
  };

  const formatConfidence = (c) => {
    if (c === undefined || c === null || isNaN(c)) return 'N/A';
    return c > 1 ? `${c.toFixed(2)}%` : `${(c * 100).toFixed(2)}%`;
  };

  return (
    <div style={{ backgroundColor: 'lightblue', minHeight: '100vh', width: '100vw' }}>
      <Nav name={loggedInUser} handleLogout={handleLogout} />
      <ToastContainer />

      <div className="detection-page" style={{ marginTop: '120px' }}>
        <header className="detect-header">
          <h1>Phishing URL Detection</h1>
          <p>Enter a suspicious link below and instantly check its safety.</p>
        </header>

        <section className="detect-input">
          <input
            type="text"
            placeholder="https://example.com/login"
            id="urlInput"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button id="detectBtn" onClick={handleDetect} disabled={loading}>
            {loading ? 'Detecting...' : 'Detect'}
          </button>
        </section>

        <section className="detect-result" id="resultCard">
          {errorMsg && (
            <div className="detect-error">
              {errorMsg}
            </div>
          )}

          {!result && !errorMsg && (
            <h2>Result will appear here...</h2>
          )}

          {result && !errorMsg && (
            <div className="detect-result-card fade-in-up">
              <div className="detect-result-header">
                <span className={getStatusClass()}>
                  {result.prediction.toLowerCase().includes('phish')
                    ? '🚨 PHISHING'
                    : '✅ LEGITIMATE'}
                </span>

                <span className="confidence">
                  Confidence:&nbsp;
                  <b>{formatConfidence(result.confidence)}</b>
                </span>
              </div>

              <div className="detect-divider"></div>

              <p className="result-url">
                <b>Analyzed URL:</b><br />
                <span>{result.url || url}</span>
              </p>

              <p className="result-note">
                This prediction is generated using machine learning over lexical URL features and patterns
                learned from phishing and legitimate datasets.
              </p>

              {result.insights && result.insights.length > 0 && (
                <div className="insights">
                  <h4>Quick Insights</h4>
                  <ul>
                    {result.insights.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Recent history section */}
        {history.length > 0 && (
          <section className="detect-history">
            <h3>Recent Checks</h3>
            <div className="history-list">
              {history.map((item, idx) => (
                <div key={idx} className="history-item">
                  <div className="history-top">
                    <span className="history-url">{item.url}</span>
                    <span
                      className={
                        item.prediction.toLowerCase().includes('phish')
                          ? 'history-badge danger'
                          : item.prediction.toLowerCase().includes('safe') ||
                            item.prediction.toLowerCase().includes('legit')
                          ? 'history-badge success'
                          : 'history-badge warning'
                      }
                    >
                      {item.prediction.toUpperCase()}
                    </span>
                  </div>
                  <div className="history-bottom">
                    <span className="history-time">{item.time}</span>
                    <span className="history-confidence">
                      {formatConfidence(item.confidence)} confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="detect-tips">
          <h3>Stay Safe Online</h3>
          <ul>
            <li>✔ Double-check the spelling of domains.</li>
            <li>✔ Look for HTTPS but don’t rely only on it.</li>
            <li>✔ Avoid clicking shortened or random links.</li>
            <li>✔ Enable Two-Factor Authentication wherever possible.</li>
          </ul>
        </section>

        <footer className="detect-footer">
          <p>
            © 2025 URL Phishing Detection through Semantic Intention Mapping |
            <a href="https://github.com/your-repo" target="_blank" rel="noreferrer">
              &nbsp;GitHub Repo
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Discussion;
