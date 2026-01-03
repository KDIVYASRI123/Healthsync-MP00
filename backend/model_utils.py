# helper utilities (optional)
import joblib, json, os, numpy as np

def load_model_and_symptoms(model_path='model.pkl', symptoms_path='symptoms.json'):
    if not os.path.exists(model_path) or not os.path.exists(symptoms_path):
        raise FileNotFoundError('Model or symptoms file missing. Train the model first.')
    model = joblib.load(model_path)
    with open(symptoms_path) as f:
        symptoms = json.load(f)
    return model, symptoms

def predict_from_symptoms(selected_symptoms, model, symptoms_list):
    x = np.zeros(len(symptoms_list), dtype=int)
    for s in selected_symptoms:
        if s in symptoms_list:
            x[symptoms_list.index(s)] = 1
    pred = model.predict([x])[0]
    return pred
