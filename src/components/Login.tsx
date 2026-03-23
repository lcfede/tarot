import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function parseUA(ua: string) {
  const mob = /Mobile|Android|iPhone|iPod/.test(ua);
  const tab = /iPad|Tablet/.test(ua);
  const device = mob ? "Móvil" : tab ? "Tablet" : "Escritorio";
  const os = /Windows NT/.test(ua) ? "Windows"
    : /Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua) ? "macOS"
    : /iPhone|iPad/.test(ua) ? "iOS"
    : /Android/.test(ua) ? "Android"
    : /Linux/.test(ua) ? "Linux" : "Otro";
  const browser = /Edg\//.test(ua) ? "Edge"
    : /OPR\//.test(ua) ? "Opera"
    : /Chrome\//.test(ua) ? "Chrome"
    : /Firefox\//.test(ua) ? "Firefox"
    : /Safari\//.test(ua) ? "Safari" : "Otro";
  return { device, os, browser };
}

async function logSession(userId: string) {
  const { device, os, browser } = parseUA(navigator.userAgent);
  let country = "", city = "";
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    const geo = await fetch("https://ipapi.co/json/", { signal: ctrl.signal }).then(r => r.json());
    clearTimeout(timer);
    country = geo.country_name || "";
    city = geo.city || "";
  } catch { /* ignore */ }
  void supabase.from("user_sessions").insert({ user_id: userId, device, os, browser, country, city }).then(() => {});
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setError("Email o contraseña incorrectos.");
      return;
    }
    // Check if account is active
    const { data: profile } = await supabase.from("profiles").select("is_active").eq("user_id", data.user.id).single();
    if (profile?.is_active === false) {
      await supabase.auth.signOut();
      setLoading(false);
      setError("Tu cuenta ha sido desactivada. Contactá al administrador.");
      return;
    }
    void logSession(data.user.id);
    setLoading(false);
    navigate("/curso");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg,#0a0612 0%,#1a0d2e 30%,#2d1150 60%,#1a0d2e 85%,#0a0612 100%)",
      fontFamily: "Georgia,serif",
      color: "#f0e6d3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 16, left: 16, right: 16, bottom: 16, border: "1px solid rgba(201,168,76,0.3)", borderRadius: 4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 28, left: 28, right: 28, bottom: 28, border: "1px solid rgba(201,168,76,0.15)", borderRadius: 4, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 380, padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 12, letterSpacing: 6, textTransform: "uppercase", color: "#c9a84c", marginBottom: 16 }}>
            Visión Tarot
          </div>
          <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#f5e6a3", letterSpacing: 2, margin: 0 }}>
            Acceder
          </h1>
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg,transparent,#c9a84c,transparent)", margin: "16px auto 0" }} />
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(201,168,76,0.8)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                background: "rgba(201,168,76,0.05)",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: 4,
                padding: "12px 16px",
                color: "#f0e6d3",
                fontSize: 15,
                fontFamily: "Georgia,serif",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(201,168,76,0.8)" }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                background: "rgba(201,168,76,0.05)",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: 4,
                padding: "12px 16px",
                color: "#f0e6d3",
                fontSize: 15,
                fontFamily: "Georgia,serif",
                outline: "none",
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
              marginTop: 8,
              padding: "14px",
              borderRadius: 4,
              border: "1px solid #c9a84c",
              background: "linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.08))",
              color: "#f5e6a3",
              fontSize: 14,
              fontFamily: "Georgia,serif",
              letterSpacing: 4,
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => navigate("/forgot-password")}
            style={{ background: "none", border: "none", color: "rgba(201,168,76,0.5)", fontSize: 12, cursor: "pointer", fontFamily: "Georgia,serif", letterSpacing: 1 }}
          >
            ¿Olvidaste tu contraseña?
          </button>
          <button
            onClick={() => navigate("/")}
            style={{ background: "none", border: "none", color: "rgba(201,168,76,0.3)", fontSize: 11, cursor: "pointer", fontFamily: "Georgia,serif", letterSpacing: 1 }}
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
