import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import diseasesData from "./data/diseases.json";
import frontendTranslations from "./data/symptoms.json";
import Chatbotpage from "./pages/Chatbotpage";
import bg from "./bg.jpg";
/* ================= TRANSLATION HELPER ================= */
const tr = (key, lang) => {
  if (!frontendTranslations[key]) return key;
  return frontendTranslations[key][lang] || frontendTranslations[key]["en"];
};

const styles1 = {
  /* ===== INFO SECTIONS ===== */
  infoBackground: {
 // background: "linear-gradient(to bottom, #e0f6ff, #87ceeb)",
backgroundImage: `url(${bg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  padding: "80px 20px"
},

  infoSection: {
    marginTop: 120,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 30,
    width: "100%",
    maxWidth: 1200,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "120px"
  },

  infoCard: {
    background: "rgba(255,255,255,0.95)",
    padding: 30,
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
  },

  infoTitle: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 16,
    color: "#0f172a"
  },

  infoList: {
    listStyle: "disc",
    paddingLeft: 20,
    lineHeight: 1.8,
    color: "#334155",
    fontSize: 15
  },

  /* ===== SUPPORTED DISEASES ===== */

  sectionBackground: {
 // background: "linear-gradient(to bottom, #e0f6ff, #87ceeb)",
backgroundImage: `url(${bg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  padding: "80px 20px"
},
  sectionWrapper: {
    
    maxWidth: 1200,
    margin: "0 auto 120px",
    padding: "0 20px"
  },

  sectionHeading: {
    fontSize: 32,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 20,
    color: "#0f172a"
  },

  sectionSub: {
    textAlign: "center",
    color: "#475569",
    marginBottom: 40
  },

  searchInput: {
    width: "100%",
    maxWidth: 400,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ccc",
    margin: "0 auto 40px",
    display: "block"
  },

  diseaseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 25
  },

  diseaseCard: {
    background: "#ffffff",
    padding: 25,
    borderRadius: 16,
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
    textAlign: "center",
    fontWeight: 600,
    color: "#1e293b"
  },

  /* ===== FAQ ===== */
  faqItem: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    marginBottom: 16
  },

  faqQ: {
    fontWeight: 600,
    marginBottom: 8,
    color: "#0f172a"
  },

  faqA: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 1.6
  }

};

/* ================= SUGGESTIONS ================= */
function getSuggestions(disease) {
  const tips = {
    Diabetes: ["Monitor sugar regularly", "Exercise daily"],
    Hypertension: ["Reduce salt intake", "Avoid stress"],
    Migraine: ["Rest in dark room", "Stay hydrated"]
  };
  return tips[disease] || ["Maintain a healthy lifestyle"];
}

/* ================= DISEASE INFO ================= */
function DiseaseInfo({ disease, onBack }) {
  const data = diseasesData[disease];
  if (!data) return <p>No data available</p>;

  return (
    <div style={styles.infoPage}>
      <button style={styles.backBtn} onClick={onBack}>← Back</button>
      <h2>{disease}</h2>
      <h3>Symptoms</h3>
      <ul>{data.symptoms.map(s => <li key={s}>{s}</li>)}</ul>
      <h3>Causes</h3>
      <ul>{data.causes.map(c => <li key={c}>{c}</li>)}</ul>
      <h3>Treatment</h3>
      <ul>{data.treatments.map(t => <li key={t}>{t}</li>)}</ul>
    </div>
  );
}

//new
function Navbar() {
  const navigate = useNavigate();

  return (
    <div style={navStyles.navbar}>
      <div style={navStyles.logo} onClick={() => navigate("/")}>
        MediPredict
      </div>

      <div style={navStyles.right}>
        <button style={navStyles.btn} onClick={() => navigate("/")}>
          Home
        </button>

        <button style={navStyles.btn} onClick={() => navigate("/main")}>
          Predictor
        </button>
<button style={navStyles.btn} onClick={() => navigate("/chatbot")}>
  Chatbot
</button>

        <select
          style={navStyles.lang}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
        >
          <option value="en">EN</option>
          <option value="hi">HI</option>
          <option value="te">TE</option>
          <option value="ta">TA</option>
          <option value="kn">KN</option>
        </select>
      </div>
    </div>
  );
}

//new




