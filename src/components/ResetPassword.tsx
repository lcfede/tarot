import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when the user lands with a valid token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError("No se pudo actualizar la contraseña. Solicitá un nuevo link.");
    } else {
      setDone(true);
      setTimeout(() => navigate("/curso"), 2500);
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
            Nueva contraseña
          </h1>
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg,transparent,#c9a84c,transparent)", margin: "16px auto 0" }} />
        </div>

        {done ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 16, color: "#c9a84c" }}>✦</div>
            <p style={{ color: "#e8dcc8", fontSize: 14, lineHeight: 1.7, fontStyle: "italic" }}>
              Contraseña actualizada. Redirigiendo al curso...
            </p>
          </div>
        ) : !ready ? (
          <p style={{ textAlign: "center", color: "rgba(201,168,76,0.5)", fontSize: 13, fontStyle: "italic" }}>
            Verificando link...
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(201,168,76,0.8)" }}>
                Nueva contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mínimo 8 caracteres"
                style={{
                  background: "rgba(201,168,76,0.05)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  borderRadius: 4, padding: "12px 16px",
                  color: "#f0e6d3", fontSize: 15,
                  fontFamily: "Georgia,serif", outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(201,168,76,0.8)" }}>
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
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
              {loading ? "Guardando..." : "Guardar contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
