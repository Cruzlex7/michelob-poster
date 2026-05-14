/* global React, ReactDOM, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSlider, TweakToggle, TweakButton, TweakSelect */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ============ DATA ============ */
const REASONS = [
  { id: 'familia',  label: 'POR MI FAMILIA',     icon: '✦', cat: 'proposito' },
  { id: 'salud',    label: 'POR MI SALUD',       icon: '✦', cat: 'proposito' },
  { id: 'supera',   label: 'POR SUPERARME',      icon: '✦', cat: 'resistencia' },
  { id: 'meta',     label: 'POR LLEGAR A LA META', icon: '✦', cat: 'celebracion' },
  { id: 'mi',       label: 'POR MÍ MISMA/O',     icon: '✦', cat: 'proposito' },
  { id: 'primera',  label: 'MI PRIMERA CARRERA', icon: '✦', cat: 'celebracion' },
];

const MESSAGES = {
  resistencia: [
    "El último kilómetro empieza en la mente. Y la tuya, [N], es invencible.",
    "[N], cada paso que duele es un paso que cuenta el doble.",
    "Lo difícil es lo único que vale la pena correr. Sigue, [N].",
    "Cuando las piernas digan no, los pulmones recordarán por qué empezaste.",
    "[N], hoy no compites contra nadie. Le vas ganando al [N] de ayer.",
  ],
  proposito: [
    "[N], no estás sola en esta pista. Llevas un mundo entero en cada zancada.",
    "Cada metro que avanzas, [N], honra exactamente por qué empezaste.",
    "[N], el amor pesa menos cuando lo cargas corriendo.",
    "Corres por algo más grande que tú, [N]. Eso ya te hace ganadora.",
    "[N], lo que te empuja hoy es más fuerte que cualquier viento en contra.",
  ],
  celebracion: [
    "[N], hoy la meta es tuya. Disfrútala kilómetro a kilómetro.",
    "Lo decidiste cuando te pusiste los tenis, [N]. El resto es celebración.",
    "Hoy no se trata de llegar primero, [N]. Se trata de llegar. Y vas a llegar.",
    "[N], esto que sientes hoy se llama estar viva. Sabe a sabor superior.",
    "[N], la mejor versión tuya está esperándote en el kilómetro 21.",
  ],
};

function categorize(text) {
  const t = (text || '').toLowerCase();
  const purp = /familia|hij|mam|pap|esposo|esposa|amor|salud|vida|prometí|prometi|dedico|por ellos|por ella|por él|por mi gente|amigos/;
  const res  = /superar|supero|reto|prueba|límite|limit|disciplina|resistencia|fuerza|orgullo|demostrar|valgo|puedo/;
  const cel  = /primera|primer|debut|disfrut|gozar|sueño|sueno|cumplir|alegría|alegria|festejar|meta|llegar|terminar/;
  if (purp.test(t)) return 'proposito';
  if (res.test(t))  return 'resistencia';
  if (cel.test(t))  return 'celebracion';
  return ['resistencia','proposito','celebracion'][Math.floor(Math.random()*3)];
}

function selectMessage(name, reasonText, category) {
  const cat = category || categorize(reasonText);
  const pool = MESSAGES[cat];
  const m = pool[Math.floor(Math.random() * pool.length)];
  const displayName = (name || 'Tú').split(' ')[0];
  return m.replaceAll('[N]', displayName);
}

/* Demo scripts for auto-play */
const DEMO_PERSONAS = [
  { name: 'Camila', reasonText: 'Por mi mamá que me espera en la meta', reasonId: 'familia' },
  { name: 'Andrés', reasonText: 'Por superar mis propios límites', reasonId: 'supera' },
  { name: 'Valentina', reasonText: 'Es mi primera media maratón', reasonId: 'primera' },
];

/* ============ KEYBOARD ============ */
const KBD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L','Ñ'],
  ['Z','X','C','V','B','N','M', '⌫'],
];

