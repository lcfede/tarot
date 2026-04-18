import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PURCHASE_URL = "https://pay.hotmart.com/X105246915J";

// ── Tarot card decoration ──────────────────────────────────────────────────
function CardDeco({ img, name, roman, rotate = 0, mt = 0, opacity = 1 }: {
  img: string; name: string; roman: string; rotate?: number; mt?: number; opacity?: number;
}) {
  return (
    <div style={{
      transform: `rotate(${rotate}deg)`,
      marginTop: mt,
      opacity,
      flexShrink: 0,
      width: 90,
      filter: "drop-shadow(0 8px 20px rgba(100,60,200,0.4))",
    }}>
      <div style={{
        background: "linear-gradient(160deg,#1a1040,#0c0820)",
        border: "1.5px solid rgba(201,168,76,0.6)",
        borderRadius: 7,
        padding: "5px 4px 4px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 8, color: "#c9a84c", letterSpacing: 1 }}>{roman}</div>
        <img src={img} alt={name} style={{ width: "100%", borderRadius: 4, display: "block" }} />
        <div style={{ fontFamily: "Georgia,serif", fontSize: 6, color: "#c9a84c", letterSpacing: 1.5, textAlign: "center", textTransform: "uppercase" }}>{name}</div>
      </div>
    </div>
  );
}

// ── Cards strip ─────────────────────────────────────────────────────────────
function CardsStrip({ cards }: { cards: Array<{ img: string; name: string; roman: string; rotate: number; mt?: number; opacity?: number }> }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", padding: "28px 0 0", overflow: "hidden" }}>
      {cards.map(c => <CardDeco key={c.name} {...c} />)}
    </div>
  );
}

// ── Gold button ─────────────────────────────────────────────────────────────
function BtnGold({ label, sub, onClick }: { label: string; sub?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="l2-btn-gold">
      <span style={{ display: "block" }}>{label}</span>
      {sub && <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.75, marginTop: 2 }}>{sub}</span>}
    </button>
  );
}

