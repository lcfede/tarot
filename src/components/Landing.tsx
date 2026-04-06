import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ⚠️ Reemplazar con la URL real de Hotmart antes de publicar
const PURCHASE_URL = "https://pay.hotmart.com/X105246915J";

const hf = "'Cormorant Garamond', Georgia, serif";
const sf = "'DM Sans', sans-serif";
const gold = "#c9a84c";
const goldLight = "#f5e6a3";
const bg = "#07050f";
const bgMid = "#100d1e";
const bgPurple = "#17103a";
const text = "#e8dcc8";
const textMuted = "rgba(232,220,200,0.6)";

function Divider() {
  return (
    <div style={{ width: 80, height: 1, background: `linear-gradient(90deg,transparent,${gold},transparent)`, margin: "0 auto" }} />
  );
}

function GoldBtn({ label, sub, onClick, large }: { label: string; sub?: string; onClick?: () => void; large?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 2,
        padding: large ? "18px 56px" : "14px 40px",
        background: hover
          ? "linear-gradient(135deg,#d4b850,#b08830)"
          : "linear-gradient(135deg,#c9a84c,#a07828)",
        border: "none",
        borderRadius: 6,
        color: "#0a0612",
        fontFamily: sf,
        fontWeight: 700,
        fontSize: large ? 18 : 15,
        cursor: "pointer",
        boxShadow: hover
          ? "0 6px 36px rgba(201,168,76,0.55)"
          : "0 4px 24px rgba(201,168,76,0.35)",
        animation: hover ? "none" : "pulseGlow 2.5s ease-in-out infinite",
        transition: "all 0.2s",
        width: "100%",
        maxWidth: large ? 480 : 360,
      }}
    >
      <span>{label}</span>
      {sub && <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.75 }}>{sub}</span>}
    </button>
  );
}