function Keyboard({ value, onChange, onNext, canNext }) {
  const tap = useCallback((k) => {
    if (k === '⌫') return onChange(value.slice(0, -1));
    if (k === '␣') return onChange(value + ' ');
    if (value.length >= 22) return;
    onChange((value + k.toLowerCase()).replace(/(^|\s)\p{L}/gu, (m) => m.toUpperCase()));
  }, [value, onChange]);

  return (
    <div className="kbd">
      {KBD_ROWS.map((row, i) => (
        <div className="kbd-row" key={i}>
          {row.map((k) => (
            <button key={k} className={"kbd-key" + (k === '⌫' ? ' wide' : '')} onClick={() => tap(k)}>
              {k}
            </button>
          ))}
        </div>
      ))}
      <div className="kbd-row">
        <button className="kbd-key wide" onClick={() => tap('␣')}>ESPACIO</button>
        <button className={"kbd-key next" + (canNext ? '' : ' disabled')} onClick={canNext ? onNext : undefined}>
          CONTINUAR →
        </button>
      </div>
    </div>
  );
}

/* ============ POSTER — DISEÑO MICHELOB ULTRA ============ */
function Poster({ name, message, reasonLabel, bigger }) {
  const displayName = (name || 'Tu Nombre').toUpperCase();
  const reasonUp = (reasonLabel || 'POR QUÉ CORRES').toUpperCase();

  const porMatch = reasonUp.match(/^(POR\s)([\s\S]*)$/);

  return (
    <div className={"poster" + (bigger ? ' bigger' : '')}>
      <div className="p-top"/>

      <div className="p-body">
        {/*
          LOGO — cuando el equipo de marca entregue el archivo oficial,
          reemplazar este bloque con:
          <img src="assets/logo.png" alt="Michelob Ultra" className="p-logo-img"/>
        */}
        <div className="p-brand">
          <span className="p-script">Michelob</span>
          <span className="p-ultra">ULTRA.</span>
          <div className="p-rib"/>
        </div>

        <div className="p-name">{displayName}</div>

        <div className="p-reason">
          {porMatch
            ? <><span className="p-red">{porMatch[1]}</span>{porMatch[2]}</>
            : reasonUp}
        </div>

        {message && <div className="p-msg">{message.toUpperCase()}</div>}

        <div className="p-runner">
          <img src="assets/runner.png" alt="" className="p-runner-img"/>
        </div>
      </div>

      <div className="p-bot"/>
    </div>
  );
}

/* ============ BOTTLE SVG ============ */
function Bottle() {
  return (
    <svg viewBox="0 0 100 260" fill="none">
      <defs>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4a85a"/>
          <stop offset="40%" stopColor="#f1c970"/>
          <stop offset="60%" stopColor="#e8b85a"/>
          <stop offset="100%" stopColor="#8e6a2a"/>
        </linearGradient>
        <linearGradient id="cap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a6f"/>
          <stop offset="100%" stopColor="#0a1e3f"/>
        </linearGradient>
      </defs>
      {/* cap */}
      <rect x="38" y="0" width="24" height="22" rx="3" fill="url(#cap)"/>
      <rect x="38" y="20" width="24" height="4" fill="#050f22"/>
      {/* neck */}
      <path d="M40,24 L40,60 Q40,68 36,72 L34,80 L66,80 L64,72 Q60,68 60,60 L60,24 Z" fill="url(#glass)"/>
      {/* body */}
      <path d="M30,80 Q24,86 24,100 L24,240 Q24,256 40,256 L60,256 Q76,256 76,240 L76,100 Q76,86 70,80 Z" fill="url(#glass)"/>
      {/* highlight */}
      <rect x="32" y="100" width="4" height="130" rx="2" fill="rgba(255,255,255,0.45)"/>
      <rect x="40" y="100" width="2" height="100" rx="1" fill="rgba(255,255,255,0.2)"/>
      {/* label */}
      <rect x="26" y="130" width="48" height="80" fill="#f4f0e6"/>
      <rect x="26" y="130" width="48" height="80" fill="none" stroke="#0a1e3f" strokeWidth="0.5"/>
      {/* label content */}
      <text x="50" y="156" textAnchor="middle" fontFamily="DM Serif Display" fontStyle="italic" fontSize="11" fill="#0a1e3f">M.</text>
      <line x1="34" y1="162" x2="66" y2="162" stroke="#0a1e3f" strokeWidth="0.4"/>
      <text x="50" y="174" textAnchor="middle" fontFamily="Barlow Condensed" fontWeight="700" fontSize="6" letterSpacing="1" fill="#0a1e3f">ULTRA*</text>
      {/* ribbon */}
      <path d="M46,180 L54,180 L54,196 L50,192 L46,196 Z" fill="#C8102E"/>
      <text x="50" y="208" textAnchor="middle" fontFamily="Barlow Condensed" fontWeight="600" fontSize="3.5" letterSpacing="0.5" fill="#0a1e3f">SUPERIOR LIGHT</text>
    </svg>
  );
}

