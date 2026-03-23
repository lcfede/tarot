import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { downloadCertificatePdf } from "../lib/certificate";
import { COURSE } from "../data/course";
import { sf, hf } from "../constants";

interface CertData {
  full_name: string;
  issued_at: string;
}

interface ProgressRow {
  lesson_id: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [done, setDone] = useState<string[]>([]);
  const [cert, setCert] = useState<CertData | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }

      setEmail(user.email ?? "");
      if (user.created_at) {
        setStartDate(new Date(user.created_at).toLocaleDateString("es-ES", {
          year: "numeric", month: "long", day: "numeric",
        }));
      }

      const [progressRes, certRes] = await Promise.all([
        supabase.from("progress").select("lesson_id").eq("user_id", user.id),
        supabase.from("certificates").select("full_name, issued_at").eq("user_id", user.id).maybeSingle(),
      ]);

      setDone((progressRes.data as ProgressRow[] ?? []).map(r => r.lesson_id));
      setCert(certRes.data ?? null);
      setLoading(false);
    }
    load();
  }, [navigate]);

  const all = COURSE.flatMap(m => m.l);
  const total = all.length;
  const pct = total > 0 ? Math.round((done.length / total) * 100) : 0;
  const isComplete = done.length === total && total > 0;

  const gold = "#c9a84c";
  const goldFaint = "rgba(201,168,76,0.15)";
  const goldMid = "rgba(201,168,76,0.75)";

  const sectionTitle = (label: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase" as const, color: goldMid, fontFamily: sf }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${goldFaint},transparent)` }} />
    </div>
  );

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0a1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: goldMid, fontFamily: hf, fontStyle: "italic", fontSize: 18 }}>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0a1e", color: "#e8dcc8", fontFamily: sf }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 4px; }
      `}</style>

      {/* Top bar */}
      <div style={{ borderBottom: "1px solid rgba(201,168,76,0.1)", padding: "14px 5%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={() => navigate("/curso")}
          style={{ background: "none", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, color: goldMid, fontSize: 12, padding: "6px 16px", cursor: "pointer", fontFamily: sf, letterSpacing: 1.5, textTransform: "uppercase" }}
        >
          ← Volver al curso
        </button>
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "rgba(201,168,76,0.65)", fontFamily: sf }}>
          Visión Tarot
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 5% 60px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", border: `1px solid ${goldFaint}`, background: "rgba(201,168,76,0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>
            ✦
          </div>
          <h1 style={{ fontFamily: hf, fontSize: 28, color: "#f5e6a3", margin: "0 0 6px", fontWeight: 600 }}>Mi Perfil</h1>
          <div style={{ fontSize: 13, color: "rgba(201,168,76,0.8)" }}>{email}</div>
          {startDate && (
            <div style={{ fontSize: 12, color: "rgba(232,220,200,0.75)", marginTop: 4 }}>Miembro desde el {startDate}</div>
          )}
        </div>

        {/* Progress section */}
        <div style={{ marginBottom: 40 }}>
          {sectionTitle("Progreso del curso")}
          <div style={{ background: "rgba(201,168,76,0.04)", border: `1px solid ${goldFaint}`, borderRadius: 8, padding: "24px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <span style={{ fontFamily: hf, fontSize: 20, color: "#f5e6a3" }}>{done.length} / {total} lecciones</span>
              <span style={{ fontSize: 28, fontFamily: hf, color: gold, fontWeight: 600 }}>{pct}%</span>
            </div>
            <div style={{ height: 6, background: "rgba(201,168,76,0.1)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: pct + "%", height: "100%", background: `linear-gradient(90deg,${gold},#f5e6a3)`, borderRadius: 3, transition: "width 0.6s ease" }} />
            </div>
            {isComplete && (
              <div style={{ marginTop: 14, fontSize: 14, color: gold, letterSpacing: 1, textAlign: "center" }}>
                Curso completado
              </div>
            )}
          </div>
        </div>

        {/* Modules section */}
        <div style={{ marginBottom: 40 }}>
          {sectionTitle("Módulos")}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {COURSE.map(mod => {
              const modDone = mod.l.filter(l => done.includes(l.id)).length;
              const modTotal = mod.l.length;
              const complete = modDone === modTotal;
              const modPct = Math.round((modDone / modTotal) * 100);
              return (
                <div key={mod.i} style={{
                  background: complete ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${complete ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 6, padding: "14px 16px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase" as const, color: complete ? gold : "rgba(232,220,200,0.65)" }}>
                      {mod.i}
                    </div>
                    <div style={{ fontSize: 13, color: complete ? gold : "rgba(232,220,200,0.65)" }}>
                      {modDone}/{modTotal}
                    </div>
                  </div>
                  <div style={{ fontSize: 16, color: complete ? "#f0e6d3" : "rgba(232,220,200,0.8)", fontFamily: hf, marginBottom: 10, lineHeight: 1.3 }}>
                    {mod.t}
                  </div>
                  <div style={{ height: 2, background: "rgba(201,168,76,0.1)", borderRadius: 1 }}>
                    <div style={{ width: modPct + "%", height: "100%", background: complete ? gold : "rgba(201,168,76,0.4)", borderRadius: 1 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate section */}
        <div>
          {sectionTitle("Certificado")}
          {cert ? (
            <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 8, padding: "28px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
              <div style={{ fontSize: 12, letterSpacing: 4, textTransform: "uppercase" as const, color: gold, marginBottom: 8 }}>Certificado emitido</div>
              <div style={{ fontFamily: hf, fontSize: 22, color: "#f5e6a3", marginBottom: 6 }}>{cert.full_name}</div>
              <div style={{ width: 60, height: 1, background: `linear-gradient(90deg,transparent,${gold},transparent)`, margin: "0 auto 12px" }} />
              <div style={{ fontSize: 14, color: "rgba(201,168,76,0.8)", fontStyle: "italic", marginBottom: 24 }}>
                Emitido el {new Date(cert.issued_at).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
              </div>
              <button
                onClick={() => downloadCertificatePdf(
                  cert.full_name,
                  new Date(cert.issued_at).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
                )}
                style={{
                  padding: "12px 32px", borderRadius: 4, border: `1px solid ${gold}`,
                  background: "linear-gradient(135deg,rgba(201,168,76,0.25),rgba(201,168,76,0.08))",
                  color: "#f5e6a3", fontSize: 13, cursor: "pointer",
                  fontFamily: hf, letterSpacing: 3, textTransform: "uppercase" as const,
                }}
              >
                ↓ Descargar certificado
              </button>
            </div>
          ) : isComplete ? (
            <div style={{ background: "rgba(201,168,76,0.04)", border: `1px solid ${goldFaint}`, borderRadius: 8, padding: "28px", textAlign: "center" }}>
              <div style={{ fontSize: 16, color: "#e8dcc8", fontFamily: hf, marginBottom: 16 }}>
                Completaste el curso. Ya podés obtener tu certificado.
              </div>
              <button
                onClick={() => navigate("/curso")}
                style={{
                  padding: "12px 32px", borderRadius: 4, border: `1px solid ${gold}`,
                  background: "linear-gradient(135deg,rgba(201,168,76,0.25),rgba(201,168,76,0.08))",
                  color: "#f5e6a3", fontSize: 13, cursor: "pointer",
                  fontFamily: hf, letterSpacing: 3, textTransform: "uppercase" as const,
                }}
              >
                Obtener certificado
              </button>
            </div>
          ) : (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "28px", textAlign: "center" }}>
              <div style={{ fontSize: 15, color: "rgba(232,220,200,0.8)", fontFamily: hf, fontStyle: "italic" }}>
                Completá todas las lecciones para obtener tu certificado.
              </div>
              <div style={{ marginTop: 16, fontSize: 14, color: "rgba(201,168,76,0.7)" }}>
                {total - done.length} {total - done.length === 1 ? "lección restante" : "lecciones restantes"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