function StarRow() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 2 }}>
        {[1,2,3,4,5].map(i => (
          <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill={gold}>
            <polygon points="8,1 10,6 15,6 11,10 13,15 8,12 3,15 5,10 1,6 6,6" />
          </svg>
        ))}
      </div>
      <span style={{ fontFamily: sf, fontSize: 13, color: textMuted }}>
        +1.200 alumnas en LATAM
      </span>
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, textAlign: "left" }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1,
        background: "rgba(201,168,76,0.15)", border: `1px solid ${gold}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4l3 3 5-6" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span style={{ fontFamily: sf, fontSize: 15, color: text, lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}

function PainItem({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "14px 18px", borderRadius: 8,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>😔</span>
      <span style={{ fontFamily: sf, fontSize: 14, color: textMuted, lineHeight: 1.6 }}>{children}</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{
      padding: "24px 20px",
      borderRadius: 10,
      background: "rgba(201,168,76,0.04)",
      border: "1px solid rgba(201,168,76,0.14)",
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div style={{ fontFamily: hf, fontSize: 17, color: goldLight, fontWeight: 600 }}>{title}</div>
      <div style={{ fontFamily: sf, fontSize: 13, color: textMuted, lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", textAlign: "left", padding: "16px 0",
          background: "none", border: "none", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
        }}
      >
        <span style={{ fontFamily: sf, fontSize: 15, color: text, fontWeight: 500 }}>{q}</span>
        <span style={{ color: gold, fontSize: 18, flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </button>
      {open && (
        <div style={{ fontFamily: sf, fontSize: 14, color: textMuted, lineHeight: 1.7, paddingBottom: 16 }}>
          {a}
        </div>
      )}
    </div>
  );
}

function RevealSection({ children, purple, tight }: { children: React.ReactNode; purple?: boolean; tight?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section style={{ background: purple ? bgPurple : "transparent", padding: tight ? "48px 24px" : "72px 24px" }}>
      <div ref={ref} className="reveal" style={{ maxWidth: 760, margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const buyNow = () => window.open(PURCHASE_URL, "_blank");

  return (
    <div style={{ background: bg, color: text, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translate(-50%,-50%) translateY(0px); }
          50%       { transform: translate(-50%,-50%) translateY(-24px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 4px 24px rgba(201,168,76,0.35); }
          50%       { box-shadow: 0 4px 48px rgba(201,168,76,0.7); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.07; }
          50%       { opacity: 0.14; }
        }
        @keyframes dotPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.6); }
          50%       { box-shadow: 0 0 0 5px rgba(201,168,76,0); }
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mockupGlow {
          0%, 100% { box-shadow: 0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px rgba(201,168,76,0.04); }
          50%       { box-shadow: 0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 0 60px rgba(201,168,76,0.12); }
        }

        .hero-badge  { animation: fadeInUp 0.7s ease both; animation-delay: 0.1s; }
        .hero-title  { animation: fadeInUp 0.7s ease both; animation-delay: 0.25s; }
        .hero-sub    { animation: fadeInUp 0.7s ease both; animation-delay: 0.4s; }
        .hero-checks { animation: fadeInUp 0.7s ease both; animation-delay: 0.55s; }
        .hero-stars  { animation: fadeInUp 0.7s ease both; animation-delay: 0.65s; }
        .hero-cta    { animation: fadeInUp 0.7s ease both; animation-delay: 0.75s; }
        .hero-stats  { animation: fadeInUp 0.7s ease both; animation-delay: 0.9s; }

        .reveal {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 600px) {
          .hero-headline { font-size: 36px !important; }
          .feature-grid { grid-template-columns: 1fr !important; }
          .value-row { flex-direction: column !important; gap: 4px !important; }
          .stack-table { font-size: 13px !important; }
          .step-row { flex-direction: column !important; align-items: center !important; }
        }
      `}</style>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: "100vh",
        background: `linear-gradient(170deg,${bg} 0%,#130b28 40%,#1e1040 70%,${bgMid} 100%)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "80px 24px 64px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative stars */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle,#c9a84c 1px,transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "twinkle 4s ease-in-out infinite",
        }} />
        {/* Glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(45,27,78,0.7) 0%,transparent 70%)",
          pointerEvents: "none",
          animation: "floatY 8s ease-in-out infinite",
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 680, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>

          {/* Badge */}
          <div className="hero-badge" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 40,
            border: `1px solid rgba(201,168,76,0.3)`,
            background: "rgba(201,168,76,0.07)",
            fontFamily: sf, fontSize: 12, color: gold, letterSpacing: 1, textTransform: "uppercase",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: gold, display: "inline-block", animation: "dotPulse 2s ease-in-out infinite" }} />
            Plataforma interactiva · Acceso inmediato
          </div>

          {/* Headline */}
          <h1 className="hero-headline hero-title" style={{
            fontFamily: hf, fontSize: 52, fontWeight: 700,
            lineHeight: 1.1, margin: 0,
            color: goldLight,
          }}>
            Aprende las 78 cartas del Tarot y gana tus primeros{" "}
            <span style={{ color: gold }}>$500/mes</span>{" "}
            desde casa
          </h1>

          {/* Sub */}
          <p className="hero-sub" style={{ fontFamily: sf, fontSize: 17, color: textMuted, lineHeight: 1.7, margin: 0, maxWidth: 540 }}>
            Sin experiencia previa. Sin dones especiales. Solo un método paso a paso con práctica interactiva y Oráculo incluido — y acceso de por vida desde tu teléfono.
          </p>

          {/* Bullets */}
          <div className="hero-checks" style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 400, textAlign: "left" }}>
            <CheckItem>78 cartas Rider-Waite con imagen, significado y ejercicio</CheckItem>
            <CheckItem>31 lecciones progresivas en 10 módulos</CheckItem>
            <CheckItem>Oráculo para resolver todas tus dudas de tarot</CheckItem>
            <CheckItem>Ebook "El Negocio del Tarot" para monetizar desde el día 1</CheckItem>
          </div>

          {/* Stars */}
          <div className="hero-stars"><StarRow /></div>

          {/* CTA */}
          <div className="hero-cta" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
            <GoldBtn label="Quiero empezar ahora →" sub="Acceso inmediato por $19.99 USD · Pago único" onClick={buyNow} large />
            <div style={{ fontFamily: sf, fontSize: 12, color: textMuted }}>
              Sin mensualidades · Garantía de 7 días · Pago seguro via Hotmart
            </div>
          </div>

          {/* Stats row */}
          <div className="hero-stats" style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
            {[["78", "cartas interactivas"], ["31", "lecciones"], ["4", "tiradas de práctica"], ["IA", "tutor incluido"]].map(([n, l]) => (
              <div key={n} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: hf, fontSize: 28, color: gold, fontWeight: 700 }}>{n}</div>
                <div style={{ fontFamily: sf, fontSize: 11, color: textMuted, letterSpacing: 0.5, textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Already have access */}
          <div style={{ marginTop: 8 }}>
            <button onClick={() => navigate("/login")} style={{
              background: "none", border: "none", color: textMuted,
              fontFamily: sf, fontSize: 13, cursor: "pointer", textDecoration: "underline",
            }}>
              Ya tengo acceso → Ingresar al curso
            </button>
          </div>
        </div>
      </section>

      {/* ─── DOLOR ─── */}
      <RevealSection purple>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Divider />
          <h2 style={{ fontFamily: hf, fontSize: 36, color: goldLight, margin: "20px 0 8px" }}>
            ¿Te identificás con alguna de estas situaciones?
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <PainItem>"Me compré una baraja pero la tengo guardada porque no sé por dónde empezar."</PainItem>
          <PainItem>"Me gustaría tener un ingreso extra pero no tengo habilidades que alguien pagaría."</PainItem>
          <PainItem>"He visto tarot en TikTok e Instagram y pienso: yo podría hacer eso — pero no sé cómo."</PainItem>
          <PainItem>"He intentado memorizar las 78 cartas pero me frustro y abandono."</PainItem>
          <PainItem>"No me animo a cobrar por lecturas porque siento que no soy suficientemente buena."</PainItem>
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <p style={{ fontFamily: hf, fontSize: 22, color: gold, fontStyle: "italic" }}>
            Si dijiste sí a alguna — este curso fue hecho para vos.
          </p>
        </div>
      </RevealSection>

      {/* ─── SOLUCIÓN ─── */}
      <RevealSection>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Divider />
          <div style={{ fontFamily: sf, fontSize: 12, color: gold, letterSpacing: 3, textTransform: "uppercase", margin: "16px 0 10px" }}>
            La solución
          </div>
          <h2 style={{ fontFamily: hf, fontSize: 40, color: goldLight, margin: "0 0 14px" }}>
            Presentamos VisionTarot
          </h2>
          <p style={{ fontFamily: sf, fontSize: 16, color: textMuted, lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
            La única plataforma interactiva que te lleva de cero a tarotista profesional — con las 78 cartas, un Oráculo, tiradas de práctica y una guía completa de monetización incluida. Todo en un solo lugar, de por vida.
          </p>
        </div>

        {/* Platform mockup */}
        <div style={{ marginBottom: 40 }}>
          {/* Browser chrome */}
          <div style={{
            borderRadius: 12, overflow: "hidden",
            border: "1px solid rgba(201,168,76,0.25)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
            animation: "mockupGlow 4s ease-in-out infinite",
            background: "#0c0c16",
          }}>
            {/* Title bar */}
            <div style={{
              background: "#13111f",
              padding: "10px 16px",
              display: "flex", alignItems: "center", gap: 12,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#ff5f57","#febc2e","#28c840"].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />
                ))}
              </div>
              {/* URL bar */}
              <div style={{
                flex: 1, maxWidth: 340, margin: "0 auto",
                background: "rgba(255,255,255,0.05)", borderRadius: 6,
                padding: "4px 12px", display: "flex", alignItems: "center", gap: 6,
              }}>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="rgba(201,168,76,0.5)">
                  <path d="M8 1a5 5 0 00-5 5v1H2a1 1 0 00-1 1v6a1 1 0 001 1h12a1 1 0 001-1V8a1 1 0 00-1-1h-1V6a5 5 0 00-5-5zm3 6H5V6a3 3 0 016 0v1z"/>
                </svg>
                <span style={{ fontFamily: sf, fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 0.3 }}>
                  visiontarot.com/curso
                </span>
              </div>
            </div>

            {/* App layout */}
            <div style={{ display: "flex", height: 420 }}>

              {/* Sidebar */}
              <div style={{
                width: 220, flexShrink: 0,
                background: "#0a0814",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                display: "flex", flexDirection: "column", overflow: "hidden",
              }}>
                {/* Logo */}
                <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
                  <div style={{ fontFamily: hf, fontSize: 15, color: gold, fontWeight: 700, letterSpacing: 1 }}>✦ VisionTarot</div>
                  {/* Progress bar */}
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontFamily: sf, fontSize: 9, color: textMuted }}>Tu progreso</span>
                      <span style={{ fontFamily: sf, fontSize: 9, color: gold }}>42%</span>
                    </div>
                    <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
                      <div style={{ width: "42%", height: "100%", background: `linear-gradient(90deg,${gold},#a07828)`, borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
                {/* Modules */}
                <div style={{ flex: 1, overflowY: "hidden", padding: "8px 0" }}>
                  {[
                    { mod: "Módulo 1", label: "Introducción al Tarot", done: true },
                    { mod: "Módulo 2", label: "Arcanos Mayores I", done: true },
                    { mod: "Módulo 3", label: "Arcanos Mayores II", active: true },
                    { mod: "Módulo 4", label: "Arcanos Mayores III", done: false },
                    { mod: "Módulo 5", label: "Palo de Copas", done: false },
                    { mod: "Módulo 6", label: "Palo de Espadas", done: false },
                  ].map(({ mod, label, done, active }: { mod: string; label: string; done?: boolean; active?: boolean }) => (
                    <div key={mod} style={{
                      padding: "7px 16px",
                      background: active ? "rgba(201,168,76,0.08)" : "transparent",
                      borderLeft: active ? `2px solid ${gold}` : "2px solid transparent",
                      cursor: "pointer",
                    }}>
                      <div style={{ fontFamily: sf, fontSize: 9, color: done ? gold : active ? gold : "rgba(255,255,255,0.2)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 1 }}>
                        {done ? "✓ " : ""}{mod}
                      </div>
                      <div style={{ fontFamily: sf, fontSize: 11, color: active ? text : done ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.25)", lineHeight: 1.3 }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
                {/* AI chat button */}
                <div style={{
                  padding: "10px 16px", borderTop: "1px solid rgba(201,168,76,0.1)",
                  display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                  background: "rgba(201,168,76,0.05)",
                }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(201,168,76,0.15)", border: `1px solid rgba(201,168,76,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11 }}>🔮</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: sf, fontSize: 10, color: gold, fontWeight: 600 }}>Oráculo</div>
                    <div style={{ fontFamily: sf, fontSize: 9, color: textMuted }}>Preguntame cualquier cosa</div>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div style={{ flex: 1, overflowY: "hidden", background: "#0c0c16", display: "flex", flexDirection: "column" }}>
                {/* Lesson header */}
                <div style={{ padding: "16px 24px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontFamily: sf, fontSize: 10, color: gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Módulo 3 · Lección 2</div>
                  <div style={{ fontFamily: hf, fontSize: 20, color: goldLight, fontWeight: 600 }}>La Emperatriz</div>
                </div>

                {/* Lesson body */}
                <div style={{ flex: 1, overflowY: "hidden", padding: "16px 24px", display: "flex", gap: 20 }}>
                  {/* Card image */}
                  <div style={{ width: 90, flexShrink: 0 }}>
                    <img
                      src="/cards/major/03_empress.jpg"
                      alt="La Emperatriz"
                      style={{
                        width: "100%",
                        borderRadius: 6,
                        border: "1px solid rgba(201,168,76,0.3)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                        display: "block",
                      }}
                    />
                  </div>

                  {/* Lesson text */}
                  <div style={{ flex: 1 }}>
                    {/* Keywords */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                      {["Abundancia", "Fertilidad", "Naturaleza", "Creatividad"].map(k => (
                        <span key={k} style={{ fontFamily: sf, fontSize: 9, color: gold, padding: "2px 7px", borderRadius: 20, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>{k}</span>
                      ))}
                    </div>
                    {/* Text lines */}
                    {[100, 100, 85, 100, 70].map((w, i) => (
                      <div key={i} style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.07)", marginBottom: 6, width: `${w}%` }} />
                    ))}
                    {/* Tip box */}
                    <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 6, background: "rgba(201,168,76,0.06)", borderLeft: `3px solid ${gold}` }}>
                      <div style={{ fontFamily: sf, fontSize: 9, color: gold, fontWeight: 600, marginBottom: 4 }}>✦ Reflexión</div>
                      {[100, 90].map((w, i) => (
                        <div key={i} style={{ height: 7, borderRadius: 4, background: "rgba(201,168,76,0.15)", marginBottom: 4, width: `${w}%` }} />
                      ))}
                    </div>
                    {/* Next button */}
                    <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ padding: "6px 16px", borderRadius: 5, background: `linear-gradient(135deg,${gold},#a07828)`, display: "inline-block" }}>
                        <span style={{ fontFamily: sf, fontSize: 10, color: "#0a0612", fontWeight: 700 }}>Continuar →</span>
                      </div>
                      <span style={{ fontFamily: sf, fontSize: 9, color: textMuted }}>Lección 3 de 8</span>
                    </div>
                  </div>

                  {/* AI chat panel */}
                  <div style={{
                    width: 160, flexShrink: 0,
                    background: "#0a0814",
                    border: "1px solid rgba(201,168,76,0.1)",
                    borderRadius: 8, display: "flex", flexDirection: "column", overflow: "hidden",
                  }}>
                    <div style={{ padding: "8px 10px", borderBottom: "1px solid rgba(201,168,76,0.1)", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10 }}>🔮</span>
                      <span style={{ fontFamily: sf, fontSize: 9, color: gold, fontWeight: 600 }}>Oráculo</span>
                    </div>
                    <div style={{ flex: 1, padding: "8px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
                      {/* AI message */}
                      <div style={{ padding: "6px 8px", borderRadius: 6, background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.12)" }}>
                        {[100, 85, 70].map((w, i) => (
                          <div key={i} style={{ height: 6, borderRadius: 3, background: "rgba(201,168,76,0.2)", marginBottom: 3, width: `${w}%` }} />
                        ))}
                      </div>
                      {/* User message */}
                      <div style={{ padding: "6px 8px", borderRadius: 6, background: "rgba(255,255,255,0.04)", alignSelf: "flex-end", width: "85%" }}>
                        {[100, 60].map((w, i) => (
                          <div key={i} style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", marginBottom: 3, width: `${w}%` }} />
                        ))}
                      </div>
                      {/* AI typing */}
                      <div style={{ padding: "6px 8px", borderRadius: 6, background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.12)" }}>
                        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                          {[0,1,2].map(i => (
                            <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: gold, opacity: 0.5 + i * 0.25 }} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Input */}
                    <div style={{ padding: "6px 10px", borderTop: "1px solid rgba(201,168,76,0.1)" }}>
                      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, padding: "4px 8px", display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontFamily: sf, fontSize: 9, color: "rgba(255,255,255,0.2)", flex: 1 }}>Escribí tu pregunta...</span>
                        <svg width="10" height="10" viewBox="0 0 16 16" fill={gold} opacity={0.6}>
                          <path d="M2 14l12-6L2 2v4l8 2-8 2v4z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p style={{ fontFamily: sf, fontSize: 12, color: textMuted, textAlign: "center", marginTop: 12 }}>
            Así se ve la plataforma — accedés desde cualquier dispositivo, a tu ritmo.
          </p>
        </div>
      </RevealSection>

      {/* ─── QUÉ INCLUYE ─── */}
      <RevealSection purple tight>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Divider />
          <h2 style={{ fontFamily: hf, fontSize: 36, color: goldLight, margin: "20px 0 8px" }}>Todo lo que recibís</h2>
          <p style={{ fontFamily: sf, fontSize: 15, color: textMuted, margin: 0 }}>Un paquete completo para aprender y monetizar el tarot desde cero</p>
        </div>
        <div className="feature-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <FeatureCard icon="🃏" title="78 cartas interactivas" desc="Cada carta con imagen real Rider-Waite, significado detallado, palabras clave, significado invertido y ejercicio de reflexión." />
          <FeatureCard icon="📚" title="31 lecciones en 10 módulos" desc="Desde '¿Qué es el tarot?' hasta 'Próximos pasos para monetizar'. Progresivo y ordenado." />
          <FeatureCard icon="🔮" title="4 tiradas de práctica" desc="Sí/No, Pasado-Presente-Futuro, Cruz Simple y El Amor. Las 78 cartas se barajan en tiempo real." />
          <FeatureCard icon="🔮" title="Oráculo ilimitado" desc="Un chat con inteligencia artificial especializada en tarot. Preguntale cualquier duda y te responde al instante." />
          <FeatureCard icon="✅" title="Tests con feedback" desc="Al final de cada módulo, preguntas de opción múltiple con corrección inmediata y posibilidad de reintentar." />
          <FeatureCard icon="💼" title="Ebook El Negocio del Tarot" desc="~40 páginas con la matemática de los $500/mes, 5 canales de clientes, protocolo profesional y plantillas copy-paste." />
          <FeatureCard icon="📖" title="Ebook Las 78 Cartas" desc="PDF de referencia offline con imagen, significado e invertida de cada carta. Para imprimir o tener en el teléfono." />
          <FeatureCard icon="🏆" title="Certificado de finalización" desc="Descargable al completar el 100% del curso. Respaldo de tu aprendizaje." />
          <FeatureCard icon="♾️" title="Acceso de por vida" desc="Sin mensualidades. Pagás una vez y es tuyo para siempre. Accedés cuando quieras." />
        </div>
      </RevealSection>

      {/* ─── STACK DE VALOR + PRECIO ─── */}
      <RevealSection>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Divider />
          <h2 style={{ fontFamily: hf, fontSize: 36, color: goldLight, margin: "20px 0 8px" }}>
            Todo esto por menos de lo que cuesta una salida a cenar
          </h2>
        </div>

        {/* Stack table */}
        <div className="stack-table" style={{
          border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, overflow: "hidden",
          marginBottom: 32, fontSize: 14,
        }}>
          {[
            ["Plataforma Interactiva", "31 lecciones, 78 cartas, tiradas, tests, progreso", "$29"],
            ["Oráculo", "Chat ilimitado con IA especializada en tarot", "$19"],
            ["Ebook El Negocio del Tarot", "Guía de monetización + plantillas listas", "$14"],
            ["Ebook Las 78 Cartas", "Referencia PDF offline de todas las cartas", "$12"],
            ["Acceso de por vida", "Sin mensualidades, tuyo para siempre", "$15"],
          ].map(([name, desc, val], i) => (
            <div key={name} className="value-row" style={{
              display: "flex", gap: 12, padding: "14px 20px",
              background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
              borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none",
              alignItems: "center",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: sf, fontWeight: 600, color: text, marginBottom: 2 }}>{name}</div>
                <div style={{ fontFamily: sf, fontSize: 12, color: textMuted }}>{desc}</div>
              </div>
              <div style={{ fontFamily: hf, fontSize: 18, color: gold, fontWeight: 700, flexShrink: 0 }}>{val}</div>
            </div>
          ))}
          {/* Total */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 20px", background: "rgba(201,168,76,0.08)",
            borderTop: `1px solid rgba(201,168,76,0.2)`,
          }}>
            <div style={{ fontFamily: sf, fontWeight: 700, color: goldLight, fontSize: 15 }}>VALOR TOTAL</div>
            <div style={{ fontFamily: hf, fontSize: 24, color: gold, fontWeight: 700 }}>$89</div>
          </div>
        </div>

        {/* Price reveal */}
        <div style={{
          textAlign: "center", padding: "36px 24px", borderRadius: 12,
          background: "linear-gradient(135deg,rgba(45,27,78,0.5),rgba(20,12,40,0.8))",
          border: "1px solid rgba(201,168,76,0.25)",
        }}>
          <div style={{ fontFamily: sf, fontSize: 14, color: textMuted, marginBottom: 8 }}>
            Precio de lanzamiento — primeras 100 personas
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", marginBottom: 4 }}>
            <span style={{ fontFamily: hf, fontSize: 28, color: textMuted, textDecoration: "line-through", opacity: 0.6 }}>$89</span>
            <span style={{ fontFamily: hf, fontSize: 64, color: gold, fontWeight: 700, lineHeight: 1 }}>$19.99</span>
            <span style={{ fontFamily: sf, fontSize: 14, color: textMuted }}>USD<br />pago único</span>
          </div>
          <div style={{ fontFamily: sf, fontSize: 13, color: textMuted, marginBottom: 24 }}>
            Después del lanzamiento el precio sube a $27
          </div>
          <GoldBtn label="Quiero acceso ahora →" sub="Pago seguro · Acceso inmediato · Sin mensualidades" onClick={buyNow} large />
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🔒</span>
            <span style={{ fontFamily: sf, fontSize: 12, color: textMuted }}>Pago 100% seguro procesado por Hotmart · Aceptamos todas las tarjetas y opciones locales LATAM</span>
          </div>
        </div>
      </RevealSection>

      {/* ─── PRUEBA SOCIAL / WHO ─── */}
      <RevealSection purple tight>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Divider />
          <h2 style={{ fontFamily: hf, fontSize: 36, color: goldLight, margin: "20px 0 8px" }}>
            El mercado del tarot no para de crecer
          </h2>
          <p style={{ fontFamily: sf, fontSize: 14, color: textMuted }}>Y vos podés ser parte de él desde hoy</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
          {[
            ["$1.300M", "Tamaño del mercado global de tarot (2025)"],
            ["800%", "Crecimiento de lecturas por Zoom desde 2020"],
            ["61%", "De millennials y Gen Z usan el tarot como autoconocimiento"],
            ["+12B", "Vistas de #Tarot en TikTok"],
          ].map(([n, d]) => (
            <div key={n} style={{
              textAlign: "center", padding: "24px 16px", borderRadius: 8,
              background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.12)",
            }}>
              <div style={{ fontFamily: hf, fontSize: 36, color: gold, fontWeight: 700, marginBottom: 8 }}>{n}</div>
              <div style={{ fontFamily: sf, fontSize: 13, color: textMuted, lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* ─── CÓMO FUNCIONA / HOW ─── */}
      <RevealSection>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Divider />
          <h2 style={{ fontFamily: hf, fontSize: 36, color: goldLight, margin: "20px 0 8px" }}>Cómo empezás</h2>
        </div>
        <div className="step-row" style={{ display: "flex", gap: 0, alignItems: "flex-start", justifyContent: "center" }}>
          {[
            ["1", "Comprás el acceso", "Clic en el botón, elegís tu método de pago y listo. Hotmart acepta tarjetas y opciones locales de cada país.", "💳"],
            ["2", "Accedés en 2 minutos", "Recibís tus credenciales por email. Entrás a visiontarot.com/curso desde tu teléfono o computadora.", "🔑"],
            ["3", "Aprendés a tu ritmo", "Seguís las lecciones en orden, practicás con las tiradas y consultás al Oráculo cuando tenés dudas.", "📲"],
          ].map(([num, title, desc, icon], i) => (
            <div key={num} style={{ flex: 1, maxWidth: 240, textAlign: "center", padding: "0 20px", position: "relative" }}>
              {i < 2 && (
                <div style={{
                  position: "absolute", top: 20, right: -1,
                  width: "50%", height: 1,
                  background: `linear-gradient(90deg,${gold},transparent)`,
                  display: "none",
                }} className="step-connector" />
              )}
              <div style={{
                width: 48, height: 48, borderRadius: "50%", margin: "0 auto 16px",
                background: "rgba(201,168,76,0.1)", border: `2px solid ${gold}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: hf, fontSize: 22, color: gold, fontWeight: 700,
              }}>{num}</div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: hf, fontSize: 18, color: goldLight, fontWeight: 600, marginBottom: 8 }}>{title}</div>
              <div style={{ fontFamily: sf, fontSize: 13, color: textMuted, lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* ─── GARANTÍA ─── */}
      <RevealSection purple tight>
        <div style={{
          display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap",
          justifyContent: "center", textAlign: "center",
        }}>
          <div style={{ fontSize: 60 }}>🛡️</div>
          <div style={{ maxWidth: 480 }}>
            <h2 style={{ fontFamily: hf, fontSize: 30, color: goldLight, margin: "0 0 12px" }}>
              Garantía de 7 días sin preguntas
            </h2>
            <p style={{ fontFamily: sf, fontSize: 15, color: textMuted, lineHeight: 1.7, margin: 0 }}>
              Si comprás y por cualquier razón no te convence, Hotmart te devuelve el 100% de tu dinero en los primeros 7 días. Sin formularios complicados, sin excusas. El riesgo es nuestro.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* ─── FAQ ─── */}
      <RevealSection tight>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Divider />
          <h2 style={{ fontFamily: hf, fontSize: 36, color: goldLight, margin: "20px 0 8px" }}>Preguntas frecuentes</h2>
        </div>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <FaqItem
            q="¿Necesito algún don especial para aprender tarot?"
            a="No. El 100% de los tarotistas profesionales aprendieron paso a paso. Nadie nace sabiendo. La intuición se desarrolla con práctica, igual que un músculo. Este curso te da las herramientas y la práctica interactiva para desarrollarla a tu ritmo."
          />
          <FaqItem
            q="¿Cuánto tiempo necesito por día?"
            a="Cada lección toma entre 5 y 10 minutos. Podés avanzar a tu propio ritmo, desde el teléfono, cuando tengas tiempo. No hay clases en vivo ni horarios. El acceso es de por vida."
          />
          <FaqItem
            q="¿Ya hay mucha información gratis en YouTube, por qué pagar?"
            a="En YouTube hay información, pero está desorganizada, contradictoria y sin estructura. Podés pasar 6 meses saltando entre videos y seguir sin saber cómo hacer una lectura real. Este curso te da un camino paso a paso, con práctica interactiva y un tutor IA para tus dudas específicas. En semanas hacés lo que con YouTube tardarías meses."
          />
          <FaqItem
            q="¿Realmente puedo ganar $500/mes leyendo tarot?"
            a="Los $500/mes no son una promesa mágica — son matemática. 17 lecturas a $30 o 34 a $15. El ebook incluye la matemática exacta, 5 canales para conseguir clientes y un plan día a día de la primera semana. Si seguís el plan, llegás."
          />
          <FaqItem
            q="¿El tarot es malo o está relacionado con algo oscuro?"
            a="No. El tarot no está vinculado a ninguna religión ni práctica oscura. Es un sistema de símbolos para el autoconocimiento, similar a la psicología o la astrología. Hay tarotistas de todas las creencias y culturas. Desmontamos todos los mitos en el primer módulo del curso."
          />
          <FaqItem
            q="¿Cómo accedo después de comprar?"
            a="Inmediatamente después de tu pago recibís un email con tus credenciales. Entrás a visiontarot.com/curso, ingresás con tu usuario y contraseña, y ya podés empezar. Todo desde el teléfono o la computadora."
          />
        </div>
      </RevealSection>

      {/* ─── CTA FINAL ─── */}
      <RevealSection purple>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <Divider />
          <h2 style={{ fontFamily: hf, fontSize: 40, color: goldLight, margin: "16px 0 0" }}>
            Tu baraja está esperando.<br />Tu negocio también.
          </h2>
          <p style={{ fontFamily: sf, fontSize: 16, color: textMuted, lineHeight: 1.7, maxWidth: 480, margin: 0 }}>
            Las primeras 100 personas acceden al precio de lanzamiento. Después el precio sube a $27. Empezá hoy.
          </p>
          <GoldBtn label="Quiero empezar ahora →" sub="$19.99 USD · Pago único · Acceso inmediato" onClick={buyNow} large />
          <div style={{ fontFamily: sf, fontSize: 12, color: textMuted }}>
            Sin mensualidades · Garantía 7 días · Hotmart
          </div>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => navigate("/login")} style={{
              background: "none", border: "none", color: textMuted,
              fontFamily: sf, fontSize: 13, cursor: "pointer", textDecoration: "underline",
            }}>
              Ya tengo acceso → Ingresar
            </button>
          </div>
        </div>
      </RevealSection>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: "24px", textAlign: "center", borderTop: "1px solid rgba(201,168,76,0.1)" }}>
        <div style={{ fontFamily: hf, fontSize: 20, color: gold, marginBottom: 6 }}>VisionTarot</div>
        <div style={{ fontFamily: sf, fontSize: 12, color: textMuted }}>
          © 2025 VisionTarot · Todos los derechos reservados · Procesado por Hotmart
        </div>
      </footer>
    </div>
  );
}
