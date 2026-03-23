import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getPdfBase64, downloadCertificatePdf } from "../lib/certificate";

interface Props {
  userId: string;
  onClose: () => void;
}


export default function Certificate({ userId, onClose }: Props) {
  const [step, setStep] = useState<"loading" | "idle" | "form" | "confirm" | "done">("loading");
  const [fullName, setFullName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.from("certificates").select("full_name,issued_at").eq("user_id", userId).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setSavedName(data.full_name);
          setIssuedDate(new Date(data.issued_at).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" }));
          setStep("done");
        } else {
          setStep("idle");
        }
      });
  }, [userId]);

  const handleConfirm = async () => {
    setSaving(true);
    const date = new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
    const { error } = await supabase.from("certificates").insert({ user_id: userId, full_name: fullName });
    if (error) {
      setError("Error al guardar. Intentá de nuevo.");
      setSaving(false);
      return;
    }
    setSavedName(fullName);
    setIssuedDate(date);
    setSaving(false);
    downloadCertificatePdf(fullName, date);
    setStep("done");
    // Send email with PDF (non-blocking)
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return;
      const pdfBase64 = getPdfBase64(fullName, date);
      void supabase.functions.invoke("send-certificate", {
        body: { email: user.email, fullName, issuedDate: date, pdfBase64 },
      }).then(() => {});
    })();
  };

  const inputStyle = {
    background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.3)",
    borderRadius: 4, padding: "12px 16px", color: "#f0e6d3", fontSize: 16,
    fontFamily: "Georgia,serif", outline: "none", width: "100%", boxSizing: "border-box" as const,
  };

  const btnPrimary = {
    padding: "13px 36px", borderRadius: 4, border: "1px solid #c9a84c",
    background: "linear-gradient(135deg,rgba(201,168,76,0.25),rgba(201,168,76,0.08))",
    color: "#f5e6a3", fontSize: 12, cursor: "pointer",
    fontFamily: "Georgia,serif", letterSpacing: 3, textTransform: "uppercase" as const,
  };

  const btnSecondary = {
    padding: "13px 28px", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)",
    background: "transparent", color: "rgba(201,168,76,0.65)", fontSize: 11, cursor: "pointer",
    fontFamily: "Georgia,serif", letterSpacing: 2, textTransform: "uppercase" as const,
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: "linear-gradient(170deg,#0a0612 0%,#1a0d2e 50%,#0a0612 100%)",
        border: "1px solid rgba(201,168,76,0.3)", borderRadius: 4,
        padding: "40px 40px", maxWidth: 480, width: "100%",
        position: "relative", textAlign: "center",
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", color: "rgba(201,168,76,0.6)", fontSize: 18, cursor: "pointer" }}>✕</button>

        {step === "loading" && (
          <p style={{ color: "rgba(201,168,76,0.65)", fontFamily: "Georgia,serif", fontStyle: "italic" }}>Cargando...</p>
        )}

        {step === "idle" && (
          <>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🏆</div>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#c9a84c", marginBottom: 12 }}>¡Felicitaciones!</div>
            <h2 style={{ fontFamily: "Georgia,serif", color: "#f5e6a3", fontSize: 24, margin: "0 0 12px", fontWeight: "bold" }}>Completaste el curso</h2>
            <div style={{ width: 80, height: 1, background: "linear-gradient(90deg,transparent,#c9a84c,transparent)", margin: "0 auto 20px" }} />
            <p style={{ color: "#e8dcc8", fontSize: 14, lineHeight: 1.75, fontFamily: "Georgia,serif", fontStyle: "italic", marginBottom: 28 }}>
              Ya tenés todas las herramientas para leer el Tarot Rider-Waite de manera profesional. Es hora de dar el siguiente paso y comenzar a trabajar de esto.
            </p>
            <button onClick={() => setStep("form")} style={btnPrimary}>
              Obtener mi certificado
            </button>
          </>
        )}

        {step === "form" && (
          <>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#c9a84c", marginBottom: 16 }}>Tu certificado</div>
            <h2 style={{ fontFamily: "Georgia,serif", color: "#f5e6a3", fontSize: 22, margin: "0 0 8px" }}>¿Cómo querés que aparezca tu nombre?</h2>
            <div style={{ width: 60, height: 1, background: "linear-gradient(90deg,transparent,#c9a84c,transparent)", margin: "0 auto 16px" }} />
            <p style={{ color: "rgba(201,168,76,0.6)", fontSize: 13, fontFamily: "Georgia,serif", marginBottom: 24, lineHeight: 1.6 }}>
              Este nombre quedará impreso en el certificado. Verificá que sea correcto antes de continuar.
            </p>
            <input
              type="text"
              placeholder="Nombre y Apellido"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ ...inputStyle, marginBottom: 20, textAlign: "center" }}
            />
            {error && <p style={{ color: "#e07070", fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setStep("idle")} style={btnSecondary}>← Volver</button>
              <button
                onClick={() => { if (fullName.trim().length > 2) setStep("confirm"); }}
                style={{ ...btnPrimary, opacity: fullName.trim().length > 2 ? 1 : 0.4, cursor: fullName.trim().length > 2 ? "pointer" : "default" }}
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#c9a84c", marginBottom: 16 }}>Confirmar</div>
            <h2 style={{ fontFamily: "Georgia,serif", color: "#f5e6a3", fontSize: 22, margin: "0 0 20px" }}>¿El nombre es correcto?</h2>
            <div style={{ padding: "20px", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 4, background: "rgba(201,168,76,0.05)", marginBottom: 20 }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "#f5e6a3", margin: 0 }}>{fullName}</p>
            </div>
            <p style={{ color: "rgba(201,168,76,0.65)", fontSize: 12, fontFamily: "Georgia,serif", marginBottom: 24, lineHeight: 1.6, fontStyle: "italic" }}>
              Una vez generado el certificado, el nombre no se puede cambiar.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setStep("form")} style={btnSecondary}>← Editar</button>
              <button onClick={handleConfirm} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
                {saving ? "Generando..." : "Confirmar y descargar"}
              </button>
            </div>
          </>
        )}

        {step === "done" && (
          <>
            <div style={{ fontSize: 36, marginBottom: 16 }}>✦</div>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#c9a84c", marginBottom: 12 }}>Certificado emitido</div>
            <h2 style={{ fontFamily: "Georgia,serif", color: "#f5e6a3", fontSize: 22, margin: "0 0 12px" }}>{savedName}</h2>
            <div style={{ width: 80, height: 1, background: "linear-gradient(90deg,transparent,#c9a84c,transparent)", margin: "0 auto 16px" }} />
            <p style={{ color: "rgba(201,168,76,0.6)", fontSize: 12, fontFamily: "Georgia,serif", marginBottom: 28, fontStyle: "italic" }}>
              Emitido el {issuedDate}
            </p>
            <button onClick={() => downloadCertificatePdf(savedName, issuedDate)} style={btnPrimary}>
              ↓ Descargar certificado
            </button>
          </>
        )}
      </div>
    </div>
  );
}
