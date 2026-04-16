import { useState, useEffect, useRef } from "react";
import { ALL } from "../../data/cards";

const INTERVAL = 130;

function randomOther(exclude: number) {
  let n: number;
  do { n = Math.floor(Math.random() * ALL.length); } while (n === exclude);
  return n;
}

interface S {
  slotA:       typeof ALL[0];
  slotB:       typeof ALL[0];
  showA:       boolean;
  displayCard: typeof ALL[0];
}

export default function AdCards() {
  const [s, setS] = useState<S>({
    slotA:       ALL[0],
    slotB:       ALL[randomOther(0)],
    showA:       true,
    displayCard: ALL[0],
  });
  const lastIdxRef = useRef(0);

  // Precarga todas las imágenes → sin blancos después de los primeros segundos
  useEffect(() => {
    ALL.forEach(card => { const i = new Image(); i.src = card.im; });
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const next = randomOther(lastIdxRef.current);
      lastIdxRef.current = next;
      const nextCard = ALL[next];

      // UN SOLO setState → UN SOLO render → imagen y nombre cambian en el mismo frame, siempre
      setS(prev => prev.showA
        ? { ...prev, slotB: nextCard, showA: false, displayCard: nextCard }
        : { ...prev, slotA: nextCard, showA: true,  displayCard: nextCard }
      );
    }, INTERVAL);
    return () => clearInterval(t);
  }, []);

  const { slotA, slotB, showA, displayCard } = s;

  return (
    <div style={{
      height: "100dvh",
      background: "linear-gradient(170deg,#0a0612 0%,#1a0d2e 30%,#2d1150 60%,#1a0d2e 85%,#0a0612 100%)",
      fontFamily: "Georgia,serif",
      color: "#f0e6d3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap');

        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer {
          0%   { background-position:-300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes orbPulse {
          0%,100% { transform:translate(-50%,-50%) scale(1);    opacity:.22; }
          50%     { transform:translate(-50%,-50%) scale(1.18); opacity:.38; }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 22px rgba(201,168,76,.3), 0 0 60px rgba(100,50,200,.2); }
          50%     { box-shadow: 0 0 40px rgba(201,168,76,.55), 0 0 90px rgba(130,60,220,.35); }
        }
        @keyframes cardPop {
          0%   { transform: scale(0.93); }
          60%  { transform: scale(1.02); }
          100% { transform: scale(1);    }
        }
        @keyframes twinkle1 { 0%,100%{opacity:.15} 50%{opacity:.8}  }
        @keyframes twinkle2 { 0%,100%{opacity:.05} 50%{opacity:.55} }
        @keyframes twinkle3 { 0%,100%{opacity:.25} 50%{opacity:.9}  }
        @keyframes twinkle4 { 0%,100%{opacity:.1}  50%{opacity:.7}  }

        .ac-seq1 { opacity:0; animation: fadeIn  .5s ease forwards .1s; }
        .ac-seq2 { opacity:0; animation: fadeUp  .6s ease forwards .3s; }
        .ac-seq3 { opacity:0; animation: fadeUp  .6s ease forwards .6s; }
        .ac-seq4 { opacity:0; animation: fadeUp  .6s ease forwards .9s; }

        .ac-star1 { animation: twinkle1 3.2s ease-in-out infinite; }
        .ac-star2 { animation: twinkle2 4.5s ease-in-out infinite 1.1s; }
        .ac-star3 { animation: twinkle3 5.8s ease-in-out infinite 2.3s; }
        .ac-star4 { animation: twinkle4 2.8s ease-in-out infinite 0.7s; }
      `}</style>

      {/* Orbe de fondo */}
      <div style={{
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        width:360, height:360, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(110,50,200,.3) 0%,transparent 70%)",
        animation:"orbPulse 5s ease-in-out infinite",
        pointerEvents:"none",
      }}/>

      {/* Estrellas */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} xmlns="http://www.w3.org/2000/svg">
        <g className="ac-star1">
          <circle cx="5%"  cy="3%"  r="2"   fill="#f5e6a3"/>
          <circle cx="12%" cy="8%"  r="1.4" fill="#c9a84c"/>
          <circle cx="3%"  cy="11%" r="1"   fill="#c9a84c"/>
          <circle cx="18%" cy="5%"  r=".8"  fill="#e8d080"/>
          <circle cx="8%"  cy="16%" r="1.2" fill="#c9a84c"/>
        </g>
        <g className="ac-star2">
          <circle cx="95%" cy="3%"  r="2"   fill="#f5e6a3"/>
          <circle cx="88%" cy="8%"  r="1.4" fill="#c9a84c"/>
          <circle cx="97%" cy="11%" r="1"   fill="#c9a84c"/>
          <circle cx="82%" cy="5%"  r=".8"  fill="#e8d080"/>
          <circle cx="92%" cy="16%" r="1.2" fill="#c9a84c"/>
        </g>
        <g className="ac-star3">
          <circle cx="5%"  cy="97%" r="2"   fill="#f5e6a3"/>
          <circle cx="12%" cy="92%" r="1.4" fill="#c9a84c"/>
          <circle cx="3%"  cy="88%" r="1"   fill="#c9a84c"/>
          <circle cx="18%" cy="95%" r=".8"  fill="#e8d080"/>
          <circle cx="8%"  cy="84%" r="1.2" fill="#c9a84c"/>
        </g>
        <g className="ac-star4">
          <circle cx="95%" cy="97%" r="2"   fill="#f5e6a3"/>
          <circle cx="88%" cy="92%" r="1.4" fill="#c9a84c"/>
          <circle cx="97%" cy="88%" r="1"   fill="#c9a84c"/>
          <circle cx="82%" cy="95%" r=".8"  fill="#e8d080"/>
          <circle cx="92%" cy="84%" r="1.2" fill="#c9a84c"/>
        </g>
        <g className="ac-star1">
          <circle cx="2%"  cy="45%" r="1.3" fill="#c9a84c"/>
          <circle cx="4%"  cy="55%" r="1"   fill="#e8d080"/>
          <circle cx="98%" cy="45%" r="1.3" fill="#c9a84c"/>
          <circle cx="96%" cy="55%" r="1"   fill="#e8d080"/>
          <circle cx="45%" cy="1%"  r="1.2" fill="#f5e6a3"/>
          <circle cx="55%" cy="99%" r="1.2" fill="#f5e6a3"/>
        </g>
      </svg>

      {/* Bordes decorativos */}
      <div className="ac-seq1" style={{position:"absolute",top:14,left:14,right:14,bottom:14,border:"1px solid rgba(201,168,76,.35)",borderRadius:6,pointerEvents:"none"}}/>
      <div className="ac-seq1" style={{position:"absolute",top:26,left:26,right:26,bottom:26,border:"1px solid rgba(201,168,76,.14)",borderRadius:6,pointerEvents:"none"}}/>

      {/* Ornamentos en esquinas */}
      {([
        {top:10,left:10},{top:10,right:10},
        {bottom:10,left:10},{bottom:10,right:10},
      ] as React.CSSProperties[]).map((pos,i)=>(
        <svg key={i} className="ac-seq1" width="20" height="20" viewBox="0 0 20 20"
          style={{position:"absolute",pointerEvents:"none",...pos}}>
          <line x1="0"  y1="10" x2="20" y2="10" stroke="#c9a84c" strokeWidth=".9" opacity=".6"/>
          <line x1="10" y1="0"  x2="10" y2="20" stroke="#c9a84c" strokeWidth=".9" opacity=".6"/>
          <circle cx="10" cy="10" r="3" fill="none" stroke="#c9a84c" strokeWidth=".9" opacity=".5"/>
        </svg>
      ))}

      {/* Contenido principal */}
      <div style={{
        position:"relative", zIndex:2,
        display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"flex-start",
        gap:16,
        height:"100dvh",
        paddingTop:52,
        paddingBottom:"28dvh",   /* empuja todo hacia arriba, fuera de la zona tapada */
        paddingLeft:28, paddingRight:28,
        maxWidth:420, width:"100%", margin:"0 auto",
        textAlign:"center",
        boxSizing:"border-box",
      }}>

        {/* TÍTULO */}
        <div className="ac-seq2" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
          <div style={{
            fontSize:11, letterSpacing:4, textTransform:"uppercase",
            color:"#c9a84c", opacity:.7, marginBottom:4,
          }}>
            ✦ lectura de tarot ✦
          </div>
          <div style={{
            fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"clamp(38px,10.5vw,52px)",
            fontWeight:700,
            lineHeight:1.1,
            color:"#f5e6a3",
            letterSpacing:.5,
          }}>
            Pausa el video
          </div>
          <div style={{
            fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"clamp(20px,5.8vw,28px)",
            fontWeight:400,
            fontStyle:"italic",
            lineHeight:1.4,
            color:"#e0d5c0",
            maxWidth:290,
          }}>
            y mira qué carta te salió
          </div>
          {/* Línea divisoria */}
          <div style={{width:100,height:1,background:"linear-gradient(90deg,transparent,#c9a84c,transparent)",marginTop:6}}/>
        </div>

        {/* CARTA ANIMADA */}
        <div className="ac-seq3" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>

          {/* Marco decorativo de la carta */}
          <div style={{
            position:"relative",
            padding:10,
            borderRadius:16,
            background:"rgba(201,168,76,.06)",
            border:"1.5px solid rgba(201,168,76,.35)",
            animation:"glowPulse 2.8s ease-in-out infinite",
          }}>
            {/* Contenedor de dos capas — swap instantáneo, siempre hay imagen */}
            <div style={{
                position:"relative",
                width:158, height:264,
                borderRadius:9,
                overflow:"hidden",
                border:"1.5px solid rgba(201,168,76,.5)",
              }}
            >
              {/* Capa A */}
              <img
                src={slotA.im}
                alt={slotA.nm}
                style={{
                  position:"absolute", inset:0,
                  width:"100%", height:"100%", objectFit:"cover",
                  opacity: showA ? 1 : 0,   // sin transition — instantáneo
                  zIndex: showA ? 2 : 1,
                }}
              />
              {/* Capa B */}
              <img
                src={slotB.im}
                alt={slotB.nm}
                style={{
                  position:"absolute", inset:0,
                  width:"100%", height:"100%", objectFit:"cover",
                  opacity: showA ? 0 : 1,   // sin transition — instantáneo
                  zIndex: showA ? 1 : 2,
                }}
              />
            </div>

            {/* Ornamentos en esquinas del marco */}
            {([
              {top:3,left:3},{top:3,right:3},
              {bottom:3,left:3},{bottom:3,right:3},
            ] as React.CSSProperties[]).map((pos,i)=>(
              <div key={i} style={{
                position:"absolute", width:10, height:10,
                border:"1px solid rgba(201,168,76,.55)",
                ...pos,
              }}/>
            ))}
          </div>

          {/* Nombre de la carta — se actualiza tras completar la transición */}
          <div style={{
            fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"clamp(16px,4.8vw,22px)",
            fontWeight:600,
            color:"#f5e6a3",
            letterSpacing:2,
            textTransform:"uppercase",
            minHeight:28,
            textShadow:"0 0 18px rgba(201,168,76,.45)",
          }}>
            {displayCard.nm}
          </div>

        </div>

        {/* DESCRIPCIÓN / CTA */}
        <div className="ac-seq4" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
          <div style={{width:100,height:1,background:"linear-gradient(90deg,transparent,#c9a84c,transparent)"}}/>
          <div style={{
            fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"clamp(18px,5.2vw,23px)",
            fontStyle:"italic",
            color:"#e0d5c0",
            lineHeight:1.55,
            maxWidth:360,
          }}>
            Comenta tu carta y algo que quieras saber<br/>— te hacemos una lectura
          </div>
          <div style={{
            marginTop:2,
            padding:"8px 22px",
            border:"1px solid rgba(201,168,76,.45)",
            borderRadius:24,
            fontSize:"clamp(12px,3.5vw,14px)",
            letterSpacing:2,
            textTransform:"uppercase",
            color:"#c9a84c",
            background:"rgba(201,168,76,.07)",
          }}>
            ✦ te respondemos con tu lectura ✦
          </div>
        </div>

      </div>
    </div>
  );
}
