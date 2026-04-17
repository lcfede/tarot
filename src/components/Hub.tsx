import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const hf = "'Cormorant Garamond', Georgia, serif";
const sf = "'DM Sans', sans-serif";
const gold = "#c9a84c";
const bg = "#07050f";

export default function Hub() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [readingsCount, setReadingsCount] = useState<number>(0);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate("/login"); return; }
      setAuthed(true);
      const { data } = await supabase
        .from("reading_packs")
        .select("sessions_total, sessions_used")
        .eq("user_id", session.user.id);
      if (data) {
        const total = data.reduce((s, r) => s + (r.sessions_total - r.sessions_used), 0);
        setReadingsCount(total);
      }
    });
  }, [navigate]);

  if (authed === null) return null;

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 50% 0%, #1a0d3e 0%, ${bg} 65%)`,
      fontFamily: sf,
      color: "#e8dcc8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .hub-card { transition: all 0.25s; }
        .hub-card:hover { border-color: rgba(201,168,76,0.55) !important; transform: translateY(-4px); box-shadow: 0 16px 48px rgba(201,168,76,0.14) !important; }
        @media (max-width: 560px) {
          .hub-cards { flex-direction: column !important; align-items: center; }
          .hub-card-btn { width: 100% !important; max-width: 340px !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 52, animation: "fadeUp 0.4s ease both" }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>✦</div>
        <h1 style={{ fontFamily: hf, fontSize: 40, fontWeight: 600, color: "#f5e6a3", margin: "0 0 10px", letterSpacing: 1 }}>
          Visión Tarot
        </h1>
        <p style={{ color: "rgba(232,220,200,0.5)", fontSize: 15, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>
          ¿A dónde querés ir?
        </p>
      </div>

      {/* Cards */}
      <div className="hub-cards" style={{
        display: "flex",
        gap: 24,
        flexWrap: "wrap",
        justifyContent: "center",
        animation: "fadeUp 0.5s ease 0.1s both",
        opacity: 0,
      }}>
        {/* Curso */}
        <button
          className="hub-card hub-card-btn"
          onClick={() => navigate("/curso")}
          style={{
            width: 280,
            padding: "36px 28px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 20,
            cursor: "pointer",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 52 }}>📖</div>
          <div>
            <div style={{ fontFamily: hf, fontSize: 26, color: "#f5e6a3", marginBottom: 8 }}>
              Mi Curso
            </div>
            <div style={{ fontSize: 15, color: "rgba(232,220,200,0.5)", lineHeight: 1.55 }}>
              Continuar el curso completo de Tarot Rider-Waite
            </div>
          </div>
          <div style={{
            marginTop: 4,
            padding: "8px 20px",
            borderRadius: 20,
            background: "rgba(201,168,76,0.1)",
            border: `1px solid rgba(201,168,76,0.25)`,
            fontSize: 13,
            color: gold,
            letterSpacing: 1,
          }}>
            Ingresar →
          </div>
        </button>

        {/* Lecturas */}
        <button
          className="hub-card hub-card-btn"
          onClick={() => navigate("/lectura/app")}
          style={{
            width: 280,
            padding: "36px 28px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 20,
            cursor: "pointer",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 52 }}>🔮</div>
          <div>
            <div style={{ fontFamily: hf, fontSize: 26, color: "#f5e6a3", marginBottom: 8 }}>
              Mis Lecturas
            </div>
            <div style={{ fontSize: 15, color: "rgba(232,220,200,0.5)", lineHeight: 1.55 }}>
              Consultá el tarot con Luna
            </div>
          </div>
          <div style={{
            marginTop: 4,
            padding: "8px 20px",
            borderRadius: 20,
            background: "rgba(201,168,76,0.1)",
            border: `1px solid rgba(201,168,76,0.25)`,
            fontSize: 13,
            color: gold,
            letterSpacing: 1,
          }}>
            {readingsCount > 0
              ? `${readingsCount} tirada${readingsCount !== 1 ? "s" : ""} disponible${readingsCount !== 1 ? "s" : ""}`
              : "Ver lecturas"} →
          </div>
        </button>
      </div>

      {/* Footer */}
      <button
        onClick={logout}
        style={{
          marginTop: 56,
          background: "none",
          border: "none",
          color: "rgba(201,168,76,0.4)",
          fontSize: 13,
          cursor: "pointer",
          letterSpacing: 1,
          animation: "fadeUp 0.5s ease 0.2s both",
          opacity: 0,
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
