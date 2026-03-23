import { useState, type ReactNode } from "react";
import type { TarotCard } from "../data/types";
import { MAJOR, CU, SWD, WND, PNT } from "../data/cards";
import { hf } from "../constants";
import CardGrid from "./CardGrid";
import CardDetail from "./CardDetail";
import QuizW from "./QuizW";
import SpreadPractice from "./SpreadPractice";

interface Props {
  id: string;
  onDone: (id: string) => void;
}

/* Shared layout primitives */
const P = ({ children }: { children: ReactNode }) => (
  <p style={{ color: "#e8dcc8", lineHeight: 1.75, fontSize: 14, margin: "0 0 14px" }}>{children}</p>
);
const H = ({ children }: { children: ReactNode }) => (
  <h3 style={{ color: "#c9a84c", fontFamily: hf, fontSize: 17, margin: "24px 0 10px", letterSpacing: 0.5 }}>{children}</h3>
);
const Li = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
    <span style={{ color: "#c9a84c", fontSize: 10, marginTop: 4, flexShrink: 0 }}>{"✦"}</span>
    <span style={{ color: "#e8dcc8", lineHeight: 1.65, fontSize: 13 }}>{children}</span>
  </div>
);
const Tip = ({ children }: { children: ReactNode }) => (
  <div style={{ padding: "14px 18px", borderRadius: 4, background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderLeft: "3px solid rgba(201,168,76,0.5)", margin: "18px 0" }}>
    <p style={{ color: "#e8dcc8", lineHeight: 1.7, fontSize: 13, margin: 0, fontStyle: "italic" }}>{children}</p>
  </div>
);

function End({ onDone }: { onDone: () => void }) {
  return (
    <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(201,168,76,0.12)", textAlign: "right" }}>
      <button
        onClick={onDone}
        style={{
          padding: "10px 28px", borderRadius: 4,
          border: "1px solid #c9a84c",
          background: "linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.08))",
          color: "#f5e6a3", fontSize: 12, cursor: "pointer",
          fontFamily: "Georgia,serif", letterSpacing: 3, textTransform: "uppercase",
        }}
      >
        {"Completar ✦"}
      </button>
    </div>
  );
}

function W({ title, children, onDone }: { title: string; children: ReactNode; onDone: () => void }) {
  return (
    <div>
      <h2 style={{ fontFamily: hf, color: "#f0e6d3", fontSize: 26, margin: "0 0 6px", letterSpacing: 0.5, fontWeight: 700 }}>{title}</h2>
      <div style={{ width: 160, height: 1, background: "linear-gradient(90deg,#c9a84c,transparent)", marginBottom: 22 }} />
      {children}
      <End onDone={onDone} />
    </div>
  );
}

function WQ({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: hf, color: "#f0e6d3", fontSize: 26, margin: "0 0 6px", letterSpacing: 0.5, fontWeight: 700 }}>{title}</h2>
      <div style={{ width: 160, height: 1, background: "linear-gradient(90deg,#c9a84c,transparent)", marginBottom: 22 }} />
      {children}
    </div>
  );
}