/* ================= WELCOME PAGE ================= */
function Welcome() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <div style={styles.heroWrapper}>
        <Navbar />

        <div style={{ ...styles.heroContent, fontFamily: "'Poppins', sans-serif" }}>
          
          {/* LEFT TEXT */}
          <div style={styles.heroLeft}>
            <h1 style={styles.heroTitle}>Disease Prediction System</h1>

            <p style={styles.heroSubtitle}>
              Select the symptoms you think you might have and it will predict
              the disease or condition you could be suffering from.
              Then you can also look for hospitals/clinics for treatment.
            </p>

            <button
              style={styles.heroGetStarted}
              onClick={() => navigate("/main")}
            >
              Get Started →
            </button>
          </div>

          {/* RIGHT CARDS */}
          <div style={styles.heroRight}>
            {[
              { icon: "🩺", title: "Select Symptoms" },
              { icon: "🧠", title: "Diagnosis & Treatment" },
              { icon: "🏥", title: "Hospitals" },
              { icon: "💬", title: "Comments" }
            ].map((c, i) => (
              <div
                key={i}
                style={styles.heroCard}
                onMouseEnter={e =>
                  Object.assign(e.currentTarget.style, styles.heroCardHover)
                }
                onMouseLeave={e =>
                  Object.assign(e.currentTarget.style, styles.heroCard)
                }
              >
                <div style={styles.heroCardIcon}>{c.icon}</div>
                <div style={styles.heroCardTitle}>{c.title}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
<div>
  <h3 style={{ margin: "5px 0" }}></h3>
</div>
      {/* ================= INFO SECTIONS ================= */}
      <div style={styles1.infoBackground}>
      <div style={styles1.infoSection}>

        <div style={styles1.infoCard}>
          <h2 style={styles1.infoTitle}>How It Works</h2>
          <ul style={styles1.infoList}>
            <li>Select the symptoms you are experiencing</li>
            <li>The system analyzes the symptom patterns</li>
            <li>Possible diseases are predicted</li>
            <li>View diagnosis and treatment guidance</li>
            <li>Find nearby hospitals or clinics</li>
          </ul>
        </div>

        <div style={styles1.infoCard}>
          <h2 style={styles1.infoTitle}>Key Features</h2>
          <ul style={styles1.infoList}>
            <li>Easy symptom selection</li>
            <li>Instant disease prediction</li>
            <li>AI chatbot assistance</li>
            <li>Hospital locator</li>
            <li>Responsive design</li>
          </ul>
        </div>

        <div style={styles1.infoCard}>
          <h2 style={styles1.infoTitle}>Why Use MediPredict?</h2>
          <ul style={styles1.infoList}>
            <li>Saves time</li>
            <li>Early health awareness</li>
            <li>User-friendly interface</li>
            <li>Accessible anytime</li>
            <li>Better medical decisions</li>
          </ul>
        </div>
</div>
      </div>
      <div>
  <h3 style={{ margin: "5px 0" }}></h3>
</div>
      {/* ================= SUPPORTED DISEASES ================= */}
      <div style={styles1.sectionBackground}>
<div style={styles1.sectionWrapper}>
  <h2 style={styles1.sectionHeading}>Supported Diseases & Conditions</h2>
  <p style={styles1.sectionSub}>
    MediPredict currently supports prediction for the following conditions
  </p>

  <input
    type="text"
    placeholder="Search diseases..."
    style={styles1.searchInput}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <div style={styles1.diseaseGrid}>
    {[
      "Fever",
      "Diabetes",
      "Hypertension",
      "Heart Disease",
      "Asthma",
      "COVID-19",
      "Migraine",
      "Headache",
      "Cough",
      "Skin Disease"
    ]
      .filter(d => d.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((d, i) => (
        <div key={i} style={styles1.diseaseCard}>
          🩺 {d}
        </div>
      ))}
  </div>
</div>
</div>
<div>
  <h3 style={{ margin: "5px 0" }}></h3>
</div>
{/* ================= FAQ SECTION ================= */}
<div style={styles1.sectionBackground}>
<div style={styles1.sectionWrapper}>
  <h2 style={styles1.sectionHeading}>Frequently Asked Questions</h2>
  <p style={styles1.sectionSub}>
    Common questions about MediPredict
  </p>

  <div style={styles1.faqItem}>
    <div style={styles1.faqQ}>Is MediPredict a replacement for doctors?</div>
    <div style={styles1.faqA}>
      No. MediPredict is designed for early awareness only. Always consult a medical professional.
    </div>
  </div>

  <div style={styles1.faqItem}>
    <div style={styles1.faqQ}>How accurate are the predictions?</div>
    <div style={styles1.faqA}>
      Predictions are based on symptom patterns and medical datasets, but accuracy may vary.
    </div>
  </div>

  <div style={styles1.faqItem}>
    <div style={styles1.faqQ}>Is my health data stored?</div>
    <div style={styles1.faqA}>
      No personal health data is permanently stored. User privacy is a priority.
    </div>
  </div>

  <div style={styles1.faqItem}>
    <div style={styles1.faqQ}>Is MediPredict free to use?</div>
    <div style={styles1.faqA}>
      Yes, MediPredict is free for educational and awareness purposes.
    </div>
  </div>
</div>
</div>
    </>
  );
}









/* ================= MAIN PAGE ================= */
function Main() {
  function HealthChatbot({ disease }) {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Ask me health-related questions about your disease." }
  ]);
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input.trim()) return;

    setMessages(m => [...m, { role: "user", text: input }]);

    const res = await axios.post("http://localhost:5000/health-chat", {
      message: input,
      disease
    });

    setMessages(m => [...m, { role: "bot", text: res.data.reply }]);
    setInput("");
  };

  return (
    <div style={{
      marginTop: 20,
      padding: 15,
      borderRadius: 12,
      background: "#f1f5f9"
    }}>
      <h3>🤖 Health Assistant</h3>

      <div style={{ maxHeight: 200, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <p key={i}><b>{m.role === "bot" ? "Bot" : "You"}:</b> {m.text}</p>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask about diet, symptoms, precautions"
        style={{ width: "100%", padding: 8, marginTop: 8 }}
      />

      <button onClick={send} style={{ marginTop: 8 }}>
        Send
      </button>
    </div>
  );
}

  const { t } = useTranslation();
  const lang = i18n.language;

  const [symptoms, setSymptoms] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [symptomDurations, setSymptomDurations] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [result, setResult] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const [location, setLocation] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [showHospitalPopup, setShowHospitalPopup] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/symptoms")
      .then(res => setSymptoms(res.data.symptoms || []))
      .catch(() => {});
  }, []);

  const toggle = (s) => {
    const ns = new Set(selected);
    const nd = { ...symptomDurations };
    if (ns.has(s)) {
      ns.delete(s);
      delete nd[s];
    } else ns.add(s);
    setSelected(ns);
    setSymptomDurations(nd);
  };

  const predict = () => {
    if (selected.size === 0) {
      alert("Select any symptom");
      return;
    }

    const payload = Array.from(selected).map(s => ({
      symptom: s,
      duration: symptomDurations[s] || 1
    }));

    setResult(null);
    setShowAnimation(true);

    setTimeout(() => {
      setShowAnimation(false);
      axios.post("http://localhost:5000/predict", { symptoms: payload })
        .then(res => setResult(res.data))
        .catch(err => console.error(err));
    }, 5000);
  };

  const fetchHospitals = () => {
    if (!location.trim()) return alert("Enter location");
    setLoadingHospitals(true);
    axios.post("http://localhost:5000/hospitals", { location,
  disease: result.primary_disease })
      .then(res => { setHospitals(res.data.hospitals || []); setLoadingHospitals(false); })
      .catch(() => setLoadingHospitals(false));
  };

  return (
     <div>
        <Navbar/>
      
    <div style={styles.page}>
      <div style={styles.container}>

        <h1>MediPredict</h1>

        <input
          type="text"
          placeholder={tr("search_symptoms", lang) || "Search symptoms..."}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={styles.searchBox}
        />

        <div style={styles.symptomGridWrapper}>
          <div style={styles.symptomGrid}>
            {symptoms.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(s => (
                <div key={s} style={styles.symptomCard}>
                  <label>
                    <input type="checkbox" checked={selected.has(s)} onChange={() => toggle(s)} />
                    {tr(s, lang)}
                  </label>
                  {selected.has(s) && (
                    <select
                      value={symptomDurations[s] || ""}
                      onChange={e => setSymptomDurations({ ...symptomDurations, [s]: e.target.value })}
                      style={styles.durationSelect}
                    >
                      <option value="">Duration</option>
                      <option value="1">1 day</option>
                      <option value="3">3 days</option>
                      <option value="7">1 week</option>
                      <option value="14">2 weeks</option>
                      <option value="30">1 month</option>
                    </select>
                  )}
                </div>
              ))
            }
          </div>
        </div>

        <button style={styles.predictBtn} onClick={predict}>Predict Disease</button>

        {showAnimation && (
          <div style={styles.animationOverlay}>
            <div style={styles.animationBox}>
              <h2>Your symptoms match...</h2>
              <div style={styles.motionDots}>
                <span style={styles.motionDotsSpan}></span>
                <span style={{ ...styles.motionDotsSpan, animationDelay: "0.2s" }}></span>
                <span style={{ ...styles.motionDotsSpan, animationDelay: "0.4s" }}></span>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div style={styles.resultBox}>
            <h3>Primary Prediction: {result.primary_disease}</h3>

<h4>Other Possible Diseases:</h4>
<ul>
  {result.possible_diseases.map((d, i) => (
    <li key={i}>
      {d.name} — {d.probability}%
    </li>
  ))}
</ul>

            <p>Severity: {result.condition_type}</p>
            <button style={styles.viewInfoBtn} onClick={() => setShowHospitalPopup(true)}>Details of Nearby Hospitals</button>
            <HealthChatbot disease={result.disease} />
          </div>
        )}

        {/* ================= HOSPITAL MODAL ================= */}
        {showHospitalPopup && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalBox}>
              <button style={styles.closeBtn} onClick={() => setShowHospitalPopup(false)}>✖</button>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Enter city / area"
                style={styles.modalInput}
              />
              <button style={styles.modalSearchBtn} onClick={fetchHospitals}>Search Hospitals</button>
              {loadingHospitals && <p>Loading hospitals...</p>}
              <div style={styles.hospitalScroll}>
  {hospitals.map((h, i) => (
    <div key={i} style={styles.hospitalCard}>
      <strong>{h.name}</strong>
      <p>{h.address}</p>

      {/* Phone */}
      <p style={{ marginTop: 4 }}>
        📞 {h.phone && h.phone !== "Phone not available" ? (
          <a href={`tel:${h.phone}`} style={{ color: "#2563eb" }}>
            {h.phone}
          </a>
        ) : (
          <span style={{ color: "#666" }}>Phone not available</span>
        )}
      </p>

      {/* Opening Hours */}
      <p style={{ fontSize: 14, color: "#444" }}>
        ⏰ <strong>Hours:</strong> {h.opening_hours}
      </p>

      {/* Website */}
      <p style={{ fontSize: 14 }}>
        🌐 {h.website !== "Not available" ? (
          <a
            href={h.website.startsWith("http") ? h.website : `https://${h.website}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#2563eb" }}
          >
            Visit Website
          </a>
        ) : (
          <span style={{ color: "#666" }}>Website not available</span>
        )}
      </p>
    </div>
  ))}
</div>
            </div>
          </div>
        )}

      </div>
    </div>
      </div>
  );
}

/* ================= APP WRAPPER ================= */
export function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/main" element={<Main />} />
        <Route path="/chatbot" element={<Chatbotpage />} />
      </Routes>
    </Router>
  );
}
//new
const navStyles = {
  navbar: {
    width: "93.7%",
    position: "fixed",
    top: 7,
    left: 7,
    zIndex: 1000,
    background: "#005A9C",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 40px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.25)"
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    color: "#00BFFF",
    cursor: "pointer"
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 22
  },

  btn: {
    background: "transparent",
    border: "none",
    color: "#e5e7eb",
    fontSize: 15,
    cursor: "pointer"
  },

  lang: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    fontSize: 13
  }
};


//new
/* ================= STYLES ================= */
const styles = {
  /* ===== BEAUTIFUL WELCOME PAGE ===== */

heroWrapper: {
  
  minHeight: "97vh",
  //background: "linear-gradient(135deg,#e6f2fb,#cfe8f7)",
  backgroundImage: `url(${bg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  display: "flex",
  alignItems: "center",
  padding: "2px 80px"
},

heroContent: {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr",
  gap: 60,
  alignItems: "center",
  marginTop:"-150px"
},

heroLeft: {
  maxWidth: 520,
  marginTop:"140px"
},

heroTitle: {
  fontSize: "50px",
  fontWeight: 600,
  color: "#0f172a",
  marginBottom: 16
},

heroSubtitle: {
  fontSize: 16,
  lineHeight: 1.7,
  color: "#334155",
  marginBottom: 28
},

heroGetStarted: {
  padding: "12px 28px",
  fontSize: 15,
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 500
},
heroRight: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 22,
  marginTop:"140px"
},

heroCard: {
  background: "#ffffff",
  padding: 22,
  borderRadius: 14,
  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  cursor: "pointer",
  transition: "transform 0.25s"
},

heroCardHover: {
  transform: "translateY(-6px)"
},

heroCardIcon: {
  fontSize: 34,
  marginBottom: 10
},

heroCardTitle: {
  fontSize: 15,
  fontWeight: 600,
  color: "#0f172a"
}
,

scrollHint: {
  marginTop: 30,
  opacity: 0.7,
  fontSize: 14
},

heroLangSelector: {
  marginTop: 20,
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  fontSize: 14
},

/* ===== FEATURE SECTION ===== */

featureSection: {
  background: "#6495ED",
  padding: "100px 20px",
  textAlign: "center"
},

sectionTitle: {
  fontSize: 42,
  fontWeight: 600,
  marginBottom: 60,
  color: "#0f172a"
},

featureGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: 40,
  maxWidth: 1200,
  margin: "0 auto"
},

featureCard: {
  background: "#E0FFFF",
  padding: 40,
  borderRadius: 24,
  boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
  transition: "transform 0.4s, box-shadow 0.4s",
  textAlign: "left"
},

featureCardHover: {
  transform: "translateY(-10px)",
  boxShadow: "0 30px 70px rgba(0,0,0,0.18)"
},navbar: {
  width: "100%",
  position: "sticky",
  top: 0,
  zIndex: 100,
  background: "rgba(15,23,42,0.95)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 30px",
  color: "#fff"
},

navLogo: {
  fontSize: 20,
  fontWeight: 600,
  cursor: "pointer",
  color: "#38bdf8"
},

navRight: {
  display: "flex",
  alignItems: "center",
  gap: 18
},

navBtn: {
  background: "transparent",
  border: "none",
  color: "#fff",
  fontSize: 14,
  cursor: "pointer"
},

navLang: {
  padding: "6px 8px",
  borderRadius: 6,
  border: "none",
  fontSize: 13
}

,
  page: {
  minHeight: "100vh",
  backgroundImage: `url(${bg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  //background: "linear-gradient(135deg,#e6f2fb,#cfe8f7)",
  paddingTop: 60,   
  paddingBottom: 40,
  display: "flex",
  justifyContent: "center"
},

container: {
  width: "100%",
  maxWidth: 1000,
  background: "#ffffff",
  padding: 30,
  borderRadius: 20,
  boxShadow: "0 12px 30px rgba(0,0,0,0.2)"
},
searchBox: { width: "100%", padding: 12, marginBottom: 15, borderRadius: 8, border: "1px solid #ccc" },
  symptomGridWrapper: { maxHeight: "60vh", overflowY: "auto" },
  symptomGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 },
  symptomCard: {
  padding: 14,
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  background: "#f8fafc"
},
durationSelect: { marginTop: 8, padding: 6, borderRadius: 6, border: "1px solid #ccc" },
  predictBtn: {
  width: "100%",
  padding: 16,
  fontSize: 18,
  background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
  color: "#fff",
  borderRadius: 14,
  border: "none",
  marginTop: 20,
  cursor: "pointer"
},
resultBox: { marginTop: 20, padding: 20, background: "#f0f6ff", borderRadius: 16 },
  viewInfoBtn: { marginTop: 12, padding: "10px 20px", background: "#3F83F8", color: "#fff", borderRadius: 10, border: "none" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 },
  modalBox: { position: "relative", background: "#fff", width: "90%", maxWidth: 600, borderRadius: 18, padding: 25, maxHeight: "80vh", display: "flex", flexDirection: "column" },
  closeBtn: { position: "absolute", top: 12, right: 15, fontSize: 20, border: "none", background: "transparent", cursor: "pointer" },
  modalInput: { width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ccc", marginBottom: 10 },
  modalSearchBtn: { padding: 12, background: "#2F54EB", color: "#fff", borderRadius: 10, border: "none", marginBottom: 10 },
  hospitalScroll: { overflowY: "auto", flex: 1, maxHeight: 300 },
  hospitalCard: { padding: 14, marginBottom: 10, background: "#f9fafb", borderRadius: 12, border: "1px solid #e5e7eb" },
  welcomePage: { minHeight: "100vh", background: "linear-gradient(135deg,#6E8EF5,#9EE9F6)", display: "flex", justifyContent: "center", alignItems: "center" },
  welcomeCard: { background: "#fff", padding: 50, borderRadius: 22, textAlign: "center", boxShadow: "0 15px 40px rgba(0,0,0,0.2)" },
  appName: { fontSize: 42, color: "#2F54EB", marginBottom: 10 },
  tagline: { fontSize: 18, color: "#555", marginBottom: 30 },
  getStartedBtn: { padding: "14px 40px", fontSize: 18, background: "#2F54EB", color: "#fff", border: "none", borderRadius: 14, cursor: "pointer" },
  langSelector: { padding: 8, borderRadius: 6 },
  animationOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  animationBox: { background: "#fff", padding: 40, borderRadius: 20, textAlign: "center", fontSize: 22, color: "#2F54EB" },
  motionDots: { marginTop: 20, display: "flex", justifyContent: "center", gap: 10 },
  motionDotsSpan: { width: 15, height: 15, backgroundColor: "#2F54EB", borderRadius: "50%", display: "inline-block", animation: "bounce 1s infinite" },
};
