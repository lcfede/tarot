import { hf } from "../constants";

interface Props {
  onStart: () => void;
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

export default function Cover({ onStart }: Props) {
  return (
    <div style={{ minHeight: "100vh", background: "#0c0c16", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16, filter: "drop-shadow(0 0 20px rgba(212,168,67,0.3))" }}>{"✦"}</div>
        <h1 style={{ fontFamily: hf, fontSize: 38, color: "#e0d5c0", fontWeight: 700, margin: "0 0 8px", lineHeight: 1.2 }}>Aprende Tarot</h1>
        <p style={{ fontFamily: hf, fontSize: 18, color: "#d4a843", margin: "0 0 28px" }}>Las 78 cartas · Curso interactivo completo</p>
        <div style={{ width: 50, height: 1, background: "#d4a843", margin: "0 auto 28px", opacity: 0.5 }} />
        <p style={{ color: "#888", fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>
          Domina el Tarot Rider-Waite desde cero. Aprende el significado de cada carta con imágenes reales, practica con tiradas interactivas, pon a prueba tu conocimiento con tests, y consulta al Tutor IA cuando quieras.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", margin: "24px auto", maxWidth: 340 }}>
          {features.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: "#d4a843", fontSize: 11 }}>{"✦"}</span>
              <span style={{ color: "#c0b8a8", fontSize: 13 }}>{t}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onStart}
          style={{ padding: "14px 40px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#d4a843,#b8922e)", color: "#0d0d1a", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: hf, letterSpacing: 0.5, marginTop: 16, boxShadow: "0 4px 20px rgba(212,168,67,0.3)" }}
        >
          Comenzar el curso
        </button>
        <p style={{ color: "#555", fontSize: 11, marginTop: 16 }}>10 módulos · 31 lecciones · 78 cartas · ~5 horas de contenido</p>
      </div>
    </div>
  );
}
