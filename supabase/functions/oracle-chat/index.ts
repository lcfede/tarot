import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  const { messages } = await req.json() as { messages: { role: string; content: string }[] };

  // User-scoped client (for RLS-protected tables like oracle_docs)
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader! } } }
  );

  // Admin client (for quota checks and usage logging)
  const adminSupabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Compute per-user daily quota
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const [{ count: activeCount }, todayUserRes, adminRow] = await Promise.all([
    adminSupabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_active", true),
    user
      ? adminSupabase.from("oracle_usage").select("total_tokens").eq("user_id", user.id).gte("created_at", todayStart)
      : Promise.resolve({ data: [] as { total_tokens: number }[] }),
    user
      ? adminSupabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const isAdmin = !!(adminRow as { data: unknown }).data;
  const DAILY_LIMIT = 500_000;
  const activeUsers = Math.max(activeCount || 1, 1);
  const dailyLimitPerUser = Math.floor(DAILY_LIMIT / activeUsers);
  const todayUserTokens = ((todayUserRes as { data: { total_tokens: number }[] | null }).data || [])
    .reduce((s, r) => s + r.total_tokens, 0);

  if (!isAdmin && user && todayUserTokens >= dailyLimitPerUser) {
    return new Response(
      JSON.stringify({ quota_exceeded: true, daily_limit: dailyLimitPerUser }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }

  // Fetch active oracle docs using the user's session
  const { data: docs } = await supabase
    .from("oracle_docs")
    .select("title, content")
    .eq("active", true);

  const startIdx = messages.findIndex((m) => m.role === "user");
  const validMessages = startIdx >= 0 ? messages.slice(startIdx) : messages;

  let systemPrompt =
    "Eres el Oráculo de Visión Tarot. Enseñas tarot Rider-Waite en español. " +
    "Eres claro, práctico y das ejemplos concretos. Máximo 200 palabras por respuesta.";

  if (docs && docs.length > 0) {
    const MAX_CONTEXT_CHARS = 6000;
    const lastMsg = (validMessages[validMessages.length - 1]?.content || "").toLowerCase();
    const words = lastMsg.split(/\s+/).filter((w: string) => w.length > 3);
    const scored = (docs as { title: string; content: string }[])
      .map(d => {
        const text = (d.title + " " + d.content).toLowerCase();
        const score = words.reduce((s: number, w: string) => s + (text.includes(w) ? 1 : 0), 0);
        return { ...d, score };
      })
      .sort((a, b) => b.score - a.score);
    let context = "";
    for (const doc of scored) {
      const chunk = `## ${doc.title}\n${doc.content}\n\n---\n\n`;
      if (context.length + chunk.length > MAX_CONTEXT_CHARS) break;
      context += chunk;
    }
    if (context) systemPrompt += `\n\nUSA ESTE MATERIAL DE REFERENCIA PARA TUS RESPUESTAS:\n\n${context}`;
  }

  const recentMessages = validMessages.slice(-4);

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("GROQ_API_KEY")}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: systemPrompt }, ...recentMessages],
      max_tokens: 1000,
    }),
  });

  if (!groqRes.ok) {
    const err = await groqRes.text();
    return new Response(JSON.stringify({ text: "Error al consultar el oráculo.", error: err }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  const groqData = await groqRes.json();
  const text =
    groqData.choices?.[0]?.message?.content ||
    "No pude generar una respuesta en este momento.";

  // Log token usage + question + user_id
  const usage = groqData.usage || {};
  const lastQuestion = validMessages[validMessages.length - 1]?.content || "";
  await adminSupabase.from("oracle_usage").insert({
    user_id: user?.id || null,
    prompt_tokens: usage.prompt_tokens || 0,
    completion_tokens: usage.completion_tokens || 0,
    total_tokens: usage.total_tokens || 0,
    question: lastQuestion.slice(0, 500),
  });

  return new Response(JSON.stringify({ text }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
