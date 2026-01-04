from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, json, numpy as np, os, requests

# Import new Google GenAI package
from google import genai

app = Flask(__name__)
CORS(app)

# ================= CONFIG =================
MODEL_FILE = "model.pkl"             #random forest
SYMPTOMS_FILE = "symptoms.json"
#AIzaSyAO4C6FON-KqIq02dloXPlorIfTWiPFs1w
# Initialize Gemini GenAI client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
#client = genai.Client(api_key="AIzaSyAO4C6FON-KqIq02dloXPlorIfTWiPFs1w")
#AIzaSyCeuW_qyqPaTh166YhnZkbnrDGlTD3UVoY
# ---------- LOAD MODEL ----------
model = joblib.load(MODEL_FILE) if os.path.exists(MODEL_FILE) else None
DISEASE_SPECIALITY_MAP = {

    # ===== GENERAL SYMPTOM BASED =====
    "Fever": ["general", "homeo", "infectious", "internal medicine", "ayurveda"],
    "Cough": ["general", "homeo", "pulmonology", "ayurveda"],
    "Cold": ["general", "homeo", "ent", "ayurveda"],
    "Headache": ["general", "homeo", "neurology", "ayurveda"],
    "Fatigue": ["general", "homeo", "ayurveda"],
    "Body Pain": ["general", "homeo", "orthopedic", "ayurveda"],

    # ===== SKIN =====
    "Skin Disease": ["dermatology", "skin", "general", "homeo", "ayurveda"],
    "Psoriasis": ["dermatology", "skin", "general", "homeo", "ayurveda"],
    "Eczema": ["dermatology", "skin", "general", "homeo", "ayurveda"],
    "Acne": ["dermatology", "skin", "cosmetology", "homeo", "ayurveda"],
    "Fungal Infection": ["dermatology", "skin", "general", "homeo", "ayurveda"],

    # ===== RESPIRATORY =====
    "Asthma": ["pulmonology", "respiratory", "general", "homeo", "ayurveda"],
    "Bronchitis": ["pulmonology", "respiratory", "general", "homeo", "ayurveda"],
    "Pneumonia": ["pulmonology", "general", "infectious", "ayurveda"],

    # ===== CARDIO =====
    "Heart Disease": ["cardiology", "heart", "general", "homeo", "ayurveda"],
    "Hypertension": ["cardiology", "general", "homeo", "ayurveda"],
    "Low Blood Pressure": ["cardiology", "general", "homeo", "ayurveda"],

    # ===== DIABETES & ENDO =====
    "Diabetes": ["diabetology", "endocrinology", "general", "homeo", "ayurveda"],
    "Thyroid": ["endocrinology", "general", "homeo", "ayurveda"],

    # ===== NEURO =====
    "Migraine": ["neurology", "general", "homeo", "ayurveda"],
    "Epilepsy": ["neurology", "general", "ayurveda"],
    "Stroke": ["neurology", "emergency", "ayurveda"],

    # ===== DIGESTIVE =====
    "Gastritis": ["gastroenterology", "general", "homeo", "ayurveda"],
    "Acidity": ["gastroenterology", "general", "homeo", "ayurveda"],
    "Constipation": ["gastroenterology", "general", "homeo", "ayurveda"],
    "Diarrhea": ["gastroenterology", "general", "homeo", "ayurveda"],
    "IBS": ["gastroenterology", "general", "homeo", "ayurveda"],

    # ===== INFECTIOUS =====
    "COVID-19": ["general", "infectious", "pulmonology", "ayurveda"],
    "Dengue": ["general", "infectious", "ayurveda"],
    "Malaria": ["general", "infectious", "ayurveda"],
    "Typhoid": ["general", "infectious", "ayurveda"],

    # ===== URINARY & KIDNEY =====
    "UTI": ["urology", "general", "homeo", "ayurveda"],
    "Kidney Stones": ["urology", "nephrology", "general", "ayurveda"],

    # ===== ORTHO =====
    "Arthritis": ["orthopedic", "rheumatology", "general", "homeo", "ayurveda"],
    "Back Pain": ["orthopedic", "general", "homeo", "ayurveda"],
    "Joint Pain": ["orthopedic", "general", "homeo", "ayurveda"],

    # ===== WOMEN HEALTH =====
    "PCOS": ["gynecology", "endocrinology", "general", "homeo", "ayurveda"],
    "Menstrual Disorder": ["gynecology", "general", "homeo", "ayurveda"],
    "Pregnancy Care": ["gynecology", "maternity", "ayurveda"],

    # ===== MENTAL HEALTH =====
    "Depression": ["psychiatry", "mental health", "general", "homeo", "ayurveda"],
    "Anxiety": ["psychiatry", "mental health", "general", "homeo", "ayurveda"],
    "Insomnia": ["psychiatry", "general", "homeo", "ayurveda"],

    # ===== EYE & ENT =====
    "Eye Infection": ["ophthalmology", "eye", "general", "ayurveda"],
    "Ear Pain": ["ent", "general", "homeo", "ayurveda"],
    "Sinusitis": ["ent", "general", "homeo", "ayurveda"],

    # ===== FALLBACK =====
    "Unknown": ["general", "homeo", "ayurveda"]
}

