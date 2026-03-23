import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "../data/types";

export default function ChatBot() {
  const [ms, setMs] = useState<ChatMessage[]>([{ r: "a", t: "¡Hola! Pregúntame sobre cualquiera de las 78 cartas. 🔮" }]);
  const [inp, setInp] = useState("");
  const [ld, setLd] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [ms]);

  const send = async () => {
    if (!inp.trim() || ld) return;
    const tx = inp.trim();
    setInp("");
    setMs((m) => [...m, { r: "u", t: tx }]);
    setLd(true);
    try {
      const h = ms.map((m) => ({ role: m.r === "u" ? "user" : "assistant", content: m.t }));
      h.push({ role: "user", content: tx });
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "Eres maestro de tarot Rider-Waite. Enseñas 78 cartas en español. Claro, práctico, ejemplos. Máx 200 palabras.",
          messages: h,
        }),
      });
      const d = await r.json();
      setMs((m) => [...m, { r: "a", t: d.content?.map((c: { text?: string }) => c.text || "").join("") || "Error." }]);
    } catch {
      setMs((m) => [...m, { r: "a", t: "Error de conexión." }]);
    }
    setLd(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div ref={ref} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 12, paddingRight: 4 }}>
        {ms.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.r === "u" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              padding: "10px 14px",
              borderRadius: 4,
              background: m.r === "u" ? "rgba(201,168,76,0.08)" : "rgba(201,168,76,0.03)",
              border: "1px solid " + (m.r === "u" ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.12)"),
              color: "#e8dcc8",
              fontSize: 13,
              lineHeight: 1.65,
              whiteSpace: "pre-wrap",
              fontFamily: m.r === "u" ? "inherit" : "Georgia,serif",
            }}
          >
            {m.t}
          </div>
        ))}
        {ld && (
          <div style={{ padding: "10px 14px", borderRadius: 4, background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.12)", color: "rgba(201,168,76,0.4)", fontSize: 12, fontFamily: "Georgia,serif", fontStyle: "italic" }}>
            Consultando...
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder="Pregunta sobre una carta..."
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 4,
            border: "1px solid rgba(201,168,76,0.2)",
            background: "rgba(201,168,76,0.04)",
            color: "#e8dcc8", fontSize: 13, outline: "none",
            fontFamily: "Georgia,serif",
          }}
        />
        <button
          onClick={send}
          disabled={ld || !inp.trim()}
          style={{
            padding: "9px 16px", borderRadius: 4,
            border: "1px solid rgba(201,168,76,0.4)",
            background: "rgba(201,168,76,0.12)",
            color: "#f5e6a3", fontSize: 14, cursor: "pointer",
            opacity: ld || !inp.trim() ? 0.3 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {"→"}
        </button>
      </div>
    </div>
  );
}