/* ============ HEADER ============ */
function Header({ step, total }) {
  return (
    <header className="kiosk-header">
      <div className="brand-mark">
        <span className="ribbon"></span>
        <span className="script">Michelob</span>
        <span className="sans">ULTRA*</span>
      </div>
      {step != null ? (
        <div className="steps">
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={"dot" + (i === step ? ' active' : i < step ? ' done' : '')}></span>
          ))}
        </div>
      ) : <span className="event-tag">GOOD PACE · 26</span>}
    </header>
  );
}

/* ============ BG arcs (subtle running track motif) ============ */
function BgArcs() {
  return (
    <svg className="arcs" viewBox="0 0 720 1200" preserveAspectRatio="xMidYMid slice">
      <g stroke="#C8102E" strokeWidth="1" fill="none" opacity="0.35">
        <path d="M-100,200 Q360,-100 820,200"/>
        <path d="M-100,260 Q360,-40 820,260"/>
        <path d="M-100,320 Q360,20 820,320"/>
      </g>
      <g stroke="#C9A961" strokeWidth="1" fill="none" opacity="0.25">
        <path d="M-100,1000 Q360,1300 820,1000"/>
        <path d="M-100,1060 Q360,1360 820,1060"/>
      </g>
    </svg>
  );
}

/* ============ SCREENS ============ */
function ScreenAttractor({ onStart }) {
  return (
    <div className="screen attractor active">
      <div className="brand-bg"><BgArcs/></div>

      {/* Brand header — centrado como referencia */}
      <div className="attr-brand">
        <div className="attr-event-tag">GOOD PACE · 23–25 JUL · 2026</div>
        <div className="attr-brand-center">
          <span className="attr-script">Michelob</span>
          <div className="attr-ultra-row">
            <span className="attr-ultra">ULTRA</span>
            <div className="attr-ribbon"/>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="attr-hero">
        <div className="attr-copy">
          <span className="attr-word">CORRE</span>
          <div className="attr-line"/>
          <span className="attr-word">MÁS</span>
          <div className="attr-line"/>
          <span className="attr-word red">RÁPIDO.</span>
          <div className="attr-desc">Crea tu poster motivacional.<br/>Llévatelo al recorrido.</div>
        </div>
        <div className="attr-bottle">
          <div className="bottle"><Bottle/></div>
          <span className="slogan">SUPERIOR LIGHT BEER</span>
        </div>
      </div>

      {/* Bottom */}
      <div className="attr-bottom">
        <div className="attr-tags">
          {['21K','CORFERIAS','BOGOTÁ','JUL 26'].map(t => (
            <span key={t} className="attr-tag">{t}</span>
          ))}
        </div>
        <button className="tap-cta" onClick={onStart} style={{width:'100%', borderRadius:18}}>
          <span className="finger">👆</span>
          <span>TOCA PARA EMPEZAR</span>
        </button>
      </div>
    </div>
  );
}

