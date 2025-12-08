import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import '../home.css'
import Nav from './nav';
import FAQ from '../faq';
import Chatbot from '../chatbot';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    return (
        <div style={{backgroundColor:'lightblue', height:'100vh', width:'100vw'}}>
            <Nav name={localStorage.getItem('loggedInUser')} handleLogout={handleLogout} />
            <ToastContainer />
        <div class="hero">
  <h1 class="fade-in">URL Phishing Detection</h1>
  <p class="fade-in">
    Our Project is URL Phishing Detection through Semantic Intention Mapping that analyzes a URL’s structure, keywords, and context to determine its real intent. By mapping semantic meaning with user intentions, the system identifies whether a link genuinely leads to trusted content or disguises malicious activity, improving phishing detection beyond surface-level pattern checks.
  </p>
  <button className='btn-start fade-in' onClick={()=>navigate('/detection')}>Start Checking Now</button>
</div>
<section class="semantic-section">
  <h2>Semantic Intention Mapping Process</h2>
  <div class="semantic-flow">
    <div class="card">
      <div class="icon">🔍</div>
      <h3>Analyze URL</h3>
      <p>Inspect the structure, domain, and hidden patterns within the URL.</p>
    </div>

    <div class="connector"></div>

    <div class="card">
      <div class="icon">🧠</div>
      <h3>Map Intent</h3>
      <p>Understand the semantic meaning to identify the real intention of the link.</p>
    </div>

    <div class="connector"></div>

    <div class="card">
      <div class="icon">⚡</div>
      <h3>Detect Result</h3>
      <p>Classify the URL as Safe or Phishing with AI-powered detection.</p>
    </div>
  </div>
</section>
<FAQ/>
<Chatbot/>


</div>
    )
}

export default Home;
