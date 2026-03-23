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

  // Fetch active oracle docs using the user's session
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader! } } }
  );

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
    // Score each doc by keyword relevance to the last user message
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

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("GROQ_API_KEY")}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: systemPrompt }, ...validMessages],
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

  // Log token usage + question
  const usage = groqData.usage || {};
  const lastQuestion = validMessages[validMessages.length - 1]?.content || "";
  const adminSupabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  await adminSupabase.from("oracle_usage").insert({
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
