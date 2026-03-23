import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const TOTAL_LESSONS = 31;

const P = "#7c3aed";
const PL = "#ede9fe";

interface UserRow {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_active: boolean;
  progress_count: number;
  has_certificate: boolean;
  last_device: string | null;
  last_os: string | null;
  last_browser: string | null;
  last_country: string | null;
  last_city: string | null;
  last_session: string | null;
}

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: 24,
};

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const fmtDt = (d: string | null) =>
  d ? new Date(d).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

function count<T extends string | null>(items: T[]): Record<string, number> {
  return items.reduce((acc, k) => {
    const key = k || "Desconocido";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function BarChart({ data, total, color }: { data: Record<string, number>; total: number; color: string }) {
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {sorted.map(([k, v]) => (
        <div key={k}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: "#374151" }}>{k}</span>
            <span style={{ color: "#64748b" }}>{v}</span>
          </div>
          <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3 }}>
            <div style={{ height: "100%", width: total > 0 ? `${(v / total) * 100}%` : "0%", background: color, borderRadius: 3 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Admin() {
  const [view, setView] = useState<"loading" | "login" | "panel">("loading");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"dashboard" | "users">("dashboard");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [certFilter, setCertFilter] = useState<"all" | "yes" | "no">("all");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const checkAdmin = async (userId: string): Promise<boolean> => {
    const { data } = await supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
    return !!data;
  };

  const loadUsers = async () => {
    setLoading(true);
    const { data: rows, error } = await supabase.rpc("get_users_admin");
    if (!error && rows) setUsers(rows as UserRow[]);
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setView("login"); return; }
      const isAdmin = await checkAdmin(session.user.id);
      if (!isAdmin) { setView("login"); return; }
      setView("panel");
      loadUsers();
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) {
      setLoginLoading(false);
      setLoginError("Email o contraseña incorrectos.");
      return;
    }
    const isAdmin = await checkAdmin(data.user.id);
    if (!isAdmin) {
      await supabase.auth.signOut();
      setLoginLoading(false);
      setLoginError("No tenés permisos de administrador.");
      return;
    }
    setLoginLoading(false);
    setView("panel");
    loadUsers();
  };

  const toggleActive = async (user: UserRow) => {
    setActionLoading(true);
    await supabase.rpc("set_user_active", { target_user_id: user.id, active_status: !user.is_active });
    const updated = { ...user, is_active: !user.is_active };
    setUsers(u => u.map(x => x.id === user.id ? updated : x));
    setSelected(s => s?.id === user.id ? updated : s);
    setActionLoading(false);
    showToast(updated.is_active ? "Usuario activado" : "Usuario desactivado");
  };

  const sendReset = async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: "https://visiontarot.com/reset-password" });
    showToast("Email de reseteo enviado a " + email);
  };

  if (view === "loading") return null;

  if (view === "login") return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "40px 40px", width: "100%", maxWidth: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div style={{ width: 44, height: 44, background: PL, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 20 }}>⚙️</div>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#1e293b" }}>Admin · Visión Tarot</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Acceso restringido</div>
        </div>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
            <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box" as const, color: "#1e293b" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Contraseña</label>
            <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box" as const, color: "#1e293b" }} />
          </div>
          {loginError && <div style={{ fontSize: 13, color: "#dc2626", textAlign: "center" }}>{loginError}</div>}
          <button type="submit" disabled={loginLoading}
            style={{ padding: "11px", borderRadius: 6, border: "none", background: P, color: "#fff", fontWeight: 600, fontSize: 14, cursor: loginLoading ? "not-allowed" : "pointer", opacity: loginLoading ? 0.7 : 1, marginTop: 4 }}>
            {loginLoading ? "Verificando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );

  // KPIs
  const activeCount = users.filter(u => u.is_active).length;
  const completedCount = users.filter(u => u.progress_count >= TOTAL_LESSONS).length;
  const certCount = users.filter(u => u.has_certificate).length;
  const avgPct = users.length > 0
    ? Math.round(users.reduce((a, u) => a + (u.progress_count / TOTAL_LESSONS) * 100, 0) / users.length)
    : 0;

  // Charts
  const deviceData = count(users.map(u => u.last_device));
  const osData = count(users.map(u => u.last_os));
  const countryAll = count(users.map(u => u.last_country));
  const countryData = Object.fromEntries(Object.entries(countryAll).sort((a, b) => b[1] - a[1]).slice(0, 6));

  const filteredUsers = users.filter(u => {
    if (filter === "active" && !u.is_active) return false;
    if (filter === "inactive" && u.is_active) return false;
    if (certFilter === "yes" && !u.has_certificate) return false;
    if (certFilter === "no" && u.has_certificate) return false;
    if (search.trim() && !u.email.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  const kpis = [
    { label: "Total usuarios", value: users.length, color: P },
    { label: "Usuarios activos", value: activeCount, color: "#16a34a" },
    { label: "Completaron curso", value: completedCount, color: "#0891b2" },
    { label: "Certificados", value: certCount, color: "#d97706" },
    { label: "Progreso promedio", value: `${avgPct}%`, color: "#7c3aed" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#1e293b" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: P }}>Admin</span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Visión Tarot</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {(["dashboard", "users"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 14,
                background: tab === t ? PL : "transparent",
                color: tab === t ? P : "#64748b",
                fontWeight: tab === t ? 600 : 400,
              }}>
                {t === "dashboard" ? "Dashboard" : "Usuarios"}
              </button>
            ))}
          </div>
          <button
            onClick={() => { void supabase.auth.signOut().then(() => setView("login")); }}
            style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 6, padding: "6px 14px", color: "#64748b", fontSize: 13, cursor: "pointer" }}
          >
            Salir
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 16, right: 16, background: P, color: "#fff", padding: "12px 20px", borderRadius: 8, fontSize: 14, zIndex: 999, boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#94a3b8", fontSize: 14 }}>Cargando datos...</div>
        ) : tab === "dashboard" ? (
          /* ── DASHBOARD ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
              {kpis.map(k => (
                <div key={k.label} style={{ ...card, textAlign: "center" }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: k.color, lineHeight: 1.1 }}>{k.value}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <div style={card}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16, color: "#374151" }}>Dispositivo</div>
                <BarChart data={deviceData} total={users.length} color={P} />
              </div>
              <div style={card}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16, color: "#374151" }}>Sistema Operativo</div>
                <BarChart data={osData} total={users.length} color="#0891b2" />
              </div>
              <div style={card}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16, color: "#374151" }}>País (top 6)</div>
                <BarChart data={countryData} total={users.length} color="#16a34a" />
              </div>
            </div>
          </div>
        ) : (
          /* ── USUARIOS ── */
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Search + Filters */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {/* Search bar */}
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 14, pointerEvents: "none" }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar por email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px 8px 36px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" as const, color: "#1e293b", background: "#fff" }}
                  />
                  {search && (
                    <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>✕</button>
                  )}
                </div>
                {/* Pill filters */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                  {([["all", `Todos (${users.length})`], ["active", `Activos (${activeCount})`], ["inactive", `Inactivos (${users.length - activeCount})`]] as const).map(([f, label]) => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                      padding: "5px 14px", borderRadius: 100, fontSize: 12, cursor: "pointer",
                      border: "1px solid " + (filter === f ? P : "#e2e8f0"),
                      background: filter === f ? PL : "#fff",
                      color: filter === f ? P : "#64748b",
                      fontWeight: filter === f ? 600 : 400,
                    }}>{label}</button>
                  ))}
                  <div style={{ width: 1, background: "#e2e8f0", margin: "0 2px" }} />
                  {([["all", "Todos"], ["yes", `Con cert. (${certCount})`], ["no", `Sin cert. (${users.length - certCount})`]] as const).map(([f, label]) => (
                    <button key={f} onClick={() => setCertFilter(f)} style={{
                      padding: "5px 14px", borderRadius: 100, fontSize: 12, cursor: "pointer",
                      border: "1px solid " + (certFilter === f ? "#d97706" : "#e2e8f0"),
                      background: certFilter === f ? "#fef3c7" : "#fff",
                      color: certFilter === f ? "#d97706" : "#64748b",
                      fontWeight: certFilter === f ? 600 : 400,
                    }}>{label}</button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      {["Email", "Registro", "Estado", "Progreso", "Cert.", "Último acceso", "País", "Dispositivo / OS"].map(h => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr
                        key={u.id}
                        onClick={() => setSelected(prev => prev?.id === u.id ? null : u)}
                        style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer", background: selected?.id === u.id ? PL : i % 2 === 0 ? "#fff" : "#fafafa", transition: "background 0.1s" }}
                      >
                        <td style={{ padding: "10px 16px", fontWeight: 500, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</td>
                        <td style={{ padding: "10px 16px", color: "#64748b", whiteSpace: "nowrap", fontSize: 12 }}>{fmt(u.created_at)}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: u.is_active ? "#dcfce7" : "#fee2e2", color: u.is_active ? "#16a34a" : "#dc2626" }}>
                            {u.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 64, height: 6, background: "#f1f5f9", borderRadius: 3, flexShrink: 0 }}>
                              <div style={{ height: "100%", width: `${Math.min(100, (u.progress_count / TOTAL_LESSONS) * 100)}%`, background: P, borderRadius: 3 }} />
                            </div>
                            <span style={{ color: "#64748b", fontSize: 12 }}>{Math.round((u.progress_count / TOTAL_LESSONS) * 100)}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 16px", textAlign: "center", color: u.has_certificate ? "#16a34a" : "#cbd5e1", fontWeight: 600 }}>{u.has_certificate ? "✓" : "—"}</td>
                        <td style={{ padding: "10px 16px", color: "#64748b", whiteSpace: "nowrap" }}>{fmt(u.last_sign_in_at)}</td>
                        <td style={{ padding: "10px 16px", color: "#64748b" }}>{u.last_country || "—"}</td>
                        <td style={{ padding: "10px 16px", color: "#64748b" }}>{[u.last_device, u.last_os].filter(Boolean).join(" · ") || "—"}</td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: "40px 16px", textAlign: "center", color: "#94a3b8" }}>Sin usuarios</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail panel */}
            {selected && (
              <div style={{ ...card, width: 300, flexShrink: 0, position: "sticky", top: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Detalle usuario</span>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>✕</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 13 }}>
                  {[
                    { label: "Email", value: selected.email },
                    { label: "Registro", value: fmt(selected.created_at) },
                    { label: "Último acceso", value: fmtDt(selected.last_sign_in_at) },
                  ].map(row => (
                    <div key={row.label}>
                      <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 2 }}>{row.label}</div>
                      <div style={{ wordBreak: "break-all" as const }}>{row.value}</div>
                    </div>
                  ))}

                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Estado</div>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: selected.is_active ? "#dcfce7" : "#fee2e2", color: selected.is_active ? "#16a34a" : "#dc2626" }}>
                      {selected.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Progreso</div>
                    <div>{selected.progress_count} / {TOTAL_LESSONS} lecciones ({Math.round((selected.progress_count / TOTAL_LESSONS) * 100)}%)</div>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, marginTop: 6 }}>
                      <div style={{ height: "100%", width: `${Math.min(100, (selected.progress_count / TOTAL_LESSONS) * 100)}%`, background: P, borderRadius: 3 }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Certificado</div>
                    <div>{selected.has_certificate ? "✓ Descargado" : "No descargado"}</div>
                  </div>

                  <div style={{ height: 1, background: "#e2e8f0" }} />

                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Dispositivo</div>
                    <div>{[selected.last_device, selected.last_os, selected.last_browser].filter(Boolean).join(" · ") || "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Ubicación</div>
                    <div>{[selected.last_city, selected.last_country].filter(Boolean).join(", ") || "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Última sesión registrada</div>
                    <div>{fmtDt(selected.last_session)}</div>
                  </div>

                  <div style={{ height: 1, background: "#e2e8f0" }} />

                  <button
                    onClick={() => toggleActive(selected)}
                    disabled={actionLoading}
                    style={{
                      padding: "9px 0", borderRadius: 6, border: "none", cursor: actionLoading ? "not-allowed" : "pointer",
                      fontWeight: 600, fontSize: 13, opacity: actionLoading ? 0.6 : 1,
                      background: selected.is_active ? "#fee2e2" : "#dcfce7",
                      color: selected.is_active ? "#dc2626" : "#16a34a",
                    }}
                  >
                    {selected.is_active ? "Desactivar usuario" : "Activar usuario"}
                  </button>
                  <button
                    onClick={() => sendReset(selected.email)}
                    style={{ padding: "9px 0", borderRadius: 6, border: "1px solid " + P, cursor: "pointer", fontWeight: 600, fontSize: 13, background: PL, color: P }}
                  >
                    Enviar reseteo de contraseña
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