// ── Platform mockup ─────────────────────────────────────────────────────────
function PlatformMockup() {
  return (
    <div style={{
      background: "#0d0b1f",
      border: "1px solid rgba(201,168,76,0.3)",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 8px 40px rgba(100,60,200,0.25)",
      width: "100%",
      maxWidth: 380,
    }}>
      {/* Browser bar */}
      <div style={{ background: "#130f28", padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57","#ffbd2e","#28c840"].map(c => <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "block" }} />)}
        </div>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "3px 10px", fontSize: 10, color: "#9080a8", textAlign: "center", maxWidth: 180, margin: "0 auto" }}>
          visiontarot.com/curso
        </div>
      </div>
      {/* Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", alignItems: "start" }}>
        {/* Sidebar */}
        <div style={{ background: "#090718", borderRight: "1px solid rgba(201,168,76,0.1)", padding: "10px 8px" }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 9, color: "#c9a84c", marginBottom: 10, letterSpacing: 1 }}>✦ VisionTarot</div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 8 }}>
            <div style={{ width: "42%", height: "100%", background: "linear-gradient(90deg,#c9a84c,#e4c76b)", borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 8, color: "#c9a84c", marginBottom: 8, opacity: 0.6 }}>42% completado</div>
          {[
            { l: "Intro al Tarot", done: true },
            { l: "Arcanos May. I", done: true },
            { l: "Arcanos May. II", active: true },
            { l: "Palo de Copas", done: false },
          ].map(({ l, done, active }) => (
            <div key={l} style={{
              fontSize: 9, padding: "4px 6px", borderRadius: 4, marginBottom: 2,
              background: active ? "rgba(201,168,76,0.12)" : "transparent",
              borderLeft: active ? "2px solid #c9a84c" : "2px solid transparent",
              color: active ? "#c9a84c" : done ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.2)",
            }}>
              {done ? "✓ " : ""}{l}
            </div>
          ))}
          <div style={{ fontSize: 9, color: "#c4a0ff", marginTop: 8, padding: "4px 6px" }}>🔮 Tutor IA</div>
        </div>
        {/* Main */}
        <div style={{ padding: "10px 12px" }}>
          <div style={{ fontSize: 8, color: "#9080a8", marginBottom: 6, opacity: 0.6 }}>Módulo 3 · Lección 2</div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <img src="/cards/major/03_empress.jpg" alt="La Emperatriz"
              style={{ width: 52, height: "auto", borderRadius: 4, border: "1px solid rgba(201,168,76,0.4)", flexShrink: 0, alignSelf: "flex-start" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 11, color: "#ffffff", marginBottom: 2 }}>La Emperatriz</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                {["Abundancia","Fertilidad"].map(k => (
                  <span key={k} style={{ fontSize: 7, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", color: "#c9a84c", padding: "1px 5px", borderRadius: 20 }}>{k}</span>
                ))}
              </div>
              {[100,100,85,70].map((w,i) => (
                <div key={i} style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.07)", marginBottom: 4, width: `${w}%` }} />
              ))}
              <div style={{ marginTop: 6 }}>
                <span style={{ display: "inline-block", background: "linear-gradient(135deg,#c9a84c,#a07828)", padding: "3px 10px", borderRadius: 4, fontSize: 8, color: "#0a0612", fontWeight: 700 }}>Continuar →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Chat / Tutor IA mockup ──────────────────────────────────────────────────
function ChatMockup() {
  return (
    <div style={{
      background: "#090718",
      border: "1px solid rgba(123,94,167,0.4)",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 8px 40px rgba(100,60,200,0.2)",
      width: "100%",
      maxWidth: 380,
    }}>
      {/* Header */}
      <div style={{ background: "rgba(123,94,167,0.2)", padding: "10px 14px", borderBottom: "1px solid rgba(123,94,167,0.3)", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔮</div>
        <div>
          <div style={{ fontSize: 11, color: "#c9a84c", fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>Tutor IA VisionTarot</div>
          <div style={{ fontSize: 9, color: "#c4a0ff" }}>● En línea · Responde al instante</div>
        </div>
      </div>
      {/* Messages */}
      <div style={{ padding: "12px 12px 8px", display: "flex", flexDirection: "column", gap: 8 }}>
        {/* User */}
        <div style={{ padding: "8px 10px", borderRadius: "8px 0 8px 8px", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)", maxWidth: "88%", alignSelf: "flex-end" }}>
          <div style={{ fontSize: 11, color: "#e4c76b", lineHeight: 1.5 }}>¿Qué significa El Sol en una tirada de amor?</div>
        </div>
        {/* AI response */}
        <div style={{ padding: "8px 10px", borderRadius: "0 8px 8px 8px", background: "rgba(123,94,167,0.15)", border: "1px solid rgba(123,94,167,0.25)", maxWidth: "88%" }}>
          <div style={{ fontSize: 10, color: "#c4a0ff", fontWeight: 700, marginBottom: 3 }}>Tutor IA</div>
          <div style={{ fontSize: 11, color: "#e8e0d0", lineHeight: 1.5 }}>El Sol en amor indica una relación llena de alegría y vitalidad. Sugiere claridad, felicidad compartida y una conexión auténtica. ☀️</div>
        </div>
      </div>
      {/* Input */}
      <div style={{ padding: "8px 12px", borderTop: "1px solid rgba(123,94,167,0.2)" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(123,94,167,0.25)", borderRadius: 20, padding: "7px 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", flex: 1 }}>Escribe tu pregunta sobre tarot...</span>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#c9a84c,#e4c76b)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="#1a1200"><path d="M2 14l12-6L2 2v4l8 2-8 2v4z"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function Landing2() {
  const navigate = useNavigate();
  const buyNow = () => window.open(PURCHASE_URL, "_blank");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "¿Necesito experiencia previa o algún don especial?", a: "No. El curso está diseñado desde cero. No necesitas haber tocado una baraja en tu vida. El Método P.I.C.A. te enseña a leer las cartas con lógica, no con intuición mística. Si sabes leer, puedes aprender tarot." },
    { q: "¿Cuánto tiempo necesito? Estoy muy ocupada.", a: "Las lecciones duran entre 5 y 15 minutos. Puedes avanzar desde el móvil en el bus, en el descanso del trabajo, donde sea. En la semana 1 ya sabrás leer tu primera tirada simple." },
    { q: "¿Realmente puedo ganar $500 al mes leyendo cartas?", a: "Sí — y la Guía de Monetización te explica exactamente cómo. Son $25-30 por lectura. Necesitas 17-20 lecturas al mes para llegar a $500. No es magia, es un sistema. La guía te da las plantillas y el plan día a día." },
    { q: "¿Y si compro y no me gusta? ¿Pierdo el dinero?", a: "No. Tienes 7 días de garantía completa de Hotmart. Si en ese tiempo sientes que no es para ti, pides el reembolso y te devolvemos el 100%. Sin formularios raros, sin preguntas." },
    { q: "¿Puedo aprender desde el móvil?", a: "Sí. La plataforma está optimizada para móvil. El 70% de nuestras alumnas aprenden desde el teléfono. Solo necesitas conexión a internet — sin apps, sin descargas." },
    { q: "¿Hay más información gratuita en YouTube? ¿Por qué pagar?", a: "Sí, hay información en YouTube — desorganizada, contradictoria y sin ningún sistema. VisionTarot es un método estructurado con las 78 cartas en orden, ejercicios prácticos, Tutor IA 24/7 y una guía para monetizar." },
  ];

  const heroCards = [
    { img: "/cards/major/00_fool.jpg",           name: "El Loco",        roman: "0",    rotate: -4, mt: 12 },
    { img: "/cards/major/02_high_priestess.jpg", name: "La Sacerdotisa", roman: "II",   rotate: 2,  mt: 0  },
    { img: "/cards/major/19_sun.jpg",            name: "El Sol",         roman: "XIX",  rotate: -1, mt: -8 },
    { img: "/cards/major/17_star.jpg",           name: "La Estrella",    roman: "XVII", rotate: 3,  mt: 16 },
    { img: "/cards/major/18_moon.jpg",           name: "La Luna",        roman: "XVIII",rotate: -2, mt: 8  },
  ];

  const socialCards = [
    { img: "/cards/major/01_magician.jpg",       name: "El Mago",        roman: "I",    rotate: -3, mt: 8  },
    { img: "/cards/major/17_star.jpg",           name: "La Estrella",    roman: "XVII", rotate: 2,  mt: 0  },
    { img: "/cards/major/00_fool.jpg",           name: "El Loco",        roman: "0",    rotate: -1, mt: 12 },
    { img: "/cards/major/02_high_priestess.jpg", name: "La Sacerdotisa", roman: "II",   rotate: 4,  mt: 4  },
  ];

  const finalCards = [
    { img: "/cards/major/09_hermit.jpg",  name: "El Ermitaño", roman: "IX",   rotate: -5, mt: 0, opacity: 0.75 },
    { img: "/cards/major/19_sun.jpg",     name: "El Sol",      roman: "XIX",  rotate: 2,  mt: 0, opacity: 0.9  },
    { img: "/cards/major/17_star.jpg",    name: "La Estrella", roman: "XVII", rotate: -2, mt: 8, opacity: 0.8  },
  ];

  return (
    <div style={{ fontFamily: "'Lato',sans-serif", background: "#0a0a1a", color: "#e8e0d0", lineHeight: 1.7, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        /* ── Button ── */
        .l2-btn-gold {
          width: 100%;
          background: linear-gradient(135deg,#c9a84c,#e4c76b);
          color: #1a1200;
          font-weight: 700;
          font-size: 15px;
          padding: 15px 28px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-family: 'Lato',sans-serif;
          letter-spacing: .3px;
          transition: transform .2s, box-shadow .2s;
        }
        .l2-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(201,168,76,.4); }

        /* ── Eyebrow ── */
        .l2-eyebrow {
          display: inline-block;
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #c9a84c;
          border: 1px solid rgba(201,168,76,0.22);
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 14px;
        }

        /* ── Section base (mobile) ── */
        .l2-section { padding: 52px 20px; border-bottom: 1px solid rgba(201,168,76,0.14); }
        .l2-container { max-width: 860px; margin: 0 auto; }
        .l2-serif { font-family: 'Playfair Display',serif; }
        .l2-h2 { font-family: 'Playfair Display',serif; font-size: clamp(22px,5vw,30px); color: #fff; margin-bottom: 8px; line-height: 1.25; }
        .l2-sub { font-size: 14px; color: #9080a8; line-height: 1.65; }

        /* ── Pillars (mobile: stacked cards, desktop: 3-col grid) ── */
        .l2-pillars-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .l2-pillar-wrap {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(201,168,76,0.18);
          border-radius: 14px;
          overflow: hidden;
        }
        .l2-pillar-num {
          background: rgba(201,168,76,0.1);
          border-bottom: 1px solid rgba(201,168,76,0.18);
          padding: 10px 18px;
          font-family: 'Playfair Display',serif;
          font-size: 12px;
          color: #c9a84c;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        /* Mobile: mockup between header and bullets */
        .l2-pillar-mockup {
          padding: 16px 16px 0;
          border-bottom: 1px solid rgba(201,168,76,0.08);
        }
        .l2-pillar-mockup-img {
          width: 100%;
          max-width: 280px;
          display: block;
          margin: 0 auto;
          border-radius: 10px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        }
        .l2-pillar-body { padding: 18px; }
        .l2-bullet {
          font-size: 13px; color: #e8e0d0;
          display: flex; gap: 8px; align-items: flex-start;
          margin-bottom: 6px;
        }
        .l2-bullet::before { content:'✓'; color:#c9a84c; font-weight:700; flex-shrink:0; margin-top:2px; }

        /* ── FAQ ── */
        .l2-faq-btn {
          width: 100%; text-align: left;
          padding: 16px 0; background: none; border: none; cursor: pointer;
          display: flex; justify-content: space-between; align-items: center; gap: 12px;
          font-family: 'Lato',sans-serif; font-size: 14px; color: #e8e0d0; font-weight: 700;
          border-bottom: 1px solid rgba(201,168,76,0.1);
        }

        /* ── Pain item ── */
        .l2-pain {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px; padding: 12px 14px; font-size: 13px; color: #e8e0d0;
          margin-bottom: 10px; line-height: 1.55;
        }
        .l2-pain.econ { border-color: rgba(201,168,76,0.28); background: rgba(201,168,76,0.06); }
        .l2-dot { width: 6px; height: 6px; border-radius: 50%; background: #c9a84c; flex-shrink: 0; margin-top: 6px; }

        /* ── Transform ── */
        .l2-transform { display: flex; flex-direction: column; gap: 16px; }
        .l2-transform-col { border-radius: 10px; overflow: hidden; }

        /* ── Fixed header ── */
        .l2-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background: rgba(10,10,26,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(201,168,76,0.12);
        }
        .l2-btn-login {
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #c9a84c;
          background: none;
          border: 1px solid rgba(201,168,76,0.35);
          border-radius: 4px;
          padding: 7px 16px;
          cursor: pointer;
          transition: background .2s, border-color .2s;
          white-space: nowrap;
        }
        .l2-btn-login:hover {
          background: rgba(201,168,76,0.1);
          border-color: rgba(201,168,76,0.6);
        }

        /* ── Cards strip: hidden on mobile ── */
        .l2-cards-desktop { display: none; }

        /* ── Steps ── */
        .l2-steps { display: flex; flex-direction: column; gap: 24px; }
        .l2-step { display: flex; gap: 16px; align-items: flex-start; text-align: left; }
        .l2-step-n {
          width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
          border: 2px solid #c9a84c; background: rgba(201,168,76,0.1);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display',serif; font-size: 18px; color: #c9a84c; font-weight: 700;
        }

        /* ── Stat ── */
        .l2-mstat { background: rgba(255,255,255,0.03); border: 1px solid rgba(201,168,76,0.2); border-radius: 8px; padding: 18px 12px; text-align: center; }

        /* ── Testimonial ── */
        .l2-tcard {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(201,168,76,0.18);
          border-radius: 10px; padding: 20px 16px;
          display: flex; flex-direction: column; gap: 10px;
        }

        /* ── For card ── */
        .l2-for-card {
          border: 1px solid rgba(255,255,255,0.07); border-radius: 10px;
          padding: 18px; background: rgba(255,255,255,0.025); position: relative; overflow: hidden;
        }
        .l2-for-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background: linear-gradient(90deg,transparent,#c9a84c,transparent);
        }

        /* ── Offer row ── */
        .l2-offer-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
          font-size: 13px; color: #e8e0d0;
        }

        /* ── DESKTOP (≥ 700px) ── */
        @media (min-width: 700px) {
          .l2-cards-desktop { display: flex; }
          .l2-btn-gold { width: auto; font-size: 16px; padding: 16px 44px; }
          .l2-section { padding: 70px 24px; }
          .l2-transform { flex-direction: row; align-items: stretch; }
          .l2-steps { flex-direction: row; justify-content: center; gap: 0; }
          .l2-step { flex-direction: column; align-items: center; text-align: center; flex: 1; padding: 0 20px; max-width: 240px; }
          .l2-step-n { margin-bottom: 12px; }
          .l2-tgrid { grid-template-columns: repeat(3,1fr) !important; }
          .l2-for-grid { grid-template-columns: repeat(3,1fr) !important; }
          .l2-mstats { grid-template-columns: repeat(4,1fr) !important; }
        }
        @media (min-width: 860px) {
          .l2-pillars-grid { flex-direction: row; align-items: stretch; gap: 18px; }
          .l2-pillar-wrap { flex: 1; display: flex; flex-direction: column; }
          /* mockup on top in desktop card layout */
          .l2-pillar-mockup {
            padding: 16px;
            border-bottom: 1px solid rgba(201,168,76,0.1);
            display: flex;
            align-items: flex-start;
            justify-content: center;
            min-height: 200px;
            background: rgba(0,0,0,0.15);
          }
          .l2-pillar-body { flex: 1; }
          .l2-pillar-mockup-img { max-width: 180px; }
        }
      `}</style>

      {/* ── Fixed header ── */}
      <header className="l2-header">
        <div className="l2-serif" style={{ fontSize: 17, color: "#c9a84c", fontWeight: 700, letterSpacing: 0.5 }}>
          ✦ VisionTarot
        </div>
        <button className="l2-btn-login" onClick={() => navigate("/login")}>
          ¿Ya tienes cuenta? Ingresar →
        </button>
      </header>

      {/* ════════════════════════════════════════
          1. HERO
      ════════════════════════════════════════ */}
      <section style={{
        background: "radial-gradient(ellipse at 50% -10%,#231050 0%,#0a0a1a 65%)",
        padding: "100px 20px 0",
        textAlign: "center",
        borderBottom: "1px solid rgba(201,168,76,0.18)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div className="l2-container">
          <div style={{ fontSize: 12, color: "#9080a8", marginBottom: 18 }}>
            <span style={{ color: "#c9a84c", letterSpacing: 2 }}>★★★★★</span>{" "}
            <strong style={{ color: "#c9a84c" }}>4.9/5</strong> · Valorado por alumnas en LATAM y España
          </div>

          <div className="l2-eyebrow">Plataforma interactiva de tarot</div>

          <h1 className="l2-serif" style={{ fontSize: "clamp(26px,6vw,48px)", lineHeight: 1.18, color: "#fff", marginBottom: 16, fontWeight: 700 }}>
            De cero a tarotista profesional —<br />
            y <span style={{ color: "#c9a84c" }}>gana tus primeros $500/mes</span><br />
            desde el móvil
          </h1>

          <p className="l2-sub" style={{ maxWidth: 520, margin: "0 auto 20px" }}>
            Para quienes quieren aprender tarot desde cero o monetizar lo que ya saben — sin cursos caros ni conocimientos previos
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
            {["📱 Plataforma interactiva","📖 2 Guías PDF","🤖 Tutor IA 24/7"].map(p => (
              <div key={p} style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.22)", color: "#c9a84c", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 20 }}>{p}</div>
            ))}
          </div>

          <div style={{ maxWidth: 400, margin: "0 auto 8px" }}>
            <BtnGold label="Quiero empezar ahora →" sub="Acceso completo · $19.99 · Pago único" onClick={buyNow} />
          </div>
          <div style={{ fontSize: 11, color: "#9080a8", marginBottom: 40 }}>
            ⏳ Precio de lanzamiento — primeros 100 accesos
          </div>

          {/* Hero image */}
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <img
              src="/images/landing_hero_mockup.png"
              alt="Plataforma VisionTarot con los 2 ebooks"
              style={{ width: "100%", borderRadius: "12px 12px 0 0", display: "block", boxShadow: "0 0 80px rgba(100,60,200,0.3)" }}
            />
          </div>
        </div>

        {/* Cards strip below hero image — desktop only */}
        <div className="l2-cards-desktop l2-container" style={{ justifyContent:"center", gap:12, flexWrap:"wrap", padding:"28px 0 0", overflow:"hidden" }}>
          {heroCards.map(c => <CardDeco key={c.name} {...c} />)}
        </div>
      </section>

      {/* ════════════════════════════════════════
          2. PARA QUIÉN
      ════════════════════════════════════════ */}
      <section className="l2-section" style={{ background: "#060614" }}>
        <div className="l2-container">
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div className="l2-eyebrow">Este curso es para ti si...</div>
            <h2 className="l2-h2">¿Te identificas con alguna de estas situaciones?</h2>
            <p className="l2-sub">Si alguna resuena contigo, sigue leyendo.</p>
          </div>
          <div className="l2-for-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <div className="l2-for-card">
              <div className="l2-serif" style={{ fontSize: 15, color: "#fff", marginBottom: 6 }}>Llevas tiempo intrigada con el tarot</div>
              <div className="l2-sub">Tienes una baraja guardada o llevas meses pensando en aprender. Quieres un método claro, visual y paso a paso — sin depender de "el don".</div>
            </div>
            <div className="l2-for-card">
              <div className="l2-serif" style={{ fontSize: 15, color: "#fff", marginBottom: 6 }}>Necesitas un ingreso extra desde casa</div>
              <div className="l2-sub">El tarot te interesa como una forma real de ganar dinero desde el móvil. Necesitas algo accesible, con un sistema claro y resultados en semanas.</div>
            </div>
            <div className="l2-for-card">
              <div className="l2-serif" style={{ fontSize: 15, color: "#fff", marginBottom: 6 }}>Ya sabes de tarot pero no estás cobrando</div>
              <div className="l2-sub">Haces lecturas gratis a conocidos pero nunca diste el paso de cobrar. Te falta la parte de negocio: precio, clientes y presentación profesional.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          3. MERCADO
      ════════════════════════════════════════ */}
      <section className="l2-section" style={{ background: "#0a0a1a", textAlign: "center" }}>
        <div className="l2-container">
          <div className="l2-eyebrow">El contexto que nadie te cuenta</div>
          <h2 className="l2-h2">El mercado del tarot no para de crecer</h2>
          <p className="l2-sub" style={{ maxWidth: 460, margin: "0 auto 28px" }}>Y la mayoría de la demanda todavía no tiene quién se la cubra. Esa es tu ventana.</p>
          <div className="l2-mstats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 620, margin: "0 auto 20px" }}>
            {[["$1,300M","Mercado global de tarot en 2024"],["800%","Crecimiento en búsquedas los últimos 5 años"],["61%","Millennials practica algún tipo de espiritualidad"],["+2B","Visualizaciones de tarot en TikTok al año"]].map(([n,d]) => (
              <div key={n} className="l2-mstat">
                <strong style={{ display:"block", fontFamily:"'Playfair Display',serif", fontSize: 26, color:"#c9a84c", marginBottom:4 }}>{n}</strong>
                <span style={{ fontSize:11, color:"#9080a8" }}>{d}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize:12, color:"#9080a8", fontStyle:"italic" }}>Hay audiencia. Hay dinero. Hay demanda. Lo que hace falta eres tú.</p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          4. DOLOR
      ════════════════════════════════════════ */}
      <section className="l2-section" style={{ background: "#10102a" }}>
        <div className="l2-container">
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2 className="l2-h2">¿Te suena alguna de estas situaciones?</h2>
            <p className="l2-sub">Si dices sí a una sola, sigue leyendo.</p>
          </div>
          <div style={{ maxWidth: 580, margin: "0 auto" }}>
            <div className="l2-pain econ"><div className="l2-dot"/><div>"No me alcanza el sueldo y necesito un ingreso extra desde casa, pero siento que no tengo ninguna habilidad que alguien pagaría."</div></div>
            <div className="l2-pain"><div className="l2-dot"/><div>"Me compré una baraja hace meses pero la tengo guardada porque no sé por dónde empezar."</div></div>
            <div className="l2-pain"><div className="l2-dot"/><div>"He intentado memorizar las 78 cartas y es imposible — me frustro y abandono."</div></div>
            <div className="l2-pain"><div className="l2-dot"/><div>"Hago lecturas a mis conocidos gratis, pero no me atrevo a cobrar porque siento que no soy suficientemente profesional."</div></div>
            <div className="l2-pain"><div className="l2-dot"/><div>"He visto cursos de tarot que cuestan $200 o más. No puedo permitirme eso sin saber si realmente funciona."</div></div>
          </div>
          <p style={{ textAlign:"center", marginTop:24, fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:16, color:"#c9a84c" }}>
            Si dijiste sí a alguna — esta plataforma fue hecha para ti.
          </p>

          {/* Decorative cards */}
          <div style={{ display:"flex", justifyContent:"center", gap:12, marginTop:28, overflow:"hidden" }}>
            <CardDeco img="/cards/major/10_wheel.jpg" name="Rueda Fortuna" roman="X" rotate={-3} mt={0} opacity={0.7} />
            <CardDeco img="/cards/major/08_strength.jpg" name="La Fuerza" roman="VIII" rotate={2} mt={-8} opacity={0.8} />
            <CardDeco img="/cards/major/18_moon.jpg" name="La Luna" roman="XVIII" rotate={-1} mt={8} opacity={0.7} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          5. TRANSFORMACIÓN
      ════════════════════════════════════════ */}
      <section className="l2-section" style={{ background: "#060614" }}>
        <div className="l2-container">
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div className="l2-eyebrow">La diferencia entre antes y después</div>
            <h2 className="l2-h2">En 4 semanas, tu realidad puede ser completamente distinta</h2>
            <p className="l2-sub">No vendemos un curso. Vendemos el resultado al otro lado.</p>
          </div>

          {/* Before/After cards visual */}
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:20, marginBottom:28 }}>
            <CardDeco img="/cards/major/18_moon.jpg" name="La Luna" roman="XVIII" rotate={-4} opacity={0.7} />
            <div style={{ color:"#c9a84c", fontSize:28, fontWeight:700 }}>→</div>
            <CardDeco img="/cards/major/19_sun.jpg" name="El Sol" roman="XIX" rotate={3} opacity={1} />
          </div>

          <div className="l2-transform">
            <div className="l2-transform-col" style={{ flex:1, border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", background:"rgba(255,255,255,0.04)", color:"#9080a8", fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase" }}>ANTES</div>
              <div style={{ padding:"14px 16px" }}>
                {[["😔","Baraja guardada que no sabes cómo usar"],["😔","Memorizar 78 cartas parece imposible"],["😔","Sin ingresos extra, dependiendo de un sueldo"],["😔","Dudas sobre cobrar por tus lecturas"]].map(([ico,t]) => (
                  <div key={t} style={{ display:"flex", gap:8, padding:"7px 8px", borderRadius:6, background:"rgba(255,255,255,0.03)", color:"#9080a8", fontSize:13, lineHeight:1.5, marginBottom:6 }}>
                    <span style={{ flexShrink:0 }}>{ico}</span><span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="l2-transform-col" style={{ flex:1, border:"1px solid rgba(201,168,76,0.35)", borderRadius:10, overflow:"hidden", background:"rgba(201,168,76,0.03)" }}>
              <div style={{ padding:"12px 16px", background:"rgba(201,168,76,0.12)", color:"#c9a84c", fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase" }}>DESPUÉS</div>
              <div style={{ padding:"14px 16px" }}>
                {[["✨","Lees tiradas completas con confianza"],["✨","Conoces las 78 cartas y sus significados"],["✨","Primeras lecturas de pago en semanas"],["✨","Un sistema claro para crecer a $500/mes"]].map(([ico,t]) => (
                  <div key={t} style={{ display:"flex", gap:8, padding:"7px 8px", borderRadius:6, background:"rgba(201,168,76,0.07)", color:"#e8e0d0", fontSize:13, lineHeight:1.5, marginBottom:6 }}>
                    <span style={{ flexShrink:0 }}>{ico}</span><span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          6. SOLUCIÓN
      ════════════════════════════════════════ */}
      <section className="l2-section" style={{ background: "#10102a", textAlign:"center" }}>
        <div className="l2-container">
          <div className="l2-eyebrow">La solución</div>
          <h2 className="l2-h2">Presentamos VisionTarot</h2>
          <p className="l2-sub" style={{ maxWidth:520, margin:"0 auto 32px" }}>
            No es un curso en vídeo. Es una plataforma interactiva + 2 guías PDF + un Tutor IA — todo para llevarte de cero a tarotista que cobra, desde el móvil.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, maxWidth:620, margin:"0 auto", textAlign:"left" }}>
            <div style={{ background:"rgba(201,168,76,0.07)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:10, padding:16 }}>
              <div style={{ fontSize:10, color:"#c9a84c", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>PLATAFORMA</div>
              {["78 cartas interactivas","31 lecciones en 10 módulos","Simulador de tiradas"].map(t => <div key={t} style={{ fontSize:12, color:"#e8e0d0", marginBottom:4 }}>✓ {t}</div>)}
            </div>
            <div style={{ background:"rgba(201,168,76,0.07)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:10, padding:16 }}>
              <div style={{ fontSize:10, color:"#c9a84c", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>2 EBOOKS PDF</div>
              {["Guía de las 78 cartas","El Negocio del Tarot","Descarga inmediata"].map(t => <div key={t} style={{ fontSize:12, color:"#e8e0d0", marginBottom:4 }}>✓ {t}</div>)}
            </div>
            <div style={{ background:"rgba(123,94,167,0.12)", border:"1px solid rgba(123,94,167,0.3)", borderRadius:10, padding:16 }}>
              <div style={{ fontSize:10, color:"#c4a0ff", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>TUTOR IA 24/7</div>
              {["Resuelve dudas al instante","Sin límite de preguntas","Disponible de noche"].map(t => <div key={t} style={{ fontSize:12, color:"#e8e0d0", marginBottom:4 }}>✓ {t}</div>)}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          7. LAS TRES HERRAMIENTAS
      ════════════════════════════════════════ */}
      <section className="l2-section" style={{ background: "#0a0a1a" }}>
        <div className="l2-container">
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div className="l2-eyebrow" style={{ display:"block", textAlign:"center" }}>¿Qué recibes exactamente?</div>
            <h2 className="l2-h2">Tres herramientas que trabajan juntas</h2>
            <p className="l2-sub" style={{ maxWidth:420, margin:"0 auto" }}>Cada una resuelve una parte del camino. Las tres juntas son el sistema completo.</p>
          </div>

          <div className="l2-pillars-grid">

          {/* PILLAR 1 – Plataforma */}
          <div className="l2-pillar-wrap">
            <div className="l2-pillar-num">
              <span style={{ width:24, height:24, borderRadius:"50%", background:"rgba(201,168,76,0.15)", border:"1px solid #c9a84c", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, flexShrink:0, fontSize:12 }}>1</span>
              <span>La Plataforma Interactiva</span>
            </div>
            <div className="l2-pillar-mockup">
              <PlatformMockup />
            </div>
            <div className="l2-pillar-body">
              <p style={{ fontSize:13, color:"#9080a8", lineHeight:1.6, marginBottom:12 }}>Aprende las 78 cartas de forma visual — no memorizando, sino interactuando. Tocas cada carta, ves su imagen y practicas tiradas reales.</p>
              <div className="l2-bullet">78 cartas con imagen, significado y palabras clave</div>
              <div className="l2-bullet">31 lecciones en 10 módulos progresivos</div>
              <div className="l2-bullet">Simulador de tiradas en tiempo real</div>
              <div className="l2-bullet">100% desde el móvil, sin descargas</div>
            </div>
          </div>

          {/* PILLAR 2 – Ebooks */}
          <div className="l2-pillar-wrap">
            <div className="l2-pillar-num">
              <span style={{ width:24, height:24, borderRadius:"50%", background:"rgba(201,168,76,0.15)", border:"1px solid #c9a84c", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, flexShrink:0, fontSize:12 }}>2</span>
              <span>Los 2 Ebooks PDF</span>
            </div>
            <div className="l2-pillar-mockup">
              <img
                src="/images/landing_ebook.png"
                alt="Ebooks VisionTarot"
                className="l2-pillar-mockup-img"
              />
            </div>
            <div className="l2-pillar-body">
              <p style={{ fontSize:13, color:"#9080a8", lineHeight:1.6, marginBottom:12 }}>Dos guías PDF que complementan la plataforma: consulta las cartas sin conexión y convierte lo que aprendes en dinero real.</p>
              <div className="l2-bullet"><strong>Guía de las 78 Cartas</strong> — referencia rápida offline</div>
              <div className="l2-bullet"><strong>El Negocio del Tarot</strong> — cómo cobrar $25-$100/lectura</div>
              <div className="l2-bullet">Descarga inmediata · Tuyas de por vida</div>
            </div>
          </div>

          {/* PILLAR 3 – Tutor IA */}
          <div className="l2-pillar-wrap">
            <div className="l2-pillar-num" style={{ background:"rgba(123,94,167,0.15)", borderBottom:"1px solid rgba(123,94,167,0.25)" }}>
              <span style={{ width:24, height:24, borderRadius:"50%", background:"rgba(123,94,167,0.2)", border:"1px solid #c4a0ff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, flexShrink:0, fontSize:12, color:"#c4a0ff" }}>3</span>
              <span style={{ color:"#c4a0ff" }}>Tutor IA 24/7</span>
            </div>
            <div className="l2-pillar-mockup" style={{ background:"rgba(123,94,167,0.05)" }}>
              <ChatMockup />
            </div>
            <div className="l2-pillar-body">
              <p style={{ fontSize:13, color:"#9080a8", lineHeight:1.6, marginBottom:12 }}>Un chatbot especializado que responde tus dudas sobre cualquier carta, tirada o monetización. Disponible a las 3 de la mañana.</p>
              <div className="l2-bullet">Respuestas al instante — 24h, 7 días</div>
              <div className="l2-bullet">Sin límite de preguntas</div>
              <div className="l2-bullet">Adapta sus respuestas a tu nivel</div>
            </div>
          </div>

          </div>{/* end pillars-grid */}
        </div>
      </section>

      {/* ════════════════════════════════════════
          8. PRUEBA SOCIAL
      ════════════════════════════════════════ */}
      <section className="l2-section" style={{ background: "#060614" }}>
        <div className="l2-container">
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div className="l2-eyebrow" style={{ display:"block", textAlign:"center" }}>Lo que dicen las que ya empezaron</div>
            <h2 className="l2-h2">Resultados reales, personas reales</h2>
          </div>
          <div className="l2-tgrid" style={{ display:"grid", gridTemplateColumns:"1fr", gap:14, marginBottom:32 }}>
            {[
              { t:'"Llevaba 2 años con la baraja guardada en un cajón. En la primera semana ya hice mi primera tirada completa. El método P.I.C.A. lo cambia todo."', a:"— María G., México 🇲🇽" },
              { t:'"No creía que pudiera cobrar por leer cartas. Hice mi primera lectura de pago a la semana de empezar. €25 que no esperaba. La guía de monetización es oro."', a:"— Carmen R., España 🇪🇸" },
              { t:'"El Tutor IA es lo mejor. Le pregunto a las 11 de la noche sobre una carta y me responde al instante. Nunca me sentí sola en el proceso."', a:"— Valeria M., Colombia 🇨🇴" },
            ].map(({ t, a }) => (
              <div key={a} className="l2-tcard">
                <div style={{ color:"#c9a84c", letterSpacing:2 }}>★★★★★</div>
                <div style={{ fontSize:13, color:"#e8e0d0", fontStyle:"italic", lineHeight:1.65 }}>{t}</div>
                <div style={{ fontSize:12, color:"#9080a8", fontWeight:700 }}>{a}</div>
              </div>
            ))}
          </div>
          {/* Cards strip — desktop only */}
          <div className="l2-cards-desktop" style={{ justifyContent:"center", gap:12, flexWrap:"wrap", padding:"28px 0 0", overflow:"hidden" }}>
            {socialCards.map(c => <CardDeco key={c.name} {...c} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          9. OFERTA
      ════════════════════════════════════════ */}
      <section id="oferta" className="l2-section" style={{ background: "#10102a" }}>
        <div className="l2-container">
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div className="l2-eyebrow" style={{ display:"block", textAlign:"center" }}>El precio</div>
            <h2 className="l2-h2">Todo esto por menos de lo que cuesta una salida a cenar</h2>
            <p className="l2-sub">Cada componente tiene un valor real. Tú te llevas todo a precio de lanzamiento.</p>
          </div>
          <div style={{ maxWidth:520, margin:"0 auto" }}>
            {[
              ["Plataforma Interactiva VisionTarot","97€"],
              ["Guía El Negocio del Tarot","37€"],
              ["Guía de las 78 Cartas","27€"],
              ["Tutor IA Personal 24/7","47€"],
              ["Tests y Simulador de Tiradas","27€"],
            ].map(([n,v]) => (
              <div key={n} className="l2-offer-row">
                <span>{n}</span>
                <span style={{ color:"#9080a8" }}>{v}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", fontWeight:700, fontSize:14, color:"#c9a84c", borderBottom:"1px solid rgba(201,168,76,0.22)", marginBottom:28 }}>
              <span>VALOR TOTAL</span><span>235€</span>
            </div>
            <div style={{ textAlign:"center", background:"linear-gradient(135deg,rgba(45,27,78,0.5),rgba(20,12,40,0.8))", border:"1px solid rgba(201,168,76,0.25)", borderRadius:12, padding:"28px 20px" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"#9080a8", textDecoration:"line-through", opacity:.6 }}>235€</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(52px,14vw,72px)", color:"#c9a84c", fontWeight:700, lineHeight:1 }}>$19.99</div>
              <div style={{ fontSize:12, color:"#9080a8", margin:"8px 0 4px" }}>Pago único · Acceso de por vida · Sin suscripción</div>
              <div style={{ fontSize:11, color:"#c9a84c", opacity:.85, marginBottom:20 }}>⏳ Sube cuando se agoten los primeros 100 accesos</div>
              <BtnGold label="Sí, quiero empezar por $19.99 →" onClick={buyNow} />
              <div style={{ marginTop:10, fontSize:11, color:"#9080a8" }}>🔒 Pago seguro · Hotmart · Acceso inmediato</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          10. PASOS
      ════════════════════════════════════════ */}
      <section className="l2-section" style={{ background: "#0a0a1a", textAlign:"center" }}>
        <div className="l2-container">
          <h2 className="l2-h2">Tres pasos y ya estás dentro</h2>
          <p className="l2-sub" style={{ marginBottom:32 }}>Sin complicaciones. En minutos.</p>
          <div className="l2-steps" style={{ maxWidth:640, margin:"0 auto" }}>
            {[
              { n:"1", title:"Compras el acceso", desc:"Pago seguro por Hotmart. En menos de 2 minutos tienes acceso completo desde cualquier dispositivo." },
              { n:"2", title:"Empiezas cuando quieras", desc:"5-15 min al día desde el móvil. Sin horarios. En la semana 1 ya sabes leer tu primera tirada." },
              { n:"3", title:"Consigues tus primeros clientes", desc:"La Guía de Monetización te dice exactamente qué cobrar, dónde buscarlos y qué decirles." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="l2-step">
                <div className="l2-step-n">{n}</div>
                <div>
                  <div className="l2-serif" style={{ fontSize:16, color:"#fff", marginBottom:6 }}>{title}</div>
                  <div className="l2-sub">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          11. GARANTÍA
      ════════════════════════════════════════ */}
      <section className="l2-section" style={{ background:"linear-gradient(135deg,#0f0c28,#1a1040)", textAlign:"center" }}>
        <div className="l2-container" style={{ maxWidth:560 }}>
          <div style={{ fontSize:52, marginBottom:14 }}>🛡️</div>
          <h2 className="l2-h2">Garantía de 7 días sin preguntas</h2>
          <p className="l2-sub">Si en los primeros 7 días sientes que no es para ti, pedimos el reembolso a Hotmart y te devolvemos el 100%. Sin formularios extraños. Sin preguntas. Sin riesgo.</p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          12. FAQ
      ════════════════════════════════════════ */}
      <section className="l2-section" style={{ background: "#10102a" }}>
        <div className="l2-container" style={{ maxWidth:640 }}>
          <h2 className="l2-h2" style={{ textAlign:"center", marginBottom:28 }}>Preguntas frecuentes</h2>
          {faqs.map((faq, i) => (
            <div key={i}>
              <button className="l2-faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <span style={{ color:"#c9a84c", fontSize:13, flexShrink:0, transition:"transform .2s", transform: openFaq === i ? "rotate(180deg)" : "none" }}>▼</span>
              </button>
              {openFaq === i && (
                <div style={{ fontSize:13, color:"#9080a8", lineHeight:1.7, padding:"10px 0 14px" }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          13. CTA FINAL
      ════════════════════════════════════════ */}
      <section className="l2-section" style={{ background:"linear-gradient(160deg,#0a0a1a 0%,#1a0d35 50%,#0a0a1a 100%)", textAlign:"center" }}>
        <div className="l2-container" style={{ maxWidth:580 }}>
          <CardsStrip cards={finalCards} />
          <div style={{ marginTop:28 }}>
            <div className="l2-eyebrow">Tu momento es ahora</div>
            <h2 className="l2-h2">Tu baraja está esperando.<br />Tu negocio también.</h2>
            <p className="l2-sub" style={{ maxWidth:440, margin:"16px auto 24px" }}>
              Miles de mujeres en LATAM y España ya aprendieron a leer tarot y cobrar por ello. Tú puedes ser la siguiente.
            </p>
            <div style={{ maxWidth:380, margin:"0 auto 12px" }}>
              <BtnGold label="Sí, quiero empezar por $19.99 →" onClick={buyNow} />
            </div>
            <div style={{ fontSize:12, color:"#9080a8", marginBottom:20 }}>🛡️ 7 días de garantía · Acceso inmediato · Pago seguro Hotmart</div>
            <button onClick={() => navigate("/login")} style={{ background:"none", border:"none", color:"#9080a8", fontFamily:"'Lato',sans-serif", fontSize:13, cursor:"pointer", textDecoration:"underline" }}>
              Ya tengo acceso → Ingresar al curso
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:"24px 20px", textAlign:"center", borderTop:"1px solid rgba(201,168,76,0.1)" }}>
        <div className="l2-serif" style={{ fontSize:18, color:"#c9a84c", marginBottom:6 }}>VisionTarot</div>
        <div style={{ fontSize:11, color:"#9080a8" }}>© 2025 VisionTarot · Todos los derechos reservados · Procesado por Hotmart</div>
      </footer>
    </div>
  );
}
