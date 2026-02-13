Phishing attacks remain one of the most persistent cybersecurity threats, exploiting deceptive URLs to impersonate trusted services and steal sensitive information. Traditional blacklist-based systems fail to detect newly generated (zero-day) phishing URLs, while standalone machine learning models often lack semantic reasoning and interpretable confidence estimation.

This project presents a hybrid phishing detection framework that integrates:

Lexical feature-based machine learning (XGBoost)

Semantic intention mapping (brand similarity + intent keyword detection)

Rule-based verification

Real-world confidence calibration

The system is designed for zero-day phishing detection, real-time prediction, and interpretable risk scoring.

🏗️ System Architecture

The detection pipeline consists of the following stages:

URL normalization and strict validation

Lexical feature extraction

XGBoost probability prediction

Brand similarity analysis

Phishing intent keyword detection

Rule-based override logic

Confidence calibration

Final classification (Phishing / Legitimate)

The architecture is modular and scalable, making it suitable for web deployment and API integration.


