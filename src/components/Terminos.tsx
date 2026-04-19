import { useNavigate } from "react-router-dom";

const hf = "'Cormorant Garamond', Georgia, serif";
const sf = "'DM Sans', sans-serif";
const gold = "#c9a84c";
const bg = "#07050f";

export default function Terminos() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: sf, color: "#c0b0a0", padding: "48px 24px 80px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", color: "rgba(201,168,76,0.55)", fontSize: 13, cursor: "pointer", marginBottom: 32, fontFamily: sf, letterSpacing: 0.5 }}
        >
          ← Volver
        </button>

        <h1 style={{ fontFamily: hf, fontSize: 36, color: "#f5e6a3", marginBottom: 8 }}>Términos de uso</h1>
        <p style={{ fontSize: 12, color: "rgba(201,168,76,0.4)", marginBottom: 40, letterSpacing: 1 }}>Última actualización: abril 2025</p>

        <Section title="1. Naturaleza del servicio">
          Visión Tarot ofrece lecturas de tarot con fines de entretenimiento, exploración personal y reflexión.
          <br /><br />
          <strong style={{ color: "#e8d8a0" }}>Luna es un asistente de inteligencia artificial.</strong> No hay ninguna persona humana detrás de las respuestas. Las interpretaciones son generadas por un modelo de lenguaje (IA) entrenado para este propósito, y no constituyen asesoramiento psicológico, médico, legal, financiero ni de ninguna otra índole profesional.
          <br /><br />
          Las cartas y sus interpretaciones son simbólicas. No predicen el futuro ni determinan decisiones de vida. El usuario es el único responsable de las decisiones que tome.
        </Section>

        <Section title="2. Edad mínima">
          Este servicio está destinado exclusivamente a personas mayores de 18 años. Al acceder y utilizar Visión Tarot, declarás tener al menos 18 años de edad.
        </Section>

        <Section title="3. Cobertura geográfica">
          Visión Tarot está disponible para usuarios de toda América Latina y otras regiones del mundo. El servicio opera desde Argentina, por lo que se rige por la legislación argentina aplicable. Al usar el servicio desde otro país, aceptás que la relación contractual se rige por las leyes de Argentina.
        </Section>

        <Section title="4. Uso permitido">
          El acceso al servicio es personal e intransferible. Queda prohibido compartir credenciales de acceso, revender lecturas o utilizar el servicio con fines comerciales sin autorización expresa.
        </Section>

        <Section title="5. Limitación de responsabilidad">
          Visión Tarot no se responsabiliza por decisiones tomadas en base a las lecturas generadas por la IA. Si estás atravesando una situación de crisis emocional, te recomendamos comunicarte con un profesional de la salud mental o una línea de crisis de tu país.
        </Section>

        <Section title="6. Propiedad intelectual">
          Todo el contenido de la plataforma —incluyendo textos, diseño e imágenes— es propiedad de Visión Tarot y no puede ser reproducido sin autorización.
        </Section>

        <Section title="7. Modificaciones">
          Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado del servicio implica la aceptación de los términos vigentes.
        </Section>

        <Section title="8. Contacto">
          Para consultas sobre estos términos, podés escribirnos a{" "}
          <a href="mailto:hola@visiontarot.com" style={{ color: gold }}>hola@visiontarot.com</a>.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: hf, fontSize: 20, color: "#e8d8a0", marginBottom: 10, fontWeight: 600 }}>{title}</h2>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: "#b0a090", margin: 0 }}>{children}</p>
    </div>
  );
}
