const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

const PACK_DESCRIPTIONS: Record<number, string> = {
  1: "1 lectura · 10 preguntas con Luna",
  3: "3 lecturas · 10 preguntas con Luna (cada una)",
  6: "6 lecturas · 12 preguntas con Luna (cada una)",
};

const PACK_QUESTIONS: Record<number, number> = { 1: 10, 3: 10, 6: 12 };

function getUserIdFromJwt(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

function buildGiftEmailHtml(opts: {
  isNewUser: boolean;
  actionLink: string | null;
  product: "course" | "readings" | "both";
  packType?: number;
}): string {
  const { isNewUser, actionLink, product, packType } = opts;

  const ctaUrl = isNewUser && actionLink ? actionLink : "https://visiontarot.com/login";
  const ctaText = isNewUser ? "Crear mi contraseña y acceder" : "Ir a mi cuenta";

  let giftTitle = "";
  let giftDesc = "";
  let includeItems: string[] = [];

  if (product === "course") {
    giftTitle = "¡Te regalaron el Curso de Tarot!";
    giftDesc = "Alguien especial te regaló acceso completo al curso de tarot de Visión Tarot.";
    includeItems = [
      "Curso completo de Tarot Rider-Waite",
      "Más de 30 lecciones",
      "Oráculo de consultas ilimitado",
      "Certificado al completar",
    ];
  } else if (product === "readings" && packType) {
    const packDesc = PACK_DESCRIPTIONS[packType] ?? `${packType} lecturas`;
    giftTitle = "¡Te regalaron lecturas de Tarot con Luna!";
    giftDesc = "Alguien especial te regaló una experiencia de tarot personalizada con Luna, tu tarotista de IA.";
    includeItems = [
      packDesc,
      "Luna, tu tarotista personal",
      "Cartas del mazo Rider-Waite",
      "Sin vencimiento",
    ];
  } else if (product === "both" && packType) {
    const packDesc = PACK_DESCRIPTIONS[packType] ?? `${packType} lecturas`;
    giftTitle = "¡Te regalaron el Curso + Lecturas de Tarot!";
    giftDesc = "Alguien especial te regaló acceso completo al curso de tarot y lecturas personalizadas con Luna.";
    includeItems = [
      "Curso completo de Tarot Rider-Waite",
      packDesc,
      "Luna, tu tarotista personal",
      "Oráculo de consultas ilimitado",
      "Certificado al completar el curso",
    ];
  }

  const footerNote = isNewUser
    ? `El link expira en 24hs. Si no lo usás a tiempo, podés solicitar uno nuevo en <a href="https://visiontarot.com/forgot-password" style="color:#c9a84c;text-decoration:none;">visiontarot.com/forgot-password</a>`
    : `Ingresá con tu email y contraseña en <a href="https://visiontarot.com/login" style="color:#c9a84c;text-decoration:none;">visiontarot.com/login</a>`;

  const itemsHtml = includeItems
    .map(item => `<tr><td style="padding:5px 0;font-size:14px;color:#374151;">&#10022; &nbsp;${item}</td></tr>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f4f0ff;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <div style="background:linear-gradient(135deg,#0d0a1e 0%,#1a0d2e 50%,#2d1150 100%);padding:48px 40px;text-align:center;">
      <div style="color:#c9a84c;font-size:36px;margin-bottom:10px;">&#10022;</div>
      <div style="color:#c9a84c;font-size:11px;letter-spacing:6px;text-transform:uppercase;margin-bottom:6px;">Visión Tarot</div>
      <div style="color:rgba(201,168,76,0.45);font-size:10px;letter-spacing:2px;">Un regalo para vos</div>
    </div>

    <div style="padding:44px 40px 36px;">
      <h1 style="color:#1a0d2e;font-size:24px;margin:0 0 6px;font-weight:bold;line-height:1.3;">
        ${giftTitle}
      </h1>
      <div style="width:48px;height:2px;background:linear-gradient(90deg,#c9a84c,#e9d8a6);margin:14px 0 24px;border-radius:2px;"></div>

      <p style="color:#374151;font-size:15px;margin:0 0 10px;line-height:1.75;">
        ${giftDesc}
      </p>

      <p style="color:#374151;font-size:15px;margin:0 0 28px;line-height:1.75;">
        ${isNewUser ? "Para acceder, creá tu contraseña haciendo click en el botón de abajo:" : "Ya podés acceder con tu cuenta existente:"}
      </p>

      <div style="text-align:center;margin-bottom:32px;">
        <a href="${ctaUrl}"
          style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#a07828);color:#fff;padding:15px 40px;border-radius:4px;text-decoration:none;font-size:12px;letter-spacing:4px;text-transform:uppercase;font-family:Georgia,serif;">
          ${ctaText}
        </a>
      </div>

      <p style="color:#9ca3af;font-size:12px;margin:0 0 28px;line-height:1.6;text-align:center;">
        ${footerNote}
      </p>

      <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.25),transparent);margin:0 0 28px;"></div>

      <div style="background:linear-gradient(135deg,#fffdf5,#fff8e7);border:1px solid #e9d8a6;border-radius:8px;padding:24px 28px;margin-bottom:12px;">
        <div style="font-size:10px;color:#c9a84c;letter-spacing:4px;text-transform:uppercase;margin-bottom:16px;">Tu regalo incluye</div>
        <table style="width:100%;border-collapse:collapse;">
          ${itemsHtml}
        </table>
      </div>
    </div>

    <div style="padding:20px 40px;background:#fafafa;border-top:1px solid #f1f5f9;text-align:center;">
      <div style="font-size:11px;color:#9ca3af;letter-spacing:1px;margin-bottom:6px;">visiontarot.com</div>
      <div style="font-size:11px;color:#c9a84c;letter-spacing:1px;">hola@visiontarot.com</div>
    </div>

  </div>
</body>
</html>`;
}

async function sendGiftEmail(
  resendKey: string,
  email: string,
  opts: { isNewUser: boolean; actionLink: string | null; product: "course" | "readings" | "both"; packType?: number },
): Promise<{ ok: boolean; error?: string }> {
  let subject = "";
  if (opts.product === "course") subject = "¡Te regalaron el Curso de Tarot! 🔮";
  else if (opts.product === "readings") subject = "¡Te regalaron lecturas de Tarot con Luna! 🔮";
  else subject = "¡Te regalaron el Curso + Lecturas de Tarot! 🔮";

  const html = buildGiftEmailHtml(opts);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Visión Tarot <hola@visiontarot.com>", to: [email], subject, html }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error:", res.status, errText);
      return { ok: false, error: `Resend ${res.status}: ${errText}` };
    }
    console.log(`Gift email sent to ${email} (product: ${opts.product})`);
    return { ok: true };
  } catch (e) {
    console.error("Failed to send gift email:", e);
    return { ok: false, error: String(e) };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401, headers: CORS });

  const jwt = authHeader.slice(7);
  const callerId = getUserIdFromJwt(jwt);
  if (!callerId) return new Response("Unauthorized", { status: 401, headers: CORS });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const resendKey = Deno.env.get("RESEND_API_KEY")!;

  // Verificar que el caller es admin
  const adminCheck = await fetch(
    `${supabaseUrl}/rest/v1/admin_users?user_id=eq.${callerId}&select=user_id`,
    { headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}` } },
  );
  const adminRows = await adminCheck.json();
  if (!Array.isArray(adminRows) || adminRows.length === 0) {
    return new Response("Forbidden", { status: 403, headers: CORS });
  }

  let email: string;
  let product: "course" | "readings" | "both";
  let packType: number | undefined;
  try {
    const body = await req.json();
    email = body.email?.trim().toLowerCase();
    product = body.product;
    packType = body.pack_type ? Number(body.pack_type) : undefined;
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: CORS });
  }

  if (!email) return new Response("Missing email", { status: 400, headers: CORS });
  if (!["course", "readings", "both"].includes(product)) return new Response("Invalid product", { status: 400, headers: CORS });
  if ((product === "readings" || product === "both") && !packType) return new Response("Missing pack_type for readings", { status: 400, headers: CORS });

  // Crear o buscar usuario via generate_link (no envía email de Supabase)
  let userId: string | null = null;
  let isNewUser = false;
  let actionLink: string | null = null;

  const genRes = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
    method: "POST",
    headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ type: "invite", email, redirect_to: "https://visiontarot.com/reset-password" }),
  });

  if (genRes.ok) {
    const genData = await genRes.json();
    console.log("generate_link response keys:", Object.keys(genData));
    actionLink = genData.action_link ?? null;
    // El user puede estar en diferentes lugares según la versión de GoTrue
    userId = genData.user?.id ?? genData.data?.user?.id ?? null;
    isNewUser = true;
    console.log(`New user created: ${email}, userId from response: ${userId}`);
  } else if (genRes.status === 422) {
    isNewUser = false;
    console.log(`User already exists: ${email}`);
  } else {
    const err = await genRes.json();
    console.error("generate_link error:", err);
    return new Response(JSON.stringify({ error: "Failed to create user" }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // Si no tenemos userId todavía (nuevo o existente), buscamos por email
  if (!userId) {
    console.log(`Looking up user by email: ${email}`);
    const usersRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?filter=${encodeURIComponent(email)}&per_page=1000`,
      { headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}` } },
    );
    if (usersRes.ok) {
      const usersData = await usersRes.json();
      console.log("Users lookup total:", usersData.users?.length ?? 0);
      const found = (usersData.users ?? []).find(
        (u: { email: string }) => u.email?.toLowerCase() === email.toLowerCase()
      );
      userId = found?.id ?? null;
      console.log(`User lookup result: ${userId}`);
    } else {
      console.error("Users lookup failed:", usersRes.status, await usersRes.text());
    }
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Could not resolve user ID" }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // Insertar en user_products según producto
  const productsToInsert: string[] = [];
  if (product === "course" || product === "both") productsToInsert.push("course");
  if (product === "readings" || product === "both") productsToInsert.push("readings");

  for (const prod of productsToInsert) {
    await fetch(`${supabaseUrl}/rest/v1/user_products`, {
      method: "POST",
      headers: {
        "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json", "Prefer": "resolution=ignore-duplicates",
      },
      body: JSON.stringify({ user_id: userId, product: prod }),
    });
  }

  // Crear reading_pack si corresponde (con is_gift: true)
  if ((product === "readings" || product === "both") && packType) {
    const questionsPerSession = PACK_QUESTIONS[packType] ?? 10;
    const packRes = await fetch(`${supabaseUrl}/rest/v1/reading_packs`, {
      method: "POST",
      headers: {
        "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json", "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        user_id: userId,
        pack_type: packType,
        sessions_total: packType,
        sessions_used: 0,
        is_gift: true,
      }),
    });
    if (!packRes.ok) {
      const err = await packRes.text();
      console.error("reading_pack insert error:", err);
      return new Response(JSON.stringify({ error: "Failed to create reading pack" }), {
        status: 500, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }
    console.log(`Gift pack ${packType} (${questionsPerSession} preguntas/sesión) created for ${email}`);
  }

  // Enviar email de regalo via Resend
  const emailResult = await sendGiftEmail(resendKey, email, { isNewUser, actionLink, product, packType });

  return new Response(
    JSON.stringify({ ok: true, new_user: isNewUser, user_id: userId, product, pack_type: packType ?? null, email_sent: emailResult.ok, email_error: emailResult.error ?? null }),
    { headers: { ...CORS, "Content-Type": "application/json" } },
  );
});
