import { useNavigate } from "react-router-dom";

export default function Landing2() {
  const navigate = useNavigate();
  const onEnter = () => navigate("/curso");
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg,#0a0612 0%,#1a0d2e 30%,#2d1150 60%,#1a0d2e 85%,#0a0612 100%)",
      fontFamily: "Georgia,serif",
      color: "#f0e6d3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Star field */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.08,
        backgroundImage: "radial-gradient(circle at 20% 30%,#c9a84c 1px,transparent 1px),radial-gradient(circle at 80% 70%,#c9a84c 1px,transparent 1px),radial-gradient(circle at 50% 10%,#c9a84c 0.5px,transparent 0.5px),radial-gradient(circle at 15% 80%,#c9a84c 0.5px,transparent 0.5px),radial-gradient(circle at 90% 20%,#c9a84c 0.5px,transparent 0.5px)",
        backgroundSize: "100% 100%",
      }} />

      {/* Outer border */}
      <div style={{ position: "absolute", top: 16, left: 16, right: 16, bottom: 16, border: "1px solid rgba(201,168,76,0.3)", borderRadius: 4, pointerEvents: "none" }} />
      {/* Inner border */}
      <div style={{ position: "absolute", top: 28, left: 28, right: 28, bottom: 28, border: "1px solid rgba(201,168,76,0.15)", borderRadius: 4, pointerEvents: "none" }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "space-between",
        minHeight: "100vh",
        padding: "52px 32px 44px",
        maxWidth: 560,
        width: "100%",
        margin: "0 auto",
        textAlign: "center",
      }}>

        {/* Top label */}
        <div style={{ letterSpacing: 3, fontSize: 11, textTransform: "uppercase", color: "#c9a84c", opacity: 0.8 }}>
          Guía práctica + Plataforma interactiva
        </div>

        {/* Center block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>

          {/* Eyebrow */}
          <div style={{ fontSize: 12, letterSpacing: 6, textTransform: "uppercase", color: "#c9a84c" }}>
            El negocio del
          </div>

          {/* Main title */}
          <div style={{ position: "relative", padding: "0 10px" }}>
            <div style={{
              fontSize: "clamp(64px,14vw,96px)",
              fontWeight: "bold",
              letterSpacing: 6,
              lineHeight: 0.95,
              background: "linear-gradient(180deg,#f5e6a3 0%,#c9a84c 40%,#a07828 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textTransform: "uppercase",
            }}>
              TAROT
            </div>
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: -8, width: 200, height: 1, background: "linear-gradient(90deg,transparent,#c9a84c,transparent)" }} />
          </div>

          {/* Tarot card SVG */}
          <svg width="130" height="184" viewBox="0 0 120 170" style={{ margin: "16px 0" }}>
            <rect x="10" y="5" width="100" height="160" rx="6" fill="none" stroke="rgba(201,168,76,0.6)" strokeWidth="1.5" />
            <rect x="16" y="11" width="88" height="148" rx="4" fill="rgba(201,168,76,0.05)" stroke="rgba(201,168,76,0.25)" strokeWidth="0.5" />
            <circle cx="60" cy="55" r="22" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.7" />
            <circle cx="60" cy="55" r="16" fill="none" stroke="#c9a84c" strokeWidth="0.5" opacity="0.5" />
            <polygon points="60,35 64,50 80,50 67,59 72,74 60,65 48,74 53,59 40,50 56,50" fill="rgba(201,168,76,0.3)" stroke="#c9a84c" strokeWidth="0.8" />
            <line x1="60" y1="85" x2="60" y2="110" stroke="#c9a84c" strokeWidth="0.8" opacity="0.5" />
            <line x1="45" y1="95" x2="75" y2="95" stroke="#c9a84c" strokeWidth="0.8" opacity="0.5" />
            <circle cx="60" cy="120" r="3" fill="rgba(201,168,76,0.4)" stroke="#c9a84c" strokeWidth="0.5" />
            <circle cx="35" cy="25" r="4" fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="0.5" />
            <circle cx="85" cy="25" r="4" fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="0.5" />
            <circle cx="35" cy="145" r="4" fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="0.5" />
            <circle cx="85" cy="145" r="4" fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="0.5" />
            <text x="60" y="148" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill="#c9a84c" opacity="0.6">RIDER-WAITE</text>
          </svg>

          {/* Subtitle */}
          <div style={{ maxWidth: 360 }}>
            <div style={{ fontSize: 16, lineHeight: 1.6, color: "#e8dcc8", fontStyle: "italic", letterSpacing: 0.5 }}>
              Cómo ganar tus primeros
            </div>
            <div style={{ fontSize: "clamp(32px,8vw,44px)", fontWeight: "bold", color: "#f5e6a3", letterSpacing: 2, margin: "6px 0" }}>
              $500 al mes
            </div>
            <div style={{ fontSize: 16, lineHeight: 1.6, color: "#e8dcc8", fontStyle: "italic", letterSpacing: 0.5 }}>
              leyendo cartas desde casa
            </div>
          </div>

          {/* CTA button */}
          <button
            onClick={onEnter}
            style={{
              marginTop: 8,
              padding: "14px 52px",
              borderRadius: 4,
              border: "1px solid #c9a84c",
              background: "linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.08))",
              color: "#f5e6a3",
              fontSize: 14,
              fontFamily: "Georgia,serif",
              letterSpacing: 4,
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 0 24px rgba(201,168,76,0.15)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,rgba(201,168,76,0.35),rgba(201,168,76,0.15))";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 36px rgba(201,168,76,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.08))";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px rgba(201,168,76,0.15)";
            }}
          >
            Ingresar
          </button>
        </div>

        {/* Footer */}
        <div>
          <div style={{ width: 160, height: 1, background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)", margin: "0 auto 14px" }} />
          <div style={{ display: "flex", justifyContent: "center", gap: 20, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(201,168,76,0.75)" }}>
            <span>78 cartas</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>10 módulos</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>bonus IA</span>
          </div>
        </div>

      </div>
    </div>
  );
}
