from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd

router = APIRouter()

# Load model and features
model = joblib.load("models/disorder_model.pkl")
feature_names = joblib.load("models/feature_names.pkl")
le_dict = joblib.load("models/label_encoders.pkl")


class PatientData(BaseModel):
    features: dict


@router.post("/predict")
def predict(data: PatientData):
    try:
        # Build input dataframe
        input_df = pd.DataFrame([data.features])

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

        # Predict — safely convert to int
        raw_prediction = model.predict(input_df)[0]
        probability = float(model.predict_proba(input_df)[0].max())

        # If prediction is already a string label, return directly
        if isinstance(raw_prediction, str):
            label = raw_prediction
        else:
            # It's a number — decode using label encoder
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
