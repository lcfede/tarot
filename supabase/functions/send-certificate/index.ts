const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { email, fullName, issuedDate, pdfBase64 } = await req.json();

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f0ff;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0d0a1e 0%,#1a0d2e 50%,#2d1150 100%);padding:40px;text-align:center;">
      <div style="color:#c9a84c;font-size:32px;margin-bottom:8px;">✦</div>
      <div style="color:#c9a84c;font-size:11px;letter-spacing:5px;text-transform:uppercase;margin-bottom:4px;">Visión Tarot</div>
      <div style="color:rgba(201,168,76,0.4);font-size:10px;letter-spacing:2px;">78 cartas · Curso completo</div>
    </div>

    <div style="padding:40px 40px 32px;">
      <h1 style="color:#1a0d2e;font-size:26px;margin:0 0 8px;font-weight:bold;">¡Felicitaciones, ${fullName}!</h1>
      <p style="color:#64748b;font-size:14px;margin:0 0 24px;line-height:1.7;">
        Completaste el curso completo de <strong style="color:#1e293b;">Tarot Rider-Waite</strong>. Ya tenés todas las herramientas para leer las 78 cartas de manera profesional.
      </p>

      <div style="border:1px solid #e9d8a6;border-radius:8px;padding:24px;margin:0 0 24px;text-align:center;background:linear-gradient(135deg,#fffdf5,#fff8e7);">
        <div style="font-size:10px;color:#c9a84c;letter-spacing:4px;text-transform:uppercase;margin-bottom:10px;">Certificado emitido</div>
        <div style="font-size:22px;color:#1a0d2e;font-weight:bold;margin-bottom:6px;">${fullName}</div>
        <div style="width:80px;height:1px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:0 auto 10px;"></div>
        <div style="font-size:12px;color:#94a3b8;font-style:italic;">Tarot Rider-Waite · 78 cartas · 10 módulos · 31 lecciones</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:6px;">${issuedDate}</div>
      </div>

      <p style="color:#64748b;font-size:14px;line-height:1.7;margin:0 0 28px;">
        Tu certificado está adjunto a este email en formato PDF. También podés descargarlo en cualquier momento desde la plataforma.
      </p>

      <div style="text-align:center;">
        <a href="https://visiontarot.com/curso"
          style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#a07828);color:#fff;padding:13px 32px;border-radius:4px;text-decoration:none;font-size:12px;letter-spacing:3px;text-transform:uppercase;">
          Volver al curso
        </a>
      </div>
    </div>

    <div style="padding:20px 40px;border-top:1px solid #f1f5f9;text-align:center;">
      <div style="font-size:11px;color:#94a3b8;letter-spacing:1px;">visiontarot.com</div>
    </div>
  </div>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Visión Tarot <hola@visiontarot.com>",
      to: [email],
      subject: `¡Felicitaciones ${fullName}! Tu certificado de Tarot Rider-Waite`,
      html,
      attachments: [
        {
          filename: "certificado-vision-tarot.pdf",
          content: pdfBase64,
        },
      ],
    }),
  });

  const result = await res.json();
  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: res.ok ? 200 : 500,
  });
});
