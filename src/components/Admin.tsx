import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const TOTAL_LESSONS = 31;

const P = "#7c3aed";
const PL = "#ede9fe";

interface OracleDoc {
  id: string;
  title: string;
  content: string;
  source_type: string;
  active: boolean;
  created_at: string;
}

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

const CHUNK_SIZE = 3000;

function splitIntoChunks(text: string): string[] {
  if (text.length <= CHUNK_SIZE) return [text];
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let current = "";
  for (const para of paragraphs) {
    if (current.length + para.length + 2 > CHUNK_SIZE && current.length > 0) {
      chunks.push(current.trim());
      current = para;
    } else {
      current += (current ? "\n\n" : "") + para;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

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

interface DocGroup {
  baseTitle: string;
  chunks: OracleDoc[];
  totalChars: number;
  allActive: boolean;
  source_type: string;
  created_at: string;
  isChunked: boolean;
}

function groupDocs(docs: OracleDoc[]): DocGroup[] {
  const map = new Map<string, DocGroup>();
  for (const doc of docs) {
    const match = doc.title.match(/^(.+) \((\d+)\/\d+\)$/);
    const baseTitle = match ? match[1] : doc.title;
    if (!map.has(baseTitle)) {
      map.set(baseTitle, { baseTitle, chunks: [], totalChars: 0, allActive: true, source_type: doc.source_type, created_at: doc.created_at, isChunked: !!match });
    }
    const g = map.get(baseTitle)!;
    g.chunks.push(doc);
    g.totalChars += doc.content.length;
    if (!doc.active) g.allActive = false;
    if (doc.created_at < g.created_at) g.created_at = doc.created_at;
    if (match) g.isChunked = true;
  }
  for (const g of map.values()) {
    g.chunks.sort((a, b) => {
      const ma = a.title.match(/\((\d+)\/\d+\)$/);
      const mb = b.title.match(/\((\d+)\/\d+\)$/);
      return ma && mb ? parseInt(ma[1]) - parseInt(mb[1]) : 0;
    });
  }
  return Array.from(map.values());
}

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const tab: "dashboard" | "users" | "oraculo" =
    location.pathname.includes("/users") ? "users"
    : location.pathname.includes("/oraculo") ? "oraculo"
    : "dashboard";

  const [view, setView] = useState<"loading" | "login" | "panel">("loading");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [oracleDocs, setOracleDocs] = useState<OracleDoc[]>([]);
  const [oracleLoading, setOracleLoading] = useState(false);
  const [addForm, setAddForm] = useState({ title: "", content: "", source_type: "text" });
  const [addLoading, setAddLoading] = useState(false);
  const [pdfExtracting, setPdfExtracting] = useState(false);
  const [oracleStats, setOracleStats] = useState<{
    todayRequests: number; todayTokens: number;
    monthRequests: number; monthTokens: number;
    totalRequests: number; totalTokens: number;
    avgTokens: number;
    topKeywords: { word: string; count: number }[];
    recentQuestions: { question: string; created_at: string }[];
    userUsage: { userId: string; tokens: number; messages: number }[];
    adminUserIds: string[];
  } | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [certFilter, setCertFilter] = useState<"all" | "yes" | "no">("all");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  const [allQuestionsOpen, setAllQuestionsOpen] = useState(false);
  const [kwFilter, setKwFilter] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [userUsagePage, setUserUsagePage] = useState(0);
  const [oracleTab, setOracleTab] = useState<"stats" | "contenido">("stats");

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

  const loadOracleStats = async () => {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [todayRes, monthRes, totalRes, userUsageRes, adminUsersRes] = await Promise.all([
        supabase.from("oracle_usage").select("total_tokens").gte("created_at", todayStart),
        supabase.from("oracle_usage").select("total_tokens").gte("created_at", monthStart),
        supabase.from("oracle_usage").select("total_tokens, question, created_at").order("created_at", { ascending: false }),
        supabase.from("oracle_usage").select("user_id, total_tokens").gte("created_at", todayStart).not("user_id", "is", null),
        supabase.from("admin_users").select("user_id"),
      ]);
      const adminUserIds = (adminUsersRes.data || []).map((r: { user_id: string }) => r.user_id);

      const sum = (rows: { total_tokens: number }[] | null) =>
        (rows || []).reduce((s, r) => s + r.total_tokens, 0);

      const allRows = totalRes.data || [];
      const totalTokens = sum(allRows);
      const totalRequests = allRows.length;
      const avgTokens = totalRequests > 0 ? Math.round(totalTokens / totalRequests) : 0;

      // Top keywords from all questions
      const STOP_WORDS = new Set(["para","como","qué","que","una","los","las","del","con","por","cuando","este","esta","sobre","más","mas","tiene","puedo","puede","cual","cuál","son","hay","algo","todo","cómo","donde"]);
      const wordCount: Record<string, number> = {};
      allRows.forEach(r => {
        if (!r.question) return;
        r.question.toLowerCase().split(/\s+/).forEach((w: string) => {
          const clean = w.replace(/[^a-záéíóúñü]/gi, "");
          if (clean.length > 3 && !STOP_WORDS.has(clean)) {
            wordCount[clean] = (wordCount[clean] || 0) + 1;
          }
        });
      });
      const topKeywords = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }));

      const recentQuestions = allRows
        .filter(r => r.question)
        .map(r => ({ question: r.question as string, created_at: r.created_at as string }));

      // Per-user today usage
      const userUsageMap: Record<string, { tokens: number; messages: number }> = {};
      ((userUsageRes.data || []) as { user_id: string; total_tokens: number }[]).forEach(r => {
        if (!userUsageMap[r.user_id]) userUsageMap[r.user_id] = { tokens: 0, messages: 0 };
        userUsageMap[r.user_id].tokens += r.total_tokens;
        userUsageMap[r.user_id].messages += 1;
      });
      const userUsage = Object.entries(userUsageMap)
        .map(([userId, v]) => ({ userId, ...v }))
        .sort((a, b) => b.tokens - a.tokens);

      setOracleStats({
        todayRequests: todayRes.data?.length || 0,
        todayTokens: sum(todayRes.data),
        monthRequests: monthRes.data?.length || 0,
        monthTokens: sum(monthRes.data),
        totalRequests,
        totalTokens,
        avgTokens,
        topKeywords,
        recentQuestions,
        userUsage,
        adminUserIds,
      });
    } catch {
      setOracleStats({ todayRequests: 0, todayTokens: 0, monthRequests: 0, monthTokens: 0, totalRequests: 0, totalTokens: 0, avgTokens: 0, topKeywords: [], recentQuestions: [], userUsage: [], adminUserIds: [] });
    }
  };

  const loadOracleDocs = async () => {
    setOracleLoading(true);
    const { data } = await supabase.from("oracle_docs").select("*").order("created_at", { ascending: false });
    if (data) setOracleDocs(data as OracleDoc[]);
    setOracleLoading(false);
  };

  const addOracleDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title.trim() || !addForm.content.trim()) return;
    setAddLoading(true);
    const title = addForm.title.trim();
    const content = addForm.content.trim();
    const chunks = splitIntoChunks(content);
    const rows = chunks.map((chunk, i) => ({
      title: chunks.length > 1 ? `${title} (${i + 1}/${chunks.length})` : title,
      content: chunk,
      source_type: addForm.source_type,
    }));
    await supabase.from("oracle_docs").insert(rows);
    setAddForm({ title: "", content: "", source_type: "text" });
    await loadOracleDocs();
    setAddLoading(false);
    showToast(chunks.length > 1 ? `Dividido en ${chunks.length} partes y guardado` : "Contenido agregado al Oráculo");
  };

  const deleteAllOracleDocs = async () => {
    await supabase.from("oracle_docs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    setOracleDocs([]);
    setDeleteAllConfirm(false);
    showToast("Base de conocimiento eliminada");
  };

  const toggleOracleGroup = async (group: DocGroup) => {
    const newActive = !group.allActive;
    const ids = group.chunks.map(c => c.id);
    await supabase.from("oracle_docs").update({ active: newActive }).in("id", ids);
    setOracleDocs(ds => ds.map(d => ids.includes(d.id) ? { ...d, active: newActive } : d));
    showToast(newActive ? "Documento activado" : "Documento desactivado");
  };

  const deleteOracleGroup = async (group: DocGroup) => {
    const ids = group.chunks.map(c => c.id);
    await supabase.from("oracle_docs").delete().in("id", ids);
    setOracleDocs(ds => ds.filter(d => !ids.includes(d.id)));
    showToast("Documento eliminado");
  };

  const handlePdfUpload = async (file: File) => {
    setPdfExtracting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => ("str" in item ? (item as { str: string }).str : ""))
          .join(" ");
        fullText += pageText + "\n\n";
      }
      const extracted = fullText.trim();
      setAddForm(f => ({
        ...f,
        content: extracted,
        title: f.title || file.name.replace(/\.pdf$/i, ""),
      }));
    } catch {
      showToast("No se pudo extraer el texto del PDF. Verificá que no sea un PDF escaneado.");
    }
    setPdfExtracting(false);
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

  useEffect(() => {
    if (view === "panel" && tab === "oraculo") {
      loadOracleDocs();
      loadOracleStats();
    }
  }, [tab, view]);

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
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 16, outline: "none", boxSizing: "border-box" as const, color: "#1e293b" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Contraseña</label>
            <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 16, outline: "none", boxSizing: "border-box" as const, color: "#1e293b" }} />
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
      <style>{`
        .adm-header { padding: 0 32px; }
        .adm-body { padding: 32px; }
        .adm-tab { padding: 6px 16px; font-size: 14px; }
        .adm-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
        .adm-charts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .adm-oracle-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .adm-oracle-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .adm-form-row { display: flex; gap: 12px; }
        .adm-users-layout { display: flex; gap: 24px; align-items: flex-start; }
        .adm-table-wrap { overflow-x: auto; }
        .adm-detail { width: 300px; flex-shrink: 0; position: sticky; top: 24px; }
        @media (max-width: 768px) {
          input, textarea, select { font-size: 16px !important; }
          .adm-header { padding: 0 14px; }
          .adm-body { padding: 16px 12px; }
          .adm-tab { padding: 6px 10px; font-size: 13px; }
          .adm-kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .adm-charts-grid { grid-template-columns: 1fr; }
          .adm-oracle-kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .adm-oracle-meta-grid { grid-template-columns: 1fr; }
          .adm-form-row { flex-direction: column; }
          .adm-users-layout { flex-direction: column; }
          .adm-table-wrap { overflow-x: visible; }
          .adm-detail { width: 100% !important; position: static !important; }
          .col-md { display: none; }
          .adm-filters { flex-wrap: nowrap !important; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px; scrollbar-width: none; }
          .adm-filters::-webkit-scrollbar { display: none; }
          .adm-filters > * { flex-shrink: 0; }
        }
        @media (max-width: 540px) { .col-sm { display: none; } }
        @media (max-width: 390px) { .col-xs { display: none; } }
      `}</style>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div className="adm-header" style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: P }}>Admin</span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Visión Tarot</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {(["dashboard", "users", "oraculo"] as const).map(t => (
              <button key={t} onClick={() => navigate("/admin/" + t)} className="adm-tab" style={{
                borderRadius: 6, border: "none", cursor: "pointer",
                background: tab === t ? PL : "transparent",
                color: tab === t ? P : "#64748b",
                fontWeight: tab === t ? 600 : 400,
              }}>
                {t === "dashboard" ? "Dashboard" : t === "users" ? "Usuarios" : "Oráculo"}
              </button>
            ))}
          </div>
          <button
            onClick={() => { void supabase.auth.signOut().then(() => navigate("/admin/dashboard")); }}
            style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 6, padding: "6px 14px", color: "#64748b", fontSize: 13, cursor: "pointer" }}
          >
            Salir
          </button>
        </div>
      </div>

      {/* Keyword questions modal */}
      {kwFilter && oracleStats && (() => {
        const filtered = oracleStats.recentQuestions.filter(q =>
          q.question.toLowerCase().includes(kwFilter.toLowerCase())
        );
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
            onClick={() => setKwFilter(null)}>
            <div style={{ background: "#fff", borderRadius: 12, padding: "28px 24px", maxWidth: 560, width: "90%", maxHeight: "80vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>
                  Preguntas con «{kwFilter}»
                  <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 400, color: "#94a3b8" }}>{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
                </div>
                <button onClick={() => setKwFilter(null)}
                  style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 10px", color: "#64748b", fontSize: 13, cursor: "pointer" }}>
                  Cerrar
                </button>
              </div>
              <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                {filtered.length === 0 ? (
                  <div style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: 24 }}>Sin resultados.</div>
                ) : filtered.map((q, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#374151", background: "#f8fafc", borderRadius: 6, padding: "8px 12px", lineHeight: 1.5 }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>{fmtDt(q.created_at)}</div>
                    {q.question}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* All questions modal */}
      {allQuestionsOpen && oracleStats && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={() => setAllQuestionsOpen(false)}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "28px 24px", maxWidth: 560, width: "90%", maxHeight: "80vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>
                Todas las preguntas
                <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 400, color: "#94a3b8" }}>{oracleStats.recentQuestions.length} total</span>
              </div>
              <button onClick={() => setAllQuestionsOpen(false)}
                style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 10px", color: "#64748b", fontSize: 13, cursor: "pointer" }}>
                Cerrar
              </button>
            </div>
            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
              {oracleStats.recentQuestions.map((q, i) => (
                <div key={i} style={{ fontSize: 13, color: "#374151", background: "#f8fafc", borderRadius: 6, padding: "8px 12px" }}>
                  <span style={{ color: "#94a3b8", marginRight: 8, fontSize: 11 }}>{fmtDt(q.created_at)}</span>
                  {q.question}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete all confirmation modal */}
      {deleteAllConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={() => setDeleteAllConfirm(false)}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "32px 28px", maxWidth: 420, width: "90%", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 32, textAlign: "center", marginBottom: 12 }}>⚠️</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#1e293b", textAlign: "center", marginBottom: 8 }}>¿Eliminar toda la base de conocimiento?</div>
            <div style={{ fontSize: 13, color: "#64748b", textAlign: "center", lineHeight: 1.6, marginBottom: 24 }}>
              Se van a borrar <strong>{oracleDocs.length} documentos</strong> permanentemente. Esta acción no se puede deshacer.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteAllConfirm(false)}
                style={{ flex: 1, padding: "10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 14, cursor: "pointer", fontWeight: 500 }}
              >
                Cancelar
              </button>
              <button
                onClick={deleteAllOracleDocs}
                style={{ flex: 1, padding: "10px", borderRadius: 6, border: "none", background: "#dc2626", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 600 }}
              >
                Sí, eliminar todo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 16, right: 16, background: P, color: "#fff", padding: "12px 20px", borderRadius: 8, fontSize: 14, zIndex: 999, boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }}>
          {toast}
        </div>
      )}

      <div className="adm-body" style={{ maxWidth: 1280, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#94a3b8", fontSize: 14 }}>Cargando datos...</div>
        ) : tab === "dashboard" ? (
          /* ── DASHBOARD ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* KPI cards */}
            <div className="adm-kpi-grid">
              {kpis.map(k => (
                <div key={k.label} style={{ ...card, textAlign: "center" }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: k.color, lineHeight: 1.1 }}>{k.value}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="adm-charts-grid">
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
        ) : tab === "oraculo" ? (
          /* ── ORÁCULO ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Oracle sub-tabs */}
            <div style={{ display: "flex", gap: 2, background: "#f1f5f9", borderRadius: 8, padding: 4, alignSelf: "flex-start" }}>
              {([["stats", "Estadísticas"], ["contenido", "Base de conocimiento"]] as const).map(([t, label]) => (
                <button key={t} onClick={() => setOracleTab(t)} style={{
                  padding: "7px 18px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13,
                  background: oracleTab === t ? "#fff" : "transparent",
                  color: oracleTab === t ? "#1e293b" : "#64748b",
                  fontWeight: oracleTab === t ? 600 : 400,
                  boxShadow: oracleTab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s",
                }}>{label}</button>
              ))}
            </div>

            {oracleTab === "stats" ? (
              /* ── ESTADÍSTICAS ── */
              oracleStats ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                  {/* KPIs */}
                  <div style={card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>Uso del Oráculo · Groq llama-3.1-8b-instant</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>Free tier: 30 req/min · 6K tokens/min · 500K tokens/día</div>
                      </div>
                    </div>
                    {(() => {
                      const DAILY_LIMIT = 500_000;
                      const remaining = Math.max(0, DAILY_LIMIT - oracleStats.todayTokens);
                      const pct = remaining / DAILY_LIMIT;
                      const tokenColor = pct > 0.3 ? "#16a34a" : pct > 0.1 ? "#d97706" : "#dc2626";
                      const kpis = [
                        { label: "Mensajes hoy", value: oracleStats.todayRequests },
                        { label: "Mensajes este mes", value: oracleStats.monthRequests },
                        { label: "Mensajes totales", value: oracleStats.totalRequests },
                        { label: "Tokens promedio/msg", value: oracleStats.avgTokens.toLocaleString() },
                        { label: "Tokens hoy", value: oracleStats.todayTokens.toLocaleString() },
                        { label: "Tokens este mes", value: oracleStats.monthTokens.toLocaleString() },
                        { label: "Tokens totales", value: oracleStats.totalTokens.toLocaleString() },
                      ];
                      return (
                        <div className="adm-oracle-kpi-grid">
                          {kpis.map(s => (
                            <div key={s.label} style={{ background: "#f8fafc", borderRadius: 8, padding: "14px 16px" }}>
                              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>{s.label}</div>
                              <div style={{ fontSize: 22, fontWeight: 700, color: P }}>{s.value}</div>
                            </div>
                          ))}
                          <div style={{ background: "#f8fafc", borderRadius: 8, padding: "14px 16px", border: `1px solid ${tokenColor}33` }}>
                            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Tokens disponibles hoy</div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: tokenColor }}>{remaining.toLocaleString()}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>de 500.000 · {Math.round(pct * 100)}% restante</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Per-user consumption */}
                  {(() => {
                    const DAILY_LIMIT = 500_000;
                    const activeUsersCount = Math.max(users.filter(u => u.is_active).length, 1);
                    const limitPerUser = Math.floor(DAILY_LIMIT / activeUsersCount);
                    const avgMsg = oracleStats.avgTokens || 500;
                    const PAGE_SIZE = 5;
                    const enriched = oracleStats.userUsage
                      .map(u => {
                        const isAdmin = oracleStats.adminUserIds.includes(u.userId);
                        const userRow = users.find(ur => ur.id === u.userId);
                        if (!userRow && !isAdmin) return null;
                        const available = isAdmin ? Infinity : Math.max(0, limitPerUser - u.tokens);
                        return { ...u, email: isAdmin ? "ADMIN" : (userRow?.email ?? u.userId), available, availableMsgs: isAdmin ? Infinity : Math.floor(available / avgMsg), isAdmin };
                      })
                      .filter((u): u is NonNullable<typeof u> => u !== null)
                      .sort((a, b) => (b.isAdmin ? 1 : 0) - (a.isAdmin ? 1 : 0));
                    const totalPages = Math.ceil(enriched.length / PAGE_SIZE);
                    const page = Math.min(userUsagePage, Math.max(0, totalPages - 1));
                    const paged = enriched.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
                    return (
                      <div style={card}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>Consumo por usuario hoy</div>
                            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
                              Cuota equitativa: {limitPerUser.toLocaleString()} tokens/usuario · {activeUsersCount} usuario{activeUsersCount !== 1 ? "s" : ""} activo{activeUsersCount !== 1 ? "s" : ""}
                            </div>
                          </div>
                          {totalPages > 1 && (
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                              <button onClick={() => setUserUsagePage(p => Math.max(0, p - 1))} disabled={page === 0}
                                style={{ padding: "3px 10px", borderRadius: 5, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 12, cursor: page === 0 ? "default" : "pointer", opacity: page === 0 ? 0.4 : 1 }}>←</button>
                              <span style={{ fontSize: 11, color: "#94a3b8" }}>{page + 1} / {totalPages}</span>
                              <button onClick={() => setUserUsagePage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                                style={{ padding: "3px 10px", borderRadius: 5, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 12, cursor: page === totalPages - 1 ? "default" : "pointer", opacity: page === totalPages - 1 ? 0.4 : 1 }}>→</button>
                            </div>
                          )}
                        </div>
                        {enriched.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "28px 0", color: "#94a3b8", fontSize: 13 }}>Sin actividad hoy todavía.</div>
                        ) : (
                          <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                              <thead>
                                <tr style={{ background: "#f8fafc" }}>
                                  {["#", "Email", "Mensajes hoy", "Tokens hoy", "Tokens disponibles", "Mensajes disponibles"].map(h => (
                                    <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: 0.5, whiteSpace: "nowrap" as const }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {paged.map((u, i) => {
                                  const rank = page * PAGE_SIZE + i + 1;
                                  const usedPct = u.isAdmin ? 0 : (limitPerUser > 0 ? (u.tokens / limitPerUser) : 0);
                                  const barColor = u.isAdmin ? "#7c3aed" : usedPct < 0.6 ? "#16a34a" : usedPct < 0.85 ? "#d97706" : "#dc2626";
                                  return (
                                    <tr key={u.userId} style={{ borderTop: "1px solid #f1f5f9", background: u.isAdmin ? "#faf5ff" : i % 2 === 0 ? "#fff" : "#fafafa" }}>
                                      <td style={{ padding: "9px 12px", color: "#94a3b8", fontWeight: 600, width: 28 }}>{rank}</td>
                                      <td style={{ padding: "9px 12px", color: u.isAdmin ? "#7c3aed" : "#1e293b", fontWeight: u.isAdmin ? 700 : 500, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{u.email}</td>
                                      <td style={{ padding: "9px 12px", color: "#374151" }}>{u.messages}</td>
                                      <td style={{ padding: "9px 12px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                          <div style={{ width: 60, height: 5, background: "#f1f5f9", borderRadius: 3, flexShrink: 0 }}>
                                            <div style={{ height: "100%", width: `${Math.min(100, usedPct * 100)}%`, background: barColor, borderRadius: 3 }} />
                                          </div>
                                          <span style={{ color: "#374151" }}>{u.tokens.toLocaleString()}</span>
                                        </div>
                                      </td>
                                      <td style={{ padding: "9px 12px", color: u.isAdmin ? "#7c3aed" : u.available === 0 ? "#dc2626" : "#16a34a", fontWeight: 600 }}>{u.isAdmin ? "∞" : u.available.toLocaleString()}</td>
                                      <td style={{ padding: "9px 12px", color: u.isAdmin ? "#7c3aed" : u.availableMsgs === 0 ? "#dc2626" : "#374151" }}>{u.isAdmin ? "∞" : u.availableMsgs}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Keywords + recent questions */}
                  {(oracleStats.topKeywords.length > 0 || oracleStats.recentQuestions.length > 0) && (
                    <div className="adm-oracle-meta-grid">
                      {oracleStats.topKeywords.length > 0 && (
                        <div style={card}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 14 }}>Palabras más consultadas</div>
                          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                            {oracleStats.topKeywords.map(k => (
                              <span key={k.word} onClick={() => setKwFilter(k.word)} style={{
                                padding: "5px 12px", borderRadius: 100, fontSize: 12,
                                background: PL, color: P, fontWeight: 500, cursor: "pointer",
                              }}>
                                {k.word} <span style={{ opacity: 0.6 }}>({k.count})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {oracleStats.recentQuestions.length > 0 && (
                        <div style={card}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>Últimas preguntas</div>
                            {oracleStats.recentQuestions.length > 5 && (
                              <button onClick={() => setAllQuestionsOpen(true)}
                                style={{ fontSize: 12, color: P, background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>
                                Ver todas ({oracleStats.recentQuestions.length}) →
                              </button>
                            )}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {oracleStats.recentQuestions.slice(0, 5).map((q, i) => (
                              <div key={i} style={{ fontSize: 12, color: "#374151", background: "#f8fafc", borderRadius: 6, padding: "8px 12px" }}>
                                <span style={{ color: "#94a3b8", marginRight: 8 }}>{fmt(q.created_at)}</span>
                                {q.question.length > 80 ? q.question.slice(0, 80) + "..." : q.question}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: 60, color: "#94a3b8", fontSize: 13 }}>Cargando estadísticas...</div>
              )
            ) : (
              /* ── BASE DE CONOCIMIENTO ── */
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Add form */}
                <div style={card}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: "#1e293b" }}>Agregar contenido al Oráculo</div>
                  <form onSubmit={addOracleDoc} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="adm-form-row">
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Título</label>
                        <input
                          type="text"
                          value={addForm.title}
                          onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
                          placeholder="Ej: Arcanos Mayores — significados"
                          required
                          style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box" as const, color: "#1e293b" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Tipo</label>
                        <select
                          value={addForm.source_type}
                          onChange={e => setAddForm(f => ({ ...f, source_type: e.target.value, content: "" }))}
                          style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14, outline: "none", color: "#1e293b", background: "#fff", cursor: "pointer" }}
                        >
                          <option value="text">Texto</option>
                          <option value="pdf">PDF</option>
                        </select>
                      </div>
                    </div>
                    {addForm.source_type === "pdf" && (
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Archivo PDF</label>
                        <label style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                          border: "1px dashed #cbd5e1", borderRadius: 6, cursor: pdfExtracting ? "not-allowed" : "pointer",
                          background: pdfExtracting ? "#f8fafc" : "#fff", color: "#64748b", fontSize: 13,
                        }}>
                          <span style={{ fontSize: 18 }}>📄</span>
                          <span>{pdfExtracting ? "Extrayendo texto..." : addForm.content ? "PDF cargado — podés cambiar el archivo" : "Hacé click para seleccionar un PDF"}</span>
                          <input type="file" accept=".pdf" disabled={pdfExtracting}
                            onChange={e => { const f = e.target.files?.[0]; if (f) handlePdfUpload(f); }}
                            style={{ display: "none" }} />
                        </label>
                        {pdfExtracting && <div style={{ fontSize: 12, color: P, marginTop: 6 }}>Leyendo páginas del PDF...</div>}
                      </div>
                    )}
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                        {addForm.source_type === "pdf" ? "Texto extraído (revisá antes de guardar)" : "Contenido"}
                      </label>
                      <textarea
                        value={addForm.content}
                        onChange={e => setAddForm(f => ({ ...f, content: e.target.value }))}
                        required rows={8}
                        placeholder={addForm.source_type === "pdf" ? "El texto del PDF aparecerá aquí automáticamente..." : "Escribí o pegá el texto que el Oráculo debe conocer..."}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" as const, color: "#1e293b", resize: "vertical" as const, fontFamily: "inherit", lineHeight: 1.6 }}
                      />
                      {addForm.content && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{addForm.content.length.toLocaleString()} caracteres</div>}
                    </div>
                    <button type="submit" disabled={addLoading}
                      style={{ alignSelf: "flex-start", padding: "10px 24px", borderRadius: 6, border: "none", background: P, color: "#fff", fontWeight: 600, fontSize: 14, cursor: addLoading ? "not-allowed" : "pointer", opacity: addLoading ? 0.7 : 1 }}>
                      {addLoading ? "Guardando..." : "Agregar al Oráculo"}
                    </button>
                  </form>
                </div>

                {/* Docs list */}
                <div style={card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>Base de conocimiento</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
                        {oracleDocs.filter(d => d.active).length} activos · {oracleDocs.length} total
                      </div>
                    </div>
                    {oracleDocs.length > 0 && (
                      <button onClick={() => setDeleteAllConfirm(true)}
                        style={{ padding: "5px 14px", borderRadius: 6, border: "1px solid #fecaca", background: "#fff", color: "#dc2626", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                        Eliminar todos
                      </button>
                    )}
                  </div>
                  {oracleLoading ? (
                    <div style={{ textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 14 }}>Cargando...</div>
                  ) : oracleDocs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 14 }}>Sin contenido todavía. Agregá el primer documento arriba.</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {groupDocs(oracleDocs).map(group => {
                        const isExpanded = expandedGroups.has(group.baseTitle);
                        return (
                          <div key={group.baseTitle} style={{ border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden", background: group.allActive ? "#fff" : "#f8fafc", opacity: group.allActive ? 1 : 0.65 }}>
                            <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" as const }}>
                                  <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{group.baseTitle}</span>
                                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: "#f1f5f9", color: "#64748b", textTransform: "uppercase" as const, letterSpacing: 0.5 }}>{group.source_type}</span>
                                  {group.isChunked && (
                                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: PL, color: P, fontWeight: 600 }}>{group.chunks.length} partes</span>
                                  )}
                                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{group.totalChars.toLocaleString()} chars</span>
                                </div>
                                <div style={{ fontSize: 11, color: "#cbd5e1" }}>{fmt(group.created_at)}</div>
                              </div>
                              <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center", flexWrap: "wrap" as const }}>
                                {group.isChunked && (
                                  <button
                                    onClick={() => setExpandedGroups(prev => { const next = new Set(prev); if (next.has(group.baseTitle)) next.delete(group.baseTitle); else next.add(group.baseTitle); return next; })}
                                    style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 12, cursor: "pointer" }}>
                                    {isExpanded ? "▲ Ocultar" : "▼ Ver partes"}
                                  </button>
                                )}
                                <button onClick={() => toggleOracleGroup(group)} style={{
                                  padding: "5px 12px", borderRadius: 6,
                                  border: "1px solid " + (group.allActive ? "#e2e8f0" : "#16a34a"),
                                  background: group.allActive ? "#fff" : "#dcfce7",
                                  color: group.allActive ? "#64748b" : "#16a34a",
                                  fontSize: 12, cursor: "pointer", fontWeight: 500,
                                }}>{group.allActive ? "Desactivar" : "Activar"}</button>
                                <button
                                  onClick={() => { if (confirm(`¿Eliminar "${group.baseTitle}"${group.isChunked ? ` y sus ${group.chunks.length} partes` : ""}?`)) void deleteOracleGroup(group); }}
                                  style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #fecaca", background: "#fff", color: "#dc2626", fontSize: 12, cursor: "pointer" }}>
                                  Eliminar
                                </button>
                              </div>
                            </div>
                            {group.isChunked && isExpanded && (
                              <div style={{ borderTop: "1px solid #f1f5f9", background: "#f8fafc", padding: "8px 16px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                                {group.chunks.map((chunk, ci) => (
                                  <div key={chunk.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: "#64748b" }}>
                                    <span style={{ flexShrink: 0, fontWeight: 600, color: "#94a3b8", minWidth: 20 }}>{ci + 1}.</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <span style={{ color: "#374151", fontWeight: 500 }}>{chunk.content.length.toLocaleString()} chars</span>
                                      <span style={{ color: "#cbd5e1", marginLeft: 8 }}>{chunk.content.slice(0, 100)}{chunk.content.length > 100 ? "..." : ""}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── USUARIOS ── */
          <div className="adm-users-layout">
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
                <div className="adm-filters" style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
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
              <div className="adm-table-wrap" style={{ ...card, padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      {([
                        ["Email", ""],
                        ["Registro", "col-sm"],
                        ["Estado", ""],
                        ["Progreso", "col-xs"],
                        ["Cert.", "col-sm"],
                        ["Último acceso", "col-md"],
                        ["País", "col-md"],
                        ["Dispositivo / OS", "col-md"],
                      ] as [string, string][]).map(([h, cls]) => (
                        <th key={h} className={cls} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
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
                        <td style={{ padding: "10px 16px", fontWeight: 500, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</td>
                        <td className="col-sm" style={{ padding: "10px 16px", color: "#64748b", whiteSpace: "nowrap", fontSize: 12 }}>{fmt(u.created_at)}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: u.is_active ? "#dcfce7" : "#fee2e2", color: u.is_active ? "#16a34a" : "#dc2626" }}>
                            {u.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="col-xs" style={{ padding: "10px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 56, height: 6, background: "#f1f5f9", borderRadius: 3, flexShrink: 0 }}>
                              <div style={{ height: "100%", width: `${Math.min(100, (u.progress_count / TOTAL_LESSONS) * 100)}%`, background: P, borderRadius: 3 }} />
                            </div>
                            <span style={{ color: "#64748b", fontSize: 12 }}>{Math.round((u.progress_count / TOTAL_LESSONS) * 100)}%</span>
                          </div>
                        </td>
                        <td className="col-sm" style={{ padding: "10px 16px", textAlign: "center", color: u.has_certificate ? "#16a34a" : "#cbd5e1", fontWeight: 600 }}>{u.has_certificate ? "✓" : "—"}</td>
                        <td className="col-md" style={{ padding: "10px 16px", color: "#64748b", whiteSpace: "nowrap" }}>{fmt(u.last_sign_in_at)}</td>
                        <td className="col-md" style={{ padding: "10px 16px", color: "#64748b" }}>{u.last_country || "—"}</td>
                        <td className="col-md" style={{ padding: "10px 16px", color: "#64748b" }}>{[u.last_device, u.last_os].filter(Boolean).join(" · ") || "—"}</td>
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
              <div className="adm-detail" style={{ ...card }}>
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
