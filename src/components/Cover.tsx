import { hf } from "../constants";

interface Props {
  onStart: () => void;
  onBack: () => void;
}

const features = [
  "22 Arcanos Mayores con significado profundo",
  "56 Arcanos Menores (4 palos completos)",
  "5 tiradas interactivas — revela cartas con un clic",
  "Tests al final de cada módulo",
  "Tutor IA disponible en cualquier momento (botón 🔮 arriba a la derecha)",
  "Método P.I.C.A. para interpretar como profesional",
  "Secretos ocultos del Rider-Waite",
  "Técnicas de memorización y errores a evitar",
];

export default function Cover({ onStart, onBack }: Props) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg,#0a0612 0%,#1a0d2e 30%,#2d1150 60%,#1a0d2e 85%,#0a0612 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
    }}>
      {/* Decorative borders */}
      <div style={{ position: "absolute", top: 16, left: 16, right: 16, bottom: 16, border: "1px solid rgba(201,168,76,0.3)", borderRadius: 4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 28, left: 28, right: 28, bottom: 28, border: "1px solid rgba(201,168,76,0.12)", borderRadius: 4, pointerEvents: "none" }} />

      <div style={{ maxWidth: 480, width: "100%", textAlign: "center", position: "relative", zIndex: 2 }}>

        {/* Top label */}
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "rgba(201,168,76,0.7)", marginBottom: 28 }}>
          Curso interactivo completo
        </div>

        {/* Title */}
        <div style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "#c9a84c", marginBottom: 12 }}>
          Aprende
        </div>
        <h1 style={{
          fontFamily: hf, fontSize: "clamp(42px,10vw,64px)", fontWeight: 700,
          background: "linear-gradient(180deg,#f5e6a3 0%,#c9a84c 40%,#a07828 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          margin: "0 0 8px", lineHeight: 1, letterSpacing: 4, textTransform: "uppercase",
        }}>
          Tarot
        </h1>
        <div style={{ width: 160, height: 1, background: "linear-gradient(90deg,transparent,#c9a84c,transparent)", margin: "0 auto 28px" }} />

        {/* Description */}
        <p style={{ color: "#e8dcc8", fontSize: 14, lineHeight: 1.75, margin: "0 0 28px", fontFamily: "Georgia,serif", fontStyle: "italic", opacity: 0.85 }}>
          Domina el Tarot Rider-Waite desde cero. Aprende el significado de cada carta, practica con tiradas interactivas y consulta al Tutor IA cuando quieras.
        </p>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", margin: "0 auto 32px", maxWidth: 360 }}>
          {features.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ color: "#c9a84c", fontSize: 9, marginTop: 4, flexShrink: 0 }}>{"✦"}</span>
              <span style={{ color: "#e8dcc8", fontSize: 13, lineHeight: 1.5, opacity: 0.85 }}>{t}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={onBack}
            style={{
              padding: "12px 28px", borderRadius: 4,
              border: "1px solid rgba(201,168,76,0.2)",
              background: "transparent",
              color: "rgba(201,168,76,0.5)", fontSize: 12, cursor: "pointer",
              fontFamily: "Georgia,serif", letterSpacing: 3, textTransform: "uppercase",
            }}
          >
            ← Volver
          </button>
          <button
            onClick={onStart}
            style={{
              padding: "12px 40px", borderRadius: 4,
              border: "1px solid #c9a84c",
              background: "linear-gradient(135deg,rgba(201,168,76,0.25),rgba(201,168,76,0.1))",
              color: "#f5e6a3", fontSize: 12, cursor: "pointer",
              fontFamily: "Georgia,serif", letterSpacing: 3, textTransform: "uppercase",
              boxShadow: "0 0 24px rgba(201,168,76,0.15)",
            }}
          >
            Comenzar el curso
          </button>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32 }}>
          <div style={{ width: 120, height: 1, background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent)", margin: "0 auto 12px" }} />
          <p style={{ color: "rgba(201,168,76,0.4)", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", margin: 0 }}>
            10 módulos · 31 lecciones · 78 cartas
          </p>
        </div>

      </div>
    </div>
  );
}
