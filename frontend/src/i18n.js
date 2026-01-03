import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation resources
const resources = {
  en: {
    translation: {
      title: "HealthSync – Disease Prediction",
      select_symptoms: "Select the symptoms you are experiencing",
      get_started: "Get Started",
      selected_symptoms: "Selected Symptoms",
      predict: "Predict",
      health_suggestions: "Health Suggestions",
      view_details: "View Details",
      back: "← Back",
      no_symptoms: "No symptoms selected",
      search_placeholder: "Search symptoms...",
    },
  },
  es: {
    translation: {
      title: "HealthSync – Predicción de Enfermedades",
      select_symptoms: "Seleccione los síntomas que está experimentando",
      get_started: "Comenzar",
      selected_symptoms: "Síntomas Seleccionados",
      predict: "Predecir",
      health_suggestions: "Sugerencias de Salud",
      view_details: "Ver Detalles",
      back: "← Atrás",
      no_symptoms: "No hay síntomas seleccionados",
      search_placeholder: "Buscar síntomas...",
    },
  },
  hi: {
    translation: {
      title: "हेल्थसिंक – रोग भविष्यवाणी",
      select_symptoms: "आपके अनुभव वाले लक्षण चुनें",
      get_started: "शुरू करें",
      selected_symptoms: "चयनित लक्षण",
      predict: "पूर्वानुमान",
      health_suggestions: "स्वास्थ्य सुझाव",
      view_details: "विवरण देखें",
      back: "← वापस",
      no_symptoms: "कोई लक्षण चयनित नहीं है",
      search_placeholder: "लक्षण खोजें...",
    },
  },
  te: {
    translation: {
      title: "హెల్త్‌సింక్ – రోగ పూర్వాభాసం",
      select_symptoms: "మీకు అనుభవంలో ఉన్న లక్షణాలను ఎంచుకోండి",
      get_started: "ప్రారంభించండి",
      selected_symptoms: "ఎంచుకున్న లక్షణాలు",
      predict: "పూర్వనిర్ణయం చేయండి",
      health_suggestions: "ఆరోగ్య సూచనలు",
      view_details: "వివరాలు చూడండి",
      back: "← వెనుకకు",
      no_symptoms: "ఏ లక్షణాలు ఎంచుకోబడలేదు",
      search_placeholder: "లక్షణాలను శోధించండి...",
    },
  },
  ta: {
    translation: {
      title: "ஹெல்த்சிஂக் – நோய் முன்னறிவு",
      select_symptoms: "நீங்கள் அனுபவிக்கும் அறிகுறிகளைத் தேர்ந்தெடுக்கவும்",
      get_started: "தொடங்கு",
      selected_symptoms: "தேர்ந்தெடுக்கப்பட்ட அறிகுறிகள்",
      predict: "முன்னறிவு",
      health_suggestions: "ஆரோக்கிய பரிந்துரைகள்",
      view_details: "விவரங்களை பார்க்கவும்",
      back: "← திரும்ப",
      no_symptoms: "எந்த அறிகுறிகளும் தேர்ந்தெடுக்கப்படவில்லை",
      search_placeholder: "அறிகுறிகளை தேடவும்...",
    },
  },
  kn: {
    translation: {
      title: "ಹೆಲ್ತ್ಸಿಂಕ್ – ರೋಗ ಭವಿಷ್ಯನಿರ್ದೇಶನ",
      select_symptoms: "ನೀವು ಅನುಭವಿಸುತ್ತಿರುವ ಲಕ್ಷಣಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      get_started: "ಪ್ರಾರಂಭಿಸಿ",
      selected_symptoms: "ಆಯ್ಕೆ ಮಾಡಿದ ಲಕ್ಷಣಗಳು",
      predict: "ಭವಿಷ್ಯನಿರ್ದೇಶನ",
      health_suggestions: "ಆರೋಗ್ಯ ಸಲಹೆಗಳು",
      view_details: "ವಿವರಗಳನ್ನು ನೋಡಿ",
      back: "← ಹಿಂದಿರುಗಿ",
      no_symptoms: "ಯಾವುದೇ ಲಕ್ಷಣಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ",
      search_placeholder: "ಲಕ್ಷಣಗಳನ್ನು ಹುಡುಕಿ...",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
