import os
import requests

# Create data folder
os.makedirs("data/raw", exist_ok=True)

# Dataset URLs
datasets = {
    "GregaVrbancic_small": "https://raw.githubusercontent.com/GregaVrbancic/Phishing-Dataset/master/dataset_small.csv",
    "GregaVrbancic_full": "https://raw.githubusercontent.com/GregaVrbancic/Phishing-Dataset/master/dataset_full.csv",
    "PhiUSIIL": "https://archive.ics.uci.edu/ml/machine-learning-databases/00967/Phishing_Legitimate_full.csv",
}

# Download each dataset
for name, url in datasets.items():
    try:
        print(f"⬇️ Downloading {name} ...")
        response = requests.get(url)
        response.raise_for_status()
        file_path = f"data/raw/{name}.csv"
        with open(file_path, "wb") as f:
            f.write(response.content)
        print(f"✅ Saved: {file_path}")
    except Exception as e:
        print(f"❌ Failed to download {name}: {e}")

print("\nAll available datasets downloaded successfully (where possible).")
