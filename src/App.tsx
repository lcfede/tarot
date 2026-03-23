import { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { COURSE } from "./data/course";
import { sf } from "./constants";
import { supabase } from "./lib/supabase";
import Landing from "./components/Landing";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Cover from "./components/Cover";
import Certificate from "./components/Certificate";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Lesson from "./components/Lesson";
import ChatBot from "./components/ChatBot";

function CoursePage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [progressReady, setProgressReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [cur, setCur] = useState("intro");
  const [done, setDone] = useState<string[]>([]);
  const [chat, setChat] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const loadProgress = async (uid: string) => {
    const { data } = await supabase.from("progress").select("lesson_id").eq("user_id", uid);
    if (data && data.length > 0) {
      const completedIds = data.map((r: { lesson_id: string }) => r.lesson_id);
      setDone(completedIds);
      setStarted(true);
      const all = COURSE.flatMap((m) => m.l);
      const next = all.find((l) => !completedIds.includes(l.id));
      setCur(next ? next.id : all[all.length - 1].id);
    }
    setProgressReady(true);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
      setUserId(session?.user.id ?? null);
      if (session?.user.id) loadProgress(session.user.id);
      else setProgressReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
      setUserId(session?.user.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (authed === null || !progressReady) return null;
  if (!authed) return <Navigate to="/login" replace />;

  const complete = (id: string) => {
    if (!done.includes(id)) {
      setDone((d) => [...d, id]);
      if (userId) {
        void supabase.from("progress")
          .upsert({ user_id: userId, lesson_id: id }, { onConflict: "user_id,lesson_id" })
          .then(() => {});
      }
    }
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
    <div style={{ display: "flex", height: "100vh", background: "#0d0a1e", fontFamily: sf, color: "#e8dcc8", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 4px; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes lessonEnter { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .sidebar { position: fixed !important; left: -280px; top: 0; z-index: 100; transition: left 0.3s; box-shadow: none !important; }
          .sidebar.open { left: 0 !important; box-shadow: 4px 0 30px rgba(0,0,0,0.8) !important; }
          .overlay { display: block !important; }
          .chatpanel { position: fixed !important; right: 0; top: 0; bottom: 0; z-index: 90; width: 100% !important; min-width: 100% !important; max-width: 100% !important; }
          .header-btn-label { display: none !important; }
          .header-btn-icon { display: inline !important; }
          .header-pct { display: flex !important; }
          .header-lesson-title { display: none !important; }
        }
      `}</style>

      {navOpen && (
        <div
          className="overlay"
          onClick={() => setNavOpen(false)}
          style={{ display: "none", position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99 }}
        />
      )}

      <Sidebar cur={cur} done={done} navOpen={navOpen} pct={pct} onGo={go} onCertificate={() => setShowCert(true)} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header
          cur={cur}
          pct={pct}
          chatOpen={chat}
          showPulse={!chat && done.length === 0}
          onToggleNav={() => setNavOpen(!navOpen)}
          onToggleChat={() => setChat(!chat)}
          onLogout={logout}
        />

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: "24px 5% 50px" }}>
            <div key={cur} style={{ maxWidth: 760, margin: "0 auto", animation: "lessonEnter 0.35s ease both" }}>
              <Lesson id={cur} onDone={complete} />
            </div>
          </div>

          {chat && (
            <div
              className="chatpanel"
              style={{ width: 320, minWidth: 320, borderLeft: "1px solid rgba(201,168,76,0.15)", padding: 14, display: "flex", flexDirection: "column", background: "#080612" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: "#c9a84c", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>{"🔮 Tutor IA"}</span>
                <button onClick={() => setChat(false)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer" }}>{"✕"}</button>
              </div>
              <ChatBot />
            </div>
          )}
        </div>
      </div>

      {showCert && userId && (
        <Certificate userId={userId} onClose={() => setShowCert(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/curso" element={<CoursePage />} />
    </Routes>
  );
}
