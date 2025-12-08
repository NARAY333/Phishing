import Nav from './nav';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import './aboutus.css'

function About() {
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
        <div style={{backgroundColor:'black', height:'100vh', width:'100vw'}}>
            <Nav name={localStorage.getItem('loggedInUser')} handleLogout={handleLogout}/>
            <div className='ab1'>
                <p>Phishing Detection using Semantic URL Content Intention Mapping </p>
            <img src='/aboutb.png' alt='aboutus' className='abimg'/>
            <h1 className='ab1-heading'>We aim to create a safer internet by developing intelligent systems
            that can detect and block phishing websites in real time.</h1>
            <div className="steps">
                <section class="process" aria-label="How it works">
  <h2 class="process-heading">How it works</h2>

  <div class="process-steps">
    <article class="step-card" aria-labelledby="step1-title">
      <div class="step-icon" aria-hidden="true">🔎</div>
      <h3 id="step1-title" class="step-title">Analyze URL</h3>
      <p class="step-desc" style={{color: 'white',marginTop:'20px',fontSize:'25px'}}>Fetches the webpage’s content, including the title and visible text, and converts it into a semantic representation, capturing the actual purpose of the page.</p>
    </article>

    <article class="step-card" aria-labelledby="step2-title">
      <div class="step-icon" aria-hidden="true">🤖</div>
      <h3 id="step2-title" class="step-title">AI Model Prediction</h3>
      <p class="step-desc" style={{color: 'white',marginTop:'20px',fontSize:'25px'}}>Both the URL intent and the page content are transformed into numerical vectors, and a cosine similarity score is computed to measure how closely the page content matches the expected intent of the URL.</p>
    </article>

    <article class="step-card" aria-labelledby="step3-title">
      <div class="step-icon" aria-hidden="true">✅</div>
      <h3 id="step3-title" class="step-title">Display Results</h3>
      <p class="step-desc" style={{color: 'white',marginTop:'20px',fontSize:'25px'}}>Generates a verdict such as “likely benign” for high similarity or “suspicious” for low similarity and displays the results in a contextual manner, showing the URL, page title, similarity score, the verdict, and a risk explanation that informs the user why the site may or may not be safe.</p>
    </article>
  </div>
</section>
        <div className='teams'>
            <section class="team-section">
  <h2 class="team-heading">Meet the Team</h2>
  <div class="guide-card">
    <img src="" alt="Guide" class="avatar-guide"/>
    <div>
      <h3 class="team-name">Mrs. J Vidya</h3>
      <p class="team-role" style={{marginTop:'20px'}}>Project Guide</p>
      <p class="team-extra" style={{marginTop:'20px'}}>Guiding research & architecture decisions.</p>
    </div>
  </div>

  <div class="team-grid">
    <article class="team-card">
      <img src="https://i.pravatar.cc/80?img=1" alt="Team member" class="avatar"/>
      <h3 class="team-name">M C S S Lakshmi Narayana</h3>
      <p class="team-role" style={{marginTop:'20px'}}>Frontend Developer</p>
    </article>

    <article class="team-card">
      <img src="https://i.pravatar.cc/80?img=2" alt="Team member" class="avatar"/>
      <h3 class="team-name">N Chandu</h3>
      <p class="team-role" style={{marginTop:'20px'}}>Backend Developer</p>
    </article>

    <article class="team-card">
      <img src="https://i.pravatar.cc/80?img=3" alt="Team member" class="avatar"/>
      <h3 class="team-name">M Hitesh</h3>
      <p class="team-role" style={{marginTop:'20px'}}>ML Research</p>
    </article>

    <article class="team-card">
      <img src="https://i.pravatar.cc/80?img=4" alt="Team member" class="avatar"/>
      <h3 class="team-name">K Rajesh</h3>
      <p class="team-role" style={{marginTop:'20px'}}>Security Analyst</p>
    </article>
  </div>
</section>

        </div>
        <div className='logos'>
            <section class="tech-section">
  <h2 class="tech-heading">Built with Modern Technologies</h2>
  <div class="logo-slider">
    <div class="logo-track">
      <div class="logo">⚛️ React</div>
      <div class="logo">🟢 Node.js</div>
      <div class="logo">⚡ Express</div>
      <div class="logo">🐍 Python</div>
      <div class="logo">🤖 ML/AI</div>
      <div class="logo">🍃 MongoDB</div>
      <div class="logo">⚛️ React</div>
      <div class="logo">🟢 Node.js</div>
      <div class="logo">⚡ Express</div>
      <div class="logo">🐍 Python</div>
      <div class="logo">🤖 ML/AI</div>
      <div class="logo">🍃 MongoDB</div>
    </div>
  </div>
</section>

        </div>
        <div className='footers'>
            <footer class="footer">
  <div class="footer-content">
    <p>© 2025 URL Phishing Detection using Content Mapping</p>
    <div class="footer-links">
      <a href="mailto:youremail@example.com">📧 Email</a>
      <a href="https://github.com/your-repo" target="_blank">💻 GitHub Repo</a>
    </div>
  </div>
</footer>

        </div>


        </div>
            </div>
            <ToastContainer />
        </div>
    )
}
export default About;