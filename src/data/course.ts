import type { CourseModule, QuizQuestion, SpreadDef } from "./types";

export const COURSE: CourseModule[] = [
  { t: "¿Qué es el Tarot?", i: "🌙", l: [{ id: "intro", t: "El tarot real" }, { id: "types", t: "Tipos de tarot" }, { id: "myths", t: "Mitos" }, { id: "q1", t: "✦ Test 1" }] },
  { t: "Estructura", i: "🗂", l: [{ id: "structure", t: "Mayores vs Menores" }, { id: "suits", t: "Los 4 palos" }, { id: "corr", t: "Correspondencias" }, { id: "memo", t: "Cómo memorizar" }, { id: "q2", t: "✦ Test 2" }] },
  { t: "Arcanos Mayores", i: "✦", l: [{ id: "maj1", t: "0–VII" }, { id: "maj2", t: "VIII–XIV" }, { id: "maj3", t: "XV–XXI" }, { id: "secrets", t: "🔍 Secretos ocultos" }, { id: "q3", t: "✦ Test Mayores" }] },
  { t: "Copas", i: "🏆", l: [{ id: "cuI", t: "Intro Copas" }, { id: "cuC", t: "14 cartas" }] },
  { t: "Espadas", i: "⚔", l: [{ id: "swI", t: "Intro Espadas" }, { id: "swC", t: "14 cartas" }] },
  { t: "Bastos", i: "🪄", l: [{ id: "waI", t: "Intro Bastos" }, { id: "waC", t: "14 cartas" }] },
  { t: "Pentáculos", i: "⭐", l: [{ id: "peI", t: "Intro Pentáculos" }, { id: "peC", t: "14 cartas" }] },
  { t: "Cómo Leer", i: "👁", l: [{ id: "prep", t: "Preparación y ritual" }, { id: "pica", t: "Método P.I.C.A." }, { id: "connect", t: "Conectar cartas" }, { id: "mistakes", t: "⚠ Errores comunes" }, { id: "protips", t: "Técnicas profesionales" }, { id: "q4", t: "✦ Test Lectura" }] },
  { t: "Tiradas", i: "◇", l: [{ id: "spreads", t: "5 tiradas" }, { id: "practice", t: "Practica" }] },
  { t: "Tu Camino", i: "📓", l: [{ id: "next", t: "Próximos pasos" }] },
];

export const QZ: Record<string, QuizQuestion[]> = {
  q1: [
    { q: "¿El tarot sirve para...?", o: ["Predecir el futuro", "Reflexionar", "Hablar con muertos"], c: 1 },
    { q: "¿Mejor baraja?", o: ["Marsella", "Rider-Waite", "Thoth"], c: 1 },
    { q: "¿Cuántas cartas?", o: ["22", "52", "78"], c: 2 },
  ],
  q2: [
    { q: "¿Cuántos Arcanos Mayores?", o: ["12", "22", "56"], c: 1 },
    { q: "Copas =", o: ["Dinero", "Emociones", "Mente"], c: 1 },
    { q: "Espadas =", o: ["Emociones", "Mente", "Acción"], c: 1 },
  ],
  q3: [
    { q: "¿Carta de nuevos comienzos?", o: ["El Mago", "El Loco", "El Sol"], c: 1 },
    { q: "La Muerte significa...", o: ["Muerte literal", "Transformación", "Mala suerte"], c: 1 },
    { q: "¿Carta más positiva?", o: ["Estrella", "Mundo", "Sol"], c: 2 },
    { q: "¿Carta de ataduras?", o: ["Torre", "Diablo", "Luna"], c: 1 },
  ],
  q4: [
    { q: "En P.I.C.A., P =", o: ["Predicción", "Posición", "Poder"], c: 1 },
    { q: "Tarotista debe...", o: ["Predecir exacto", "Orientar", "Solo buenas noticias"], c: 1 },
  ],
};

export const SPS: Record<string, SpreadDef> = {
  yn: { nm: "Sí o No", n: 1, p: ["Respuesta"] },
  ppf: { nm: "Pasado-Presente-Futuro", n: 3, p: ["Pasado", "Presente", "Futuro"] },
  cruz: { nm: "Cruz Simple", n: 5, p: ["Situación", "Pasado", "Futuro", "Consciente", "Inconsciente"] },
  amor: { nm: "El Amor", n: 5, p: ["Tú sientes", "Tu actitud", "Otro siente", "Su actitud", "Relación"] },
};
