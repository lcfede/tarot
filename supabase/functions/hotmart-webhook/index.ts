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

  // Verify Hotmart hottok — busca en todas las ubicaciones posibles
  const expectedHottok = Deno.env.get("HOTMART_HOTTOK");
  const receivedHottok =
    body.hottok ??
    (body.data as Record<string, unknown> | undefined)?.hottok ??
    req.headers.get("x-hotmart-hottok") ??
    req.headers.get("hottok");

  console.log("hottok received:", receivedHottok ? "present" : "missing");
  console.log("hottok match:", receivedHottok === expectedHottok);

  if (!expectedHottok || receivedHottok !== expectedHottok) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Only process approved purchases
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

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  if (!email) {
    await logPurchaseError(supabaseUrl, serviceKey, undefined, transactionId, "Missing buyer email in webhook payload");
    return new Response("Missing buyer email", { status: 400 });
  }

  // inviteUserByEmail creates the user and sends them an email
  // to set their password. If the user already exists it returns 422.
  const res = await fetch(`${supabaseUrl}/auth/v1/invite`, {
    method: "POST",
    headers: {
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      data: { hotmart_purchase_id: transactionId },
      redirect_to: "https://visiontarot.com/reset-password",
    }),
  });

  if (!res.ok) {
    // 422 = user already exists → they already have access, not an error
    if (res.status === 422) {
      return new Response(JSON.stringify({ ok: true, existing_user: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    const err = await res.json();
    console.error("Error inviting user:", err);
    await logPurchaseError(supabaseUrl, serviceKey, email, transactionId, `Invite API error ${res.status}: ${JSON.stringify(err)}`);
    return new Response(JSON.stringify({ error: err }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