# ---------- LOAD SYMPTOMS ----------
if os.path.exists(SYMPTOMS_FILE):
    with open(SYMPTOMS_FILE) as f:
        SYMPTOMS = json.load(f)
else:
    SYMPTOMS = [
        "fever", "cough", "headache", "fatigue",
        "nausea", "vomiting", "chest pain", "breathlessness"
    ]

# ================= ROUTES =================
@app.route("/symptoms")
def symptoms():
    return jsonify({"symptoms": SYMPTOMS})

@app.route("/predict", methods=["POST"])
def predict():
    if not model:
        return jsonify({
            "disease": "Unknown",
            "condition_type": "Unknown",
            "severity_score": 0
        })

    data = request.json.get("symptoms", [])
    x = np.zeros(len(SYMPTOMS))     #svm
    severity = 0

    for item in data:
        if item["symptom"] in SYMPTOMS:
            x[SYMPTOMS.index(item["symptom"])] = 1
            severity += int(item.get("duration", 1))

    probs = model.predict_proba([x])[0]    #random forest

# Get top 3 diseases
    top_indices = np.argsort(probs)[::-1][:5]

    top_diseases = [
    {
        "name": model.classes_[i],
        "probability": round(float(probs[i] * 100), 2)
    }
    for i in top_indices
    ]
    condition = "Severe" if severity >= 21 else "Moderate" if severity >= 7 else "Mild"

    return jsonify({
        
        "primary_disease": top_diseases[0]["name"],
        "possible_diseases": top_diseases,
        "severity_score": severity,
        "condition_type": condition
    })

# ================= HEALTH CHATBOT (Gemini GenAI) =================
@app.route("/health-chat", methods=["POST"])
def health_chat():
    data = request.json
    user_msg = data.get("message", "").strip()
    disease = data.get("disease", "General Health")

    if not user_msg:
        return jsonify({"reply": ["❌ Please ask a health‑related question."]})

    allowed_keywords = [
        "symptom", "cause", "treatment", "cure", "diet",
        "food", "medicine", "exercise", "precaution",
        "pain", "infection", "fever", "health", "care", "itching"
    ]

    if not any(word in user_msg.lower() for word in allowed_keywords):
        return jsonify({"reply": ["❌ I can answer only disease and health‑related questions."]})

    try:
        # Build a clear prompt with roles
        prompt = f"You are a helpful health assistant.\nDisease: {disease}\nUser: {user_msg}\nAssistant:"

        # Call the GenAI SDK correctly
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        # Get text from the response
        raw_text = response.text if hasattr(response, "text") else ""

        # Split into lines for frontend
        lines = [line.strip() for line in raw_text.split("\n") if line.strip()]

        if not lines:
            lines = ["⚠️ I couldn't generate a response."]

        return jsonify({"reply": lines})

    except Exception as e:
        print("GenAI error:", e)
        return jsonify({"reply": ["⚠️ Unable to generate response. Please try again."]})

# ================= HOSPITAL FINDER =================

@app.route("/hospitals", methods=["POST"])
def hospitals():
    location = request.json.get("location", "").strip()
    disease = request.json.get("disease", "").strip()

    if not location:
        return jsonify({"hospitals": []})

    # Get specialty keywords
    keywords = DISEASE_SPECIALITY_MAP.get(disease, ["general"])

    # Geocode location
    geo = requests.get(
        "https://nominatim.openstreetmap.org/search",
        params={"q": location, "format": "json", "limit": 1},
        headers={"User-Agent": "HealthSync"}
    ).json()

    if not geo:
        return jsonify({"hospitals": []})

    lat, lon = geo[0]["lat"], geo[0]["lon"]

    # Overpass query: hospitals + clinics + doctors
    query = f"""
    [out:json];
    (
      node["amenity"="hospital"](around:10000,{lat},{lon});
      node["amenity"="clinic"](around:10000,{lat},{lon});
      node["healthcare"](around:10000,{lat},{lon});
    );
    out tags;
    """

    res = requests.get(
        "https://overpass-api.de/api/interpreter",
        params={"data": query},
        timeout=25
    ).json()

    filtered = []
    for el in res.get("elements", []):
        tags = el.get("tags", {})
        combined_text = " ".join([
            tags.get("name", ""),
            tags.get("healthcare", ""),
            tags.get("healthcare:speciality", ""),
            tags.get("description", "")
        ]).lower()

        if any(k in combined_text for k in keywords):
            filtered.append({
                "name": tags.get("name", "Unnamed Hospital"),
                "address": tags.get("addr:city", "Address not available"),
                "phone": tags.get("phone", "Phone not available"),
                "opening_hours": tags.get("opening_hours", "Not available"),
                "website": tags.get("website", "Not available")
            })

    return jsonify({"hospitals": filtered[:20]})




# @app.route("/hospitals", methods=["POST"])
# def hospitals():
#     location = request.json.get("location", "").strip()
#     if not location:
#         return jsonify({"hospitals": []})

