import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib
import os

# ── Load datasets ──────────────────────────────────────────
train_df = pd.read_csv("data/train_data.csv")   # ← rename to your exact filename
test_df  = pd.read_csv("data/test_data.csv")    # ← rename to your exact filename

print("Train shape:", train_df.shape)
print("Test shape: ", test_df.shape)
print("\nColumns:", list(train_df.columns))

# ── Clean train data ───────────────────────────────────────
train_df = train_df.dropna(thresh=len(train_df.columns) * 0.6)

for col in train_df.columns:
    if train_df[col].dtype == "object":
        train_df[col].fillna(train_df[col].mode()[0], inplace=True)
    else:
        train_df[col].fillna(train_df[col].median(), inplace=True)

# ── Clean test data ────────────────────────────────────────
for col in test_df.columns:
    if test_df[col].dtype == "object":
        test_df[col].fillna(test_df[col].mode()[0], inplace=True)
    else:
        test_df[col].fillna(test_df[col].median(), inplace=True)

# ── Encode categorical columns ─────────────────────────────
le_dict = {}
for col in train_df.select_dtypes(include="object").columns:
    le = LabelEncoder()
    train_df[col] = le.fit_transform(train_df[col].astype(str))
    le_dict[col] = le
    # Apply same encoding to test
    if col in test_df.columns:
        test_df[col] = test_df[col].astype(str).map(
            lambda x: le.transform([x])[0] if x in le.classes_ else -1
        )

# ── Define target column ───────────────────────────────────
target = "Genetic Disorder"   # ← update if your column name is different

X_train = train_df.drop(columns=[target])
y_train = train_df[target]

X_test  = test_df.drop(columns=[target]) if target in test_df.columns else None
y_test  = test_df[target]               if target in test_df.columns else None

# ── Train model ────────────────────────────────────────────
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
print("\n✅ Model trained!")

# ── Evaluate ───────────────────────────────────────────────
train_acc = accuracy_score(y_train, model.predict(X_train))
print(f"📊 Train Accuracy: {train_acc * 100:.2f}%")

if X_test is not None and y_test is not None:
    test_acc = accuracy_score(y_test, model.predict(X_test))
    print(f"📊 Test  Accuracy: {test_acc  * 100:.2f}%")

# ── Save model & features ──────────────────────────────────
os.makedirs("models", exist_ok=True)
joblib.dump(model,              "models/disorder_model.pkl")
joblib.dump(list(X_train.columns), "models/feature_names.pkl")
joblib.dump(le_dict,            "models/label_encoders.pkl")
print("\n✅ Model saved to models/")