import { useState } from "react";
import { QZ } from "../data/course";
import { hf } from "../constants";

interface Props {
  qid: string;
  onDone: () => void;
}

export default function QuizW({ qid, onDone }: Props) {
  const qs = QZ[qid] || [];
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState<number | null>(null);
  const [sc, setSc] = useState(0);
  const [fin, setFin] = useState(false);

  if (fin) {
    return (
      <div style={{ textAlign: "center", padding: 24 }}>
        <div style={{ fontSize: 42 }}>{sc >= qs.length * 0.8 ? "🌟" : "✨"}</div>
        <div style={{ fontSize: 32, fontFamily: hf, color: "#d4a843", margin: "8px 0" }}>{sc}/{qs.length}</div>
        <button
          onClick={() => { setIdx(0); setAns(null); setSc(0); setFin(false); }}
          style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #d4a843", background: "rgba(212,168,67,0.08)", color: "#d4a843", cursor: "pointer", marginTop: 8 }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  const q = qs[idx];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666", marginBottom: 10 }}>
        <span>{idx + 1}/{qs.length}</span>
        <span style={{ color: "#d4a843" }}>{sc} ✓</span>
      </div>
      <p style={{ fontSize: 16, lineHeight: 1.5, color: "#e0d5c0", marginBottom: 16, fontFamily: hf }}>{q.q}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.o.map((o, j) => {
          let bg = "rgba(255,255,255,0.03)";
          let bc = "#333";
          let tc = "#c0b8a8";
          if (ans !== null && j === q.c) { bg = "rgba(45,106,79,0.2)"; bc = "#2d6a4f"; tc = "#90be6d"; }
          if (ans !== null && j === ans && j !== q.c) { bg = "rgba(209,0,0,0.12)"; bc = "#d00000"; tc = "#ff6b6b"; }
          return (
            <button
              key={j}
              onClick={() => { if (ans !== null) return; setAns(j); if (j === q.c) setSc((s) => s + 1); }}
              style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid " + bc, background: bg, color: tc, fontSize: 14, textAlign: "left", cursor: ans === null ? "pointer" : "default" }}
            >
              {o}
            </button>
          );
        })}
      </div>
      {ans !== null && (
        <div style={{ textAlign: "right", marginTop: 14 }}>
          <button
            onClick={() => { if (idx + 1 >= qs.length) { setFin(true); onDone(); } else { setIdx((n) => n + 1); setAns(null); } }}
            style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#d4a843", color: "#0d0d1a", fontSize: 13, cursor: "pointer", fontWeight: 600 }}
          >
            {idx + 1 >= qs.length ? "Resultado" : "Siguiente →"}
          </button>
        </div>
      )}
    </div>
  );
}
