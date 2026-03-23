import { COURSE } from "../data/course";
import { hf } from "../constants";

interface Props {
  cur: string;
  pct: number;
  chatOpen: boolean;
  showPulse: boolean;
  onToggleNav: () => void;
  onToggleChat: () => void;
  onProfile: () => void;
  onLogout: () => void;
}

export default function Header({ cur, pct, chatOpen, showPulse, onToggleNav, onToggleChat, onProfile, onLogout }: Props) {
  const cm = COURSE.find((m) => m.l.some((l) => l.id === cur));
  const cl = cm ? cm.l.find((l) => l.id === cur) : null;

  return (
    <div style={{ padding: "10px 18px", borderBottom: "1px solid rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "rgba(8,6,18,0.6)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Hamburger — large touch target on mobile */}
        <button
          onClick={onToggleNav}
          style={{ background: "none", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 6, color: "#c9a84c", cursor: "pointer", fontSize: 18, padding: "6px 10px", lineHeight: 1, minWidth: 40, minHeight: 40 }}
        >
          {"☰"}
        </button>

        {/* Lesson info — hidden on mobile */}
        <div className="header-lesson-title">
          <div style={{ fontSize: 9, color: "rgba(201,168,76,0.75)", letterSpacing: 2, textTransform: "uppercase" }}>{cm ? cm.i + " " + cm.t : ""}</div>
          <div style={{ fontSize: 13, color: "#f0e6d3", fontFamily: hf, fontWeight: 600, letterSpacing: 0.3 }}>{cl ? cl.t : ""}</div>
        </div>

        {/* Progress % — only on mobile */}
        <div className="header-pct" style={{ display: "none", flexDirection: "column", gap: 3 }}>
          <div style={{ fontSize: 9, color: "rgba(201,168,76,0.8)", letterSpacing: 2, textTransform: "uppercase" }}>Progreso</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 80, height: 2, background: "rgba(201,168,76,0.1)", borderRadius: 2 }}>
              <div style={{ width: pct + "%", height: "100%", background: "linear-gradient(90deg,#c9a84c,#f5e6a3)", borderRadius: 2, transition: "width 0.5s" }} />
            </div>
            <span style={{ fontSize: 10, color: "#c9a84c" }}>{pct}%</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={onToggleChat}
          style={{
            padding: "6px 14px", borderRadius: 20,
            border: "1px solid " + (chatOpen ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.2)"),
            background: chatOpen ? "rgba(201,168,76,0.1)" : "transparent",
            color: chatOpen ? "#c9a84c" : "rgba(201,168,76,0.65)",
            fontSize: 16, cursor: "pointer", position: "relative",
            minWidth: 40, minHeight: 40,
          }}
        >
          {"🔮"}
          <span className="header-btn-label" style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", fontFamily: "Georgia,serif", marginLeft: 6 }}>
            Oráculo
          </span>
          {showPulse && (
            <span style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
          )}
        </button>
        <button
          onClick={onProfile}
          style={{
            padding: "6px 12px", borderRadius: 20,
            border: "1px solid rgba(201,168,76,0.2)",
            background: "transparent",
            color: "rgba(201,168,76,0.82)",
            fontSize: 14, cursor: "pointer",
            minWidth: 40, minHeight: 40,
          }}
          title="Mi Perfil"
        >
          {"☽"}
        </button>
        <button
          onClick={onLogout}
          style={{
            padding: "6px 12px", borderRadius: 20,
            border: "1px solid rgba(201,168,76,0.15)",
            background: "transparent",
            color: "rgba(201,168,76,0.75)",
            fontSize: 11, cursor: "pointer",
            minWidth: 40, minHeight: 40,
            fontFamily: "Georgia,serif",
          }}
        >
          <span className="header-btn-label" style={{ letterSpacing: 1.5, textTransform: "uppercase" }}>Salir</span>
          <span className="header-btn-icon" style={{ display: "none", fontSize: 14 }}>✕</span>
        </button>
      </div>
    </div>
  );
}
