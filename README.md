# Disease Prediction from Symptoms (ML + NLP)

This is a full final-year project scaffold that predicts diseases from user-reported symptoms.
It includes:
- Backend (Python/Flask): training script and prediction API
- Frontend (React): symptom selector UI and result display
- Instructions to download recommended Kaggle datasets and how to run everything locally

---
**Primary dataset (recommended):**
- `Disease Prediction Using Machine Learning` by kaushil268 on Kaggle.
  Download: https://www.kaggle.com/datasets/kaushil268/disease-prediction-using-machine-learning
  (This dataset contains ~132 symptom columns and a 'prognosis' label — matches the code's expectations.)

Alternative datasets (useful):
- https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset
- https://www.kaggle.com/datasets/dhivyeshrk/diseases-and-symptoms-dataset

---
Place your downloaded CSV into `backend/data/dataset.csv` before running training.

Quick start (backend):
```bash
cd backend
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# place dataset at backend/data/dataset.csv
python train.py
# then run the API
python app.py
```

Quick start (frontend):
```bash
cd frontend
npm install
npm start
```

The React app expects the backend at http://localhost:5000 by default.
