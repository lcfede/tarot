import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "../data/types";
import { supabase } from "../lib/supabase";

export default function ChatBot() {
  const [ms, setMs] = useState<ChatMessage[]>([{
    r: "a",
    t: "Hola. Soy el Oráculo de Visión Tarot. Pregúntame sobre cualquiera de las 78 cartas del Rider-Waite.",
  }]);
  const [inp, setInp] = useState("");
  const [ld, setLd] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [ms, ld]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 96) + "px";
  }, [inp]);

  const send = async () => {
    if (!inp.trim() || ld) return;
    const tx = inp.trim();
    setInp("");
    const newMs = [...ms, { r: "u" as const, t: tx }];
    setMs(newMs);
    setLd(true);
    try {
      const history = newMs.map((m) => ({
        role: m.r === "u" ? "user" : "assistant",
        content: m.t,
      }));
      const { data, error } = await supabase.functions.invoke("oracle-chat", {
        body: { messages: history },
      });
      if (error) throw error;
      setMs((m) => [...m, { r: "a", t: data.text || "Error." }]);
    } catch {
      setMs((m) => [...m, { r: "a", t: "Error de conexión." }]);
    }
    setLd(false);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const canSend = inp.trim().length > 0 && !ld;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>

      {/* Message list */}
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          paddingRight: 2,
          paddingBottom: 2,
          minHeight: 0,
        }}
      >
        {ms.map((m, i) =>
          m.r === "u" ? (
            /* User bubble */
            <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: "16px 16px 4px 16px",
                  background: "rgba(201,168,76,0.13)",
                  border: "1px solid rgba(201,168,76,0.28)",
                  color: "#f0e2b8",
                  fontSize: 14,
                  lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {m.t}
              </div>
            </div>
          ) : (
            /* Oracle bubble */
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                  background: "rgba(201,168,76,0.07)",
                  border: "1px solid rgba(201,168,76,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: "rgba(201,168,76,0.7)",
                  marginTop: 3,
                }}
              >✦</div>
              <div
                style={{
                  maxWidth: "84%",
                  padding: "10px 14px",
                  borderRadius: "4px 16px 16px 16px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(201,168,76,0.1)",
                  color: "#ddd0b5",
                  fontSize: 14,
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "Georgia,serif",
                }}
              >
                {m.t}
              </div>
            </div>
          )
        )}

        {/* Typing indicator */}
        {ld && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div
              style={{
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                background: "rgba(201,168,76,0.07)",
                border: "1px solid rgba(201,168,76,0.22)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: "rgba(201,168,76,0.7)",
              }}
            >✦</div>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "4px 16px 16px 16px",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(201,168,76,0.1)",
                display: "flex", gap: 5, alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "rgba(201,168,76,0.55)",
                    animation: "dotBounce 1.2s ease-in-out infinite",
                    animationDelay: `${i * 0.18}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        style={{
          marginTop: 14,
          borderTop: "1px solid rgba(201,168,76,0.1)",
          paddingTop: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex", gap: 8, alignItems: "flex-end",
            background: "rgba(201,168,76,0.04)",
            border: "1px solid rgba(201,168,76,0.18)",
            borderRadius: 12,
            padding: "8px 8px 8px 14px",
            transition: "border-color 0.2s",
          }}
        >
          <textarea
            ref={textareaRef}
            className="chat-input"
            value={inp}
            onChange={(e) => setInp(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Preguntá sobre una carta..."
            rows={1}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "#e8dcc8",
              fontFamily: "Georgia,serif",
              resize: "none",
              lineHeight: 1.6,
              padding: "3px 0",
              maxHeight: 96,
              overflowY: "auto",
            }}
          />
          <button
            onClick={send}
            disabled={!canSend}
            style={{
              width: 34, height: 34, borderRadius: 8, flexShrink: 0,
              border: "1px solid " + (canSend ? "rgba(201,168,76,0.45)" : "rgba(201,168,76,0.12)"),
              background: canSend ? "rgba(201,168,76,0.18)" : "rgba(201,168,76,0.04)",
              color: canSend ? "#f5e6a3" : "rgba(201,168,76,0.25)",
              fontSize: 17, cursor: canSend ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              lineHeight: 1,
            }}
          >↑</button>
        </div>
        <div
          style={{
            fontSize: 10, color: "rgba(201,168,76,0.25)",
            textAlign: "center", marginTop: 7, letterSpacing: 0.5,
          }}
        >
          Enter para enviar · Shift+Enter nueva línea
        </div>
      </div>
    </div>
  );
}
