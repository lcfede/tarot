import { useState } from "react";
import type { TarotCard } from "../data/types";
import { hf } from "../constants";
import CardImg from "./CardImg";

interface Props {
  c: TarotCard;
  onBack: () => void;
}

export default function CardDetail({ c, onBack }: Props) {
  const [showReversed, setShowReversed] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <CardImg c={c} w={145} h={238} glow />
        <div style={{ flex: 1, minWidth: 220 }}>
          <h2 style={{ fontFamily: hf, color: "#e0d5c0", margin: "0 0 2px", fontSize: 24 }}>{c.nm}</h2>
          <p style={{ color: "#666", fontSize: 12, margin: "0 0 10px" }}>{c.n} · {c.el || c.suit}</p>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
            {c.kw.map((k) => (
              <span key={k} style={{ padding: "3px 9px", borderRadius: 16, fontSize: 11, background: c.cl + "18", color: c.cl, border: "1px solid " + c.cl + "33" }}>
                {k}
              </span>
            ))}
          </div>
          <div style={{ padding: 14, borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid #1a1a2e", marginBottom: 12 }}>
            <h4 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "#888", margin: "0 0 6px" }}>Significado</h4>
            <p style={{ color: "#c0b8a8", lineHeight: 1.6, fontSize: 13, margin: 0 }}>{c.mg}</p>
          </div>
          {c.pr && (
            <div style={{ padding: 14, borderRadius: 8, background: "rgba(212,168,67,0.04)", border: "1px solid rgba(212,168,67,0.15)", marginBottom: 12 }}>
              <h4 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "#d4a843", margin: "0 0 6px" }}>Ejercicio</h4>
              <p style={{ color: "#c0b8a8", lineHeight: 1.6, fontSize: 13, margin: 0 }}>{c.pr}</p>
            </div>
          )}
          <button
            onClick={() => setShowReversed(!showReversed)}
            style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #d4a843", background: "rgba(212,168,67,0.08)", color: "#d4a843", fontSize: 12, cursor: "pointer" }}
          >
            {showReversed ? "▲ Ocultar" : "▼ Ver"} significado invertido
          </button>
          {!showReversed && <span style={{ fontSize: 11, color: "#555", marginLeft: 8 }}>{"← Haz clic para expandir"}</span>}
          {showReversed && (
            <div style={{ padding: 14, borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid #332", marginTop: 8 }}>
              <p style={{ color: "#999", lineHeight: 1.6, fontSize: 13, margin: 0 }}>{c.rv}</p>
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(201,168,76,0.1)" }}>
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.35)",
          color: "#c9a84c", cursor: "pointer", fontSize: 12, padding: "9px 22px",
          borderRadius: 4, letterSpacing: 1, fontFamily: "Georgia,serif",
        }}>
          {"← Volver a las cartas"}
        </button>
      </div>
    </div>
  );
}
