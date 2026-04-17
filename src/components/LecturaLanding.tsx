import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PACK_URLS = {
  1: "https://pay.hotmart.com/R105430859J?off=osr5b44m",
  3: "https://pay.hotmart.com/R105430859J?off=ntyyhq9k",
  6: "https://pay.hotmart.com/R105430859J?off=z9ku7323",
};

const hf = "'Cormorant Garamond', Georgia, serif";
const sf = "'DM Sans', sans-serif";
const gold = "#c9a84c";
const bg = "#07050f";
const text = "#e8dcc8";
const textMuted = "rgba(232,220,200,0.6)";

function GoldBtn({ label, sub, onClick }: { label: string; sub?: string; onClick?: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        padding: "16px 24px",
        background: hover
          ? "linear-gradient(135deg,#d4b850,#b08830)"
          : "linear-gradient(135deg,#c9a84c,#a07828)",
        border: "none",
        borderRadius: 8,
        color: "#0a0612",
        fontFamily: sf,
        fontWeight: 700,
        fontSize: 15,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        boxShadow: hover ? "0 6px 36px rgba(201,168,76,0.5)" : "0 4px 24px rgba(201,168,76,0.3)",
        transition: "all 0.2s",
      }}
    >
      <span>{label}</span>
      {sub && <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.75 }}>{sub}</span>}
    </button>
  );
}

interface PackCardProps {
  title: string;
  sessions: number;
  questions: number;
  price: string;
  priceNote?: string;
  highlight?: boolean;
  packKey: keyof typeof PACK_URLS;
}

