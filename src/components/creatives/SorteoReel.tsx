import { useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  #sorteo-scene *, #sorteo-scene *::before, #sorteo-scene *::after { box-sizing: border-box; margin: 0; padding: 0; }

  #sorteo-root {
    width: 100vw;
    height: 100dvh;
    overflow: hidden;
    background: #07070f;
    font-family: 'DM Sans', sans-serif;
  }

  #sorteo-scene {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: radial-gradient(ellipse 90% 55% at 50% 28%, #1a102e 0%, #0a0814 55%, #07070f 100%);
  }

  .sr-stars { position: absolute; inset: 0; pointer-events: none; }
  .sr-star {
    position: absolute; border-radius: 50%; background: #fff;
    animation: srTwinkle var(--dur, 3s) ease-in-out infinite var(--dl, 0s);
  }
  @keyframes srTwinkle {
    0%,100% { opacity: var(--mn, .1); transform: scale(1); }
    50%     { opacity: var(--mx, .8); transform: scale(1.5); }
  }

  .sr-nebula { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
  .sr-nb1 { width:80vw; height:80vw; top:-15%; left:-20%; background:radial-gradient(circle,rgba(120,60,200,.22) 0%,transparent 70%); animation:srNbDrift 8s ease-in-out infinite alternate; }
  .sr-nb2 { width:70vw; height:70vw; bottom:5%; right:-15%; background:radial-gradient(circle,rgba(212,168,67,.13) 0%,transparent 70%); animation:srNbDrift 11s ease-in-out infinite alternate-reverse; }
  .sr-nb3 { width:50vw; height:50vw; top:32%; left:5%; background:radial-gradient(circle,rgba(60,100,200,.18) 0%,transparent 70%); animation:srNbDrift 7s ease-in-out infinite alternate; }
  @keyframes srNbDrift { from{transform:translate(0,0) scale(1);} to{transform:translate(3vw,4vw) scale(1.1);} }

  .sr-particles { position: absolute; inset: 0; pointer-events: none; }
  .sr-particle {
    position: absolute; border-radius: 50%; opacity: 0;
    animation: srFloatUp var(--d2,6s) ease-in infinite var(--dl2,0s);
  }
  @keyframes srFloatUp {
    0%  { opacity:0; transform:translateY(0) scale(.5); }
    20% { opacity:.8; }
    80% { opacity:.4; }
    100%{ opacity:0; transform:translateY(-25vw) scale(1.5); }
  }

  #sr-sweep {
    position:absolute; inset:0; z-index:8; pointer-events:none;
    background:linear-gradient(135deg,transparent 40%,rgba(212,168,67,.07) 50%,transparent 60%);
    background-size:200% 200%;
    animation:srSweep 3.5s ease-in-out 2.4s infinite;
  }
  @keyframes srSweep {
    0%  { background-position:-100% -100%; opacity:0; }
    10% { opacity:1; }
    50% { background-position:200% 200%; opacity:1; }
    60% { opacity:0; }
    100%{ opacity:0; background-position:200% 200%; }
  }

  #sr-brand {
    position:absolute; top:2.4%; right:4.5%; z-index:30;
    text-align:right; animation:srFadeIn 1s ease .4s both;
  }
  #sr-brand-name   { font-family:'Cormorant Garamond',serif; font-size:3.6vw; color:#d4a843; letter-spacing:.5vw; font-weight:600; }
  #sr-brand-handle { font-size:2.6vw; color:#8a7f6e; letter-spacing:.3vw; margin-top:.3vw; }

  #sr-hook {
    position:absolute; top:4%; left:0; right:0;
    text-align:center; z-index:20;
    animation:srHookReveal .7s cubic-bezier(.34,1.56,.64,1) .1s both;
  }
  @keyframes srHookReveal { from{transform:translateY(-8vw) scale(.8);opacity:0;} to{transform:none;opacity:1;} }
  #sr-hook-eyebrow { font-size:2.5vw; letter-spacing:1.2vw; text-transform:uppercase; color:rgba(212,168,67,.65); margin-bottom:.5vw; }
  #sr-hook-main {
    font-family:'Cormorant Garamond',serif;
    font-size:13.5vw; font-weight:700; line-height:1;
    letter-spacing:2.5vw; text-transform:uppercase;
    background:linear-gradient(180deg,#f0c96a 0%,#d4a843 50%,#a07820 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    animation:srTitleGlow 3s ease-in-out 1s infinite;
  }
  @keyframes srTitleGlow {
    0%,100%{ filter:drop-shadow(0 0 4vw rgba(212,168,67,.5)); }
    50%    { filter:drop-shadow(0 0 8vw rgba(212,168,67,.95)) drop-shadow(0 0 15vw rgba(212,168,67,.3)); }
  }
  #sr-hook-deco { font-size:2.8vw; letter-spacing:2vw; color:rgba(212,168,67,.4); margin-top:.5vw; }

  #sr-card-glow {
    position:absolute; top:13%; left:50%; transform:translateX(-50%);
    width:56vw; height:38dvh; border-radius:50%;
    background:radial-gradient(ellipse,rgba(212,168,67,.12) 0%,transparent 70%);
    filter:blur(5vw); z-index:9;
    animation:srGlowPulse 3s ease-in-out 2.2s infinite;
  }
  @keyframes srGlowPulse {
    0%,100%{ opacity:.6; transform:translateX(-50%) scale(1); }
    50%    { opacity:1;  transform:translateX(-50%) scale(1.15); }
  }
  #sr-ring  { position:absolute; top:12%; left:50%; transform:translateX(-50%); width:50vw; height:37dvh; border-radius:50%; border:1px solid rgba(212,168,67,.12); z-index:7; animation:srRingPulse 4s ease-in-out 2.2s infinite; }
  #sr-ring2 { position:absolute; top:10.5%; left:50%; transform:translateX(-50%); width:57vw; height:41dvh; border-radius:50%; border:1px solid rgba(212,168,67,.06); z-index:6; animation:srRingPulse 4s ease-in-out 2.7s infinite; }
  @keyframes srRingPulse {
    0%,100%{ opacity:.4; transform:translateX(-50%) scale(1); }
    50%    { opacity:1;  transform:translateX(-50%) scale(1.04); }
  }

  .sr-mini-card {
    position:absolute; width:9.5vw; height:15.5vw; border-radius:1.2vw;
    border:.7px solid rgba(212,168,67,.35);
    background:linear-gradient(145deg,#1a0e2e,#0e0820);
    display:flex; align-items:center; justify-content:center;
    font-size:4.5vw; box-shadow:0 1vw 4vw rgba(0,0,0,.5); z-index:5; opacity:0;
  }
  .sr-mc1 { top:19%; left:3.5vw;  animation:srMf1 14s ease-in-out 1.2s infinite; }
  .sr-mc2 { top:27%; right:3vw;   animation:srMf2 16s ease-in-out 1.8s infinite; }
  .sr-mc3 { top:47%; left:5.5vw;  animation:srMf3 12s ease-in-out 2.2s infinite; }
  .sr-mc4 { top:42%; right:4vw;   animation:srMf4 15s ease-in-out 0.8s infinite; }
  @keyframes srMf1{0%,100%{opacity:.7;transform:translateY(0) rotate(-8deg);}  50%{opacity:.9;transform:translateY(-4vw) rotate(-12deg);}}
  @keyframes srMf2{0%,100%{opacity:.6;transform:translateY(0) rotate(6deg);}   50%{opacity:.85;transform:translateY(-5vw) rotate(10deg);}}
  @keyframes srMf3{0%,100%{opacity:.65;transform:translateY(0) rotate(-5deg);} 50%{opacity:.8;transform:translateY(-3.5vw) rotate(-9deg);}}
  @keyframes srMf4{0%,100%{opacity:.7;transform:translateY(0) rotate(9deg);}   50%{opacity:.9;transform:translateY(-4.5vw) rotate(5deg);}}

  #sr-card-wrap {
    position:absolute; top:15.5%; left:50%; transform:translateX(-50%);
    width:32vw; height:26dvh;
    perspective:100vw; z-index:10;
    animation:srCardEntrance .9s cubic-bezier(.34,1.56,.64,1) .2s both;
  }
  @keyframes srCardEntrance { from{transform:translateX(-50%) translateY(-15vw) scale(.6);opacity:0;} to{transform:translateX(-50%) translateY(0) scale(1);opacity:1;} }
  #sr-card-inner {
    position:relative; width:100%; height:100%; transform-style:preserve-3d;
    animation:srCardFlip .8s ease-in-out .5s both, srCardFloat 4s ease-in-out 1.4s infinite;
  }
  @keyframes srCardFlip { 0%{transform:rotateY(0);} 100%{transform:rotateY(180deg);} }
  @keyframes srCardFloat {
    0%,100%{ transform:rotateY(180deg) translateY(0) rotate(-1deg); }
    33%    { transform:rotateY(180deg) translateY(-2.5vw) rotate(1deg); }
    66%    { transform:rotateY(180deg) translateY(-1.2vw) rotate(-.5deg); }
  }
  .sr-card-face {
    position:absolute; inset:0; border-radius:3vw;
    backface-visibility:hidden; -webkit-backface-visibility:hidden;
    box-shadow:0 0 10vw rgba(212,168,67,.4),0 5vw 12vw rgba(0,0,0,.8);
  }
  .sr-card-back {
    background:linear-gradient(145deg,#1a0e2e,#0e0820);
    border:.5vw solid #a07820;
    display:flex; align-items:center; justify-content:center; overflow:hidden;
  }
  .sr-card-back::before { content:''; position:absolute; inset:1.8vw; border:1px solid rgba(212,168,67,.3); border-radius:2vw; }
  .sr-cbp { width:18vw; height:18vw; opacity:.6; animation:srRotateSlow 20s linear infinite; }
  @keyframes srRotateSlow { to{transform:rotate(360deg);} }
  .sr-card-front {
    transform:rotateY(180deg);
    background:linear-gradient(160deg,#1e1230,#120c24 60%,#0e0a1c);
    border:.5vw solid #d4a843;
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5vw;
    overflow:hidden;
  }
  .sr-card-front::before { content:''; position:absolute; inset:1.5vw; border:1px solid rgba(212,168,67,.45); border-radius:1.8vw; }
  .sr-cf-glyph { font-size:12vw; line-height:1; animation:srGlyphPulse 2s ease-in-out infinite; }
  @keyframes srGlyphPulse {
    0%,100%{ filter:drop-shadow(0 0 2.5vw rgba(212,168,67,.6)); }
    50%    { filter:drop-shadow(0 0 6vw rgba(212,168,67,1)) drop-shadow(0 0 10vw rgba(212,168,67,.4)); }
  }
  .sr-cf-name  { font-family:'Cormorant Garamond',serif; color:#d4a843; font-size:3vw; letter-spacing:.8vw; text-transform:uppercase; font-weight:600; }
  .sr-cf-roman { font-family:'Cormorant Garamond',serif; color:rgba(212,168,67,.5); font-size:2.5vw; letter-spacing:.5vw; }

  #sr-prize {
    position:absolute; top:43%; left:0; right:0;
    text-align:center; z-index:20; padding:0 6vw;
    animation:srPrizeReveal .7s cubic-bezier(.34,1.56,.64,1) 1.4s both;
  }
  @keyframes srPrizeReveal { from{transform:translateY(8vw) scale(.9);opacity:0;} to{transform:none;opacity:1;} }
  #sr-prize-label {
    font-family:'Cormorant Garamond',serif; font-size:5.5vw; font-weight:600; line-height:1;
    letter-spacing:2vw; text-transform:uppercase;
    color:#e0d5c0; opacity:.9; margin-bottom:.5vw;
  }
  #sr-prize-badge {
    font-family:'Cormorant Garamond',serif; font-size:15vw; font-weight:700; line-height:1; letter-spacing:-.3vw;
    background:linear-gradient(135deg,#a07820,#d4a843,#f0c96a,#d4a843); background-size:200% 200%;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    animation:srShimmer 2.5s ease-in-out infinite;
  }
  @keyframes srShimmer { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }

  #sr-ademas {
    position:absolute; top:53%; left:0; right:0;
    padding:0 5vw; z-index:20;
    animation:srFadeIn .5s ease 1.8s both;
  }
  #sr-ademas span {
    font-size:2.6vw; letter-spacing:.5vw; text-transform:uppercase;
    color:rgba(212,168,67,.55); font-weight:400;
  }

  #sr-bonuses {
    position:absolute; top:56%; left:0; right:0;
    padding:0 5vw; z-index:20;
    display:flex; flex-direction:column; gap:1.2vw;
    animation:srFadeIn .5s ease 2s both;
  }
  .sr-bonus-item { display:flex; align-items:center; gap:2.5vw; background:rgba(255,255,255,.03); border:1px solid rgba(212,168,67,.15); border-radius:2vw; padding:1.6vw 2.5vw; }
  .sr-bonus-icon { font-size:3.5vw; flex-shrink:0; }
  .sr-bonus-text { font-size:2.8vw; color:rgba(224,213,192,.8); line-height:1.3; font-weight:300; }
  .sr-bonus-text strong { color:#f0c96a; font-weight:500; }

  .sr-divider { position:absolute; top:65%; left:9vw; right:9vw; height:1px; background:linear-gradient(90deg,transparent,rgba(212,168,67,.35),transparent); z-index:20; animation:srFadeIn .5s ease 2.3s both; }

  #sr-bottom-section {
    position:absolute; top:66.5%; left:0; right:0;
    padding:0 7vw; z-index:20;
    display:flex; flex-direction:column; gap:0;
  }

  #sr-steps {
    display:flex; flex-direction:column; gap:1.2vw;
  }
  .sr-step { display:flex; align-items:center; gap:3vw; opacity:0; transform:translateX(-4vw); }
  .sr-s1 { animation:srStepIn .45s cubic-bezier(.34,1.56,.64,1) 2.5s both; }
  .sr-s2 { animation:srStepIn .45s cubic-bezier(.34,1.56,.64,1) 2.8s both; }
  .sr-s3 { animation:srStepIn .45s cubic-bezier(.34,1.56,.64,1) 3.1s both; }
  .sr-s4 { animation:srStepIn .45s cubic-bezier(.34,1.56,.64,1) 3.4s both; }
  @keyframes srStepIn { from{opacity:0;transform:translateX(-4vw);} to{opacity:1;transform:none;} }
  .sr-step-num {
    width:6vw; height:6vw; border-radius:50%; flex-shrink:0;
    border:1.5px solid #d4a843;
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:3.2vw; color:#d4a843; font-weight:700;
    box-shadow:0 0 2vw rgba(212,168,67,.3);
  }
  .sr-step-text { font-size:3vw; color:#e0d5c0; line-height:1.3; font-weight:300; }
  .sr-step-text strong { color:#f0c96a; font-weight:500; }

  #sr-date-line { margin-top:3vw; text-align:center; animation:srCtaReveal .7s cubic-bezier(.34,1.56,.64,1) 4s both; }
  @keyframes srCtaReveal { from{transform:translateY(5vw);opacity:0;} to{transform:none;opacity:1;} }
  #sr-date-hdiv { width:28vw; height:1px; margin:0 auto 2vw; background:linear-gradient(90deg,transparent,rgba(212,168,67,.4),transparent); }
  #sr-date-text { font-family:'Cormorant Garamond',serif; font-size:5vw; color:#f0c96a; letter-spacing:.3vw; font-weight:600; }
  #sr-date-sub  { font-size:2.5vw; color:#8a7f6e; letter-spacing:.5vw; text-transform:uppercase; margin-top:.8vw; }

  @keyframes srFadeIn { from{opacity:0;} to{opacity:1;} }
`;

export default function SorteoReel() {
  useEffect(() => {
    // Stars
    const se = document.getElementById("sr-stars");
    if (se) {
      for (let i = 0; i < 110; i++) {
        const s = document.createElement("div");
        s.className = "sr-star";
        const sz = (Math.random() * 2 + 0.5).toFixed(1);
        s.style.cssText = `width:${sz}px;height:${sz}px;top:${(Math.random() * 100).toFixed(1)}%;left:${(Math.random() * 100).toFixed(1)}%;--dur:${(Math.random() * 4 + 2).toFixed(1)}s;--dl:${(Math.random() * 5).toFixed(1)}s;--mn:${(Math.random() * 0.15).toFixed(2)};--mx:${(Math.random() * 0.6 + 0.3).toFixed(2)};`;
        se.appendChild(s);
      }
    }
    // Particles
    const pe = document.getElementById("sr-particles");
    if (pe) {
      for (let i = 0; i < 28; i++) {
        const p = document.createElement("div");
        p.className = "sr-particle";
        const sz = (Math.random() * 2.5 + 0.8).toFixed(1);
        p.style.cssText = `width:${sz}px;height:${sz}px;left:${(Math.random() * 100).toFixed(1)}%;bottom:${(Math.random() * 40).toFixed(1)}%;--d2:${(Math.random() * 5 + 4).toFixed(1)}s;--dl2:${(Math.random() * 6).toFixed(1)}s;background:${Math.random() > 0.5 ? "#d4a843" : "#c0b8a8"};`;
        pe.appendChild(p);
      }
    }
    return () => {
      if (se) se.innerHTML = "";
      if (pe) pe.innerHTML = "";
    };
  }, []);

  return (
    <div id="sorteo-root">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div id="sorteo-scene">

        <div className="sr-stars" id="sr-stars" />
        <div className="sr-nebula sr-nb1" />
        <div className="sr-nebula sr-nb2" />
        <div className="sr-nebula sr-nb3" />
        <div className="sr-particles" id="sr-particles" />
        <div id="sr-sweep" />
        <div id="sr-ring" />
        <div id="sr-ring2" />
        <div id="sr-card-glow" />

        <div id="sr-brand">
          <div id="sr-brand-name">Visión Tarot</div>
          <div id="sr-brand-handle">@visiontarotonline</div>
        </div>

        <div id="sr-hook">
          <div id="sr-hook-eyebrow">✦ &nbsp; gran &nbsp; ✦</div>
          <div id="sr-hook-main">SORTEO</div>
          <div id="sr-hook-deco">— — — — —</div>
        </div>

        <div className="sr-mini-card sr-mc1">🌙</div>
        <div className="sr-mini-card sr-mc2">⭐</div>
        <div className="sr-mini-card sr-mc3">♾️</div>
        <div className="sr-mini-card sr-mc4">🔮</div>

        <div id="sr-card-wrap">
          <div id="sr-card-inner">
            <div className="sr-card-face sr-card-back">
              <svg className="sr-cbp" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" stroke="#d4a843" strokeWidth="0.8" opacity="0.6"/>
                <circle cx="50" cy="50" r="28" stroke="#d4a843" strokeWidth="0.5" opacity="0.4"/>
                <line x1="50" y1="10" x2="50" y2="90" stroke="#d4a843" strokeWidth="0.5" opacity="0.4"/>
                <line x1="10" y1="50" x2="90" y2="50" stroke="#d4a843" strokeWidth="0.5" opacity="0.4"/>
                <line x1="22" y1="22" x2="78" y2="78" stroke="#d4a843" strokeWidth="0.5" opacity="0.3"/>
                <line x1="78" y1="22" x2="22" y2="78" stroke="#d4a843" strokeWidth="0.5" opacity="0.3"/>
                <polygon points="50,15 60,40 88,40 65,57 74,85 50,68 26,85 35,57 12,40 40,40" fill="none" stroke="#d4a843" strokeWidth="0.7" opacity="0.5"/>
              </svg>
            </div>
            <div className="sr-card-face sr-card-front">
              <div className="sr-cf-glyph">☀️</div>
              <div className="sr-cf-name">El Sol</div>
              <div className="sr-cf-roman">XIX</div>
            </div>
          </div>
        </div>

        <div id="sr-prize">
          <div id="sr-prize-label">Curso de Tarot</div>
          <div id="sr-prize-badge">GRATIS</div>
        </div>

        <div id="sr-ademas"><span>Además incluye:</span></div>

        <div id="sr-bonuses">
          <div className="sr-bonus-item">
            <div className="sr-bonus-icon">📖</div>
            <div className="sr-bonus-text"><strong>Ebook 1:</strong> Guía educativa completa de Tarot</div>
          </div>
          <div className="sr-bonus-item">
            <div className="sr-bonus-icon">💼</div>
            <div className="sr-bonus-text"><strong>Ebook 2:</strong> Estrategia para vender servicios de Tarot</div>
          </div>
        </div>

        <div className="sr-divider" />

        <div id="sr-bottom-section">
          <div id="sr-steps">
            <div className="sr-step sr-s1">
              <div className="sr-step-num">1</div>
              <div className="sr-step-text"><strong>Seguí</strong> esta cuenta</div>
            </div>
            <div className="sr-step sr-s2">
              <div className="sr-step-num">2</div>
              <div className="sr-step-text">Comentá <strong>¿por qué querés aprender tarot?</strong></div>
            </div>
            <div className="sr-step sr-s3">
              <div className="sr-step-num">3</div>
              <div className="sr-step-text">Etiquetá a <strong>alguien que necesite esto</strong> 🔮</div>
            </div>
            <div className="sr-step sr-s4">
              <div className="sr-step-num">4</div>
              <div className="sr-step-text"><strong>Compartí este reel</strong> para una entrada extra ✨</div>
            </div>
          </div>

          <div id="sr-date-line">
            <div id="sr-date-hdiv" />
            <div id="sr-date-text">✦ &nbsp; Ganador el 1 de Mayo &nbsp; ✦</div>
            <div id="sr-date-sub">Cierra el 30 de Abril · Un solo ganador</div>
          </div>
        </div>

      </div>
    </div>
  );
}
