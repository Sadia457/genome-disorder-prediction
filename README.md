# Genome-Based Disorder Prediction System

A full-stack machine learning application that predicts genetic disorders 
based on patient genomic, clinical, and demographic data.

## 🧬 About
This system analyzes patient data including gene inheritance patterns, 
vital signs, symptoms, and family history to predict the most likely 
genetic disorder using a trained Random Forest model.

## 🔬 Predicted Disorders
- Mitochondrial genetic inheritance disorders
- Multifactorial genetic inheritance disorders  
- Single-gene inheritance diseases

## 🛠️ Tech Stack
- **Frontend:** React + Vite
- **Backend:** FastAPI (Python)
- **ML Model:** Random Forest (scikit-learn)
- **Dataset:** Kaggle - Predict Genetic Disorder

## 🚀 Run Locally

### Backend
\```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
\```

### Frontend
\```bash
cd frontend
npm install
npm run dev
\```

## 📊 Model Performance
- Algorithm: Random Forest Classifier
- Cross-validation: 5-fold
- Features: 44 clinical and genomic features

## 👤 Author
**Your Name**  
Built from scratch — May 2026