#     geo = requests.get(
#         "https://nominatim.openstreetmap.org/search",
#         params={"q": location, "format": "json", "limit": 1},
#         headers={"User-Agent": "MediPredict"}
#     ).json()

#     if not geo:
#         return jsonify({"hospitals": []})

#     lat, lon = geo[0]["lat"], geo[0]["lon"]

#     query = f"""
# [out:json];
# node["amenity"="hospital"](around:10000,{lat},{lon});
# out;
# """

#     res = requests.get(
#         "https://overpass-api.de/api/interpreter",
#         params={"data": query},
#         timeout=25
#     ).json()

#     hospitals_list = []
#     for el in res.get("elements", [])[:10]:
#         tags = el.get("tags", {})
#         hospitals_list.append({
#             "name": tags.get("name", "Unnamed Hospital"),
#             "address": tags.get("addr:city", "Address not available"),
#             "phone": tags.get("phone", "Phone not available"),
#             "opening_hours": tags.get("opening_hours", "Not available"),
#             "website": tags.get("website", "Not available")
#         })

#     return jsonify({"hospitals": hospitals_list})






# ================= RUN =================
if __name__ == "__main__":
    app.run(debug=True, port=5000)


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import joblib, json, numpy as np, os, requests

# app = Flask(__name__)
# CORS(app)

# MODEL_FILE = "model.pkl"
# SYMPTOMS_FILE = "symptoms.json"

# # ---------- LOAD MODEL ----------
# model = joblib.load(MODEL_FILE) if os.path.exists(MODEL_FILE) else None

# # ---------- LOAD SYMPTOMS ----------
# if os.path.exists(SYMPTOMS_FILE):
#     with open(SYMPTOMS_FILE) as f:
#         SYMPTOMS = json.load(f)
# else:
#     SYMPTOMS = [
#         "fever", "cough", "headache", "fatigue",
#         "nausea", "vomiting", "chest pain", "breathlessness"
#     ]

# # ---------- ROUTES ----------
# @app.route("/symptoms")
# def symptoms():
#     return jsonify({"symptoms": SYMPTOMS})

# @app.route("/predict", methods=["POST"])
# def predict():
#     if not model:
#         return jsonify({
#             "disease": "Unknown",
#             "condition_type": "Unknown",
#             "severity_score": 0
#         })

#     data = request.json.get("symptoms", [])
#     x = np.zeros(len(SYMPTOMS))
#     severity = 0

#     for item in data:
#         if item["symptom"] in SYMPTOMS:
#             x[SYMPTOMS.index(item["symptom"])] = 1
#             severity += int(item.get("duration", 1))

#     disease = model.predict([x])[0]
#     condition = "Severe" if severity >= 21 else "Moderate" if severity >= 7 else "Mild"

#     return jsonify({
#         "disease": str(disease),
#         "severity_score": severity,
#         "condition_type": condition
#     })

# # ---------- HEALTH CHATBOT ----------
# @app.route("/health-chat", methods=["POST"])
# def health_chat():
#     msg = request.json.get("message", "").lower()
#     disease = request.json.get("disease", "Unknown")

#     allowed = [
#         "symptom", "cause", "treatment", "diet",
#         "food", "precaution", "medicine",
#         "exercise", "care", "health", "pain"
#     ]

#     if not any(w in msg for w in allowed):
#         return jsonify({
#             "reply": "❌ I can answer only disease and health-related questions."
#         })

#     reply = f"""
# Disease: {disease}

# • Common symptoms should be monitored.
# • Maintain healthy diet & hydration.
# • Avoid stress and take adequate rest.
# • Consult a doctor if symptoms worsen.

# ⚠️ This is general health guidance, not medical advice.
# """

#     return jsonify({"reply": reply.strip()})

# # ---------- HOSPITAL FINDER ----------
# @app.route("/hospitals", methods=["POST"])
# def hospitals():
#     location = request.json.get("location", "").strip()
#     if not location:
#         return jsonify({"hospitals": []})

#     geo = requests.get(
#         "https://nominatim.openstreetmap.org/search",
#         params={"q": location, "format": "json", "limit": 1},
#         headers={"User-Agent": "MediPredict"}
#     ).json()

#     if not geo:
#         return jsonify({"hospitals": []})

#     lat, lon = geo[0]["lat"], geo[0]["lon"]

#     query = f"""
# [out:json];
# node["amenity"="hospital"](around:10000,{lat},{lon});
# out;
# """

#     res = requests.get(
#         "https://overpass-api.de/api/interpreter",
#         params={"data": query},
#         timeout=25
#     ).json()

#     hospitals_list = []
#     for el in res.get("elements", [])[:10]:
#         tags = el.get("tags", {})
#         hospitals_list.append({
#             "name": tags.get("name", "Unnamed Hospital"),
#             "address": tags.get("addr:city", "Address not available"),
#             "phone": tags.get("phone", "Phone not available"),
#             "opening_hours": tags.get("opening_hours", "Not available"),
#             "website": tags.get("website", "Not available")
#         })

#     return jsonify({"hospitals": hospitals_list})

# if __name__ == "__main__":
#     app.run(debug=True, port=5000)
































































