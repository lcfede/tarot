import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ALL } from "../data/cards";
import { SPS } from "../data/course";
import type { TarotCard, ChatMessage } from "../data/types";
import CardImg from "./CardImg";

const hf = "'Cormorant Garamond', Georgia, serif";
const sf = "'DM Sans', sans-serif";
const gold = "#c9a84c";
const bg = "#07050f";

// ─── tipos internos ────────────────────────────────────────────────────────────

interface CardInSpread {
  id: string;
  name: string;
  position: string;
  reversed: boolean;
  card: TarotCard;
}

interface Pack {
  id: string;
  pack_type: number;
  sessions_total: number;
  sessions_used: number;
}

interface Session {
  id: string;
  pack_id: string;
  spread_key: string;
  cards_json: CardInSpread[];
  questions_total: number;
  questions_used: number;
  status: "active" | "completed";
}

// ─── utilidades de UI ──────────────────────────────────────────────────────────

function inlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} style={{ fontWeight: 700, color: "#e8dcc8" }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

function MarkdownText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        if (line.startsWith("### ")) return <div key={i} style={{ fontWeight: 700, fontSize: 15, color: gold, marginTop: 10, marginBottom: 2 }}>{inlineMarkdown(line.slice(4))}</div>;
        if (line.startsWith("## ")) return <div key={i} style={{ fontWeight: 700, fontSize: 16, color: gold, marginTop: 10, marginBottom: 2 }}>{inlineMarkdown(line.slice(3))}</div>;
        if (/^[-*] /.test(line)) return <div key={i} style={{ display: "flex", gap: 7, marginTop: 3 }}><span style={{ color: gold, flexShrink: 0, marginTop: 1 }}>•</span><span>{inlineMarkdown(line.slice(2))}</span></div>;
        if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
        return <div key={i}>{inlineMarkdown(line)}</div>;
      })}
    </>
  );
}

// ─── vista: dashboard de packs ─────────────────────────────────────────────────

const PACK_URLS: Record<number, string> = {
  1: "https://pay.hotmart.com/R105430859J?off=osr5b44m",
  3: "https://pay.hotmart.com/R105430859J?off=ntyyhq9k",
  6: "https://pay.hotmart.com/R105430859J?off=z9ku7323",
};

const PACK_INFO = [
  { type: 1, title: "Esencial",  sessions: 1, questions: 10, price: "$5 USD" },
  { type: 3, title: "Profunda",  sessions: 3, questions: 10, price: "$12 USD" },
  { type: 6, title: "Completa",  sessions: 6, questions: 12, price: "$20 USD" },
];

