import React, { useState } from "react";
import "./faq.css";

const leftFaqs = [
  { question: "1. What is a URL?", answer: "A URL (Uniform Resource Locator) is the address of a resource on the internet. It includes protocol, domain, path, and optional query parameters." },
  { question: "2. What is the difference between HTTP and HTTPS?", answer: "HTTP transfers data as plain text, while HTTPS uses SSL/TLS encryption for secure communication." },
  { question: "3. What makes a URL suspicious or malicious?", answer: "Misspelled domains, extra subdomains, redirects, or shortened links hiding the real domain." },
  { question: "4. What is phishing?", answer: "Phishing is a cyber-attack where fake websites trick users into revealing sensitive data." },
  { question: "5. How do attackers create phishing URLs?", answer: "They register lookalike domains, use shorteners, or compromised servers." }
];

const rightFaqs = [
  { question: "6. Why can phishing links be hard to detect manually?", answer: "Phishing websites mimic trusted designs, use HTTPS, and copy logos." },
  { question: "7. What are traditional methods of phishing detection?", answer: "Blacklist/Whitelist checks and heuristics such as too many subdomains." },
  { question: "8. How does machine learning improve phishing detection?", answer: "ML analyzes URL patterns and domains to detect new phishing attempts." },
  { question: "9. What is the role of domain reputation in phishing detection?", answer: "Newly registered or low-reputation domains are more likely to be phishing." },
  { question: "10. What are best practices to avoid phishing attacks?", answer: "Check domains carefully, avoid suspicious links, use HTTPS, and enable 2FA." }
];

function FAQ() {
  const [activeLeft, setActiveLeft] = useState([]);
  const [activeRight, setActiveRight] = useState([]);

  const toggleLeft = (index) => {
    if (activeLeft.includes(index)) {
      setActiveLeft(activeLeft.filter((i) => i !== index));
    } else {
      setActiveLeft([...activeLeft, index]);
    }
  };

  const toggleRight = (index) => {
    if (activeRight.includes(index)) {
      setActiveRight(activeRight.filter((i) => i !== index));
    } else {
      setActiveRight([...activeRight, index]);
    }
  };

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-columns">
        
 
        <div className="faq-column">
          {leftFaqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeLeft.includes(index) ? "active" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleLeft(index)}>
                {faq.question}
              </div>
              <div className="faq-answer">{faq.answer}</div>
            </div>
          ))}
        </div>


        <div className="faq-column">
          {rightFaqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeRight.includes(index) ? "active" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleRight(index)}>
                {faq.question}
              </div>
              <div className="faq-answer">{faq.answer}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FAQ;
