import os
import pandas as pd
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

# === Paths ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "processed", "processed_dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

# === Load Data ===
print("📥 Loading processed dataset...")
data = pd.read_csv(DATA_PATH)

# === Split Features and Labels ===
if 'phishing' not in data.columns:
    raise KeyError("Missing 'phishing' column in dataset.")

X = data.drop(columns=['phishing'])
y = data['phishing']

# === Train-Test Split ===
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# === Train Model ===
print("🚀 Training XGBoost model...")
model = XGBClassifier(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=7,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    use_label_encoder=False,
    eval_metric='logloss'
)
model.fit(X_train, y_train)

# === Evaluate ===
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print("\n✅ Model Training Complete!")
print(f"🎯 Accuracy: {acc*100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# === Save Model ===
model_path = os.path.join(MODEL_DIR, "xgboost_phishing_model.pkl")
joblib.dump(model, model_path)
print(f"\n💾 Model saved at: {model_path}")
