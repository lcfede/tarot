import jsPDF from "jspdf";

export function drawCertificate(fullName: string, issuedDate: string, scale = 1): string {
  const W = 2480;
  const H = 1754;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(W * scale);
  canvas.height = Math.round(H * scale);
  const ctx = canvas.getContext("2d")!;
  if (scale !== 1) ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = "#0d0a1e";
  ctx.fillRect(0, 0, W, H);

  // Subtle radial glow in center
  const glow = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 900);
  glow.addColorStop(0, "rgba(44,17,80,0.7)");
  glow.addColorStop(1, "rgba(13,10,30,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Outer border
  ctx.strokeStyle = "rgba(201,168,76,0.9)";
  ctx.lineWidth = 5;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  // Inner border
  ctx.strokeStyle = "rgba(201,168,76,0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 70, W - 140, H - 140);

  // Corner ornaments
  const corners = [[90, 90], [W - 90, 90], [90, H - 90], [W - 90, H - 90]] as [number, number][];
  corners.forEach(([x, y]) => {
    ctx.strokeStyle = "rgba(201,168,76,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(201,168,76,0.5)";
    ctx.fill();
  });

  const text = (
    str: string,
    y: number,
    size: number,
    color: string,
    font = "normal",
    family = "Georgia, serif"
  ) => {
    ctx.font = `${font} ${size}px ${family}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(str, W / 2, y);
  };

  const line = (y: number, w: number, color: string, alpha = 1) => {
    const grad = ctx.createLinearGradient(W / 2 - w / 2, y, W / 2 + w / 2, y);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, "transparent");
    ctx.strokeStyle = grad;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - w / 2, y);
    ctx.lineTo(W / 2 + w / 2, y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  text("✦  VISIÓN TAROT  ✦", 200, 36, "#c9a84c");
  line(230, 600, "#c9a84c", 0.5);

  ctx.font = "bold 86px Georgia, serif";
  ctx.textAlign = "center";
  const titleGrad = ctx.createLinearGradient(W / 2 - 500, 0, W / 2 + 500, 0);
  titleGrad.addColorStop(0, "#f5e6a3");
  titleGrad.addColorStop(0.5, "#c9a84c");
  titleGrad.addColorStop(1, "#a07828");
  ctx.fillStyle = titleGrad;
  ctx.fillText("Certificado de Finalización", W / 2, 380);

  line(420, 900, "#c9a84c", 0.4);

  text("Se certifica que", 530, 38, "rgba(232,220,200,0.75)", "italic");

  ctx.font = "bold 110px Georgia, serif";
  ctx.textAlign = "center";
  const nameGrad = ctx.createLinearGradient(W / 2 - 600, 0, W / 2 + 600, 0);
  nameGrad.addColorStop(0, "#f5e6a3");
  nameGrad.addColorStop(0.5, "#fff8e7");
  nameGrad.addColorStop(1, "#f5e6a3");
  ctx.fillStyle = nameGrad;
  ctx.fillText(fullName, W / 2, 700);

  line(740, 800, "#c9a84c", 0.6);

  text("ha completado satisfactoriamente el curso completo de", 840, 36, "#e8dcc8");
  text("Tarot Rider-Waite", 920, 58, "#c9a84c", "bold");

  line(970, 500, "#c9a84c", 0.3);

  text("78 cartas  ·  10 módulos  ·  31 lecciones", 1040, 28, "rgba(201,168,76,0.6)");
  text("✦   ✦   ✦", 1140, 32, "rgba(201,168,76,0.4)");
  text(issuedDate, 1240, 28, "rgba(201,168,76,0.5)", "italic");
  text("visiontarot.com", H - 10 < 1680 ? 1650 : H - 80, 26, "rgba(201,168,76,0.35)");

  return canvas.toDataURL("image/jpeg", scale < 1 ? 0.75 : 0.95);
}

export function getPdfBase64(name: string, date: string): string {
  const imgData = drawCertificate(name, date, 0.5);
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.addImage(imgData, "JPEG", 0, 0, 297, 210);
  const bytes = new Uint8Array(doc.output("arraybuffer"));
  let binary = "";
  bytes.forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

export function downloadCertificatePdf(name: string, date: string) {
  const imgData = drawCertificate(name, date);
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.addImage(imgData, "JPEG", 0, 0, 297, 210);
  doc.save("certificado-vision-tarot.pdf");
}
