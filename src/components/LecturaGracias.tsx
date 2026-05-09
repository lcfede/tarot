import { useNavigate } from "react-router-dom";

const hf = "'Cormorant Garamond', Georgia, serif";
const sf = "'DM Sans', sans-serif";
const bg = "#07050f";

export default function LecturaGracias() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 50% -10%, #1a0d3e 0%, ${bg} 60%)`,
      fontFamily: sf,
      color: "#e8dcc8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{
        maxWidth: 480,
        width: "100%",
        textAlign: "center",
        animation: "fadeUp 0.5s ease both",
      }}>
        <div style={{ fontSize: 56, marginBottom: 24 }}>🔮</div>

        <h1 style={{
          fontFamily: hf,
          fontSize: "clamp(30px, 6vw, 44px)",
          fontWeight: 600,
          color: "#f5e6a3",
          margin: "0 0 16px",
          lineHeight: 1.2,
        }}>
          ¡Gracias por tu compra!
        </h1>

        <p style={{ fontSize: 17, color: "rgba(232,220,200,0.65)", lineHeight: 1.7, margin: "0 0 12px" }}>
          Tus lecturas ya están siendo procesadas.
        </p>
        <p style={{ fontSize: 15, color: "rgba(232,220,200,0.45)", lineHeight: 1.7, margin: "0 0 36px" }}>
          Revisá tu email — te enviamos las instrucciones para acceder.
          Si es tu primera compra, encontrarás un link para crear tu contraseña.
        </p>

        <div style={{
          background: "rgba(201,168,76,0.04)",
          border: "1px solid rgba(201,168,76,0.12)",
          borderRadius: 14,
          padding: "18px 22px",
          marginBottom: 32,
          fontSize: 13,
          color: "rgba(232,220,200,0.35)",
          lineHeight: 1.65,
        }}>
          El procesamiento del pago puede demorar unos minutos.
          Si ya tenés cuenta, podés ingresar directamente.
        </div>

        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg,#c9a84c,#a07828)",
            color: "#0a0612",
            fontFamily: sf,
            fontWeight: 700,
            fontSize: 17,
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          Ir a mis lecturas →
        </button>

        <div style={{ fontSize: 12, color: "rgba(232,220,200,0.25)", lineHeight: 1.7 }}>
          ¿No recibiste el email? Revisá tu carpeta de spam o escribinos a{" "}
          <span style={{ color: "rgba(201,168,76,0.4)" }}>hola@visiontarot.com</span>
        </div>
      </div>
    </div>
  );
}
