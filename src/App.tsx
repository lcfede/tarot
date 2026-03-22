import { useState, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { COURSE } from "./data/course";
import { sf } from "./constants";
import Landing from "./components/Landing";
import Cover from "./components/Cover";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Lesson from "./components/Lesson";
import ChatBot from "./components/ChatBot";

function CoursePage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [cur, setCur] = useState("intro");
  const [done, setDone] = useState<string[]>([]);
  const [chat, setChat] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const complete = (id: string) => {
    if (!done.includes(id)) setDone((d) => [...d, id]);
    const all = COURSE.flatMap((m) => m.l);
    const i = all.findIndex((l) => l.id === id);
    if (i < all.length - 1) setCur(all[i + 1].id);
    if (ref.current) ref.current.scrollTo(0, 0);
  };

  const go = (id: string) => {
    setCur(id);
    setNavOpen(false);
    if (ref.current) ref.current.scrollTo(0, 0);
  };

  const total = COURSE.reduce((a, m) => a + m.l.length, 0);
  const pct = Math.round((done.length / total) * 100);

  if (!started) return <Cover onStart={() => setStarted(true)} onBack={() => navigate("/")} />;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0c0c16", fontFamily: sf, color: "#c0b8a8", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @media (max-width: 768px) {
          .sidebar { position: fixed !important; left: -280px; top: 0; z-index: 100; transition: left 0.3s; box-shadow: none !important; }
          .sidebar.open { left: 0 !important; box-shadow: 4px 0 20px rgba(0,0,0,0.6) !important; }
          .overlay { display: block !important; }
          .chatpanel { position: fixed !important; right: 0; top: 0; bottom: 0; z-index: 90; width: 100% !important; min-width: 100% !important; max-width: 100% !important; }
        }
      `}</style>

      {navOpen && (
        <div
          className="overlay"
          onClick={() => setNavOpen(false)}
          style={{ display: "none", position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99 }}
        />
      )}

      <Sidebar cur={cur} done={done} navOpen={navOpen} pct={pct} onGo={go} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header
          cur={cur}
          chatOpen={chat}
          showPulse={!chat && done.length === 0}
          onToggleNav={() => setNavOpen(!navOpen)}
          onToggleChat={() => setChat(!chat)}
        />

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: "24px 5% 50px" }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <Lesson id={cur} onDone={complete} />
            </div>
          </div>

          {chat && (
            <div
              className="chatpanel"
              style={{ width: 320, minWidth: 320, borderLeft: "1px solid #151520", padding: 14, display: "flex", flexDirection: "column", background: "#0a0a12" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "#e0d5c0", fontWeight: 600 }}>{"🔮 Tutor"}</span>
                <button onClick={() => setChat(false)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer" }}>{"✕"}</button>
              </div>
              <ChatBot />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/curso" element={<CoursePage />} />
    </Routes>
  );
}
