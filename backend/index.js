const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const predictRoute = require('./Routes/predictRoute');

require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;

// ✅ Middlewares
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// ✅ Routes
app.use("/api/predict", predictRoute);
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

// 🔹 Rule-based chatbot logic
function generateReply(message = "") {
  const msg = message.toLowerCase().trim();

  if (!msg) {
    return "Hi! I can help you understand URLs, phishing attacks, HTTPS, machine learning detection, and how our project works.";
  }

  // --- GREETINGS / SMALL TALK ---

  if (/(^|\b)(hi|hello|hey|yo|hola)\b/.test(msg)) {
    return "Hello! 👋 Ask me anything about URLs, phishing detection, HTTPS, zero-day attacks, or our ML-based system.";
  }

  if (msg.includes("who are you") || msg.includes("what can you do")) {
    return "I’m a rule-based assistant for this project. I explain concepts like phishing, URLs, HTTPS, zero-day attacks, semantic intention mapping, and how our detection model works.";
  }

  // --- URL BASICS ---

  if (msg.includes("what is url") || (msg.includes("url") || msg.includes("meaning"))) {
    return "A URL (Uniform Resource Locator) is the address of a resource on the internet, like https://example.com. It typically contains protocol, domain name, path, and optional query parameters.";
  }

  if (msg.includes("parts of url") || msg.includes("components of url")) {
    return "A URL has several parts: protocol (http/https), domain (example.com), optional subdomain (login.example.com), path (/login), and optional query parameters (?id=123).";
  }

  if (msg.includes("domain name")) {
    return "A domain name is the human-readable name of a website, such as google.com. It maps to an IP address where the website is hosted.";
  }

  if (msg.includes("subdomain")) {
    return "A subdomain is a subdivision of a main domain. For example, in login.example.com, 'login' is a subdomain of example.com.";
  }

  if (msg.includes("ip address") || msg.includes("url ip address")) {
    return "Some URLs use an IP address instead of a domain name, like http://192.168.1.1. Phishing URLs sometimes use raw IPs to hide their identity.";
  }

  // --- HTTPS / SECURITY ---

  if (msg.includes("what is https") || msg.includes("https")) {
    return "HTTPS is a secure version of HTTP that encrypts the communication between your browser and the website using SSL/TLS.";
  }

  if ((msg.includes("https") && msg.includes("safe")) || msg.includes("does https mean safe")) {
    return "HTTPS means the connection is encrypted, but it does NOT guarantee the site itself is safe. Many phishing sites also use HTTPS. Always verify the domain name.";
  }

  if (msg.includes("ssl certificate") || msg.includes("tls")) {
    return "An SSL/TLS certificate enables HTTPS and proves control over a domain. However, attackers can also obtain certificates for fake domains, so SSL alone does not guarantee legitimacy.";
  }

  // --- PHISHING BASICS ---

  if (msg.includes("what is phishing") || (msg.includes("phishing") && msg.includes("meaning"))) {
    return "Phishing is a cyber attack where attackers impersonate legitimate websites, emails or URLs to trick users into revealing sensitive information such as passwords, OTPs, or bank details.";
  }

  if (msg.includes("types of phishing") || msg.includes("kinds of phishing")) {
    return "Common phishing types include: email phishing, URL phishing, SMS phishing (smishing), voice phishing (vishing), and spear phishing targeting specific individuals.";
  }

  if (msg.includes("why is phishing dangerous") || msg.includes("phishing dangerous")) {
    return "Phishing is dangerous because it can lead to financial loss, data theft, account hijacking, identity theft, and long-term security breaches.";
  }

  // --- PHISHING URL PATTERNS ---

  if (msg.includes("suspicious url") || msg.includes("phishing url indicators") || (msg.includes("identify") && msg.includes("suspicious url"))) {
    return "Suspicious URLs often have misspelled domains, extra or strange subdomains, too many special characters, misleading keywords like 'login', 'secure', 'verify', and sometimes use URL shorteners to hide the real address.";
  }

  if (msg.includes("suspicious keywords") || msg.includes("keywords in phishing urls")) {
    return "Common suspicious keywords in phishing URLs include: login, secure, verify, update, account, confirm, free, bonus, reward. When combined with brand names, they are often phishing indicators.";
  }

  if (msg.includes("shortened url") || msg.includes("bit.ly") || msg.includes("tinyurl")) {
    return "Shortened URLs hide the real destination and are frequently used in phishing attacks. It's safer to expand them or avoid clicking unknown shortened links.";
  }

  if (msg.includes("why do phishing urls use brand names") || (msg.includes("brand name") && msg.includes("phishing"))) {
    return "Phishing URLs often embed brand names like 'paypal', 'bank', or 'google' to trick users into trusting the link. For example, paypal-login-secure.com is not the same as paypal.com.";
  }

  // --- ZERO-DAY PHISHING ---

  if (msg.includes("what is zero day") || msg.includes("zero-day phishing")) {
    return "Zero-day phishing refers to newly created phishing URLs that are not yet listed in blacklists or threat databases. They are harder to detect using traditional methods.";
  }

  if (msg.includes("why zero day phishing hard to detect") || msg.includes("zero day difficult")) {
    return "Zero-day phishing is hard to detect because these URLs are new and unknown. Blacklists only contain previously reported URLs, so we need ML-based detection that looks at URL patterns instead.";
  }

  // --- DETECTION TECHNIQUES: RULE-BASED, BLACKLIST, ML ---

  if (msg.includes("blacklist") && msg.includes("phishing")) {
    return "Blacklist-based detection compares URLs against a database of known phishing sites. It's simple but fails against zero-day or slightly modified phishing URLs.";
  }

  if (msg.includes("traditional methods") || (msg.includes("old methods") && msg.includes("phishing"))) {
    return "Traditional phishing detection often relied on blacklists, whitelists, and fixed rules. These methods are fast but weak against new or obfuscated phishing links.";
  }

  // --- LEXICAL FEATURES ---

  if (msg.includes("what are lexical features") || msg.includes("lexical features in url")) {
    return "Lexical features are text-based properties of the URL itself, such as URL length, number of dots, hyphens, digits, special characters, subdomains, and presence of suspicious words.";
  }

  if (msg.includes("examples of lexical features") || msg.includes("lexical feature examples")) {
    return "Examples of lexical features: URL length, domain length, path length, number of digits, number of dots, number of hyphens, presence of '@', use of IP addresses, and suspicious tokens like 'login' or 'secure'.";
  }

  if (msg.includes("why lexical features useful") || msg.includes("benefit of lexical features")) {
    return "Lexical features are useful because they are fast to compute and do not require external lookups. Many phishing URLs follow detectable lexical patterns such as long length, many symbols, and tricky subdomains.";
  }

  // --- SEMANTIC INTENTION MAPPING ---

  if (msg.includes("semantic intention mapping") || (msg.includes("semantic") && msg.includes("url"))) {
    return "Semantic intention mapping means analyzing the meaning and intent of words inside the URL, such as 'login', 'secure', or 'update', and checking if their usage matches the genuine purpose of the domain or looks misleading.";
  }

  if (msg.includes("semantic example") || msg.includes("example of semantic")) {
    return "Example: paypal.com/login is a legitimate login URL, but paypal-login-secure-update.com is likely phishing. Both contain 'paypal' and 'login', but the second one is a fake domain misusing the brand name.";
  }

  // --- MACHINE LEARNING / XGBOOST ---

  if (msg.includes("what is machine learning") || msg.includes("what is ml")) {
    return "Machine learning is a technique where models learn patterns from data instead of relying only on fixed rules. In phishing detection, ML can generalize to unseen URLs.";
  }

  if (msg.includes("which algorithm") && msg.includes("project")) {
    return "In this project, we use algorithms like XGBoost for classification of URLs as phishing or legitimate based on features extracted from them.";
  }

  if (msg.includes("what is xgboost") || msg.includes("explain xgboost")) {
    return "XGBoost (Extreme Gradient Boosting) is a powerful machine learning algorithm based on decision tree ensembles. It is fast, handles large feature sets well, and achieves high accuracy in classification tasks like phishing detection.";
  }

  if (msg.includes("why xgboost") || msg.includes("why did you choose xgboost")) {
    return "We chose XGBoost because it performs very well on tabular feature-based data, supports regularization to reduce overfitting, and is widely used in security and Kaggle competitions for its accuracy.";
  }

  // --- DATASET / TRAINING ---

  if (msg.includes("which dataset") || msg.includes("what dataset") || msg.includes("dataset used")) {
    return "We used a phishing URL dataset containing lexical features and labels indicating whether each URL is phishing or legitimate. It includes features like length, special character counts, and domain-related metrics.";
  }

  if (msg.includes("why dataset important") || msg.includes("role of dataset")) {
    return "The dataset is important because the ML model learns patterns of phishing vs legitimate URLs from it. The quality and diversity of data directly impact model accuracy.";
  }

  if (msg.includes("train test split") || msg.includes("training and testing data")) {
    return "We split the dataset into training and testing sets. The training set teaches the model, and the testing set evaluates how well it performs on unseen data.";
  }

  // --- MODEL OUTPUT / CONFIDENCE ---

  if (msg.includes("what does the model output") || msg.includes("model output")) {
    return "The model outputs a class label (phishing or legitimate) and a probability score indicating how confident the model is about that prediction.";
  }

  if (msg.includes("what is confidence score") || msg.includes("confidence score")) {
    return "A confidence score is a probability value between 0 and 1 that shows how sure the model is about its prediction. Higher scores mean higher confidence.";
  }

  // --- PROJECT WORKFLOW / SYSTEM FLOW ---

  if (msg.includes("explain project") || msg.includes("how does this project work") || msg.includes("system workflow")) {
    return "Our system takes a URL as input, extracts lexical and structural features, feeds them into an ML model like XGBoost, and classifies the URL as phishing or legitimate. The frontend shows the result with a confidence score and safety tips.";
  }

  if (msg.includes("architecture") || msg.includes("system design")) {
    return "The architecture includes a frontend (React) for user interaction, a backend (Node.js/Express) that communicates with a Python/ML service, and an ML model (XGBoost) trained on lexical phishing datasets.";
  }

  if (msg.includes("dashboard") || msg.includes("analytics")) {
    return "The dashboard page shows analytics like number of URLs scanned, ratio of phishing vs legitimate URLs, and recent scan history using charts and tables.";
  }

  // --- USER SAFETY / BEST PRACTICES ---

  if (msg.includes("how to stay safe") || msg.includes("avoid phishing") || msg.includes("protect myself")) {
    return "To stay safe: verify domain names carefully, avoid clicking unknown or shortened links, enable 2FA, never share OTPs or passwords, and access banking or login pages by typing the official URL manually.";
  }

  if (msg.includes("clicked on phishing link") || msg.includes("what if i click") || msg.includes("i clicked a phishing")) {
    return "If you clicked a phishing link, immediately change your passwords, log out from all devices, enable 2FA, and inform your bank or service provider if any financial data was involved.";
  }

  // --- URL PASTED BY USER ---

  if (msg.startsWith("http://") || msg.startsWith("https://") || msg.includes(".com") || msg.includes(".net") || msg.includes(".org")) {
    return "You shared something that looks like a URL. To analyze it properly, please use our Detection Page, which will run it through the ML model and show a prediction with a confidence score.";
  }

  // --- DEFAULT FALLBACK ---

  return "I’m a rule-based assistant for this project. Try asking me about: phishing, URLs, HTTPS, zero-day attacks, lexical features, semantic intention mapping, machine learning, datasets, or how our detection system works.";
}
// 🔹 Chatbot endpoint
app.post("/api/chat", (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.json({ reply: "Please type something related to URLs or phishing detection." });
    }

    const reply = generateReply(message);
    return res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    return res.status(500).json({ reply: "Sorry, something went wrong on the server." });
  }
});

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
