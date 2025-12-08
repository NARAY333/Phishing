import sys
import json
from pathlib import Path

import pandas as pd
import joblib

HERE = Path(__file__).parent
CANDIDATES = [
    HERE / "models" / "xgboost_phishing_model.pkl",
    HERE / "scripts" / "models" / "xgboost_phishing_model.pkl",
    HERE.parent / "scripts" / "models" / "xgboost_phishing_model.pkl",
    HERE.parent / "models" / "xgboost_phishing_model.pkl",
]


def find_model():
    for p in CANDIDATES:
        if p.exists():
            return p
    return None


# try to import a URL -> feature extractor from scripts
def load_url_extractor():
    try:
        # preferred location
        from scripts.predict_url import extract_features_from_url as extract
        return extract
    except Exception:
        try:
            from scripts.preprocess_datasets import extract_features as extract
            return extract
        except Exception:
            return None


def try_coerce_numeric(df):
    coerced = df.copy()
    non_numeric = []
    for col in coerced.columns:
        if pd.api.types.is_numeric_dtype(coerced[col]) or pd.api.types.is_bool_dtype(
            coerced[col]
        ) or pd.api.types.is_categorical_dtype(coerced[col]):
            continue
        coerced[col] = pd.to_numeric(coerced[col], errors="coerce")
        if coerced[col].isna().all():
            non_numeric.append(col)
        else:
            coerced[col] = coerced[col].fillna(0)
    return coerced, non_numeric


def single_result_object(original_url, pred_label, confidence):
    return {"url": original_url, "prediction": pred_label, "confidence": round(confidence, 2)}


def main():
    try:
        payload = sys.stdin.read()
        if not payload:
            print(json.dumps({"error": "no input"}))
            return

        input_json = json.loads(payload)

        # Accept either a single record dict or a list of records.
        # If a record contains "url", prefer to extract features from URL.
        extractor = load_url_extractor()

        records = [input_json] if isinstance(input_json, dict) else input_json

        # If records contain 'url' and an extractor is available, run it.
        prepared_rows = []
        original_urls = []
        for rec in records:
            if "url" in rec:
                if extractor is None:
                    print(
                        json.dumps(
                            {
                                "error": "extractor_missing",
                                "detail": "No URL feature-extractor found. Implement extract_features_from_url in scripts/predict_url.py or provide numeric features in the request."
                            }
                        )
                    )
                    return
                features = extractor(rec["url"])
                if isinstance(features, dict):
                    prepared_rows.append(features)
                    original_urls.append(rec["url"])
                elif isinstance(features, pd.DataFrame):
                    # if dataframe returned, convert rows
                    for _, r in features.iterrows():
                        prepared_rows.append(r.to_dict())
                        original_urls.append(rec["url"])
                else:
                    print(
                        json.dumps(
                            {"error": "invalid_extractor_output", "detail": "extractor must return dict or DataFrame"}
                        )
                    )
                    return
            else:
                # assume caller supplied numeric features directly
                prepared_rows.append(rec)
                original_urls.append(rec.get("url", None))

        df_raw = pd.DataFrame.from_records(prepared_rows)

        model_path = find_model()
        if model_path is None:
            print(json.dumps({"error": "model_not_found", "detail": [str(p) for p in CANDIDATES]}))
            return

        model = joblib.load(model_path)

        # expected feature names
        expected_features = None
        if hasattr(model, "feature_names_in_"):
            expected_features = list(model.feature_names_in_)
        else:
            try:
                booster = model.get_booster()
                expected_features = list(booster.feature_names) if booster.feature_names is not None else None
            except Exception:
                expected_features = None

        if expected_features:
            missing = [f for f in expected_features if f not in df_raw.columns]
            if missing:
                print(json.dumps({"error": "missing_features", "detail": missing}))
                return
            df = df_raw[expected_features].copy()
        else:
            df = df_raw.copy()

        df_coerced, non_numeric_cols = try_coerce_numeric(df)
        if non_numeric_cols:
            print(json.dumps({"error": "non_numeric_features", "detail": non_numeric_cols}))
            return

        df_final = df_coerced.astype(float, copy=False)

        preds = model.predict(df_final).tolist()
        probs = model.predict_proba(df_final).tolist() if hasattr(model, "predict_proba") else None

        results = []
        for i, pred in enumerate(preds):
            # compute confidence
            confidence = 0.0
            if probs is not None:
                try:
                    classes = list(model.classes_)
                    class_index = classes.index(pred)
                    confidence = probs[i][class_index] * 100.0
                except Exception:
                    confidence = max(probs[i]) * 100.0
            # map label to human string (assumes 1 -> Phishing, 0 -> Legitimate)
            try:
                pred_int = int(pred)
                label = "Phishing" if pred_int == 1 else "Legitimate"
            except Exception:
                label = str(pred)

            results.append(single_result_object(original_urls[i], label, confidence))

        # if single input, return single object
        if len(results) == 1:
            print(json.dumps(results[0]))
        else:
            print(json.dumps(results))

    except Exception as e:
        print(json.dumps({"error": "python_exception", "detail": str(e)}))


if __name__ == "__main__":
    main()