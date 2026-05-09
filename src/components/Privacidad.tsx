import { useNavigate } from "react-router-dom";

const hf = "'Cormorant Garamond', Georgia, serif";
const sf = "'DM Sans', sans-serif";
const gold = "#c9a84c";
const bg = "#07050f";

export default function Privacidad() {
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

        <h1 style={{ fontFamily: hf, fontSize: 36, color: "#f5e6a3", marginBottom: 8 }}>Política de privacidad</h1>
        <p style={{ fontSize: 12, color: "rgba(201,168,76,0.4)", marginBottom: 40, letterSpacing: 1 }}>Última actualización: abril 2025</p>

        <Section title="1. Responsable del tratamiento">
          Visión Tarot es el responsable del tratamiento de los datos personales recopilados a través de esta plataforma. El servicio opera desde Argentina, bajo la Ley 25.326 de Protección de Datos Personales, cuyos principios son compatibles con los marcos de protección de datos vigentes en América Latina (incluyendo las leyes aplicables de México, Colombia, Brasil, Chile, Perú y otros países de la región).
        </Section>

        <Section title="2. Datos que recopilamos">
          Recopilamos únicamente la información necesaria para brindarte el servicio:
          <br /><br />
          — <strong>Datos de cuenta:</strong> dirección de email y contraseña (almacenada encriptada, nunca en texto plano).<br />
          — <strong>Datos de uso:</strong> tiradas realizadas, cantidad de preguntas utilizadas y estado de las sesiones.<br />
          — <strong>Datos técnicos:</strong> tipo de dispositivo, sistema operativo y navegador, con fines estadísticos.<br />
          — <strong>Geolocalización aproximada:</strong> país y ciudad, obtenidos mediante IP pública. No almacenamos direcciones IP.
        </Section>

        <Section title="3. Conversaciones con Luna (IA)">
          Luna es un asistente de inteligencia artificial. <strong style={{ color: "#e8d8a0" }}>Las conversaciones con Luna no se almacenan en nuestros servidores.</strong> El historial de cada sesión existe solo mientras la sesión está activa en tu dispositivo y no se guarda de forma persistente.
          <br /><br />
          Los mensajes son procesados por la API de Anthropic (proveedor de IA) para generar respuestas en tiempo real. Consultá la <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: gold }}>política de privacidad de Anthropic</a> para más detalles sobre su tratamiento de datos.
        </Section>

        <Section title="4. Uso de los datos">
          Los datos recopilados se usan exclusivamente para:
          <br /><br />
          — Proveer y mejorar el servicio.<br />
          — Gestionar tu cuenta y accesos.<br />
          — Generar estadísticas agregadas de uso (sin identificar usuarios individuales).
          <br /><br />
          No vendemos ni cedemos tus datos a terceros con fines comerciales.
        </Section>

        <Section title="5. Proveedores de servicio">
          Utilizamos los siguientes servicios de terceros para operar la plataforma:
          <br /><br />
          — <strong>Supabase</strong> — base de datos y autenticación.<br />
          — <strong>Anthropic</strong> — inteligencia artificial que impulsa a Luna.<br />
          — <strong>Hotmart</strong> — procesamiento de pagos. Los datos de pago son manejados exclusivamente por Hotmart y no llegan a nuestros servidores.
        </Section>

        <Section title="6. Transferencias internacionales de datos">
          Al utilizar servicios de terceros como Supabase y Anthropic, tus datos pueden ser procesados en servidores ubicados fuera de tu país de residencia. Estos proveedores cuentan con medidas de seguridad adecuadas para la protección de datos personales.
        </Section>

        <Section title="7. Retención de datos">
          Conservamos tus datos mientras tu cuenta esté activa. Podés solicitar la eliminación de tu cuenta y datos en cualquier momento escribiéndonos.
        </Section>

        <Section title="8. Tus derechos">
          Independientemente de tu país de residencia, tenés derecho a acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales (derechos ARCO). Para ejercerlos, escribinos a{" "}
          <a href="mailto:hola@visiontarot.com" style={{ color: gold }}>hola@visiontarot.com</a>.
        </Section>

        <Section title="9. Seguridad">
          Aplicamos medidas de seguridad técnicas para proteger tu información, incluyendo encriptación en tránsito (HTTPS) y en reposo.
        </Section>

        <Section title="10. Contacto">
          Para consultas sobre privacidad, escribinos a{" "}
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