function ScreenWelcome({ onNext }) {
  useEffect(() => { const t = setTimeout(onNext, 5400); return () => clearTimeout(t); }, [onNext]);
  return (
    <div className="screen welcome active">
      <div className="brand-bg"><BgArcs/></div>
      <div style={{position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <div className="greet">¡Hola, corredor!</div>
        <div className="lead">EN 3 PASOS TENDRÁS TU POSTER</div>
        <div className="steps-preview">
          <div className="step-card"><div className="num">1</div><div className="lbl">TU NOMBRE</div></div>
          <div className="step-card"><div className="num">2</div><div className="lbl">¿POR QUÉ<br/>CORRES?</div></div>
          <div className="step-card"><div className="num">3</div><div className="lbl">IMPRIMIR<br/>Y LLEVAR</div></div>
        </div>
      </div>
    </div>
  );
}

function ScreenName({ name, setName, onNext, onBack }) {
  return (
    <div className="screen input-screen active">
      <div className="brand-bg"><BgArcs/></div>
      <Header step={0} total={2}/>
      <div style={{position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flex: 1, padding: '0 50px 40px'}}>
        <div className="step-header">
          <div className="hint">PASO 1 DE 2</div>
          <div className="question">¿Cómo te <span className="accent">llamas</span>?</div>
        </div>
        <input
          className="text-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Escribe tu nombre"
          autoFocus
          maxLength={22}
        />
        <Keyboard
          value={name}
          onChange={setName}
          onNext={onNext}
          canNext={name.trim().length >= 2}
        />
      </div>
    </div>
  );
}

function ScreenReason({ reasonId, setReasonId, customReason, setCustomReason, onNext, onBack }) {
  const canNext = reasonId === 'custom' ? customReason.trim().length >= 4 : !!reasonId;
  return (
    <div className="screen input-screen active">
      <div className="brand-bg"><BgArcs/></div>
      <Header step={1} total={2}/>
      <div style={{position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flex: 1, padding: '0 50px 40px'}}>
        <div className="step-header">
          <div className="hint">PASO 2 DE 2</div>
          <div className="question">¿Por qué <span className="accent">corres</span>?</div>
        </div>
        <div className="chips-grid">
          {REASONS.map((r) => (
            <button
              key={r.id}
              className={"chip" + (reasonId === r.id ? ' selected' : '')}
              onClick={() => setReasonId(r.id)}
            >
              <span className="icon">{r.icon}</span>
              {r.label}
            </button>
          ))}
          <div className={"chip custom" + (reasonId === 'custom' ? ' selected' : '')}
               onClick={() => setReasonId('custom')}>
            <span className="icon">✦</span>
            ESCRIBE TU PROPIA RAZÓN
            {reasonId === 'custom' && (
              <input
                autoFocus
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Por…"
                maxLength={70}
              />
            )}
          </div>
        </div>
        <div className="cta-bar">
          <button className="btn" onClick={onBack}>← ATRÁS</button>
          <button className={"btn primary" + (canNext ? '' : ' disabled')} onClick={canNext ? onNext : undefined}>
            CREAR MI POSTER <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenGenerating({ name, reasonText, category, onDone, speed }) {
  const [shuffle, setShuffle] = useState('');
  const [progress, setProgress] = useState(0);
  const phraseMs = Math.max(400, 2000 / speed);
  const totalMs = phraseMs * 3 + 800;

  useEffect(() => {
    const pool = MESSAGES[category || categorize(reasonText)];
    const display = (name || 'Tú').split(' ')[0];
    let i = 0;
    setShuffle(pool[0].replaceAll('[N]', display));
    const iv = setInterval(() => {
      i++;
      setShuffle(pool[i % pool.length].replaceAll('[N]', display));
    }, phraseMs);
    const startT = Date.now();
    const piv = setInterval(() => {
      const p = Math.min(100, ((Date.now() - startT) / totalMs) * 100);
      setProgress(p);
      if (p >= 100) clearInterval(piv);
    }, 60);
    const t = setTimeout(() => { clearInterval(iv); onDone(); }, totalMs);
    return () => { clearInterval(iv); clearInterval(piv); clearTimeout(t); };
  }, []);

  return (
    <div className="screen generating active">
      <div className="brand-bg"><BgArcs/></div>
      <Header step={null}/>
      <div style={{position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '40px 60px'}}>
        <div className="gen-title">CREANDO TU MENSAJE</div>
        <div className="gen-shuffle">
          <span key={shuffle} className="line">"{shuffle}"</span>
        </div>
        <div className="gen-loader"><span></span><span></span><span></span></div>
        <div className="gen-progress"><div className="bar" style={{width: progress + '%'}}/></div>
      </div>
    </div>
  );
}

function ScreenPoster({ name, message, reasonLabel, onPrint, onRetry, onBack }) {
  return (
    <div className="screen poster-screen active">
      <Header step={null}/>
      <div className="poster-screen-body">
        <div className="title">VISTA PREVIA DE TU POSTER</div>
        <div className="scene">
          <Poster name={name} message={message} reasonLabel={reasonLabel}/>
        </div>
        <div className="poster-actions">
          <button className="btn" onClick={onRetry}>↻ OTRO MENSAJE</button>
          <button className="btn primary" onClick={onPrint}>IMPRIMIR <span className="arrow">→</span></button>
        </div>
      </div>
    </div>
  );
}

function ScreenPrinting({ onDone, speed }) {
  useEffect(() => {
    const t = setTimeout(onDone, Math.max(2400, 5500 / speed));
    return () => clearTimeout(t);
  }, [onDone, speed]);
  return (
    <div className="screen printing active">
      <div className="brand-bg"><BgArcs/></div>
      <Header step={null}/>
      <div style={{position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 36, padding: '40px 60px'}}>
        <div className="heading">Imprimiendo<br/>tu poster…</div>
        <div className="printer">
          <div className="paper"></div>
          <div className="slit"></div>
          <div className="body">
            <div className="lights"><span className="green on"></span><span className="on"></span><span></span></div>
          </div>
        </div>
        <div className="print-progress"><div className="bar"></div></div>
        <div className="status">NO CIERRES LA APP · TAMAÑO CARTA</div>
      </div>
    </div>
  );
}

function ScreenDone({ name, onReset }) {
  const [count, setCount] = useState(8);
  useEffect(() => {
    if (count <= 0) { onReset(); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  const sparkles = useMemo(() => Array.from({length: 18}).map((_, i) => ({
    id: i,
    left: 50 + (Math.random() - 0.5) * 80,
    top: 50 + (Math.random() - 0.5) * 60,
    delay: Math.random() * 0.8,
    sx: (Math.random() - 0.5) * 200 + 'px',
    sy: (Math.random() - 0.5) * 200 + 'px',
  })), []);

  return (
    <div className="screen done-screen active">
      <div className="brand-bg"><BgArcs/></div>
      <Header step={null}/>
      <div style={{position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 28, padding: '40px 60px'}}>
        {sparkles.map(s => (
          <div key={s.id} className="sparkle" style={{
            left: s.left + '%', top: s.top + '%',
            animationDelay: s.delay + 's',
            '--sx': s.sx, '--sy': s.sy
          }}/>
        ))}
        <div className="check">
          <svg viewBox="0 0 70 70" fill="none">
            <path d="M16 36 L30 50 L54 22" stroke="#F4F0E6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="heading">¡Listo, {(name || 'Tú').split(' ')[0]}!</div>
        <div className="sub">Recoge tu poster del lado izquierdo del tótem.<br/>Nos vemos en el kilómetro 21.</div>
      </div>
      <div className="reset-timer">VOLVIENDO AL INICIO EN {count}s</div>
    </div>
  );
}

/* ============ ROOT APP ============ */
const DEFAULTS = /*EDITMODE-BEGIN*/{
  "showChrome": false,
  "speed": 1,
  "demo": false,
  "accent": "#C8102E"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(DEFAULTS);

  const [screen, setScreen] = useState('attractor');
  const [name, setName] = useState('');
  const [reasonId, setReasonId] = useState(null);
  const [customReason, setCustomReason] = useState('');
  const [message, setMessage] = useState('');

  // Scale kiosk to viewport
  const stageRef = useRef(null);
  useEffect(() => {
    const fit = () => {
      const el = stageRef.current; if (!el) return;
      const pad = 50;
      const sw = window.innerWidth - pad * 2;
      const sh = window.innerHeight - pad * 2;
      const s = Math.min(sw / 1080, sh / 1920);
      el.style.transform = `translate(-50%, -50%) scale(${s})`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // Apply accent color
  useEffect(() => {
    document.documentElement.style.setProperty('--red', tweaks.accent);
  }, [tweaks.accent]);

  const reasonText = reasonId === 'custom' ? customReason : (REASONS.find(r => r.id === reasonId)?.label || '');
  const reasonCat = reasonId === 'custom' ? null : (REASONS.find(r => r.id === reasonId)?.cat || null);
  const reasonLabel = reasonId === 'custom'
    ? customReason
    : (REASONS.find(r => r.id === reasonId)?.label || '');

  const generate = () => {
    setMessage(selectMessage(name, reasonText, reasonCat));
  };

  const reset = useCallback(() => {
    setName(''); setReasonId(null); setCustomReason(''); setMessage('');
    setScreen('attractor');
  }, []);

  // Auto-demo mode
  useEffect(() => {
    if (!tweaks.demo) return;
    let cancelled = false;
    const persona = DEMO_PERSONAS[Math.floor(Math.random() * DEMO_PERSONAS.length)];
    const speed = tweaks.speed;
    const delay = (ms) => new Promise(r => setTimeout(r, ms / speed));
    (async () => {
      while (!cancelled) {
        setScreen('attractor');
        await delay(2200);
        if (cancelled) return;
        setScreen('welcome');
        await delay(2600);
        setScreen('name');
        // type name
        for (let i = 1; i <= persona.name.length; i++) {
          if (cancelled) return;
          setName(persona.name.slice(0, i));
          await delay(110);
        }
        await delay(600);
        setScreen('reason');
        await delay(900);
        setReasonId(persona.reasonId);
        await delay(1500);
        setScreen('generating');
        // generating screen will call setScreen on its own via onDone -> we wait via screen change
        // We'll force-set message after gen time
        setTimeout(() => { setMessage(selectMessage(persona.name, persona.reasonText, REASONS.find(r=>r.id===persona.reasonId).cat)); }, 100);
        await delay(2800);
        setScreen('poster');
        await delay(4200);
        setScreen('printing');
        await delay(5800);
        setScreen('done');
        await delay(4500);
        if (cancelled) return;
        setName(''); setReasonId(null); setCustomReason(''); setMessage('');
      }
    })();
    return () => { cancelled = true; };
  }, [tweaks.demo, tweaks.speed]);

  return (
    <div className={"env" + (tweaks.showChrome ? '' : ' no-chrome')}>
      <div className="kiosk-stage" ref={stageRef}>
        <div className="kiosk-frame"></div>
        <div className="kiosk-screen">
          {screen === 'attractor' && <ScreenAttractor onStart={() => setScreen('welcome')}/>}
          {screen === 'welcome' && <ScreenWelcome onNext={() => setScreen('name')}/>}
          {screen === 'name' && <ScreenName name={name} setName={setName} onNext={() => setScreen('reason')} onBack={() => setScreen('attractor')}/>}
          {screen === 'reason' && <ScreenReason reasonId={reasonId} setReasonId={setReasonId} customReason={customReason} setCustomReason={setCustomReason} onNext={() => { generate(); setScreen('generating'); }} onBack={() => setScreen('name')}/>}
          {screen === 'generating' && <ScreenGenerating name={name} reasonText={reasonText} category={reasonCat} speed={tweaks.speed} onDone={() => setScreen('poster')}/>}
          {screen === 'poster' && <ScreenPoster name={name} message={message} reasonLabel={reasonLabel} onPrint={() => setScreen('printing')} onRetry={() => { generate(); }} onBack={() => setScreen('reason')}/>}
          {screen === 'printing' && <ScreenPrinting speed={tweaks.speed} onDone={() => setScreen('done')}/>}
          {screen === 'done' && <ScreenDone name={name} onReset={reset}/>}
        </div>
      </div>

      <TweaksPanel title="TWEAKS · GOOD PACE">
        <TweakSection title="Flujo">
          <TweakToggle label="Modo demo auto-play" value={tweaks.demo} onChange={(v) => setTweak('demo', v)}/>
          <TweakSlider label="Velocidad de animación" value={tweaks.speed} min={0.5} max={3} step={0.25} onChange={(v) => setTweak('speed', v)}/>
        </TweakSection>
        <TweakSection title="Visual">
          <TweakToggle label="Mostrar chasis del tótem" value={tweaks.showChrome} onChange={(v) => setTweak('showChrome', v)}/>
          <TweakSection title="Acento">
            <div style={{display:'flex', gap:8, padding:'6px 0'}}>
              {[
                {name:'Rojo Ultra', val:'#C8102E'},
                {name:'Oro', val:'#C9A961'},
                {name:'Azul', val:'#2B6CB0'},
                {name:'Cobre', val:'#C16A3A'},
              ].map(c => (
                <button key={c.val} onClick={() => setTweak('accent', c.val)} style={{
                  flex:1, height:36, borderRadius:8, border: tweaks.accent === c.val ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                  background: c.val, cursor:'pointer', color:'#fff', fontFamily:'Barlow Condensed', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase'
                }}>{c.name}</button>
              ))}
            </div>
          </TweakSection>
        </TweakSection>
        <TweakSection title="Navegación rápida">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6}}>
            {['attractor','welcome','name','reason','generating','poster','printing','done'].map(s => (
              <button key={s} onClick={() => { if (s === 'generating') generate(); if (s === 'poster' && !message) generate(); setScreen(s); }} style={{
                height:30, borderRadius:6, border: screen === s ? '1px solid #C8102E' : '1px solid rgba(255,255,255,0.12)',
                background: screen === s ? 'rgba(200,16,46,0.2)' : 'rgba(255,255,255,0.04)',
                color:'#fff', fontFamily:'Barlow Condensed', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer'
              }}>{s}</button>
            ))}
          </div>
        </TweakSection>
        <TweakButton label="↺ Reiniciar flujo" onClick={reset}/>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
