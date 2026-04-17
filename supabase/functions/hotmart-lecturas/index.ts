// hotmart-lecturas — webhook para compras del producto "Pack de Lecturas"
// Cuando llega PURCHASE_APPROVED:
//   1. Crea el usuario via generate_link (sin email de Supabase)
//   2. Inserta en user_products { product: 'readings' }
//   3. Crea el reading_pack con sessions_total según pack_type
//   4. Envía email de bienvenida via Resend (nuevo usuario o recompra)

const PACK_DESCRIPTIONS: Record<number, string> = {
  1: "1 lectura · 10 preguntas con Luna",
  3: "3 lecturas · 10 preguntas con Luna (cada una)",
  6: "6 lecturas · 12 preguntas con Luna (cada una)",
};

async function logPurchaseError(
  supabaseUrl: string,
  serviceKey: string,
  email: string | undefined,
  transactionId: string | undefined,
  reason: string,
) {
  try {
    await fetch(`${supabaseUrl}/rest/v1/purchase_errors`, {
      method: "POST",
      headers: {
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        email: email ?? null,
        hotmart_transaction_id: transactionId ?? null,
        error_reason: reason,
      }),
    });
  } catch (e) {
    console.error("Failed to log purchase error:", e);
  }
}

function buildEmailHtml(opts: {
  isNewUser: boolean;
  actionLink: string | null;
  packType: number;
}): string {
  const { isNewUser, actionLink, packType } = opts;
  const packDesc = PACK_DESCRIPTIONS[packType] ?? `${packType} lecturas`;

  const ctaText = isNewUser ? "Crear mi contraseña" : "Ir a mis lecturas";
  const ctaUrl = isNewUser && actionLink ? actionLink : "https://visiontarot.com/login";

  const mainMessage = isNewUser
    ? "Tu compra fue procesada exitosamente. Para acceder a tus lecturas, primero tenés que crear tu contraseña haciendo click en el botón de abajo:"
    : "Tu compra fue procesada exitosamente. Tus nuevas lecturas ya están disponibles en tu cuenta:";

  const footerNote = isNewUser
    ? `El link expira en 24 horas. Si no lo usás a tiempo, podés solicitar uno nuevo en <a href="https://visiontarot.com/forgot-password" style="color:#c9a84c;text-decoration:none;">visiontarot.com/forgot-password</a>`
    : `Ingresá con tu email y contraseña en <a href="https://visiontarot.com/login" style="color:#c9a84c;text-decoration:none;">visiontarot.com/login</a>`;

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
      <div style="color:rgba(201,168,76,0.45);font-size:10px;letter-spacing:2px;">Lecturas de Tarot con Luna</div>
    </div>

    <div style="padding:44px 40px 36px;">
      <h1 style="color:#1a0d2e;font-size:26px;margin:0 0 6px;font-weight:bold;line-height:1.3;">
        ¡Gracias por tu compra!
      </h1>
      <div style="width:48px;height:2px;background:linear-gradient(90deg,#c9a84c,#e9d8a6);margin:14px 0 24px;border-radius:2px;"></div>

      <p style="color:#374151;font-size:15px;margin:0 0 28px;line-height:1.75;">
        ${mainMessage}
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
        <div style="font-size:10px;color:#c9a84c;letter-spacing:4px;text-transform:uppercase;margin-bottom:16px;">Tu compra incluye</div>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:5px 0;font-size:14px;color:#374151;">&#10022; &nbsp;${packDesc}</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#374151;">&#10022; &nbsp;Luna, tu tarotista personal</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#374151;">&#10022; &nbsp;Cartas del mazo Rider-Waite</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#374151;">&#10022; &nbsp;Sin vencimiento</td></tr>
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

async function sendEmail(
  resendKey: string,
  email: string,
  isNewUser: boolean,
  actionLink: string | null,
  packType: number,
): Promise<void> {
  const subject = isNewUser
    ? "¡Bienvenida a Visión Tarot! Tus lecturas te esperan 🔮"
    : "¡Gracias! Tus nuevas lecturas ya están disponibles 🔮";

  const html = buildEmailHtml({ isNewUser, actionLink, packType });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Visión Tarot <hola@visiontarot.com>",
        to: [email],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
    } else {
      console.log(`Welcome email sent to ${email} (new: ${isNewUser})`);
    }
  } catch (e) {
    console.error("Failed to send welcome email:", e);
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // Verificar hottok
  const expectedHottok = Deno.env.get("HOTMART_HOTTOK");
  const receivedHottok =
    body.hottok ??
    (body.data as Record<string, unknown> | undefined)?.hottok ??
    req.headers.get("x-hotmart-hottok") ??
    req.headers.get("hottok");

  console.log("hottok match:", receivedHottok === expectedHottok);

  if (!expectedHottok || receivedHottok !== expectedHottok) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Solo procesar compras aprobadas
  const event = body.event as string;
  const data = body.data as Record<string, unknown> | undefined;
  const purchase = data?.purchase as Record<string, unknown> | undefined;
  const buyer = data?.buyer as Record<string, unknown> | undefined;

  if (event !== "PURCHASE_APPROVED" || purchase?.status !== "APPROVED") {
    return new Response(JSON.stringify({ ok: true, skipped: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const email = buyer?.email as string | undefined;
  const transactionId = purchase?.transaction as string | undefined;

  // Determinar pack_type por offer code de Hotmart
  const offerObj = purchase?.offer as Record<string, unknown> | undefined;
  const offerCode = (offerObj?.code as string | undefined) ?? "";
  const priceObj = purchase?.price as Record<string, unknown> | undefined;
  const pricePaid = typeof priceObj?.value === "number" ? priceObj.value : 0;

  let packType: number;
  if (offerCode === "osr5b44m") {
    packType = 1;
  } else if (offerCode === "ntyyhq9k") {
    packType = 3;
  } else if (offerCode === "z9ku7323") {
    packType = 6;
  } else if (pricePaid <= 6) {
    packType = 1;
  } else if (pricePaid <= 14) {
    packType = 3;
  } else {
    packType = 6;
  }

  console.log(`offerCode: ${offerCode}, pricePaid: ${pricePaid} → pack_type: ${packType}`);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const resendKey = Deno.env.get("RESEND_API_KEY")!;

  if (!email) {
    await logPurchaseError(supabaseUrl, serviceKey, undefined, transactionId, "Missing buyer email in webhook payload");
    return new Response("Missing buyer email", { status: 400 });
  }

  // 1. Crear usuario via generate_link (no envía email de Supabase)
  let userId: string | null = null;
  let isNewUser = false;
  let actionLink: string | null = null;

  const genRes = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
    method: "POST",
    headers: {
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "invite",
      email,
      redirect_to: "https://visiontarot.com/reset-password",
    }),
  });

  if (genRes.ok) {
    const genData = await genRes.json();
    actionLink = genData.action_link ?? null;
    userId = genData.user?.id ?? null;
    isNewUser = true;
    console.log(`New user created: ${email}, action_link obtained: ${!!actionLink}`);
  } else if (genRes.status === 422) {
    // Usuario ya existe — buscar su ID
    isNewUser = false;
    const usersRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      {
        headers: {
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
        },
      }
    );
    if (usersRes.ok) {
      const usersData = await usersRes.json();
      userId = usersData.users?.[0]?.id ?? null;
    }
    console.log(`Existing user: ${email}, userId: ${userId}`);
  } else {
    const err = await genRes.json();
    console.error("Error generating invite link:", err);
    await logPurchaseError(supabaseUrl, serviceKey, email, transactionId, `generate_link error ${genRes.status}: ${JSON.stringify(err)}`);
    return new Response(JSON.stringify({ error: err }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  if (!userId) {
    await logPurchaseError(supabaseUrl, serviceKey, email, transactionId, "Could not resolve user ID");
    return new Response("Could not resolve user ID", { status: 500 });
  }

  // 2. Insertar en user_products { product: 'readings' }
  await fetch(`${supabaseUrl}/rest/v1/user_products`, {
    method: "POST",
    headers: {
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      "Prefer": "resolution=ignore-duplicates",
    },
    body: JSON.stringify({ user_id: userId, product: "readings" }),
  });

  // 3. Crear el reading_pack
  const packRes = await fetch(`${supabaseUrl}/rest/v1/reading_packs`, {
    method: "POST",
    headers: {
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
    },
    body: JSON.stringify({
      user_id: userId,
      pack_type: packType,
      sessions_total: packType,
      sessions_used: 0,
    }),
  });

  if (!packRes.ok) {
    const err = await packRes.json();
    console.error("Error creating reading_pack:", err);
    await logPurchaseError(supabaseUrl, serviceKey, email, transactionId, `reading_pack insert error: ${JSON.stringify(err)}`);
    return new Response(JSON.stringify({ error: "Failed to create reading pack" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  console.log(`Pack ${packType} created for ${email} (user ${userId})`);

  // 4. Enviar email de bienvenida via Resend
  await sendEmail(resendKey, email, isNewUser, actionLink, packType);

  return new Response(JSON.stringify({ ok: true, pack_type: packType, user_id: userId, new_user: isNewUser }), {
    headers: { "Content-Type": "application/json" },
  });
});
