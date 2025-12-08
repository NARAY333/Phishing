# backend/scripts/predict_url.py
import sys
import os
import json
import joblib
import pandas as pd
from urllib.parse import urlparse

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "model", "dynamic_xgb_model.pkl")

# -------- same feature extractor as training --------
def extract_features(url: str) -> dict:
    parsed = urlparse(url)
    hostname = parsed.netloc or ""
    path = parsed.path or ""
    full = url

    feats = {}
    feats["url_length"] = len(full)
    feats["hostname_length"] = len(hostname)
    feats["path_length"] = len(path)

    feats["num_dots"] = full.count(".")
    feats["num_hyphens"] = full.count("-")
    feats["num_slashes"] = full.count("/")
    feats["num_digits"] = sum(c.isdigit() for c in full)
    feats["num_letters"] = sum(c.isalpha() for c in full)
    feats["has_https"] = 1 if parsed.scheme == "https" else 0
    feats["has_at"] = 1 if "@" in full else 0
    feats["has_ip_in_domain"] = 1 if hostname.replace(".", "").isdigit() else 0
    feats["num_query_params"] = full.count("&") + (1 if "?" in full else 0)

    return feats

# ---- main ----
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No URL provided"}))
        sys.exit(1)

    url = sys.argv[1]

    # load model
    try:
        model = joblib.load(MODEL_PATH)
    except Exception as e:
        print(json.dumps({"error": f"Failed to load model: {e}"}))
        sys.exit(1)

    try:
        feats = extract_features(url)
        X = pd.DataFrame([feats])
        pred = model.predict(X)[0]
        proba = model.predict_proba(X)[0][int(pred)]

        label = "phishing" if pred == 1 else "legitimate"

        result = {
            "url": url,
            "prediction": label,
            "confidence": round(float(proba) * 100, 2)
        }
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": f"Prediction error: {e}"}))
        sys.exit(1)
