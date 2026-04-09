const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

function getUserIdFromJwt(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401, headers: CORS });
  }

  const jwt = authHeader.slice(7);
  const userId = getUserIdFromJwt(jwt);
  if (!userId) {
    return new Response("Unauthorized", { status: 401, headers: CORS });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Verify caller is admin
  const adminCheck = await fetch(
    `${supabaseUrl}/rest/v1/admin_users?user_id=eq.${userId}&select=user_id`,
    {
      headers: {
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
      },
    },
  );
  const adminRows = await adminCheck.json();
  if (!Array.isArray(adminRows) || adminRows.length === 0) {
    return new Response("Forbidden", { status: 403, headers: CORS });
  }

  let email: string;
  let errorId: string | undefined;
  try {
    const body = await req.json();
    email = body.email;
    errorId = body.error_id;
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: CORS });
  }

  if (!email) {
    return new Response("Missing email", { status: 400, headers: CORS });
  }

  // Try to invite (creates user + sends welcome email)
  const inviteRes = await fetch(`${supabaseUrl}/auth/v1/invite`, {
    method: "POST",
    headers: {
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      redirect_to: "https://visiontarot.com/reset-password",
    }),
  });

  let action: string;

  if (inviteRes.ok) {
    action = "invited";
  } else if (inviteRes.status === 422) {
    // User already exists → send password reset
    await fetch(`${supabaseUrl}/auth/v1/recover`, {
      method: "POST",
      headers: {
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        redirect_to: "https://visiontarot.com/reset-password",
      }),
    });
    action = "reset_sent";
  } else {
    const err = await inviteRes.json();
    return new Response(JSON.stringify({ error: err }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // Mark purchase error as resolved if errorId provided
  if (errorId) {
    await fetch(
      `${supabaseUrl}/rest/v1/purchase_errors?id=eq.${errorId}`,
      {
        method: "PATCH",
        headers: {
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({ resolved: true }),
      },
    );
  }

  return new Response(JSON.stringify({ ok: true, action }), {
    headers: { ...CORS, "Content-Type": "application/json" },
  });
});
