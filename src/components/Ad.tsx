import { useState, useEffect } from "react";

const CARDS = [
  "/cards/major/02_high_priestess.jpg",
  "/cards/major/17_star.jpg",
  "/cards/major/21_world.jpg",
];

export default function Ad() {
  const [visible, setVisible]   = useState([false, false, false]);
  const [flipped, setFlipped]   = useState([false, false, false]);
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    // Aparecen boca abajo, escalonadas
    const t0 = setTimeout(() => setVisible(v => [true,  v[1], v[2]]), 150);
    const t1 = setTimeout(() => setVisible(v => [v[0], true,  v[2]]), 300);
    const t2 = setTimeout(() => setVisible(v => [v[0], v[1], true ]), 450);
    // Se dan vuelta una por una
    const t3 = setTimeout(() => setFlipped(f => [true,  f[1], f[2]]), 1100);
    const t4 = setTimeout(() => setFlipped(f => [f[0], true,  f[2]]), 1350);
    const t5 = setTimeout(() => setFlipped(f => [f[0], f[1], true ]), 1600);
    // Float arranca después del último flip
    const t6 = setTimeout(() => setFloating(true), 2000);
    return () => [t0,t1,t2,t3,t4,t5,t6].forEach(clearTimeout);
  }, []);

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

        @keyframes cardIn {
          from { opacity:0; transform:translateY(32px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes float {
          0%,100% { transform:translateY(0px);  }
          50%     { transform:translateY(-8px); }
        }
        @keyframes shimmer {
          0%   { background-position:-300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow:0 0 18px rgba(201,168,76,.25); }
          50%     { box-shadow:0 0 44px rgba(201,168,76,.6);  }
        }
        @keyframes orbPulse {
          0%,100% { transform:translate(-50%,-50%) scale(1);    opacity:.2; }
          50%     { transform:translate(-50%,-50%) scale(1.15); opacity:.35; }
        }
        @keyframes twinkle1 { 0%,100%{opacity:.15} 50%{opacity:.8}  }
        @keyframes twinkle2 { 0%,100%{opacity:.05} 50%{opacity:.55} }
        @keyframes twinkle3 { 0%,100%{opacity:.25} 50%{opacity:.9}  }

        .ad-float  { animation: float 4s ease-in-out infinite; }
        .ad-cta    { animation: pulseGlow 2.2s ease-in-out infinite; }

        .ad-card-scene {
          perspective: 1000px;
          width: 88px;
          height: 132px;
        }
        .ad-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform .45s cubic-bezier(.4,0,.2,1);
        }
        .ad-card-inner.flipped { transform: rotateY(180deg); }
        .ad-card-face {
          position: absolute;
          inset: 0;
          border-radius: 7px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
          border: 1.5px solid rgba(201,168,76,.55);
        }
        .ad-card-front {
          transform: rotateY(180deg);
        }
        .ad-card-back-inner {
          width: 100%;
          height: 100%;
          background: linear-gradient(160deg,#1e1040,#0d0622);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ad-seq-1 { opacity:0; animation:fadeIn  .3s ease forwards  .1s;  }
        .ad-seq-2 { opacity:0; animation:fadeUp  .3s ease forwards  .3s;  }
        .ad-seq-3 { opacity:0; animation:fadeUp  .3s ease forwards  .6s;  }
        .ad-seq-4 { opacity:0; animation:fadeUp  .3s ease forwards  .9s;  }
        .ad-seq-5 { opacity:0; animation:fadeUp  .3s ease forwards  1.2s; }

        .star-1 { animation: twinkle1 3.2s ease-in-out infinite; }
        .star-2 { animation: twinkle2 4.5s ease-in-out infinite 1.1s; }
        .star-3 { animation: twinkle3 5.8s ease-in-out infinite 2.3s; }
        .star-4 { animation: twinkle1 2.8s ease-in-out infinite 0.7s; }
        .star-5 { animation: twinkle2 6s   ease-in-out infinite 3s;   }
      `}</style>

      {/* Orbe de fondo */}
      <div style={{
        position:"absolute", top:"35%", left:"50%",
        transform:"translate(-50%,-50%)",
        width:340, height:340, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(100,50,180,.28) 0%,transparent 70%)",
        animation:"orbPulse 6s ease-in-out infinite",
        pointerEvents:"none",
      }}/>

      {/* Estrellas SVG */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} xmlns="http://www.w3.org/2000/svg">
        <g className="star-1">
          <circle cx="15%"  cy="10%" r="2"   fill="#c9a84c"/>
          <circle cx="78%"  cy="7%"  r="1.6" fill="#c9a84c"/>
          <circle cx="52%"  cy="94%" r="1.8" fill="#c9a84c"/>
          <circle cx="88%"  cy="55%" r="1.5" fill="#c9a84c"/>
        </g>
        <g className="star-2">
          <circle cx="90%"  cy="15%" r="1.2" fill="#e8d080"/>
          <circle cx="8%"   cy="42%" r="1.3" fill="#e8d080"/>
          <circle cx="68%"  cy="88%" r="1.1" fill="#e8d080"/>
          <circle cx="30%"  cy="80%" r="1.4" fill="#e8d080"/>
          <circle cx="44%"  cy="4%"  r="1"   fill="#e8d080"/>
        </g>
        <g className="star-3">
          <circle cx="22%"  cy="68%" r="2.2" fill="#f5e6a3"/>
          <circle cx="82%"  cy="30%" r="2"   fill="#f5e6a3"/>
          <circle cx="60%"  cy="18%" r="1.8" fill="#f5e6a3"/>
        </g>
        <g className="star-4">
          <circle cx="5%"   cy="22%" r="1.5" fill="#c9a84c"/>
          <circle cx="95%"  cy="72%" r="1.3" fill="#c9a84c"/>
          <circle cx="38%"  cy="96%" r="1.6" fill="#c9a84c"/>
          <circle cx="73%"  cy="3%"  r="1.4" fill="#c9a84c"/>
        </g>
        <g className="star-5">
          <circle cx="55%"  cy="48%" r="1"   fill="#c9a84c" opacity=".5"/>
          <circle cx="18%"  cy="85%" r=".9"  fill="#c9a84c" opacity=".5"/>
          <circle cx="93%"  cy="40%" r="1.1" fill="#c9a84c" opacity=".5"/>
        </g>
      </svg>

      {/* Bordes decorativos */}
      <div className="ad-seq-1" style={{position:"absolute",top:14,left:14,right:14,bottom:14,border:"1px solid rgba(201,168,76,.35)",borderRadius:6,pointerEvents:"none"}}/>
      <div className="ad-seq-1" style={{position:"absolute",top:26,left:26,right:26,bottom:26,border:"1px solid rgba(201,168,76,.15)",borderRadius:6,pointerEvents:"none"}}/>

      {/* Ornamentos en esquinas */}
      {([
        {top:10,left:10},{top:10,right:10},
        {bottom:10,left:10},{bottom:10,right:10},
      ] as React.CSSProperties[]).map((pos,i)=>(
        <svg key={i} className="ad-seq-1" width="20" height="20" viewBox="0 0 20 20"
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
        justifyContent:"space-between",
        height:"100dvh",
        padding:"48px 28px 40px",
        maxWidth:420, width:"100%", margin:"0 auto",
        textAlign:"center",
      }}>

        {/* Top label */}
        <div className="ad-seq-1" style={{
          letterSpacing:4, fontSize:10, textTransform:"uppercase",
          color:"#c9a84c", opacity:.75,
        }}>
          Para quienes buscan un ingreso extra
        </div>

        {/* Bloque central */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:22}}>

          {/* Tres cartas */}
          <div className={floating ? "ad-float" : ""} style={{display:"flex",gap:10,alignItems:"flex-end",justifyContent:"center"}}>
            {CARDS.map((src, i) => (
              <div
                key={i}
                style={{
                  opacity: visible[i] ? 1 : 0,
                  transform: visible[i] ? "translateY(0)" : "translateY(32px)",
                  transition: "opacity .5s ease, transform .5s ease",
                  // La carta del centro ligeramente más alta
                  marginBottom: i === 1 ? 12 : 0,
                }}
              >
                <div className="ad-card-scene">
                  <div className={`ad-card-inner${flipped[i] ? " flipped" : ""}`}>
                    {/* Reverso */}
                    <div className="ad-card-face">
                      <div className="ad-card-back-inner">
                        <svg width="70" height="112" viewBox="0 0 70 112">
                          <rect x="4" y="4" width="62" height="104" rx="4" fill="none" stroke="rgba(201,168,76,.3)" strokeWidth=".8"/>
                          <line x1="4" y1="4" x2="66" y2="108" stroke="rgba(201,168,76,.1)" strokeWidth=".6"/>
                          <line x1="66" y1="4" x2="4" y2="108" stroke="rgba(201,168,76,.1)" strokeWidth=".6"/>
                          <circle cx="35" cy="56" r="18" fill="none" stroke="rgba(201,168,76,.28)" strokeWidth=".8"/>
                          <circle cx="35" cy="56" r="10" fill="none" stroke="rgba(201,168,76,.18)" strokeWidth=".6"/>
                          <circle cx="35" cy="56" r="3"  fill="rgba(201,168,76,.35)"/>
                        </svg>
                      </div>
                    </div>
                    {/* Frente con imagen real */}
                    <div className="ad-card-face ad-card-front">
                      <img
                        src={src}
                        alt=""
                        style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Título TAROT */}
          <div className="ad-seq-2" style={{position:"relative", marginTop:14}}>
            <div style={{
              fontSize:"clamp(58px,16vw,84px)",
              fontWeight:"bold",
              letterSpacing:8,
              lineHeight:.92,
              background:"linear-gradient(180deg,#f5e6a3 0%,#c9a84c 40%,#a07828 100%)",
              backgroundSize:"300% auto",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
              backgroundClip:"text",
              textTransform:"uppercase",
              animation:"shimmer 5s linear infinite",
            }}>TAROT</div>
            <div style={{
              position:"absolute", left:"50%", transform:"translateX(-50%)",
              bottom:-6, width:180, height:1,
              background:"linear-gradient(90deg,transparent,#c9a84c,transparent)",
            }}/>
          </div>

          {/* Hook */}
          <div className="ad-seq-3" style={{maxWidth:300}}>
            <div style={{fontSize:15,lineHeight:1.65,color:"#e8dcc8",fontStyle:"italic"}}>
              Convierte tu intuición en
            </div>
            <div style={{fontSize:"clamp(22px,6.5vw,30px)",fontWeight:"bold",color:"#f5e6a3",letterSpacing:1,margin:"5px 0"}}>
              ingresos reales<br/>desde casa
            </div>
          </div>

          {/* Pills */}
          <div className="ad-seq-4" style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
            {["Sin experiencia previa","IA incluida","Acceso hoy"].map((t,i)=>(
              <div key={i} style={{
                padding:"5px 14px",
                border:"1px solid rgba(201,168,76,.4)",
                borderRadius:20,
                fontSize:10,
                letterSpacing:2,
                textTransform:"uppercase",
                color:"rgba(201,168,76,.85)",
                background:"rgba(201,168,76,.06)",
              }}>{t}</div>
            ))}
          </div>

          {/* CTA */}
          <button
            className="ad-seq-5 ad-cta"
            onClick={() => window.location.href = "https://pay.hotmart.com/X105246915J"}
            style={{
              marginTop:2,
              padding:"14px 52px",
              borderRadius:5,
              border:"1px solid #c9a84c",
              background:"linear-gradient(135deg,rgba(201,168,76,.22),rgba(201,168,76,.08))",
              color:"#f5e6a3",
              fontSize:13,
              fontFamily:"Georgia,serif",
              letterSpacing:4,
              textTransform:"uppercase",
              cursor:"pointer",
            }}
            onMouseEnter={e=>{
              (e.currentTarget as HTMLButtonElement).style.background="linear-gradient(135deg,rgba(201,168,76,.38),rgba(201,168,76,.16))";
            }}
            onMouseLeave={e=>{
              (e.currentTarget as HTMLButtonElement).style.background="linear-gradient(135deg,rgba(201,168,76,.22),rgba(201,168,76,.08))";
            }}
          >
            Empezar ahora →
          </button>
        </div>

        {/* Footer */}
        <div>
          <div style={{width:140,height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,.4),transparent)",margin:"0 auto 12px"}}/>
          <div style={{display:"flex",justifyContent:"center",gap:16,fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(201,168,76,.6)"}}>
            <span>10 módulos</span>
            <span style={{opacity:.35}}>|</span>
            <span>Chat con IA</span>
            <span style={{opacity:.35}}>|</span>
            <span>Certificado</span>
          </div>
        </div>

      </div>
    </div>
  );
}
