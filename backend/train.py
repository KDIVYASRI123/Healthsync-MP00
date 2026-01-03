# train.py - trains a RandomForest model on a symptom->disease dataset
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import json

DATA_PATH = os.path.join('data', 'dataset.csv')
MODEL_OUT = 'model.pkl'
SYMPTOMS_OUT = 'symptoms.json'


def load_data(path=DATA_PATH):
    df = pd.read_csv(path)

    # FIX 1: Remove empty junk columns like "Unnamed: 133"
    df = df.loc[:, ~df.columns.str.contains('Unnamed')]

    # Detect target column
    if 'prognosis' in df.columns:
        label_col = 'prognosis'
    elif 'disease' in df.columns:
        label_col = 'disease'
    else:
        label_col = df.columns[-1]  # fallback

    # Separate features & label
    X = df.drop(columns=[label_col])
    y = df[label_col].astype(str)

    print("Loaded dataset with features:", X.shape[1])
    return X, y


def train():
    X, y = load_data()

    print("Final feature count:", X.shape[1])

    # FIX 2: Convert objects/strings to numeric
    X_processed = X.copy()
    for c in X_processed.columns:
        if X_processed[c].dtype == object:
            X_processed[c] = X_processed[c].replace({
                'yes': 1, 'Yes': 1, 'YES': 1,
                'no': 0, 'No': 0, 'NO': 0,
                '1': 1, '0': 0
            }).fillna(0)

        X_processed[c] = pd.to_numeric(X_processed[c], errors='coerce').fillna(0).astype(int)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_processed, y, test_size=0.2, random_state=42, stratify=y
    )

    # Train model
    clf = RandomForestClassifier(n_estimators=200, random_state=42)
    clf.fit(X_train, y_train)

    preds = clf.predict(X_test)

    print("Accuracy:", accuracy_score(y_test, preds))
    print(classification_report(y_test, preds, zero_division=0))

    # Save model
    joblib.dump(clf, MODEL_OUT)
    print("Saved model to", MODEL_OUT)

    # FIX 3: Save correct feature names used by model
    with open(SYMPTOMS_OUT, 'w') as f:
        json.dump(list(X_processed.columns), f, indent=2)
    print("Saved symptoms list to", SYMPTOMS_OUT)


if __name__ == '__main__':
    if not os.path.exists('data'):
        os.makedirs('data')
    if not os.path.exists(DATA_PATH):
        print("ERROR: dataset not found:", DATA_PATH)
    else:
        train()
