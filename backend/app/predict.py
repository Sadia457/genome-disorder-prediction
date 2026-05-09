from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
import os

router = APIRouter()

# ✅ Fixed absolute paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "..", "models", "disorder_model.pkl"))
feature_names = joblib.load(os.path.join(BASE_DIR, "..", "models", "feature_names.pkl"))
le_dict = joblib.load(os.path.join(BASE_DIR, "..", "models", "label_encoders.pkl"))



class PatientData(BaseModel):
    features: dict


@router.post("/predict")
def predict(data: PatientData):
    try:
        print("RAW FEATURES RECEIVED:", data.features)
        print("TYPE:", type(data.features))

        # Build input dataframe
        input_df = pd.DataFrame([data.features])
        print("FEATURE NAMES EXPECTED:", feature_names)
        print("MISSING FROM INPUT:", [f for f in feature_names if f not in input_df.columns])
        print("EXTRA IN INPUT:", [f for f in input_df.columns if f not in feature_names])
        print("DATAFRAME COLUMNS:", input_df.columns.tolist())

        # Add missing columns with 0
        for col in feature_names:
            if col not in input_df.columns:
                input_df[col] = 0

        # Keep only required columns in correct order
        input_df = input_df[feature_names]

        # Encode each column
        for col in input_df.columns:
            if col in le_dict:
                le = le_dict[col]
                val = str(input_df[col].iloc[0])
                if val in le.classes_:
                    input_df[col] = le.transform([val])[0]
                else:
                    input_df[col] = -1
            else:
                input_df[col] = pd.to_numeric(input_df[col], errors="coerce").fillna(0)

        # Predict
        raw_prediction = model.predict(input_df)[0]
        probability = float(model.predict_proba(input_df)[0].max())

        # Decode label
        if isinstance(raw_prediction, str):
            label = raw_prediction
        else:
            prediction_index = int(float(raw_prediction))
            target = "Genetic Disorder"
            if target in le_dict:
                label = le_dict[target].inverse_transform([prediction_index])[0]
            else:
                label = f"Disorder class {prediction_index}"

        return {
            "prediction": label,
            "confidence": f"{probability * 100:.2f}%",
            "status": "success",
        }

    except Exception as e:
        return {"error": str(e), "status": "failed"}
