import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://visiontarot.com/reset-password",
    });
    setLoading(false);
    if (error) {
      setError("No pudimos enviar el email. Verificá la dirección.");
    } else {
      setSent(true);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg,#0a0612 0%,#1a0d2e 30%,#2d1150 60%,#1a0d2e 85%,#0a0612 100%)",
      fontFamily: "Georgia,serif", color: "#f0e6d3",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 16, left: 16, right: 16, bottom: 16, border: "1px solid rgba(201,168,76,0.3)", borderRadius: 4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 28, left: 28, right: 28, bottom: 28, border: "1px solid rgba(201,168,76,0.12)", borderRadius: 4, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 380, padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 12, letterSpacing: 6, textTransform: "uppercase", color: "#c9a84c", marginBottom: 16 }}>
            Visión Tarot
          </div>
          <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#f5e6a3", letterSpacing: 2, margin: "0 0 8px" }}>
            Recuperar acceso
          </h1>
          <p style={{ color: "rgba(201,168,76,0.75)", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            Te enviaremos un link para restablecer tu contraseña
          </p>
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg,transparent,#c9a84c,transparent)", margin: "16px auto 0" }} />
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 16, color: "#c9a84c" }}>✦</div>
            <p style={{ color: "#e8dcc8", fontSize: 14, lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>
              Revisá tu bandeja de entrada. Si el email existe en nuestro sistema, recibirás el link en los próximos minutos.
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "12px 32px", borderRadius: 4,
                border: "1px solid rgba(201,168,76,0.3)",
                background: "transparent", color: "rgba(201,168,76,0.82)",
                fontSize: 11, cursor: "pointer", letterSpacing: 3, textTransform: "uppercase",
              }}
            >
              Volver al login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(201,168,76,0.8)" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                style={{
                  background: "rgba(201,168,76,0.05)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  borderRadius: 4, padding: "12px 16px",
                  color: "#f0e6d3", fontSize: 15,
                  fontFamily: "Georgia,serif", outline: "none",
                }}
              />
            </div>

            {error && (
              <div style={{ color: "#e07070", fontSize: 13, textAlign: "center" }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8, padding: "14px", borderRadius: 4,
                border: "1px solid #c9a84c",
                background: "linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.08))",
                color: "#f5e6a3", fontSize: 12, cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: 4, textTransform: "uppercase", opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Enviando..." : "Enviar link"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                background: "none", border: "none",
                color: "rgba(201,168,76,0.75)", fontSize: 11,
                cursor: "pointer", letterSpacing: 1, textAlign: "center",
              }}
            >
              ← Volver al login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