export default function Lesson({ id, onDone }: Props) {
  const [sel, setSel] = useState<TarotCard | null>(null);

  if (sel) return <CardDetail c={sel} onBack={() => setSel(null)} />;

  const dn = () => onDone(id);

  switch (id) {
    case "intro": return (
      <W title="El Tarot No Es Lo Que Crees" onDone={dn}>
        <P>Olvida todo lo que has visto en películas. Olvida a la señora misteriosa con bola de cristal en una feria. Olvida la idea de que el tarot es algo oscuro, peligroso o reservado para personas con poderes especiales.</P>
        <P>El tarot es, en su esencia, un <strong>sistema de 78 imágenes simbólicas</strong> que representan todos los arquetipos de la experiencia humana: el amor, el miedo, el cambio, la pérdida, el éxito, la duda, la transformación, la alegría, el conflicto y la resolución.</P>
        <P>Cuando haces una lectura de tarot, no estás invocando fuerzas oscuras ni prediciendo un destino inevitable. Estás usando estas imágenes como un <strong>espejo</strong> para reflexionar sobre tu vida, tus decisiones y tus emociones. Es como tener una conversación profunda contigo mismo, con las cartas como guía visual.</P>
        <H>{"¿Para qué sirve realmente?"}</H>
        <Li><strong>Autoconocimiento:</strong> te ayuda a ver patrones en tu comportamiento, relaciones y decisiones que quizás no notabas. Es como tener un espejo que no miente.</Li>
        <Li><strong>Toma de decisiones:</strong> no te dice qué hacer, pero te muestra las diferentes perspectivas y energías de una situación. Te da un marco para pensar con más claridad.</Li>
        <Li><strong>Reflexión emocional:</strong> pone nombre a emociones o situaciones que sentías pero no sabías articular. Muchas veces sabes que algo no va bien pero no puedes explicar qué — el tarot te ayuda a verlo.</Li>
        <Li><strong>Orientación práctica:</strong> ofrece un punto de partida para reflexionar sobre problemas concretos: una relación, un cambio de trabajo, una decisión importante.</Li>
        <H>{"¿Qué NO es el tarot?"}</H>
        <P>El tarot <strong>no predice un futuro fijo</strong>. No existe un destino escrito en piedra. Las cartas muestran tendencias, energías y posibilidades basadas en el momento presente. Tú siempre tienes el poder de elegir y cambiar el curso.</P>
        <P>El tarot <strong>no es terapia ni consejo médico</strong>. Es una herramienta complementaria, no un sustituto de un profesional de la salud mental.</P>
        <P>El tarot <strong>no requiere creencias sobrenaturales</strong>. Puedes usarlo desde un enfoque completamente psicológico (los arquetipos de Jung, por ejemplo) o desde un enfoque espiritual. Ambos caminos son válidos.</P>
        <Tip>A lo largo de este curso, vas a aprender las 78 cartas, a hacer tiradas, a interpretar con un método profesional y a conectar las cartas entre sí para contar historias. Al final, tendrás todas las herramientas para hacer lecturas reales — para ti y para otros.</Tip>
      </W>
    );

    case "types": return (
      <W title="Tipos de Tarot" onDone={dn}>
        <P>Existen muchas barajas de tarot en el mundo, pero todas comparten la misma estructura básica: 78 cartas divididas en Arcanos Mayores y Menores. Lo que cambia es el estilo artístico, la simbología y la profundidad de interpretación.</P>
        <P>Conocer los principales tipos te ayudará a entender por qué usamos una baraja específica en este curso y qué opciones tienes a futuro.</P>
        <H>{"🃏 Rider-Waite-Smith (1909)"}</H>
        <P>Creada por Arthur Edward Waite e ilustrada por Pamela Colman Smith. Es <strong>la baraja más usada del mundo</strong> y la que usaremos en todo este curso. Su gran innovación fue que CADA carta — incluso los Arcanos Menores — tiene una imagen que cuenta una historia.</P>
        <P>Esto es fundamental para principiantes porque la imagen misma te guía en la interpretación. No necesitas memorizar listas abstractas: miras la carta, observas la escena, y la interpretación fluye de forma natural.</P>
        <Li><strong>Ventaja:</strong> visual, narrativa, intuitiva. Ideal para aprender.</Li>
        <Li><strong>Disponibilidad:</strong> se consigue en cualquier parte del mundo por $10-25 USD.</Li>
        <Li><strong>Recursos:</strong> el 90% de los libros y cursos de tarot usan esta baraja como referencia.</Li>
        <H>{"🏛 Tarot de Marsella"}</H>
        <P>Es más antiguo (siglo XVII) y tiene un estilo mucho más geométrico y simbólico. Los Arcanos Menores solo muestran el número de elementos del palo (por ejemplo, el 5 de Espadas muestra cinco espadas dibujadas, sin personajes ni escena narrativa).</P>
        <P>Esto lo hace más abstracto y requiere más experiencia para leer, ya que dependes más de la memorización y menos de la imagen. Muchos tarotistas avanzados lo prefieren por su profundidad simbólica.</P>
        <H>{"🔺 Tarot de Thoth"}</H>
        <P>Creado por Aleister Crowley e ilustrado por Lady Frieda Harris. Es artísticamente hermoso pero extremadamente complejo. Incorpora astrología, cábala, numerología y alquimia en cada carta. Definitivamente <strong>no recomendado para principiantes</strong>.</P>
        <H>{"🎨 Barajas modernas e independientes"}</H>
        <P>Hoy existen miles de barajas temáticas: tarot con gatos, tarot feminista, tarot minimalista, tarot afrofuturista... Todas siguen la estructura de 78 cartas pero con estéticas únicas. Son geniales para coleccionar, pero para aprender, siempre empieza con Rider-Waite.</P>
        <Tip>{"Usa Rider-Waite-Smith para aprender. Una vez que domines los significados y la interpretación, podrás leer cualquier baraja del mundo porque la estructura es la misma. Es como aprender a conducir con un coche estándar: después puedes manejar cualquiera."}</Tip>
      </W>
    );

    case "myths": return (
      <W title="Mitos Que Necesitas Dejar Atrás" onDone={dn}>
        <P>El tarot arrastra siglos de mitos, malentendidos y miedos. Muchos de ellos impiden que personas curiosas se acerquen a esta herramienta. Vamos a desmontar los más comunes uno por uno.</P>
        <H>{"❌ \"Alguien tiene que regalarte tu primera baraja\""}</H>
        <P>Este es probablemente el mito más extendido. <strong>Es completamente falso.</strong> No existe ninguna tradición esotérica seria que establezca esta regla. Es una leyenda urbana moderna que se repite tanto que la gente la asume como verdad.</P>
        <P>Compra tu baraja cuando quieras, donde quieras. Lo importante es que te conectes con ella a través del uso, no de cómo llegó a tus manos.</P>
        <H>{"❌ \"El tarot es satánico o peligroso\""}</H>
        <P>El tarot <strong>no está vinculado a ninguna religión ni práctica oscura</strong>. Es un sistema de símbolos, igual que la astrología, la numerología o los arquetipos de la psicología junguiana. Hay tarotistas católicos, budistas, judíos, musulmanes, agnósticos y ateos.</P>
        <P>La herramienta es completamente neutra. Lo que importa es la intención y la ética de quien la usa. Un cuchillo de cocina puede cortar verduras o hacer daño — el objeto no es bueno ni malo.</P>
        <H>{"❌ \"Solo personas con don pueden leer tarot\""}</H>
        <P><strong>Cualquier persona puede aprender a leer tarot.</strong> No necesitas ser vidente, médium ni tener poderes psíquicos. Necesitas tres cosas: estudio (aprender los significados), práctica (hacer lecturas constantemente) e intuición (que TODOS tenemos y se puede desarrollar).</P>
        <P>Es como aprender un idioma: al principio traduces palabra por palabra, pero con práctica empiezas a "pensar" directamente en ese idioma.</P>
        <H>{"❌ \"La carta de La Muerte significa que alguien va a morir\""}</H>
        <P><strong>NUNCA. Jamás. Bajo ninguna circunstancia.</strong> La Muerte (Arcano XIII) es una de las cartas más positivas del tarot. Representa transformación profunda, fin de un ciclo y renacimiento. Es la oruga que se convierte en mariposa.</P>
        <P>Si algún "tarotista" te dice que La Muerte predice una muerte física, aléjate. Esa persona no sabe leer tarot o está tratando de manipularte.</P>
        <H>{"❌ \"No puedes echarte las cartas a ti mismo\""}</H>
        <P>No solo puedes, sino que <strong>deberías hacerlo constantemente</strong>. Es la mejor forma de practicar, de conocer tu baraja y de usar el tarot como herramienta de autoconocimiento diario. La carta del día (que aprenderás más adelante) es un ejercicio de auto-lectura que transformará tu práctica.</P>
        <H>{"❌ \"El tarot predice el futuro de forma fija\""}</H>
        <P>El tarot muestra <strong>tendencias y posibilidades</strong>, no un destino escrito. Piensa en él como un GPS: te muestra el camino basado en tu posición actual y la dirección en la que vas, pero tú siempre puedes girar el volante.</P>
        <Tip>El único requisito real para aprender tarot es la disposición de estudiar, practicar, y la honestidad de interpretar lo que ves en las cartas — no lo que quieres ver.</Tip>
      </W>
    );

    case "structure": return (
      <W title="Arcanos Mayores vs Menores" onDone={dn}>
        <P>Una baraja de tarot completa tiene <strong>78 cartas</strong> divididas en dos grandes grupos. Entender esta división es fundamental antes de empezar a estudiar carta por carta.</P>
        <H>{"Los 22 Arcanos Mayores — Los capítulos de tu vida"}</H>
        <P>Los Arcanos Mayores van del 0 (El Loco) al XXI (El Mundo). Son las cartas "estrella" del tarot. Representan los <strong>grandes temas y lecciones de la existencia humana</strong>: el inicio de un viaje, el amor, la autoridad, la transformación, la muerte simbólica, la esperanza, el juicio final sobre tu camino.</P>
        <P>Cuando un Arcano Mayor aparece en una lectura, señala algo <strong>importante y significativo</strong>. No es un evento menor del día a día — es un tema central que merece atención profunda.</P>
        <P>Juntos, los 22 Arcanos Mayores cuentan una historia completa llamada "El Viaje del Loco": un personaje inocente que parte de cero, descubre el mundo, enfrenta pruebas, cae, renace y finalmente alcanza la plenitud. Es la historia de toda vida humana.</P>
        <H>{"Los 56 Arcanos Menores — Los párrafos del día a día"}</H>
        <P>Los Arcanos Menores están divididos en <strong>4 palos de 14 cartas</strong> cada uno: Copas, Espadas, Bastos y Pentáculos. Cada palo tiene cartas numeradas del As al 10, más 4 cartas de corte (Sota, Caballero, Reina y Rey).</P>
        <P>Representan las <strong>situaciones cotidianas</strong>: los retos del trabajo, las emociones de una discusión, la alegría de un logro pequeño, la ansiedad de una noche de insomnio. Son el "cómo" y el "cuándo" de lo que los Mayores plantean como "qué".</P>
        <H>{"Una analogía útil"}</H>
        <P>Piensa en los Arcanos Mayores como los <strong>capítulos</strong> de tu vida (el gran amor, el cambio de carrera, la crisis que te transformó) y los Arcanos Menores como los <strong>párrafos</strong> dentro de esos capítulos (la discusión del martes, la oferta de trabajo, el mensaje que no contestaste).</P>
        <P>Si haces una tirada y salen muchos Arcanos Mayores, la lectura habla de temas grandes y profundos. Si salen mayormente Menores, los temas son más cotidianos y prácticos.</P>
        <Tip>En este curso vamos a cubrir las 78 cartas completas. Empezaremos por los 22 Arcanos Mayores (porque son los más impactantes y los que necesitas para hacer lecturas potentes desde el día 1), y después los 4 palos de Menores uno por uno.</Tip>
      </W>
    );

    case "suits": return (
      <W title="Los 4 Palos y Su Energía" onDone={dn}>
        <P>Los 56 Arcanos Menores se dividen en 4 palos. Cada palo está asociado a un elemento de la naturaleza y gobierna un área específica de la vida. Conocer esta asociación es CLAVE porque te permite interpretar cualquier carta menor aunque no la hayas memorizado.</P>
        <H>{"🏆 Copas — Elemento Agua"}</H>
        <P>Las Copas gobiernan <strong>las emociones, relaciones, amor, intuición y creatividad</strong>. Todo lo que sientes pasa por este palo. Cuando aparecen muchas Copas en una lectura, el tema central es emocional.</P>
        <Li>Temas: amor, amistad, familia, felicidad, tristeza, intuición, arte, sueños.</Li>
        <Li>Signos zodiacales asociados: Cáncer, Escorpio, Piscis.</Li>
        <Li>Energía: receptiva, fluida, profunda.</Li>
        <H>{"⚔ Espadas — Elemento Aire"}</H>
        <P>Las Espadas gobiernan <strong>la mente, los pensamientos, la comunicación y los conflictos</strong>. Son las cartas del intelecto pero también del dolor mental. Piensa en decisiones difíciles, verdades incómodas, ansiedad y claridad.</P>
        <Li>Temas: decisiones, verdad, conflicto, estrés, comunicación, justicia, análisis.</Li>
        <Li>Signos: Géminis, Libra, Acuario.</Li>
        <Li>Energía: cortante, directa, a veces dolorosa pero siempre reveladora.</Li>
        <H>{"🪄 Bastos — Elemento Fuego"}</H>
        <P>Los Bastos gobiernan <strong>la acción, pasión, creatividad, ambición y emprendimiento</strong>. Son las cartas del movimiento. Cuando aparecen, el mensaje es: actúa, muévete, crea.</P>
        <Li>Temas: proyectos, motivación, aventura, carrera, inspiración, competencia, viajes.</Li>
        <Li>Signos: Aries, Leo, Sagitario.</Li>
        <Li>Energía: expansiva, dinámica, impaciente.</Li>
        <H>{"⭐ Pentáculos — Elemento Tierra"}</H>
        <P>Los Pentáculos gobiernan <strong>lo material: dinero, trabajo, salud, hogar y estabilidad física</strong>. Todo lo tangible y concreto del mundo.</P>
        <Li>Temas: finanzas, inversiones, carrera, salud, cuerpo, propiedad, seguridad, naturaleza.</Li>
        <Li>Signos: Tauro, Virgo, Capricornio.</Li>
        <Li>Energía: estable, práctica, paciente, a veces lenta.</Li>
        <Tip>La regla de oro que nunca falla: Copas = sentir. Espadas = pensar. Bastos = hacer. Pentáculos = tener. Si memorizas solo esto, ya puedes empezar a leer cualquier carta menor combinando el número con el palo.</Tip>
      </W>
    );

    case "corr": return (
      <W title="Sistema de Correspondencias" onDone={dn}>
        <P>Cada palo del tarot no existe aislado — está conectado con un sistema completo de correspondencias que te ayudarán a profundizar tus lecturas. No necesitas memorizarlo todo ahora, pero conocerlo te dará una ventaja enorme.</P>
        <H>{"Tabla de correspondencias"}</H>
        <Li><strong>{"🪄 Bastos"}</strong> → Fuego → Aries, Leo, Sagitario → Primavera → Sur → Rojo/Naranja → Acción, voluntad, creatividad.</Li>
        <Li><strong>{"🏆 Copas"}</strong> → Agua → Cáncer, Escorpio, Piscis → Verano → Oeste → Azul/Plateado → Emociones, relaciones, intuición.</Li>
        <Li><strong>{"⚔ Espadas"}</strong> → Aire → Géminis, Libra, Acuario → Otoño → Este → Amarillo/Blanco → Mente, comunicación, conflicto.</Li>
        <Li><strong>{"⭐ Pentáculos"}</strong> → Tierra → Tauro, Virgo, Capricornio → Invierno → Norte → Verde/Marrón → Material, trabajo, salud, dinero.</Li>
        <H>{"¿Por qué importan los signos zodiacales?"}</H>
        <P>Si el consultante es Escorpio (signo de agua), las Copas tendrán especial resonancia en su lectura. Si es Aries (fuego), los Bastos hablarán de su energía natural. No necesitas ser astrólogo, pero esta conexión añade profundidad a tus interpretaciones.</P>
        <H>{"Correspondencias de tiempo"}</H>
        <P>Un sistema popular para estimar tiempos en lecturas:</P>
        <Li><strong>Bastos</strong> = días a semanas (fuego = rápido).</Li>
        <Li><strong>Copas</strong> = semanas a meses (agua = fluido).</Li>
        <Li><strong>Espadas</strong> = semanas (aire = moderado).</Li>
        <Li><strong>Pentáculos</strong> = meses a años (tierra = lento, sólido).</Li>
        <H>{"Dato curioso: ¿Por qué todos los cincos son difíciles?"}</H>
        <P>En la tradición cabalística, el número 5 corresponde a Geburah (severidad, conflicto). Por eso el 5 de Copas es pérdida, el 5 de Espadas es conflicto, el 5 de Bastos es rivalidad y el 5 de Pentáculos es dificultad. No es casualidad — es diseño.</P>
        <Tip>No necesitas memorizar esta tabla ahora. Pero vuelve a esta lección cuando empieces a hacer lecturas reales. Las correspondencias transformarán la profundidad de tus interpretaciones.</Tip>
      </W>
    );

    case "memo": return (
      <W title="Técnicas de Memorización" onDone={dn}>
        <P>78 cartas parecen muchas, pero con las técnicas correctas puedes aprenderlas en semanas, no meses. Estos métodos están probados por los mejores educadores de tarot del mundo.</P>
        <H>{"Técnica 1: El Viaje del Loco (Arcanos Mayores)"}</H>
        <P>Los 22 Arcanos Mayores cuentan una historia secuencial. En lugar de memorizar carta por carta, aprende la HISTORIA: El Loco (inocente) parte de cero, descubre su poder (Mago), conecta con su intuición (Sacerdotisa), y así sucesivamente hasta completar el ciclo con El Mundo. Tu cerebro retiene narrativas mucho mejor que listas.</P>
        <H>{"Técnica 2: Número + Elemento (Arcanos Menores)"}</H>
        <P>Este es el atajo más poderoso. Memorizando solo <strong>17 piezas de información</strong> puedes derivar el significado de las 56 cartas menores:</P>
        <Li>10 significados numéricos (As = inicio, 2 = dualidad... 10 = fin de ciclo).</Li>
        <Li>4 significados de palo (Copas = sentir, Espadas = pensar, Bastos = hacer, Pentáculos = tener).</Li>
        <Li>4 rangos de corte (Sota = aprendiz, Caballero = acción, Reina = dominio interno, Rey = dominio externo).</Li>
        <P>Ejemplo: 7 (reflexión/desafío) + Copas (emociones) = 7 de Copas = fantasías e ilusiones emocionales. ¡Funciona!</P>
        <H>{"Técnica 3: La Carta del Día"}</H>
        <P>El ejercicio más recomendado por profesionales. Cada mañana saca UNA carta, obsérvala, interpreta lo que ves y anota en tu diario. Por la noche, reflexiona cómo se manifestó esa energía. Después de 78 días habrás trabajado con TODAS las cartas de forma natural y orgánica.</P>
        <H>{"Técnica 4: Cuenta historias con las imágenes"}</H>
        <P>El tarot Rider-Waite fue diseñado para que cada carta cuente una historia visual. No memorices definiciones abstractas — mira la imagen y pregúntate: ¿qué está pasando aquí? ¿Qué siente esta persona? ¿A dónde va? La imagen te dirá el significado.</P>
        <Tip>El error más común es intentar memorizar las 78 cartas antes de hacer una sola lectura. No lo hagas. Empieza a practicar con las que ya conoces. Puedes consultar los significados durante la lectura — eso NO es trampa. Es aprendizaje.</Tip>
      </W>
    );

    case "maj1": return (
      <W title="El Viaje del Loco: 0–VII" onDone={dn}>
        <P>Los primeros 8 Arcanos representan el inicio del viaje. <strong>Haz clic en cualquier carta</strong> para ver la imagen real del Rider-Waite, su significado profundo, un ejercicio de reflexión personal y su interpretación invertida.</P>
        <CardGrid cards={MAJOR.slice(0, 8)} onPick={setSel} />
      </W>
    );

    case "maj2": return (
      <W title="El Camino Interior: VIII–XIV" onDone={dn}>
        <P>El viaje se vuelve interno. Lecciones sobre fuerza, soledad, cambio y equilibrio. <strong>Haz clic en cada carta</strong> para explorarla en detalle.</P>
        <CardGrid cards={MAJOR.slice(8, 15)} onPick={setSel} />
      </W>
    );

    case "maj3": return (
      <W title="La Transformación: XV–XXI" onDone={dn}>
        <P>La fase más intensa: sombras, destrucción, renacimiento y plenitud. <strong>Toca cada carta</strong> para descubrir su significado.</P>
        <CardGrid cards={MAJOR.slice(15)} onPick={setSel} />
      </W>
    );

    case "secrets": return (
      <W title="Secretos Ocultos del Rider-Waite" onDone={dn}>
        <P>La artista Pamela Colman Smith escondió capas de simbolismo en cada carta que la mayoría nunca descubre. Conocer estos detalles transformará cómo miras las imágenes — y cómo las interpretas en tus lecturas.</P>
        <H>{"La artista que el mundo olvidó"}</H>
        <P>Antes de los secretos visuales, conoce a la creadora: <strong>Pamela Colman Smith</strong> (1878–1951), apodada "Pixie", completó las 78 ilustraciones en solo seis meses. Tenía <strong>sinestesia</strong>: literalmente veía la música como colores y formas. Trabajó como diseñadora teatral junto a Bram Stoker (el autor de Drácula), y se cree que usó a sus amigos como modelos para las cartas. Pese a crear el mazo más vendido de la historia (+100 millones de copias), nunca recibió regalías y murió en la pobreza. Su tumba nunca ha sido localizada.</P>
        <H>{"El código de colores del cielo"}</H>
        <P>Los cielos en el Rider-Waite no son decorativos — son un lenguaje:</P>
        <Li><strong>Amarillo brillante</strong> = vitalidad, iluminación, optimismo. Mira El Loco, El Sol, La Fuerza.</Li>
        <Li><strong>Azul profundo</strong> = subconsciente, profundidad emocional. Mira La Estrella, La Luna, El Ermitaño.</Li>
        <Li><strong>Gris</strong> = ambigüedad, incertidumbre. Mira el 5 de Copas.</Li>
        <Li><strong>Negro</strong> = fin, peligro, lo desconocido. Mira La Torre, El Diablo, La Muerte.</Li>
        <H>{"Rosas y lirios: la boda alquímica"}</H>
        <P>La combinación <strong>rojo + blanco</strong> es el símbolo más importante del mazo. Viene de la alquimia: rojo = consciencia, pasión; blanco = pureza, subconsciente. El Mago tiene rosas rojas y lirios blancos a su alrededor. La Muerte lleva una bandera con una rosa blanca sobre fondo negro: pureza que nace de la transformación.</P>
        <H>{"El símbolo del infinito (∞) aparece en exactamente 4 cartas"}</H>
        <P>Búscalo: <strong>El Mago</strong> (sobre su cabeza), <strong>La Fuerza</strong> (sobre su cabeza), <strong>2 de Pentáculos</strong> (la cuerda entre las monedas), y <strong>El Mundo</strong> (las cintas de la guirnalda). Marca una progresión: potencial infinito → poder interior infinito → equilibrio material → ciclo completado.</P>
        <H>{"Detalles que cambian todo"}</H>
        <Li>En el <strong>8 de Espadas</strong>, la mujer está vendada y rodeada de espadas, pero mira sus pies: <strong>no están atados</strong>. La prisión es 100% mental. Podría caminar libre.</Li>
        <Li>Las <strong>granadas</strong> en el velo de La Sacerdotisa están dispuestas siguiendo el patrón del Árbol de la Vida cabalístico.</Li>
        <Li>La dirección en que miran las figuras importa: <strong>izquierda = pasado</strong>, <strong>derecha = futuro</strong>. La danzarina de El Mundo mira a ambos lados: existe en un presente perfecto.</Li>
        <Li>El <strong>10 de Pentáculos</strong> dispone las monedas siguiendo exactamente el patrón de las 10 sefirot del Árbol de la Vida.</Li>
        <Tip>La próxima vez que mires una carta, no busques solo el significado general. Observa los colores del cielo, las flores, la dirección de la mirada, los animales. Cada detalle fue puesto intencionalmente por Pamela Colman Smith hace más de 100 años.</Tip>
      </W>
    );

    case "cuI": return (
      <W title="Copas: Agua y Emociones" onDone={dn}>
        <P>Gobiernan el corazón: amor, tristeza, intuición, creatividad.</P>
        <Li><strong>As-3:</strong> Nuevas emociones, celebración.</Li>
        <Li><strong>4-6:</strong> Apatía, pérdida, nostalgia.</Li>
        <Li><strong>7-10:</strong> Ilusiones, búsqueda, satisfacción, felicidad.</Li>
        <Li><strong>Corte:</strong> Personas emocionales.</Li>
      </W>
    );

    case "cuC": return (
      <W title="Las 14 Cartas de Copas" onDone={dn}>
        <P>Explora las 14 cartas del palo de Copas. <strong>Haz clic en cualquier carta</strong> para ver la imagen del Rider-Waite, su significado y su interpretación invertida.</P>
        <CardGrid cards={CU} onPick={setSel} />
      </W>
    );

    case "swI": return (
      <W title="Espadas: Aire y Pensamiento" onDone={dn}>
        <P>Mente, comunicación, verdad, conflicto. Las más intensas.</P>
        <Li><strong>As-3:</strong> Claridad, indecisión, dolor.</Li>
        <Li><strong>4-6:</strong> Descanso, conflicto, transición.</Li>
        <Li><strong>7-10:</strong> Engaño, prisiones, ansiedad, fondo.</Li>
        <Li><strong>Corte:</strong> Personas analíticas.</Li>
      </W>
    );

    case "swC": return (
      <W title="Las 14 Cartas de Espadas" onDone={dn}>
        <P><strong>Haz clic en cada carta</strong> para explorar su significado. Las Espadas pueden parecer intimidantes, pero recuerda: siempre traen verdad, y la verdad es el primer paso para mejorar.</P>
        <CardGrid cards={SWD} onPick={setSel} />
      </W>
    );

    case "waI": return (
      <W title="Bastos: Fuego y Pasión" onDone={dn}>
        <P>Acción, creatividad, emprendimiento.</P>
        <Li><strong>As-3:</strong> Inspiración, planificación, expansión.</Li>
        <Li><strong>4-6:</strong> Celebración, competencia, victoria.</Li>
        <Li><strong>7-10:</strong> Defensa, velocidad, resiliencia, carga.</Li>
        <Li><strong>Corte:</strong> Personas apasionadas.</Li>
      </W>
    );

    case "waC": return (
      <W title="Las 14 Cartas de Bastos" onDone={dn}>
        <P>Las cartas del fuego y la acción. <strong>Toca cada una</strong> para ver su imagen, significado e interpretación invertida.</P>
        <CardGrid cards={WND} onPick={setSel} />
      </W>
    );

    case "peI": return (
      <W title="Pentáculos: Tierra y Materia" onDone={dn}>
        <P>Dinero, trabajo, salud, hogar.</P>
        <Li><strong>As-3:</strong> Oportunidad, equilibrio, equipo.</Li>
        <Li><strong>4-6:</strong> Posesividad, dificultad, generosidad.</Li>
        <Li><strong>7-10:</strong> Paciencia, dedicación, independencia, legado.</Li>
        <Li><strong>Corte:</strong> Personas prácticas.</Li>
      </W>
    );

    case "peC": return (
      <W title="Las 14 Cartas de Pentáculos" onDone={dn}>
        <P>El mundo material: dinero, trabajo, salud. <strong>Haz clic en cada carta</strong> para descubrir su significado completo.</P>
        <CardGrid cards={PNT} onPick={setSel} />
      </W>
    );

    case "prep": return (
      <W title="Preparación: Ritual y Energía" onDone={dn}>
        <P>Antes de tocar las cartas hay un paso que muchos ignoran y que marca la diferencia entre una lectura mediocre y una poderosa: la preparación. No es nada esotérico — es simplemente poner tu mente en modo lectura.</P>
        <H>Tu espacio de lectura</H>
        <Li>Busca un lugar tranquilo donde no te interrumpan durante al menos 15 minutos.</Li>
        <Li>Mesa limpia, despejada. Las cartas necesitan espacio y tú necesitas claridad mental.</Li>
        <Li>Si quieres, enciende una vela o incienso. No tiene poderes mágicos — simplemente le dice a tu cerebro que es hora de concentrarse. Es un ritual de transición.</Li>
        <H>Tu estado mental</H>
        <Li>Respira profundo 3 veces antes de empezar. Suena simple pero funciona.</Li>
        <Li>Suelta expectativas. No busques la respuesta que quieres sino la que necesitas. Este es el error más común: leer lo que deseamos ver.</Li>
        <Li>Baraja con intención. Mientras mezclas, piensa en la pregunta o situación.</Li>
        <H>La pregunta correcta</H>
        <P>La calidad de tu lectura depende enormemente de cómo formulas la pregunta:</P>
        <Li>{"❌ \"¿Voy a ser rico?\" → Vaga, busca certeza que el tarot no da."}</Li>
        <Li>{"✅ \"¿Qué puedo hacer para mejorar mi situación financiera?\" → Abierta, práctica."}</Li>
        <Li>{"❌ \"¿Él me quiere?\" → Busca un sí/no sobre algo fuera de tu control."}</Li>
        <Li>{"✅ \"¿Qué energía rodea mi relación con esta persona?\" → Permite profundidad."}</Li>
        <Tip>{"Las mejores preguntas: \"¿Qué...?\", \"¿Cómo...?\", \"¿Qué necesito saber sobre...?\". Evita: \"¿Cuándo...?\" y \"¿Voy a...?\" porque buscan predicciones exactas."}</Tip>
      </W>
    );

    case "pica": return (
      <W title="El Método P.I.C.A." onDone={dn}>
        <P>Este es el método que va a transformar tus lecturas. La mayoría de principiantes cometen el mismo error: aprenden los significados de las cartas y cuando se sientan a leer, recitan definiciones como si leyeran un diccionario. El cliente se va pensando: esto lo puedo buscar en Google.</P>
        <P>El Método P.I.C.A. te da una estructura para convertir cada carta en una <strong>experiencia narrativa</strong>. Es la diferencia entre un tarotista que cobra $5 y uno que cobra $50.</P>
        <H>P — Posición</H>
        <P>Empieza contextualizando dónde está la carta dentro de la tirada.</P>
        <P><em>{"\"En la posición de futuro, esta carta me habla de...\""}</em></P>
        <P>Esto le dice al consultante exactamente a qué parte de su vida se refiere lo que vas a interpretar.</P>
        <H>I — Imagen</H>
        <P>Describe lo que VES en la carta. Los colores, las figuras, los símbolos. No saltes directo al significado — pinta la imagen primero.</P>
        <P><em>{"\"Veo una mujer que vierte agua bajo un cielo estrellado. Es una escena de calma, de sanación...\""}</em></P>
        <P>Esto conecta visualmente y hace que la lectura sea mucho más vívida y memorable.</P>
        <H>C — Conexión</H>
        <P>Aquí conectas la carta con la vida real del consultante. Dejas de hablar de la carta y empiezas a hablar de SU situación.</P>
        <P><em>{"\"Esto me dice que la angustia que estás sintiendo va a encontrar alivio. No de forma mágica, sino porque tú misma vas a encontrar la paz interior...\""}</em></P>
        <H>A — Acción</H>
        <P>Cierras con un consejo práctico y concreto. Algo que el consultante pueda HACER.</P>
        <P><em>{"\"Mi consejo basado en las cartas: no fuerces soluciones. Confía en que el proceso de sanación ya está en marcha.\""}</em></P>
        <Tip>{"Ejemplo completo con La Estrella en posición de futuro: \"En tu futuro cercano aparece La Estrella [P]. Veo una mujer vertiendo agua bajo las estrellas — es una imagen de calma y sanación después de algo difícil [I]. Lo que esto me dice es que esa angustia que sientes ahora va a pasar, y vas a encontrar una paz que ahora no ves posible [C]. Mi consejo: no fuerces soluciones, la respuesta va a llegar cuando dejes de buscarla con desesperación [A].\" — ¿Ves la diferencia con solo decir \"La Estrella significa esperanza\"?"}</Tip>
      </W>
    );

    case "connect": return (
      <W title="Conectar Cartas Entre Sí" onDone={dn}>
        <P>El salto de principiante a intermedio no es aprender más cartas — es aprender a leerlas <strong>juntas</strong>. Una carta sola cuenta una idea. Dos o tres cartas juntas cuentan una historia completa.</P>
        <H>{"La técnica del \"Y entonces...\""}</H>
        <P>Lee las cartas en secuencia como si narraras una historia, conectándolas con "y entonces". Por ejemplo:</P>
        <P><em>El Emperador → La Torre → La Estrella</em></P>
        <P><em>{"\"Tenías todo bajo control, estructurado y en orden [Emperador]. Y entonces algo se derrumbó de forma inesperada, una revelación o un cambio que sacudió esa estructura [Torre]. Y entonces, después de ese caos, viene un período de calma, sanación y esperanza renovada [Estrella].\""}</em></P>
        <P>La historia fluye naturalmente. El consultante se siente comprendido porque la narrativa refleja su experiencia real.</P>
        <H>Busca patrones</H>
        <Li><strong>Muchas cartas del mismo palo:</strong> la lectura tiene un tema dominante. Muchas Copas = todo es emocional. Muchos Bastos = momento de acción.</Li>
        <Li><strong>Números consecutivos:</strong> si salen cartas con números seguidos (3, 4, 5), hay una progresión natural en la situación.</Li>
        <Li><strong>Contrastes fuertes:</strong> El Sol junto al Diablo señala una tensión importante entre algo muy positivo y algo que te ata. Esa tensión ES la historia.</Li>
        <Li><strong>Repetición de elementos:</strong> si aparecen dos Reinas, puede haber dos mujeres importantes en la situación. Dos cartas de transformación (Muerte + Torre) indican un cambio profundo e inevitable.</Li>
        <Tip>Ejercicio: saca 3 cartas al azar ahora mismo y cuenta una historia con ellas usando la técnica del "Y entonces...". No te preocupes si suena forzado al principio — con 10-15 prácticas empezará a fluir como algo natural.</Tip>
      </W>
    );

    case "mistakes": return (
      <W title="Los 7 Errores Que Todo Principiante Comete" onDone={dn}>
        <P>Estos errores están documentados por los mejores educadores de tarot del mundo. Conocerlos de antemano te ahorrará meses de frustración.</P>
        <H>{"1. Recitar significados como un diccionario"}</H>
        <P>El error número uno. Sacas una carta y dices: "La Estrella significa esperanza y sanación". Punto. Eso no es una lectura — es una definición. El consultante puede buscar eso en Google. Usa el <strong>Método P.I.C.A.</strong> para convertir significados en experiencias narrativas.</P>
        <H>{"2. Tener miedo de las cartas 'negativas'"}</H>
        <P>La Muerte, La Torre, El Diablo... Muchos principiantes se paralizan cuando aparecen. Recuerda: <strong>no existen cartas malas</strong>. La Muerte es transformación. La Torre es destrucción de lo falso. El Diablo señala cadenas que puedes romper. Aprende a reencuadrarlas como oportunidades.</P>
        <H>{"3. Leer estando emocionalmente involucrado"}</H>
        <P>Si te echas las cartas sobre algo que te angustia profundamente, tu miedo distorsionará la interpretación. Verás catástrofe donde hay transformación. Si el tema te afecta mucho, pide a otra persona que te lea — o espera a estar más centrado.</P>
        <H>{"4. Repetir la misma pregunta cambiando las palabras"}</H>
        <P>{"No te gustó la respuesta y vuelves a preguntar: \"¿Él volverá?\" → \"¿Hay futuro con él?\" → \"¿La relación se puede arreglar?\". Esto no funciona. La primera tirada es la que vale. Repetir diluye la claridad."}</P>
        <H>{"5. Leer cartas en aislamiento"}</H>
        <P>Interpretar cada carta por separado sin ver cómo se relacionan entre sí. Las cartas hablan en conjunto — una historia de 3 cartas es más que la suma de 3 significados individuales. Usa la técnica del "Y entonces..." que aprendiste.</P>
        <H>{"6. Dudar de tu primera impresión"}</H>
        <P>Miras la carta, sientes algo inmediato... y luego lo descartas porque "seguramente estoy equivocado" y buscas en un libro. Tu primera impresión es tu intuición hablando. Los profesionales coinciden: <strong>la primera sensación casi siempre resulta ser la correcta</strong>.</P>
        <H>{"7. Intentar memorizar todo antes de practicar"}</H>
        <P>Querer saber las 78 cartas de memoria antes de hacer una sola tirada. Esto es como querer memorizar todo el diccionario antes de hablar un idioma. Empieza a practicar ya — puedes consultar significados durante la lectura. Eso no es trampa, es aprendizaje.</P>
        <Tip>El antídoto para casi todos estos errores es uno solo: práctica constante. No lecturas perfectas — lecturas frecuentes. Cada tirada te enseña más que una hora de estudio teórico.</Tip>
      </W>
    );

    case "protips": return (
      <W title="Técnicas Profesionales" onDone={dn}>
        <P>Estas técnicas separan a un estudiante de tarot de un lector profesional. Son las habilidades "invisibles" que hacen que una lectura se sienta profunda y transformadora.</P>
        <H>{"Reencuadrar sin mentir"}</H>
        <P>La clave profesional: presentar mensajes difíciles a través de la lente de la <strong>acción personal</strong>, no del miedo. No suavizas la verdad — la haces útil.</P>
        <Li><strong>La Muerte:</strong> {"\"Algo en tu vida ha completado su ciclo. ¿Qué necesita terminar para que algo mejor pueda nacer?\""}</Li>
        <Li><strong>La Torre:</strong> {"\"Algo construido sobre bases inestables necesita caer. Dentro de esta ruptura está la posibilidad de empezar de nuevo.\""}</Li>
        <Li><strong>El Diablo:</strong> {"\"Esta carta señala las cadenas a las que te aferras. Romperlas no solo es posible — es exactamente el punto.\""}</Li>
        <H>{"El poder de las preguntas abiertas"}</H>
        <P>Después de interpretar cada carta, haz una pregunta que invite a la reflexión:</P>
        <Li>{"\"¿Esto resuena contigo?\""}</Li>
        <Li>{"\"¿Hay algo en tu vida que se sienta así en este momento?\""}</Li>
        <Li>{"\"¿Qué es lo primero que te viene a la mente?\""}</Li>
        <P>Estas preguntas no son trampa — son el puente entre la carta y la vida real del consultante. La mejor lectura es un <strong>diálogo</strong>, no un monólogo.</P>
        <H>{"La carta clarificadora"}</H>
        <P>Cuando una carta te confunde o el consultante no conecta con la interpretación, saca una carta adicional preguntando: {"\"¿Qué energía puede clarificar esto?\""}. Es una técnica profesional que resuelve bloqueos sin perder fluidez.</P>
        <H>{"Ética fundamental"}</H>
        <P>Principios que todo tarotista profesional respeta:</P>
        <Li><strong>Confidencialidad absoluta</strong> — lo que se dice en una lectura no se comparte jamás.</Li>
        <Li><strong>No crear dependencia</strong> — tu trabajo es empoderar, no hacer que el cliente necesite consultarte para cada decisión.</Li>
        <Li><strong>Derivar cuando sea necesario</strong> — si el tema toca salud mental, problemas legales o médicos, recomienda un profesional.</Li>
        <Li><strong>Nunca predecir muertes, diagnosticar enfermedades ni identificar maldiciones</strong> — estas son líneas rojas absolutas.</Li>
        <Tip>La diferencia entre un tarotista mediocre y uno excelente no es cuántas cartas conoce — es cómo hace sentir al consultante. Si al terminar la lectura la persona se siente empoderada, con claridad y con un camino de acción, hiciste bien tu trabajo.</Tip>
      </W>
    );

    case "spreads": return (
      <W title="Las 5 Tiradas Esenciales" onDone={dn}>
        <P>Una tirada es simplemente cómo dispones las cartas sobre la mesa. Cada posición tiene un significado asignado, y tú interpretas la carta según ese contexto. Solo necesitas estas 5 para cubrir el 90% de las consultas.</P>
        <H>1. Sí o No (1 carta)</H>
        <P>La más simple y la más pedida. El consultante hace una pregunta cerrada y sacas una carta. Cartas positivas (Sol, Estrella, Mundo, Emperatriz) = SÍ. Cartas desafiantes (Torre, Diablo, Luna) = NO o todavía no. Cartas neutras (Rueda, Colgado) = la situación está en movimiento.</P>
        <H>2. Pasado - Presente - Futuro (3 cartas)</H>
        <P>Tres cartas en línea horizontal. La primera = lo que ha llevado a la situación actual. La segunda = la energía del momento. La tercera = hacia dónde se dirige si continúa así. Es tu tirada comodín — funciona para cualquier tema.</P>
        <H>3. Cruz Simple (5 cartas)</H>
        <P>Centro = situación actual. Izquierda = influencia del pasado. Derecha = futuro inmediato. Arriba = lo que el consultante aspira o teme conscientemente. Abajo = las influencias inconscientes. Tu tirada premium para análisis profundo.</P>
        <H>4. El Amor (5 cartas)</H>
        <P>Dos cartas para el consultante (sentimientos y actitud), dos para la otra persona (sentimientos y actitud), y una carta central para la energía de la relación. El amor es el tema número 1 en consultas — esta tirada va a ser tu herramienta más usada.</P>
        <H>5. La Decisión (5 cartas)</H>
        <P>Una carta arriba = situación actual. Debajo, dos columnas de dos cartas: la izquierda muestra consecuencias a corto y largo plazo de la Opción A, y la derecha lo mismo para la Opción B. Ideal para encrucijadas vitales.</P>
        <Tip>Domina primero la de 1 carta y la de 3. Son las que más usarás en el día a día. La Cruz y las de 5 cartas son para cuando ya tengas fluidez interpretando.</Tip>
      </W>
    );

    case "practice": return (
      <W title="Practica en Vivo" onDone={dn}>
        <P>Es hora de poner en práctica lo aprendido. Piensa en una pregunta o situación, selecciona una tirada y las cartas se barajarán automáticamente entre las 78 del mazo completo.</P>
        <Li><strong>Paso 1:</strong> Elige una de las tiradas disponibles haciendo clic.</Li>
        <Li><strong>Paso 2:</strong> Piensa en tu pregunta mientras observas las cartas boca abajo.</Li>
        <Li><strong>Paso 3:</strong> Haz clic en cada carta para revelarla. Intenta interpretar con el Método P.I.C.A. antes de leer el significado.</Li>
        <Li><strong>Paso 4:</strong> Haz clic en una carta ya revelada para ver su interpretación según la posición de la tirada.</Li>
        <SpreadPractice />
      </W>
    );

    case "next": return (
      <W title="Próximos Pasos en Tu Camino" onDone={dn}>
        <P>{"¡Felicidades! Has completado el curso. Ahora conoces las 78 cartas del tarot Rider-Waite, dominas las 5 tiradas esenciales, sabes interpretar con el Método P.I.C.A. y puedes conectar cartas entre sí para contar historias."}</P>
        <P>Eso te pone por delante del 90% de personas que dicen querer aprender tarot pero nunca pasan de hojear un libro. Ahora viene lo importante: la práctica.</P>
        <H>Tu plan para las próximas 4 semanas</H>
        <Li><strong>Semana 1:</strong> Saca una carta del día cada mañana. Obsérvala, interpreta con P.I.C.A., anota en tu diario. Por la noche, reflexiona cómo se manifestó esa energía en tu día.</Li>
        <Li><strong>Semana 2:</strong> Haz una tirada de Pasado-Presente-Futuro para ti mismo cada 2-3 días. Practica conectar las 3 cartas en una narrativa fluida.</Li>
        <Li><strong>Semana 3:</strong> Ofrece lecturas gratuitas a 3 amigos o familiares. Aplica todo lo aprendido. Pide feedback honesto. Esto es invaluable.</Li>
        <Li><strong>Semana 4:</strong> Intenta la Cruz Simple (5 cartas) con las 78 cartas completas. Conecta cartas entre sí. Verás cómo todo empieza a fluir.</Li>
        <H>{"¿Quieres convertir esto en un negocio?"}</H>
        <P>Si te apasiona el tarot y quieres aprender a <strong>cobrar por lecturas, encontrar clientes, dar sesiones profesionales y generar ingresos desde casa</strong>, tenemos la guía completa para ti:</P>
        <Tip>{"\"El Negocio del Tarot: Cómo Ganar Tus Primeros $500 al Mes Leyendo Cartas Desde Casa\" — La guía paso a paso con precios, canales de captación, scripts de venta y plantillas listas para usar. El siguiente nivel para quien quiere vivir de esto."}</Tip>
        <P>Independientemente de si monetizas o no, el tarot es una herramienta que te acompañará toda la vida. Cada lectura te enseñará algo nuevo sobre ti mismo y sobre las personas que te rodean.</P>
        <p style={{ fontStyle: "italic", color: "#d4a843", marginTop: 20, textAlign: "center", lineHeight: 1.7, fontSize: 14 }}>
          {"Ahora ve, baraja tus cartas, y empieza tu viaje. El Loco ya dio su primer paso — ahora te toca a ti. ✦"}
        </p>
      </W>
    );

    case "q1": return <WQ title="Test: ¿Qué es el Tarot?"><QuizW qid="q1" onDone={dn} /></WQ>;
    case "q2": return <WQ title="Test: Estructura"><QuizW qid="q2" onDone={dn} /></WQ>;
    case "q3": return <WQ title="Test: Arcanos Mayores"><QuizW qid="q3" onDone={dn} /></WQ>;
    case "q4": return <WQ title="Test: Lectura"><QuizW qid="q4" onDone={dn} /></WQ>;

    default: return <p style={{ color: "#888" }}>{"Lección: " + id}</p>;
  }
}
