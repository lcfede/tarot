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
      <div ref={ref} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 10, paddingRight: 4 }}>
        {ms.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.r === "u" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              padding: "10px 13px",
              borderRadius: 10,
              background: m.r === "u" ? "rgba(212,168,67,0.1)" : "rgba(255,255,255,0.03)",
              border: "1px solid " + (m.r === "u" ? "rgba(212,168,67,0.2)" : "#222"),
              color: "#c0b8a8",
              fontSize: 13,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {m.t}
          </div>
        ))}
        {ld && (
          <div style={{ padding: 10, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid #222", color: "#555", fontSize: 12 }}>
            Consultando...
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder="Pregunta..."
          style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #333", background: "rgba(255,255,255,0.03)", color: "#e0d5c0", fontSize: 13, outline: "none" }}
        />
        <button
          onClick={send}
          disabled={ld || !inp.trim()}
          style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: "#d4a843", color: "#0d0d1a", fontSize: 13, cursor: "pointer", fontWeight: 600, opacity: ld || !inp.trim() ? 0.4 : 1 }}
        >
          {"→"}
        </button>
      </div>
    </div>
  );
}