function BuyModal({ onClose, onRefresh }: { onClose: () => void; onRefresh: () => void }) {
  const [purchased, setPurchased] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleBuy = (type: number) => {
    window.open(PACK_URLS[type], "_blank");
    setPurchased(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: "0 0 0 0",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#110d22",
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: "20px 20px 0 0",
          padding: "24px 20px 36px",
          animation: "slideUp 0.3s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: hf, fontSize: 22, color: "#f5e6a3" }}>Comprar lecturas</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(201,168,76,0.5)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>

        {!purchased ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PACK_INFO.map((pack) => (
              <button
                key={pack.type}
                onClick={() => handleBuy(pack.type)}
                style={{
                  padding: "16px 18px",
                  borderRadius: 12,
                  border: "1px solid rgba(201,168,76,0.2)",
                  background: "rgba(201,168,76,0.04)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: hf, fontSize: 18, color: "#f5e6a3", marginBottom: 2 }}>{pack.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(232,220,200,0.45)" }}>
                    {pack.sessions} lectura{pack.sessions > 1 ? "s" : ""} · {pack.questions} preguntas c/u
                  </div>
                </div>
                <div style={{ fontFamily: sf, fontWeight: 700, fontSize: 16, color: gold, flexShrink: 0, marginLeft: 12 }}>
                  {pack.price}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
            <p style={{ color: "#e8dcc8", fontSize: 15, marginBottom: 20, lineHeight: 1.6 }}>
              ¡Gracias por tu compra! Una vez confirmado el pago, tus lecturas aparecerán acá.
            </p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg,#c9a84c,#a07828)",
                color: "#0a0612",
                fontFamily: sf,
                fontWeight: 700,
                fontSize: 16,
                cursor: refreshing ? "not-allowed" : "pointer",
                opacity: refreshing ? 0.7 : 1,
              }}
            >
              {refreshing ? "Actualizando..." : "Ya compré — actualizar mis lecturas"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PacksDashboard({ userId, onStart }: { userId: string; onStart: (packId: string, spreadKey: string, cards: CardInSpread[]) => void }) {
  const navigate = useNavigate();
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpread, setSelectedSpread] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const fetchPacks = async () => {
    const { data } = await supabase
      .from("reading_packs")
      .select("id, pack_type, sessions_total, sessions_used")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setPacks((data as Pack[]) ?? []);
  };

  useEffect(() => {
    fetchPacks().then(() => setLoading(false));
  }, [userId]);

  const totalAvailable = packs.reduce((s, p) => s + (p.sessions_total - p.sessions_used), 0);
  const activePack = packs.find((p) => p.sessions_total - p.sessions_used > 0) ?? null;

  const handleStartReading = () => {
    if (!selectedSpread || !activePack) return;
    const spread = SPS[selectedSpread];
    const shuffled = [...ALL].sort(() => Math.random() - 0.5).slice(0, spread.n);
    const cards: CardInSpread[] = shuffled.map((card, i) => ({
      id: card.n,
      name: card.nm,
      position: spread.p[i],
      reversed: Math.random() < 0.3,
      card,
    }));
    onStart(activePack.id, selectedSpread, cards);
  };

  if (loading) return null;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 42, marginBottom: 12 }}>🔮</div>
        <h1 style={{ fontFamily: hf, fontSize: 34, color: "#f5e6a3", margin: "0 0 10px" }}>
          Mis Lecturas
        </h1>
        {totalAvailable > 0 ? (
          <p style={{ color: "rgba(232,220,200,0.55)", fontSize: 16, margin: 0 }}>
            Tenés <strong style={{ color: gold }}>{totalAvailable} lectura{totalAvailable !== 1 ? "s" : ""}</strong> disponible{totalAvailable !== 1 ? "s" : ""}
          </p>
        ) : (
          <p style={{ color: "rgba(232,220,200,0.55)", fontSize: 16, margin: 0 }}>
            No tenés lecturas disponibles
          </p>
        )}
      </div>

      {totalAvailable > 0 && (
        <div style={{
          background: "rgba(201,168,76,0.04)",
          border: "1px solid rgba(201,168,76,0.15)",
          borderRadius: 18,
          padding: "28px 22px",
          marginBottom: 24,
        }}>
          <h3 style={{ fontFamily: hf, fontSize: 22, color: "#f5e6a3", margin: "0 0 20px" }}>
            Iniciar nueva lectura
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
            {Object.entries(SPS).map(([key, spread]) => (
              <button
                key={key}
                onClick={() => setSelectedSpread(key)}
                style={{
                  padding: "16px 18px",
                  borderRadius: 12,
                  border: `1px solid ${selectedSpread === key ? "rgba(201,168,76,0.55)" : "rgba(201,168,76,0.15)"}`,
                  background: selectedSpread === key ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.01)",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ color: "#e8dcc8", fontSize: 16, fontFamily: sf }}>{spread.nm}</span>
                <span style={{ color: gold, fontSize: 14 }}>{spread.n} carta{spread.n > 1 ? "s" : ""}</span>
              </button>
            ))}
          </div>
          <button
            onClick={handleStartReading}
            disabled={!selectedSpread}
            style={{
              width: "100%",
              padding: "17px",
              borderRadius: 10,
              border: "none",
              background: selectedSpread
                ? "linear-gradient(135deg,#c9a84c,#a07828)"
                : "rgba(201,168,76,0.1)",
              color: selectedSpread ? "#0a0612" : "rgba(201,168,76,0.3)",
              fontFamily: sf,
              fontWeight: 700,
              fontSize: 17,
              cursor: selectedSpread ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            Tirar las cartas ✦
          </button>
          <p style={{ fontSize: 11, color: "rgba(232,220,200,0.28)", textAlign: "center", margin: "14px 0 0", lineHeight: 1.55 }}>
            Luna es una experiencia de tarot. No reemplaza la atención psicológica profesional. Solo para mayores de 18 años.{" "}
            Al usar este servicio aceptás los{" "}
            <a href="/terminos" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(201,168,76,0.45)", textDecoration: "underline" }}>Términos de uso</a>
            {" "}y la{" "}
            <a href="/privacidad" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(201,168,76,0.45)", textDecoration: "underline" }}>Política de privacidad</a>.
          </p>
        </div>
      )}

      <div style={{ textAlign: "center", paddingTop: 8 }}>
        <p style={{ fontSize: 13, color: "rgba(232,220,200,0.3)", marginBottom: 14 }}>
          {packs.length > 0
            ? `Pack${packs.length !== 1 ? "s" : ""}: ${packs.map(p => `${p.sessions_used}/${p.sessions_total} usadas`).join(" · ")}`
            : ""}
        </p>
        <button
          onClick={() => setShowBuyModal(true)}
          style={{
            background: "none",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 8,
            padding: "10px 22px",
            color: gold,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: sf,
          }}
        >
          + Comprar más lecturas
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button
          onClick={() => navigate("/hub")}
          style={{ background: "none", border: "none", color: "rgba(201,168,76,0.35)", fontSize: 13, cursor: "pointer" }}
        >
          ← Volver al inicio
        </button>
      </div>

      {showBuyModal && (
        <BuyModal
          onClose={() => setShowBuyModal(false)}
          onRefresh={fetchPacks}
        />
      )}
    </div>
  );
}

// ─── vista: revelado de cartas ─────────────────────────────────────────────────

function CardReveal({ cards, onAllRevealed, onBack }: { cards: CardInSpread[]; onAllRevealed: () => void; onBack: () => void }) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const reveal = (i: number) => {
    if (!revealed.includes(i)) {
      const next = [...revealed, i];
      setRevealed(next);
      if (next.length === cards.length) {
        setTimeout(onAllRevealed, 1200);
      }
    } else {
      setSelected(selected === i ? null : i);
    }
  };

  // Tamaño de carta adaptado a la cantidad
  const cardW = cards.length <= 3 ? 90 : cards.length <= 5 ? 76 : 64;
  const cardH = Math.round(cardW * 1.64);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: hf, fontSize: 28, color: "#f5e6a3", margin: "0 0 8px" }}>
          Tus cartas están listas
        </h2>
        <p style={{ color: "rgba(232,220,200,0.5)", fontSize: 15, margin: "0 0 14px" }}>
          {revealed.length < cards.length
            ? "Tocá cada carta para revelarla"
            : "✨ Todas reveladas. Continuando..."}
        </p>
        {revealed.length === 0 && (
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 8,
              padding: "8px 18px",
              color: "rgba(201,168,76,0.6)",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: sf,
            }}
          >
            ← Cambiar lectura
          </button>
        )}
      </div>

      {/* Grid de cartas */}
      {(() => {
        const renderCard = (entry: CardInSpread, i: number) => {
          const isRevealed = revealed.includes(i);
          const isSelected = selected === i;
          return (
            <div key={i} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              {/* Posición — siempre arriba */}
              <div style={{ fontSize: 10, color: "rgba(201,168,76,0.65)", letterSpacing: 0.5, textTransform: "uppercase", maxWidth: cardW, lineHeight: 1.2, minHeight: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {entry.position}
              </div>
              {/* Carta */}
              <div style={{
                transform: isSelected ? "scale(1.06)" : "scale(1)",
                transition: "transform 0.2s",
                filter: isRevealed ? "none" : "brightness(0.55)",
              }}>
                {isRevealed ? (
                  <CardImg c={entry.card} w={cardW} h={cardH} onClick={() => reveal(i)} glow={isSelected} flip={false} />
                ) : (
                  <CardImg c={entry.card} w={cardW} h={cardH} onClick={() => reveal(i)} flip glow={false} />
                )}
              </div>
              {/* Nombre — solo cuando está revelada */}
              <div style={{ fontSize: 11, color: isRevealed ? "#e8dcc8" : "transparent", maxWidth: cardW, lineHeight: 1.3, minHeight: 28 }}>
                {isRevealed ? `${entry.name}${entry.reversed ? " ↙" : ""}` : "·"}
              </div>
            </div>
          );
        };

        // 5 cartas → 3 arriba + 2 abajo
        if (cards.length === 5) {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                {cards.slice(0, 3).map((entry, i) => renderCard(entry, i))}
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                {cards.slice(3).map((entry, i) => renderCard(entry, i + 3))}
              </div>
            </div>
          );
        }

        // Resto: fila única
        return (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
            {cards.map((entry, i) => renderCard(entry, i))}
          </div>
        );
      })()}

      {/* Detalle carta seleccionada */}
      {selected !== null && revealed.includes(selected) && (
        <div style={{
          background: "rgba(201,168,76,0.04)",
          border: "1px solid rgba(201,168,76,0.18)",
          borderRadius: 14,
          padding: "20px",
          marginTop: 8,
          animation: "fadeIn 0.25s ease",
        }}>
          <div style={{ fontFamily: hf, fontSize: 20, color: "#f5e6a3", marginBottom: 4 }}>
            {cards[selected].name} {cards[selected].reversed ? "(invertida)" : ""}
          </div>
          <div style={{ fontSize: 12, color: gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
            {cards[selected].position}
          </div>
          <div style={{ fontSize: 15, color: "rgba(232,220,200,0.75)", lineHeight: 1.65 }}>
            {cards[selected].reversed ? cards[selected].card.rv : cards[selected].card.mg}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── vista: chat con Luna ──────────────────────────────────────────────────────

function validateInput(text: string): string | null {
  const t = text.trim();
  if (t.length < 3) return "Escribí tu pregunta.";
  if (t.length > 500) return "La pregunta es demasiado larga (máx. 500 caracteres).";
  const banned = [
    /ignora (las )?instrucciones/i,
    /olvida (lo que|tus instrucciones)/i,
    /actúa como/i,
    /act as/i,
    /ahora eres/i,
    /you are now/i,
    /system prompt/i,
    /forget (your|all)/i,
    /pretend (you are|to be)/i,
    /jailbreak/i,
  ];
  if (banned.some((r) => r.test(t))) {
    return "Ese tipo de mensaje no está permitido. ¿Qué querés saber sobre tus cartas?";
  }
  return null;
}

function TarotChat({ session, onSessionEnd }: { session: Session; onSessionEnd: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    r: "a",
    t: `Hola, soy Luna. Tus cartas ya están sobre la mesa.\n\n${session.cards_json.map((c, i) => `**${i + 1}. ${c.name}**${c.reversed ? " (invertida)" : ""} — ${c.position}`).join("\n")}\n\nPreguntame lo que quieras saber sobre esta lectura. 🌙`,
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionsLeft, setQuestionsLeft] = useState(session.questions_total - session.questions_used);
  const [readingFinished, setReadingFinished] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastMsgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    if (loading) {
      container.scrollTop = container.scrollHeight;
    } else {
      const last = messages[messages.length - 1];
      if (last?.r === "a" && lastMsgRef.current) {
        container.scrollTop = lastMsgRef.current.offsetTop - container.offsetTop;
      } else {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, loading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 88) + "px";
  }, [input]);

  const send = async () => {
    if (!input.trim() || loading || questionsLeft <= 0) return;
    const tx = input.trim();
    const err = validateInput(tx);
    if (err) { setInputError(err); return; }
    setInputError(null);
    setInput("");
    const newMessages = [...messages, { r: "u" as const, t: tx }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.map((m) => ({
        role: m.r === "u" ? "user" : "assistant",
        content: m.t,
      }));
      const { data, error } = await supabase.functions.invoke("tarot-reader", {
        body: { session_id: session.id, messages: history },
      });
      if (error) throw error;
      if (data.quota_exceeded) {
        setMessages((m) => [...m, {
          r: "a",
          t: "Has usado todas las preguntas de esta lectura. Podés iniciar una nueva lectura cuando quieras. 🌙",
        }]);
        setQuestionsLeft(0);
        setLoading(false);
        return;
      }
      setQuestionsLeft(data.questions_remaining ?? 0);
      setMessages((m) => [...m, { r: "a", t: data.text || "Error." }]);
      if (data.session_completed) {
        setReadingFinished(true);
      }
    } catch {
      setMessages((m) => [...m, { r: "a", t: "Error de conexión. Intentá de nuevo." }]);
    }
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const canSend = input.trim().length > 0 && !loading && questionsLeft > 0;

  return (
    <div style={{ display: "flex", height: "100dvh", flexDirection: "column", background: bg, fontFamily: sf }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes dotBounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-5px); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .luna-input { font-size: 16px !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid rgba(201,168,76,0.1)",
        background: "linear-gradient(180deg,rgba(201,168,76,0.07) 0%,transparent 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "radial-gradient(circle,rgba(201,168,76,0.18),rgba(201,168,76,0.04))",
            border: "1px solid rgba(201,168,76,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0,
          }}>🌙</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: gold, fontFamily: "Georgia,serif" }}>Luna</div>
            <div style={{ fontSize: 11, color: "rgba(201,168,76,0.45)", letterSpacing: 1.5, textTransform: "uppercase" }}>
              {SPS[session.spread_key]?.nm ?? "Lectura"}
            </div>
          </div>
        </div>
        {/* Preguntas restantes + salir */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            padding: "6px 14px",
            borderRadius: 20,
            background: "rgba(201,168,76,0.07)",
            border: "1px solid rgba(201,168,76,0.2)",
            fontSize: 12,
            color: questionsLeft <= 2 && !readingFinished ? "#e07070" : gold,
            fontFamily: sf,
            fontWeight: 600,
          }}>
            {readingFinished ? "Finalizada ✦" : `${questionsLeft} ${questionsLeft === 1 ? "pregunta" : "preguntas"}`}
          </div>
          {!readingFinished && (
            <button
              onClick={() => setShowExitModal(true)}
              style={{
                background: "none",
                border: "1px solid rgba(201,168,76,0.15)",
                borderRadius: 8,
                padding: "6px 12px",
                color: "rgba(232,220,200,0.4)",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: sf,
                letterSpacing: 0.5,
                transition: "all 0.15s",
              }}
            >
              Salir
            </button>
          )}
        </div>
      </div>

      {/* ── Tira de cartas (siempre visible, scroll horizontal) ── */}
      <div style={{
        borderBottom: "1px solid rgba(201,168,76,0.08)",
        background: "rgba(201,168,76,0.015)",
        flexShrink: 0,
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
      }}>
        <div style={{
          display: "flex",
          gap: 10,
          padding: "12px 16px",
          width: "max-content",
          minWidth: "100%",
          justifyContent: session.cards_json.length <= 4 ? "center" : "flex-start",
        }}>
          {session.cards_json.map((entry, i) => (
            <button
              key={i}
              onClick={() => setSelectedCard(selectedCard === i ? null : i)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                flexShrink: 0,
                outline: "none",
              }}
            >
              <div style={{
                borderRadius: 7,
                border: `1px solid ${selectedCard === i ? "rgba(201,168,76,0.7)" : "rgba(201,168,76,0.2)"}`,
                overflow: "hidden",
                boxShadow: selectedCard === i ? "0 0 12px rgba(201,168,76,0.25)" : "none",
                transition: "all 0.15s",
              }}>
                <CardImg c={entry.card} w={52} h={84} />
              </div>
              <div style={{ fontSize: 9, color: "rgba(201,168,76,0.55)", textTransform: "uppercase", letterSpacing: 0.5, maxWidth: 56, lineHeight: 1.2, textAlign: "center" }}>
                {entry.position}
              </div>
            </button>
          ))}
        </div>

        {/* Detalle carta seleccionada */}
        {selectedCard !== null && (
          <div style={{
            padding: "0 16px 12px",
            animation: "slideDown 0.2s ease",
          }}>
            <div style={{
              background: "rgba(201,168,76,0.05)",
              border: "1px solid rgba(201,168,76,0.15)",
              borderRadius: 10,
              padding: "12px 14px",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}>
              <CardImg c={session.cards_json[selectedCard].card} w={42} h={68} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: hf, fontSize: 16, color: "#f5e6a3", marginBottom: 2 }}>
                  {session.cards_json[selectedCard].name}
                  {session.cards_json[selectedCard].reversed ? " ↙" : ""}
                </div>
                <div style={{ fontSize: 10, color: gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                  {session.cards_json[selectedCard].position}
                </div>
                <div style={{ fontSize: 13, color: "rgba(232,220,200,0.7)", lineHeight: 1.55 }}>
                  {session.cards_json[selectedCard].reversed
                    ? session.cards_json[selectedCard].card.rv
                    : session.cards_json[selectedCard].card.mg}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Mensajes ── */}
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          minHeight: 0,
        }}
      >
        {messages.map((m, i) =>
          m.r === "u" ? (
            <div key={i} ref={i === messages.length - 1 ? lastMsgRef : undefined} style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{
                maxWidth: "82%",
                padding: "11px 15px",
                borderRadius: "16px 16px 4px 16px",
                background: "rgba(201,168,76,0.12)",
                border: "1px solid rgba(201,168,76,0.25)",
                color: "#f0e2b8",
                fontSize: 15,
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}>
                {m.t}
              </div>
            </div>
          ) : (
            <div key={i} ref={i === messages.length - 1 ? lastMsgRef : undefined} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: "rgba(201,168,76,0.07)",
                border: "1px solid rgba(201,168,76,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, marginTop: 2,
              }}>🌙</div>
              <div style={{
                maxWidth: "85%",
                padding: "11px 15px",
                borderRadius: "4px 16px 16px 16px",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(201,168,76,0.1)",
                color: "#ddd0b5",
                fontSize: 15,
                lineHeight: 1.8,
                wordBreak: "break-word",
                fontFamily: "Georgia,serif",
              }}>
                <MarkdownText text={m.t} />
              </div>
            </div>
          )
        )}

        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
              background: "rgba(201,168,76,0.07)",
              border: "1px solid rgba(201,168,76,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13,
            }}>🌙</div>
            <div style={{
              padding: "13px 16px",
              borderRadius: "4px 16px 16px 16px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(201,168,76,0.1)",
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "rgba(201,168,76,0.55)",
                  animation: "dotBounce 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.18}s`,
                }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal: confirmar salida ── */}
      {showExitModal && (
        <div
          onClick={() => setShowExitModal(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 300,
            background: "rgba(0,0,0,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 360,
              background: "#110d22",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 20,
              padding: "28px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 14 }}>🌙</div>
            <div style={{ fontFamily: hf, fontSize: 22, color: "#f5e6a3", marginBottom: 10 }}>
              ¿Cerrar la lectura?
            </div>
            <p style={{ fontSize: 14, color: "rgba(232,220,200,0.6)", lineHeight: 1.65, marginBottom: 24 }}>
              Esta sesión ya fue registrada. Las preguntas que no uses en esta lectura se perderán.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowExitModal(false)}
                style={{
                  flex: 1,
                  padding: "13px",
                  borderRadius: 10,
                  border: "1px solid rgba(201,168,76,0.2)",
                  background: "transparent",
                  color: "rgba(232,220,200,0.6)",
                  fontFamily: sf,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await supabase
                    .from("reading_sessions")
                    .update({ status: "completed" })
                    .eq("id", session.id);
                  onSessionEnd();
                }}
                style={{
                  flex: 1,
                  padding: "13px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg,#c9a84c,#a07828)",
                  color: "#0a0612",
                  fontFamily: sf,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                Cerrar lectura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div style={{
        padding: "10px 14px 16px",
        borderTop: "1px solid rgba(201,168,76,0.1)",
        flexShrink: 0,
        background: "rgba(0,0,0,0.35)",
      }}>
        {readingFinished ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: "16px",
            background: "rgba(201,168,76,0.05)",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 14,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 22 }}>✦</div>
            <div style={{ fontFamily: hf, fontSize: 20, color: "#f5e6a3" }}>Lectura finalizada</div>
            <button
              onClick={onSessionEnd}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg,#c9a84c,#a07828)",
                color: "#0a0612",
                fontFamily: sf,
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Volver al inicio →
            </button>
          </div>
        ) : (
          <div style={{
            display: "flex", gap: 8, alignItems: "flex-end",
            background: "rgba(201,168,76,0.04)",
            border: `1px solid ${inputError ? "rgba(180,60,60,0.4)" : "rgba(201,168,76,0.2)"}`,
            borderRadius: 14,
            padding: "8px 8px 8px 14px",
            position: "relative",
          }}>
            <textarea
              ref={textareaRef}
              className="luna-input"
              value={input}
              onChange={(e) => { setInput(e.target.value); if (inputError) setInputError(null); }}
              onKeyDown={handleKey}
              placeholder="Preguntale a Luna sobre tus cartas..."
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
                padding: "4px 0",
                maxHeight: 88,
                overflowY: "auto",
              }}
            />
            {inputError && (
              <div style={{ position: "absolute", bottom: "100%", left: 0, right: 0, marginBottom: 6, padding: "8px 14px", background: "rgba(180,60,60,0.15)", border: "1px solid rgba(180,60,60,0.3)", borderRadius: 8, fontSize: 13, color: "#e07070" }}>
                {inputError}
              </div>
            )}
            <button
              onClick={send}
              disabled={!canSend}
              style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                border: "1px solid " + (canSend ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.12)"),
                background: canSend ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.04)",
                color: canSend ? "#f5e6a3" : "rgba(201,168,76,0.25)",
                fontSize: 18, cursor: canSend ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
            >↑</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── componente principal ──────────────────────────────────────────────────────

type View = "dashboard" | "reveal" | "chat";

export default function LecturaApp() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [pendingPack, setPendingPack] = useState<string | null>(null);
  const [pendingSpread, setPendingSpread] = useState<string | null>(null);
  const [pendingCards, setPendingCards] = useState<CardInSpread[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/login"); return; }
      setAuthed(true);
      setUserId(session.user.id);
    });
  }, [navigate]);

  if (authed === null) return null;
  if (!userId) return null;

  const handleStartReading = (packId: string, spreadKey: string, cards: CardInSpread[]) => {
    setPendingPack(packId);
    setPendingSpread(spreadKey);
    setPendingCards(cards);
    setView("reveal");
  };

  const handleAllRevealed = async () => {
    if (!pendingPack || !pendingSpread || !pendingCards.length || !userId) return;

    const cardsJson = pendingCards.map(({ id, name, position, reversed }) => ({ id, name, position, reversed }));

    const { data, error } = await supabase
      .from("reading_sessions")
      .insert({
        user_id: userId,
        pack_id: pendingPack,
        spread_key: pendingSpread,
        cards_json: cardsJson,
        questions_total: 10,
        questions_used: 0,
        status: "active",
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Error creating session:", error);
      return;
    }

    await supabase.rpc("increment_pack_sessions_used", { pack_id: pendingPack });

    setActiveSession({ ...data, cards_json: pendingCards } as Session);
    setView("chat");
  };

  const handleSessionEnd = () => {
    setActiveSession(null);
    setPendingPack(null);
    setPendingSpread(null);
    setPendingCards([]);
    setView("dashboard");
  };

  const bgStyle = { minHeight: "100vh", background: `radial-gradient(ellipse at 50% 0%, #1a0d3e 0%, ${bg} 65%)`, fontFamily: sf };
  const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap'); @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`;

  if (view === "dashboard") return (
    <div style={bgStyle}><style>{fonts}</style>
      <PacksDashboard userId={userId} onStart={handleStartReading} />
    </div>
  );

  if (view === "reveal") return (
    <div style={bgStyle}><style>{`${fonts} @keyframes fadeIn { from{opacity:0} to{opacity:1} }`}</style>
      <CardReveal cards={pendingCards} onAllRevealed={handleAllRevealed} onBack={() => setView("dashboard")} />
    </div>
  );

  if (view === "chat" && activeSession) return (
    <TarotChat session={activeSession} onSessionEnd={handleSessionEnd} />
  );

  return null;
}
