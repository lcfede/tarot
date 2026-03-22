import { COURSE } from "../data/course";
import { hf } from "../constants";

interface Props {
  cur: string;
  done: string[];
  navOpen: boolean;
  pct: number;
  onGo: (id: string) => void;
}

export default function Sidebar({ cur, done, navOpen, pct, onGo }: Props) {
  return (
    <div
      className={"sidebar" + (navOpen ? " open" : "")}
      style={{ width: 260, minWidth: 260, height: "100vh", overflowY: "auto", background: "#0a0a12", borderRight: "1px solid #151520", padding: "16px 10px", flexShrink: 0 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 6px", marginBottom: 8 }}>
        <span style={{ fontSize: 18, color: "#d4a843" }}>{"✦"}</span>
        <div>
          <div style={{ fontFamily: hf, fontSize: 16, color: "#e0d5c0", fontWeight: 700 }}>Aprende Tarot</div>
          <div style={{ fontSize: 10, color: "#555" }}>78 cartas · Curso completo</div>
        </div>
      </div>

      <div style={{ padding: "4px 6px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#555", marginBottom: 3 }}>
          <span>Progreso</span><span>{pct}%</span>
        </div>
        <div style={{ height: 3, background: "#1a1a2e", borderRadius: 2 }}>
          <div style={{ width: pct + "%", height: "100%", background: "linear-gradient(90deg,#d4a843,#e8c96a)", borderRadius: 2, transition: "width 0.5s" }} />
        </div>
      </div>

      {COURSE.map((mod, mi) => (
        <div key={mi} style={{ marginBottom: 4 }}>
          <div style={{ padding: "6px 6px 2px", fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1.2 }}>
            {mod.i} {mod.t}
          </div>
          {mod.l.map((l) => {
            const isAct = cur === l.id;
            const isDn = done.includes(l.id);
            return (
              <button
                key={l.id}
                onClick={() => onGo(l.id)}
                style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 12px", borderRadius: 6, border: "none", background: isAct ? "rgba(212,168,67,0.08)" : "transparent", color: isAct ? "#d4a843" : isDn ? "#6b8a6b" : "#777", fontSize: 12, cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid " + (isDn ? "#4a7a4a" : isAct ? "#d4a843" : "#333"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, flexShrink: 0, background: isDn ? "rgba(74,122,74,0.15)" : "transparent", color: isDn ? "#6b8a6b" : "transparent" }}>
                  {isDn ? "✓" : ""}
                </span>
                <span style={{ lineHeight: 1.25 }}>{l.t}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
