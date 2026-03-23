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
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 42, marginBottom: 12 }}>{sc >= qs.length * 0.8 ? "🌟" : "✨"}</div>
        <div style={{ fontSize: 40, fontFamily: hf, color: "#c9a84c", marginBottom: 4 }}>{sc}/{qs.length}</div>
        <div style={{ fontSize: 13, color: "rgba(201,168,76,0.6)", fontFamily: "Georgia,serif", fontStyle: "italic", marginBottom: 24 }}>
          {sc >= qs.length * 0.8 ? "Excelente resultado" : "Podés mejorar — repasa el módulo"}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={() => { setIdx(0); setAns(null); setSc(0); setFin(false); }}
            style={{
              padding: "10px 24px", borderRadius: 4,
              border: "1px solid rgba(201,168,76,0.3)",
              background: "transparent", color: "rgba(201,168,76,0.6)",
              fontSize: 11, cursor: "pointer",
              fontFamily: "Georgia,serif", letterSpacing: 2, textTransform: "uppercase",
            }}
          >
            Reintentar
          </button>
          <button
            onClick={onDone}
            style={{
              padding: "10px 28px", borderRadius: 4,
              border: "1px solid #c9a84c",
              background: "linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.08))",
              color: "#f5e6a3", fontSize: 11, cursor: "pointer",
              fontFamily: "Georgia,serif", letterSpacing: 3, textTransform: "uppercase",
            }}
          >
            Continuar ✦
          </button>
        </div>
      </div>
    );
  }

  const q = qs[idx];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(201,168,76,0.5)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>
        <span>Pregunta {idx + 1} de {qs.length}</span>
        <span style={{ color: "#c9a84c" }}>{sc} correctas</span>
      </div>
      <p style={{ fontSize: 16, lineHeight: 1.65, color: "#f0e6d3", marginBottom: 20, fontFamily: hf, fontWeight: 600 }}>{q.q}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.o.map((o, j) => {
          let bg = "rgba(201,168,76,0.03)";
          let bc = "rgba(201,168,76,0.15)";
          let tc = "#e8dcc8";
          if (ans !== null && j === q.c) { bg = "rgba(45,106,79,0.2)"; bc = "#2d6a4f"; tc = "#90be6d"; }
          if (ans !== null && j === ans && j !== q.c) { bg = "rgba(209,0,0,0.12)"; bc = "#d00000"; tc = "#ff6b6b"; }
          return (
            <button
              key={j}
              onClick={() => { if (ans !== null) return; setAns(j); if (j === q.c) setSc((s) => s + 1); }}
              style={{
                padding: "12px 16px", borderRadius: 4,
                border: "1px solid " + bc, background: bg, color: tc,
                fontSize: 14, textAlign: "left",
                cursor: ans === null ? "pointer" : "default",
                fontFamily: "Georgia,serif", lineHeight: 1.5,
                transition: "all 0.15s",
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
      {ans !== null && (
        <div style={{ textAlign: "right", marginTop: 20 }}>
          <button
            onClick={() => {
              if (idx + 1 >= qs.length) { setFin(true); }
              else { setIdx((n) => n + 1); setAns(null); }
            }}
            style={{
              padding: "10px 28px", borderRadius: 4,
              border: "1px solid #c9a84c",
              background: "linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.08))",
              color: "#f5e6a3", fontSize: 11, cursor: "pointer",
              fontFamily: "Georgia,serif", letterSpacing: 3, textTransform: "uppercase",
            }}
          >
            {idx + 1 >= qs.length ? "Ver resultado" : "Siguiente →"}
          </button>
        </div>
      )}
    </div>
  );
}
