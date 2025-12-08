# backend/scripts/train_dynamic_model.py
import os
import pandas as pd
from urllib.parse import urlparse
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "data", "raw", "GregaVrbancic_full.csv")  # <-- put your URL-based dataset here
MODEL_DIR = os.path.join(BASE_DIR, "model", "dynamic_xgb_model.pkl")
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "dynamic_xgb_model.pkl")

# --------- Feature extractor (same will be used in predict_url.py) ---------
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

print("📥 Loading dataset from:", DATA_PATH)
df = pd.read_csv(DATA_PATH)

# Try to detect URL and label columns
url_col = None
label_col = None

for c in df.columns:
    if "url" in c.lower():
        url_col = c
    if c.lower() in ["label", "phishing", "status", "target"]:
        label_col = c

if url_col is None or label_col is None:
    raise ValueError(f"Could not find url/label columns. Columns: {list(df.columns)}")

print(f"✅ Using URL column: {url_col}, label column: {label_col}")

# Clean
df = df.dropna(subset=[url_col, label_col])

# Extract features for each URL
feature_rows = []
labels = []

print("🔍 Extracting lexical features for training...")
for url, label in zip(df[url_col], df[label_col]):
    feats = extract_features(str(url))
    feature_rows.append(feats)
    # map label to 0/1
    if str(label).lower() in ["phishing", "malicious", "1", "true"]:
        labels.append(1)
    else:
        labels.append(0)

X = pd.DataFrame(feature_rows)
y = pd.Series(labels)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print("🚀 Training XGBoost model...")
model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    eval_metric="logloss",
    use_label_encoder=False,
    random_state=42
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print(f"✅ Accuracy: {acc:.4f}")
print("\nClassification report:\n", classification_report(y_test, y_pred))

joblib.dump(model, MODEL_PATH)
print(f"💾 Model saved to: {MODEL_PATH}")
