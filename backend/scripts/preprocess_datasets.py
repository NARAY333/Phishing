import os
import pandas as pd

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DIR = os.path.join(BASE_DIR, "data", "raw")
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")

# Ensure processed directory exists
os.makedirs(PROCESSED_DIR, exist_ok=True)

def load_all_raw_datasets():
    csv_files = [f for f in os.listdir(RAW_DIR) if f.endswith(".csv")]
    if not csv_files:
        raise FileNotFoundError("No CSV files found in raw directory.")
    
    print(f"📂 Found {len(csv_files)} raw CSV files:")
    dataframes = []
    
    for file in csv_files:
        path = os.path.join(RAW_DIR, file)
        df = pd.read_csv(path)
        print(f"   → Loaded {file} with shape {df.shape}")
        dataframes.append(df)
    
    combined = pd.concat(dataframes, ignore_index=True)
    print(f"✅ Combined dataset shape: {combined.shape}")
    return combined

def preprocess_data(df):
    # Drop duplicates
    df.drop_duplicates(inplace=True)

    # Drop fully empty columns
    df.dropna(axis=1, how="all", inplace=True)

    # Fill remaining NaN values with 0 (since lexical features are numeric)
    df.fillna(0, inplace=True)

    # Ensure target column 'phishing' exists
    if 'phishing' not in df.columns:
        raise KeyError("Missing target column 'phishing' in dataset.")
    
    # Convert phishing column to integer (if it’s boolean or float)
    df['phishing'] = df['phishing'].astype(int)

    print("✅ Data preprocessing completed.")
    return df

if __name__ == "__main__":
    print("🚀 Starting dataset preprocessing...")

    # Load and process
    data = load_all_raw_datasets()
    processed = preprocess_data(data)

    # Save processed dataset
    processed_path = os.path.join(PROCESSED_DIR, "processed_dataset.csv")
    processed.to_csv(processed_path, index=False)

    print(f"🎉 Processing complete! Saved processed dataset to:\n   {processed_path}")
