import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import i18n from "../i18n";
import bg from "../assets/bg.jpg";
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

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: "bot", lines: ["👋 Ask me anything related to health or diseases."] }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Ensure bot reply is always an array
  const formatBotReply = (reply) => {
    if (Array.isArray(reply)) return reply;
    if (typeof reply === "string") return reply.split("\n").map((l) => l.trim()).filter(Boolean);
    return ["⚠️ Unexpected reply format"];
  };

  const send = async () => {
    if (!input.trim()) return;

    setMessages((m) => [...m, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/health-chat", {
        message: input,
        disease: "General Health"
      });

      setMessages((m) => [
        ...m,
        { role: "bot", lines: formatBotReply(res.data.reply) }
      ]);
    } catch (err) {
      console.error("Chatbot API error:", err);
      setMessages((m) => [
        ...m,
        { role: "bot", lines: ["⚠️ Server not responding"] }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>🤖 MediPredict Health Assistant</h2>

          <div style={styles.chatBox}>
            {messages.map((m, i) => (
              <div key={i} style={m.role === "bot" ? styles.bot : styles.user}>
                {m.lines
                  ? m.lines.map((l, j) => <p key={j}>• {l}</p>)
                  : <p>{m.text}</p>}
              </div>
            ))}
            {loading && <p style={{ color: "#555" }}>💬 Bot is typing...</p>}
          </div>

          <div style={styles.inputRow}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about symptoms, diet, medicine..."
              style={styles.input}
            />
            <button onClick={send} style={styles.sendBtn}>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------- STYLES ----------------

const navStyles = {
  navbar: {
    width: "96%",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "#005A9C",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
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
    gap: 20
  },
  btn: {
    background: "transparent",
    border: "none",
    color: "#e5e7eb",
    fontSize: 14,
    cursor: "pointer"
  },
  lang: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "none",
    outline: "none",
    fontSize: 13
  }
};

const styles = {
  page: {
    minHeight: "94vh",
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
    //background: "linear-gradient(135deg,#e6f2fb,#cfe8f7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: "95%",
    maxWidth: 700,
    background: "#fff",
    borderRadius: 20,
    padding: 25,
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
    marginTop:"-100px"
  },
  title: {
    textAlign: "center",
    color: "#1e40af",
    marginBottom: 15
  },
  chatBox: {
    maxHeight: 300,
    overflowY: "auto",
    padding: 10,
    marginBottom: 40
  },
  bot: {
    background: "#f1f5f9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
  },
  user: {
    background: "#2563eb",
    color: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    textAlign: "right"
  },
  inputRow: {
    display: "flex",
    gap: 10
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ccc"
  },
  sendBtn: {
    padding: "12px 20px",
    borderRadius: 10,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer"
  }
};