function PackCard({ title, sessions, questions, price, priceNote, highlight, packKey }: PackCardProps) {
  return (
    <div style={{
      flex: "1 1 240px",
      maxWidth: 300,
      padding: "28px 24px",
      background: highlight ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${highlight ? "rgba(201,168,76,0.45)" : "rgba(201,168,76,0.15)"}`,
      borderRadius: 16,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      position: "relative",
    }}>
      {highlight && (
        <div style={{
          position: "absolute",
          top: -12,
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg,#c9a84c,#a07828)",
          color: "#0a0612",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          padding: "4px 14px",
          borderRadius: 20,
          whiteSpace: "nowrap",
        }}>
          Más popular
        </div>
      )}

      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: hf, fontSize: 22, color: "#f5e6a3", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 36, fontWeight: 700, color: gold, fontFamily: sf }}>{price}</div>
        {priceNote && <div style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>{priceNote}</div>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          `${sessions} lectura${sessions > 1 ? "s" : ""} de tarot`,
          `${questions} preguntas por lectura`,
          "Luna, tu tarotista personal",
          "Cartas del mazo Rider-Waite",
          "Acceso inmediato",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: text }}>
            <span style={{ color: gold, flexShrink: 0, marginTop: 1 }}>✦</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <GoldBtn
        label="Comprar ahora"
        sub={`${sessions} lectura${sessions > 1 ? "s" : ""}`}
        onClick={() => window.open(PACK_URLS[packKey], "_blank")}
      />
    </div>
  );
}

export default function LecturaLanding() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 50% -10%, #1a0d3e 0%, ${bg} 60%)`,
      fontFamily: sf,
      color: text,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 4px 24px rgba(201,168,76,0.3); } 50% { box-shadow: 0 4px 40px rgba(201,168,76,0.55); } }
      `}</style>

      {/* Nav */}
      <nav style={{
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(201,168,76,0.08)",
      }}>
        <div style={{ fontFamily: hf, fontSize: 18, color: "#f5e6a3", letterSpacing: 1 }}>
          Visión Tarot
        </div>
        <button
          onClick={() => navigate("/login")}
          style={{
            background: "none",
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: 6,
            padding: "7px 16px",
            color: gold,
            fontSize: 12,
            cursor: "pointer",
            fontFamily: sf,
            letterSpacing: 1,
          }}
        >
          Iniciar sesión
        </button>
      </nav>

      {/* Hero */}
      <section style={{
        textAlign: "center",
        padding: "72px 24px 56px",
        maxWidth: 720,
        margin: "0 auto",
        animation: "fadeUp 0.5s ease both",
      }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>🔮</div>
        <h1 style={{
          fontFamily: hf,
          fontSize: "clamp(34px, 6vw, 52px)",
          fontWeight: 600,
          color: "#f5e6a3",
          margin: "0 0 20px",
          lineHeight: 1.2,
          letterSpacing: 1,
        }}>
          Tu lectura de tarot personalizada con Luna
        </h1>
        <p style={{ fontSize: 17, color: textMuted, lineHeight: 1.7, margin: "0 0 32px" }}>
          Tirá las cartas, recibí una interpretación profunda y preguntá todo lo que necesitás saber. Luna te acompaña en cada lectura.
        </p>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {["78 cartas Rider-Waite", "Luna, tu tarotista", "Respuestas al instante"].map((tag, i) => (
            <span key={i} style={{
              padding: "5px 14px",
              borderRadius: 20,
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.2)",
              fontSize: 12,
              color: gold,
              letterSpacing: 0.5,
            }}>
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section style={{ padding: "0 24px 64px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: hf,
          fontSize: 26,
          color: "#f5e6a3",
          textAlign: "center",
          marginBottom: 32,
          fontWeight: 600,
        }}>
          ¿Cómo funciona?
        </h2>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { n: "1", title: "Comprá un pack", desc: "Elegí cuántas lecturas querés" },
            { n: "2", title: "Tirá las cartas", desc: "Elegí un spread y revelá cada carta" },
            { n: "3", title: "Consultá a Luna", desc: "Luna lee tus cartas y responde tus preguntas" },
          ].map((step) => (
            <div key={step.n} style={{
              flex: "1 1 180px",
              maxWidth: 220,
              textAlign: "center",
              padding: "24px 16px",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: hf, fontSize: 20, color: gold,
                margin: "0 auto 14px",
              }}>
                {step.n}
              </div>
              <div style={{ fontFamily: hf, fontSize: 17, color: "#f5e6a3", marginBottom: 6 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: textMuted, lineHeight: 1.5 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Packs */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: hf,
          fontSize: 30,
          color: "#f5e6a3",
          textAlign: "center",
          marginBottom: 8,
          fontWeight: 600,
        }}>
          Elegí tu pack
        </h2>
        <p style={{ textAlign: "center", color: textMuted, fontSize: 14, marginBottom: 16 }}>
          Sin suscripción. Usás tus lecturas cuando querés, sin vencimiento.
        </p>
        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(232,220,200,0.3)", marginBottom: 36 }}>
          Al ser un servicio digital de acceso inmediato, no se aceptan reembolsos una vez iniciada la lectura.
        </p>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <PackCard
            packKey={1}
            title="Esencial"
            sessions={1}
            questions={10}
            price="$5 USD"
            priceNote="pago único"
          />
          <PackCard
            packKey={3}
            title="Profunda"
            sessions={3}
            questions={10}
            price="$12 USD"
            priceNote="pago único"
            highlight
          />
          <PackCard
            packKey={6}
            title="Completa"
            sessions={6}
            questions={12}
            price="$20 USD"
            priceNote="pago único"
          />
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(201,168,76,0.08)",
        padding: "24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        <div style={{ fontFamily: hf, fontSize: 16, color: "#f5e6a3" }}>Visión Tarot</div>
        <div style={{ fontSize: 11, color: "rgba(232,220,200,0.3)", letterSpacing: 1 }}>
          © 2025 · Todos los derechos reservados
        </div>
        <button
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", color: "rgba(201,168,76,0.4)", fontSize: 11, cursor: "pointer", marginTop: 4 }}
        >
          Ver el curso completo →
        </button>
      </footer>
    </div>
  );
}
