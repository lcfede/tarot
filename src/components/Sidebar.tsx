import { COURSE } from "../data/course";
import { hf } from "../constants";

interface Props {
  cur: string;
  done: string[];
  navOpen: boolean;
  pct: number;
  onGo: (id: string) => void;
  onCertificate: () => void;
}

export default function Sidebar({ cur, done, navOpen, pct, onGo, onCertificate }: Props) {
  const all = COURSE.flatMap((m) => m.l);
  const isUnlocked = (id: string) => {
    const idx = all.findIndex((l) => l.id === id);
    if (idx === 0) return true;
    return done.includes(all[idx - 1].id);
  };

  return (
    <div
      className={"sidebar" + (navOpen ? " open" : "")}
      style={{ width: 260, minWidth: 260, height: "100vh", overflowY: "auto", background: "#080612", borderRight: "1px solid rgba(201,168,76,0.15)", padding: "20px 10px", flexShrink: 0 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 16 }}>
        <span style={{ fontSize: 20, color: "#c9a84c", opacity: 0.8 }}>{"✦"}</span>
        <div>
          <div style={{ fontFamily: hf, fontSize: 17, color: "#f0e6d3", fontWeight: 700, letterSpacing: 0.5 }}>Aprende Tarot</div>
          <div style={{ fontSize: 10, color: "rgba(201,168,76,0.45)", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 1 }}>78 cartas · Curso completo</div>
        </div>
      </div>

      <div style={{ padding: "4px 8px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(201,168,76,0.5)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>
          <span>Progreso</span><span>{pct}%</span>
        </div>
        <div style={{ height: 2, background: "rgba(201,168,76,0.1)", borderRadius: 2 }}>
          <div style={{ width: pct + "%", height: "100%", background: "linear-gradient(90deg,#c9a84c,#f5e6a3)", borderRadius: 2, transition: "width 0.5s" }} />
        </div>
      </div>

      <div style={{ width: "100%", height: 1, background: "rgba(201,168,76,0.1)", marginBottom: 12 }} />

      {COURSE.map((mod, mi) => (
        <div key={mi} style={{ marginBottom: 6 }}>
          <div style={{ padding: "6px 8px 4px", fontSize: 9, color: "rgba(201,168,76,0.5)", textTransform: "uppercase", letterSpacing: 2 }}>
            {mod.i} {mod.t}
          </div>
          {mod.l.map((l) => {
            const isAct = cur === l.id;
            const isDn = done.includes(l.id);
            const unlocked = isUnlocked(l.id);
            return (
              <button
                key={l.id}
                onClick={() => unlocked && onGo(l.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 9, width: "100%",
                  padding: "7px 12px", borderRadius: 4,
                  border: isAct ? "1px solid rgba(201,168,76,0.3)" : "1px solid transparent",
                  background: isAct ? "rgba(201,168,76,0.07)" : "transparent",
                  color: isAct ? "#c9a84c" : isDn ? "rgba(201,168,76,0.45)" : unlocked ? "rgba(240,230,211,0.45)" : "rgba(240,230,211,0.18)",
                  fontSize: 12, cursor: unlocked ? "pointer" : "default", textAlign: "left",
                  transition: "all 0.15s",
                  opacity: unlocked ? 1 : 0.5,
                }}
              >
                <span style={{
                  width: 15, height: 15, borderRadius: "50%",
                  border: "1px solid " + (isDn ? "rgba(201,168,76,0.4)" : isAct ? "rgba(201,168,76,0.6)" : unlocked ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.1)"),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 8, flexShrink: 0,
                  background: isDn ? "rgba(201,168,76,0.12)" : "transparent",
                  color: isDn ? "#c9a84c" : "transparent",
                }}>
                  {isDn ? "✓" : !unlocked ? "🔒" : ""}
                </span>
                <span style={{ lineHeight: 1.3 }}>{l.t}</span>
              </button>
            );
          })}
        </div>
      ))}

      {pct === 100 && (
        <div style={{ padding: "16px 8px 8px" }}>
          <div style={{ width: "100%", height: 1, background: "rgba(201,168,76,0.15)", marginBottom: 14 }} />
          <button
            onClick={onCertificate}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 12px", borderRadius: 4,
              border: "1px solid rgba(201,168,76,0.4)",
              background: "rgba(201,168,76,0.07)",
              color: "#c9a84c", fontSize: 12, cursor: "pointer",
              fontFamily: "Georgia,serif", letterSpacing: 1,
            }}
          >
            <span style={{ fontSize: 16 }}>🏆</span>
            <span>Descargar Certificado</span>
          </button>
        </div>
      )}
    </div>
  );
}
