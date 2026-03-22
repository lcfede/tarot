import { useState } from "react";
import type { TarotCard } from "../data/types";
import { ALL } from "../data/cards";
import { SPS } from "../data/course";
import { hf } from "../constants";
import CardImg from "./CardImg";

export default function SpreadPractice() {
  const [k, setK] = useState<string | null>(null);
  const [cs, setCs] = useState<TarotCard[]>([]);
  const [rv, setRv] = useState<number[]>([]);
  const [dt, setDt] = useState<number | null>(null);

  const start = (key: string) => {
    setCs([...ALL].sort(() => Math.random() - 0.5).slice(0, SPS[key].n));
    setRv([]);
    setDt(null);
    setK(key);
  };

  if (!k) {
    return (
      <div>
        <p style={{ color: "#888", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
          {"Elige una tirada para practicar. Se barajarán las 78 cartas aleatoriamente y podrás revelar cada una haciendo clic."}
        </p>
        {Object.entries(SPS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => start(key)}
            style={{ display: "block", width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #222", background: "rgba(255,255,255,0.02)", cursor: "pointer", textAlign: "left", marginBottom: 8 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#e0d5c0", fontSize: 14 }}>{s.nm}</span>
              <span style={{ color: "#d4a843", fontSize: 12 }}>{s.n} cartas</span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  const sp = SPS[k];
  return (
    <div>
      <button onClick={() => setK(null)} style={{ background: "none", border: "none", color: "#d4a843", cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 10 }}>
        {"← Cambiar tirada"}
      </button>
      <h3 style={{ fontFamily: hf, color: "#e0d5c0", margin: "0 0 4px" }}>{sp.nm}</h3>
      {rv.length < cs.length && (
        <p style={{ color: "#888", fontSize: 12, margin: "0 0 12px" }}>
          {"👆 Haz clic en cada carta boca abajo para revelarla. Luego haz clic en una carta revelada para ver su significado."}
        </p>
      )}
      {rv.length === cs.length && rv.length > 0 && (
        <p style={{ color: "#888", fontSize: 12, margin: "0 0 12px" }}>
          {"✨ Todas reveladas. Haz clic en cualquier carta para ver su interpretación según la posición."}
        </p>
      )}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
        {cs.map((c, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ color: "#888", fontSize: 10, marginBottom: 3, maxWidth: 100, lineHeight: 1.2 }}>{sp.p[i]}</div>
            <CardImg
              c={c}
              flip={!rv.includes(i)}
              glow={dt === i}
              onClick={() => {
                if (!rv.includes(i)) setRv((r) => [...r, i]);
                else setDt(dt === i ? null : i);
              }}
            />
            {!rv.includes(i) && <div style={{ fontSize: 9, color: "#d4a843", marginTop: 2, opacity: 0.6 }}>{"toca para revelar"}</div>}
          </div>
        ))}
      </div>
      {dt !== null && rv.includes(dt) && (
        <div style={{ padding: 14, borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid " + cs[dt].cl + "33" }}>
          <strong style={{ color: "#e0d5c0" }}>{cs[dt].nm}</strong>
          <span style={{ color: "#666", fontSize: 11 }}>{" en posición de \"" + sp.p[dt] + "\""}</span>
          <p style={{ color: "#c0b8a8", lineHeight: 1.6, fontSize: 13, marginTop: 6 }}>{cs[dt].mg}</p>
        </div>
      )}
      {rv.length === cs.length && (
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button onClick={() => start(k)} style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #d4a843", background: "rgba(212,168,67,0.08)", color: "#d4a843", fontSize: 13, cursor: "pointer" }}>
            {"🔄 Nueva tirada"}
          </button>
        </div>
      )}
    </div>
  );
}
