import { useState, useRef, useEffect } from "react";

const ORDEN = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const ROJOS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

const ROWS = [
  [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
];

const CHIP_VALUES = [1, 5, 25, 100];
const WIN_MSGS = [
  "¡El chocolate es tuyo! 🍫",
  "¡Que suerte la tuya! ✨",
  "¡El cacao te favorece! 🍬",
  "¡Maestro de la ruleta! 🎩",
  "¡Increíble jugada! 🎰",
];

function getWinZones(num) {
  const z = [String(num)];
  if (num === 0) return z;
  ROJOS.has(num) ? z.push("Rojo") : z.push("Negro");
  num % 2 === 0 ? z.push("PAR") : z.push("IMPAR");
  if (num >= 1 && num <= 18) z.push("1-18");
  if (num >= 19 && num <= 36) z.push("19-36");
  if (num >= 1 && num <= 12) z.push("1-12");
  if (num >= 13 && num <= 24) z.push("13-24");
  if (num >= 25 && num <= 36) z.push("25-36");
  if (num % 3 === 0) z.push("COL1");
  if (num % 3 === 2) z.push("COL2");
  if (num % 3 === 1) z.push("COL3");
  return z;
}

function calcPremio(num, bets) {
  let total = 0;
  const esRojo = ROJOS.has(num);
  Object.entries(bets).forEach(([zona, monto]) => {
    const n = parseInt(zona);
    if (!isNaN(n) && n === num) { total += monto * 36; return; }
    if (zona === "Rojo" && esRojo && num !== 0) total += monto * 2;
    else if (zona === "Negro" && !esRojo && num !== 0) total += monto * 2;
    else if (zona === "PAR" && num !== 0 && num % 2 === 0) total += monto * 2;
    else if (zona === "IMPAR" && num % 2 !== 0) total += monto * 2;
    else if (zona === "1-18" && num >= 1 && num <= 18) total += monto * 2;
    else if (zona === "19-36" && num >= 19 && num <= 36) total += monto * 2;
    else if (zona === "1-12" && num >= 1 && num <= 12) total += monto * 3;
    else if (zona === "13-24" && num >= 13 && num <= 24) total += monto * 3;
    else if (zona === "25-36" && num >= 25 && num <= 36) total += monto * 3;
    else if (zona === "COL1" && num !== 0 && num % 3 === 0) total += monto * 3;
    else if (zona === "COL2" && num !== 0 && num % 3 === 2) total += monto * 3;
    else if (zona === "COL3" && num !== 0 && num % 3 === 1) total += monto * 3;
  });
  return total;
}

// ─── NUEVO: Visualizador de número (reemplaza la ruleta SVG) ───
function NumberDisplay({ numero, girando, resultado }) {
  const [displayNumber, setDisplayNumber] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (girando) {
      // Animación de números aleatorios durante el giro
      let count = 0;
      intervalRef.current = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 37);
        setDisplayNumber(randomNum);
        count++;
        if (count > 35) {
          // Hacia el final, mostramos números cercanos al resultado
          if (resultado && count > 40) {
            clearInterval(intervalRef.current);
            setDisplayNumber(resultado.num);
          }
        }
      }, 80);
    } else if (resultado) {
      setDisplayNumber(resultado.num);
    } else if (!girando && !resultado) {
      setDisplayNumber(null);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [girando, resultado]);

  const numMostrar = displayNumber !== null ? displayNumber : "?";
  const esRojo = ROJOS.has(numMostrar);
  const esCero = numMostrar === 0;
  
  let bgColor = "#1a0a00";
  let textColor = "#f5c842";
  let borderColor = "#c9880c";
  
  if (!girando && resultado && !girando) {
    if (resultado.num === 0) {
      bgColor = "#0a5a0a";
      textColor = "#80ff80";
      borderColor = "#80ff80";
    } else if (ROJOS.has(resultado.num)) {
      bgColor = "#8b1a1a";
      textColor = "#ffbbbb";
      borderColor = "#ff6060";
    } else {
      bgColor = "#1e1e2e";
      textColor = "#f0d090";
      borderColor = "#c99820";
    }
  }

  return (
  <div className="flex flex-col items-center">
    <div className="relative">

      {/* CONTENEDOR PRINCIPAL */}
      <div
        className={`relative rounded-[28px] flex flex-col items-center justify-center transition-all duration-300 ${
          girando ? "scale-105" : ""
        }`}
        style={{
          width: 240,
          height: 240,
          background: `
            radial-gradient(circle at 30% 30%, ${bgColor}, #120600 70%),
            linear-gradient(145deg, #3a1a00, #0a0400)
          `,
          border: `5px solid ${borderColor}`,
          boxShadow: `
            0 25px 50px rgba(0,0,0,0.8),
            inset 0 0 25px rgba(255,255,255,0.08),
            inset 0 -10px 30px rgba(0,0,0,0.6)
          `,
        }}
      >
        {/* EFECTO CHOCOLATE BRILLO */}
        <div
          className="absolute inset-0 rounded-[28px] pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 25% 20%, rgba(255,255,255,0.18), transparent 60%),
              radial-gradient(circle at 70% 80%, rgba(0,0,0,0.4), transparent 60%)
            `,
          }}
        />

        {/* BORDE INTERNO DORADO */}
        <div
          className="absolute inset-2 rounded-[22px]"
          style={{
            border: "2px solid rgba(245,200,66,0.5)",
            boxShadow: "inset 0 0 10px rgba(245,200,66,0.3)"
          }}
        />

        {/* NÚMERO */}
        <span
          className={`font-black transition-all duration-200 ${
            girando ? "animate-pulse" : ""
          }`}
          style={{
            fontSize: 120,
            fontFamily: "'Georgia', serif",
            color: textColor,
            textShadow: `
              0 5px 20px rgba(0,0,0,0.8),
              0 0 10px rgba(245,200,66,0.3)
            `,
            lineHeight: 1,
          }}
        >
          {typeof numMostrar === "number" ? numMostrar : "?"}
        </span>

        {/* DECORACIÓN CHOCOLATE */}
        <div className="flex gap-2 mt-3">
          <span className="text-xl drop-shadow">🍫</span>
          <span className="text-xl drop-shadow">✨</span>
          <span className="text-xl drop-shadow">🍫</span>
        </div>

        {/* EFECTO “DERRETIDO” ABAJO */}
        <div
          className="absolute bottom-0 left-0 right-0 h-6 rounded-b-[28px]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6), transparent)"
          }}
        />
      </div>

      {/* INDICADOR DE GIRO MEJORADO */}
      {girando && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <div
            className="rounded-full animate-spin"
            style={{
              width: 36,
              height: 36,
              border: "4px solid #f5c842",
              borderTop: "4px solid transparent",
              boxShadow: "0 0 10px #f5c842"
            }}
          />
        </div>
      )}
    </div>

    {/* RESULTADO */}
    {!girando && resultado && (
      <div
        className="mt-5 px-7 py-2 rounded-full text-sm font-bold uppercase tracking-wider"
        style={{
          background: "linear-gradient(145deg,#1a0a00,#0a0400)",
          border: `2px solid ${borderColor}`,
          color: textColor,
          boxShadow: "0 0 10px rgba(0,0,0,0.5)"
        }}
      >
        {resultado.num === 0 ? "VERDE" : esRojo ? "ROJO" : "NEGRO"}
      </div>
    )}

    {/* ESPERA */}
    {!girando && !resultado && (
      <div className="mt-6 text-center">
        <p className="text-amber-500 text-sm uppercase tracking-wider">
          Haz tu apuesta y gira
        </p>
        <p className="text-amber-700 text-xs">
          🍫 El chocolate te espera 🍫
        </p>
      </div>
    )}
  </div>
);
}
// ─── Chip badge ───────────────────────────────────────────────
function ChipBadge({ valor }) {
  if (!valor) return null;
  return (
    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-amber-200 z-20 pointer-events-none shadow-lg"
      style={{
        background: "linear-gradient(135deg, #f5c842, #c9880c)",
        color: "#2a0a00",
      }}>
      {valor >= 1000 ? Math.round(valor / 1000) + "k" : valor}
    </div>
  );
}

// ─── Win Overlay ──────────────────────────────────────────────
function WinOverlay({ num, ganado, onClose }) {
  const isR = ROJOS.has(num);
  const colGanador = num === 0 ? "#80ff80" : isR ? "#ff8080" : "#ffffff";
  const bgGanador = num === 0 ? "#0a5a0a" : isR ? "#8b1a1a" : "#2a2a3a";
  const nombre = num === 0 ? "VERDE" : isR ? "ROJO" : "NEGRO";
  const titulo = ganado >= 100 ? "🍫 ¡LLUVIA DE CHOCOLATES! 🍫" : ganado >= 36 ? "✨ ¡GRAN GANANCIA! ✨" : "🎉 ¡CHOCOLATES GANADOS! 🎉";
  const msg = WIN_MSGS[Math.floor(Math.random() * WIN_MSGS.length)];

  const confColors = ["#f5c842", "#ff8080", "#80ff80", "#80c0ff", "#ffb060", "#ff80c0", "#c9880c"];
  const confetti = Array.from({ length: 40 }, (_, i) => ({
    left: Math.random() * 100,
    color: confColors[i % confColors.length],
    size: 6 + Math.random() * 10,
    dur: 1.2 + Math.random() * 1.8,
    delay: Math.random() * 0.8,
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}>
      <style>{`
        @keyframes popwin{from{transform:scale(0.3) rotate(-10deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}
        @keyframes bounce{from{transform:translateY(0) scale(1)}to{transform:translateY(-15px) scale(1.15)}}
        @keyframes pulse2{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes fall{0%{transform:translateY(-30px) rotate(0deg);opacity:1}100%{transform:translateY(500px) rotate(720deg);opacity:0}}
        .pop{animation:popwin 0.5s cubic-bezier(0.34,1.56,0.64,1)}
        .emo{animation:bounce 0.7s ease infinite alternate}
        .pls{animation:pulse2 1s ease infinite}
        .fal{animation:fall linear forwards}
      `}</style>

      <div className="pop relative rounded-2xl p-8 text-center overflow-hidden max-w-sm w-11/12"
        style={{
          background: "linear-gradient(145deg, #4a2000, #1a0800)",
          border: "3px solid #f5c842",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confetti.map((c, i) => (
            <div key={i} className="fal absolute rounded-full"
              style={{
                left: `${c.left}%`, top: 0, background: c.color, width: c.size, height: c.size,
                animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s`
              }} />
          ))}
        </div>

        <div className="emo text-7xl mb-3">🍫✨</div>
        <div className="text-xl font-bold uppercase tracking-wider mb-3"
          style={{ color: "#f5c842", fontFamily: "'Georgia', serif", textShadow: "0 0 20px rgba(245,200,66,.5)" }}>
          {titulo}
        </div>
        <div className="inline-block text-5xl font-bold rounded-xl px-6 py-2 mb-2"
          style={{ color: colGanador, background: bgGanador, fontFamily: "'Courier New', monospace", border: "2px solid #f5c842" }}>
          {num}
        </div>
        <div className="text-sm font-bold tracking-wider mb-1" style={{ color: "#c99820" }}>{nombre}</div>
        <div className="pls text-2xl font-bold mb-2" style={{ color: "#c8ff80", fontFamily: "'Courier New', monospace" }}>
          +{ganado} 🍫
        </div>
        <div className="text-sm uppercase mt-2 px-4 py-1 rounded-full inline-block" style={{ background: "rgba(0,0,0,0.4)", color: "#e8b830" }}>
          {msg}
        </div>

        <button onClick={onClose}
          className="mt-6 px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #c9880c, #f5c842)",
            color: "#1a0800",
            fontFamily: "'Georgia', serif",
          }}>
          🎰 SEGUIR JUGANDO
        </button>
      </div>
    </div>
  );
}

// ─── App principal ────────────────────────────────────────────
export default function RuletaChocolates() {
  const [balance, setBalance] = useState(500);
  const [apuestas, setApuestas] = useState({});
  const [ultimas, setUltimas] = useState({});
  const [girando, setGirando] = useState(false);
  const [chip, setChip] = useState(5);
  const [historial, setHistorial] = useState([]);
  const [numGan, setNumGan] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [showWin, setShowWin] = useState(false);

  const totalApuesta = Object.values(apuestas).reduce((a, b) => a + b, 0);
  const winZones = numGan !== null ? new Set(getWinZones(numGan)) : new Set();

  const apostar = (zona) => {
    if (girando) return;
    if (balance < chip) return;
    setBalance(p => p - chip);
    setApuestas(p => ({ ...p, [zona]: (p[zona] || 0) + chip }));
  };

  const limpiar = () => {
    if (girando) return;
    setBalance(p => p + Object.values(apuestas).reduce((a, b) => a + b, 0));
    setApuestas({});
  };

  const rebet = () => {
    if (girando || !Object.keys(ultimas).length) return;
    const needed = Object.values(ultimas).reduce((a, b) => a + b, 0);
    if (balance < needed) return;
    setBalance(p => p - needed);
    setApuestas({ ...ultimas });
  };

  const jugar = () => {
    if (!totalApuesta || girando) return;
    const snap = { ...apuestas };
    setUltimas(snap);
    setGirando(true);
    setNumGan(null);
    setResultado(null);
    setShowWin(false);

    // Simular el giro con un número aleatorio
    setTimeout(() => {
      const num = Math.floor(Math.random() * 37);
      const ganado = calcPremio(num, snap);
      setBalance(p => p + ganado);
      setApuestas({});
      setGirando(false);
      setNumGan(num);
      setHistorial(p => [num, ...p].slice(0, 8));
      setResultado({ num, ganado });
      if (ganado > 0) setShowWin(true);
    }, 2000);
  };

  const cellBase = "relative flex items-center justify-center font-bold cursor-pointer rounded-sm border transition-all duration-100 select-none hover:brightness-125 hover:scale-105 hover:z-10 hover:border-amber-400 active:scale-95";

  const Cell = ({ zona, cls, label, style = {} }) => {
    const isWin = winZones.has(String(zona));
    return (
      <div onClick={() => apostar(zona)}
        className={`${cellBase} ${cls} ${isWin ? "!border-amber-400 brightness-150 ring-1 ring-amber-400" : ""}`}
        style={{ ...style, animation: isWin ? "cw .4s ease 4" : "none" }}>
        {label}
        <ChipBadge valor={apuestas[zona]} />
      </div>
    );
  };

  const isR = resultado ? ROJOS.has(resultado.num) : false;
  const numColor = resultado ? (resultado.num === 0 ? "text-green-400" : isR ? "text-red-400" : "text-gray-300") : "";
  const nombre = resultado ? (resultado.num === 0 ? "VERDE" : isR ? "ROJO" : "NEGRO") : "";

  return (
    <div className="min-h-screen flex flex-col items-center px-3 py-4 pb-16 select-none"
      style={{ background: "linear-gradient(145deg, #1a0a00 0%, #0a0400 100%)", fontFamily: "'Georgia', 'Times New Roman', serif", color: "#f0d090" }}>

      <style>{`
        @keyframes cw{0%,100%{filter:brightness(1.6)}50%{filter:brightness(2.5)}}
      `}</style>

      {/* Título */}
      <div className="text-center mb-3">
        <h1 className="text-3xl font-black uppercase tracking-widest"
          style={{ color: "#f5c842", textShadow: "0 0 20px rgba(245,200,66,0.5)", letterSpacing: "4px" }}>
          🍫 RULETA DE CHOCOLATES 🍫
        </h1>
        <p className="text-[10px] tracking-[6px] uppercase mt-1" style={{ color: "#c99820", letterSpacing: "3px" }}>
          Casino del Cacao — Ruleta Europea
        </p>
      </div>

      {/* HUD */}
      <div className="flex gap-3 w-full max-w-3xl mb-4 flex-wrap justify-center">
        <div className="flex flex-col gap-1 px-5 py-2 rounded-xl border-2 flex-1 min-w-[100px]"
          style={{ background: "linear-gradient(135deg, #1a0a00, #0a0500)", borderColor: "#c9880c", boxShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>
          <span className="text-[10px] tracking-widest uppercase font-mono" style={{ color: "#e8b830" }}>💰 SALDO</span>
          <span className="text-3xl font-bold" style={{ color: "#f5c842", textShadow: "0 0 5px rgba(245,200,66,0.3)" }}>{balance}</span>
          <span className="text-[9px] font-mono" style={{ color: "#c99820" }}>CHOCOS</span>
        </div>
        <div className="flex flex-col gap-1 px-5 py-2 rounded-xl border-2 flex-1 min-w-[100px]"
          style={{ background: "linear-gradient(135deg, #1a0a00, #0a0500)", borderColor: "#c9880c", boxShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>
          <span className="text-[10px] tracking-widest uppercase font-mono" style={{ color: "#e8b830" }}>🎲 APUESTA</span>
          <span className="text-3xl font-bold" style={{ color: "#f5c842" }}>{totalApuesta}</span>
          <span className="text-[9px] font-mono" style={{ color: "#c99820" }}>CHOCOS</span>
        </div>
        <div className="flex flex-col gap-1 px-5 py-2 rounded-xl border-2 flex-1 min-w-[180px]"
          style={{ background: "linear-gradient(135deg, #1a0a00, #0a0500)", borderColor: "#c9880c", boxShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>
          <span className="text-[10px] tracking-widest uppercase font-mono" style={{ color: "#e8b830" }}>📜 ÚLTIMOS NÚMEROS</span>
          <div className="flex gap-1.5 flex-wrap">
            {historial.length === 0
              ? <span className="text-xs font-mono italic" style={{ color: "#8a6020" }}>Sin historial</span>
              : historial.map((n, i) => {
                  const bg = n === 0 ? "#0e5a0e" : ROJOS.has(n) ? "#8b1a1a" : "#2a2a3a";
                  const cl = n === 0 ? "#90ff90" : ROJOS.has(n) ? "#ffbbbb" : "#ddd";
                  const br = n === 0 ? "#80ff80" : ROJOS.has(n) ? "#ff6060" : "#c99820";
                  return (
                    <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold font-mono border-2 shadow-md"
                      style={{ background: bg, color: cl, borderColor: br }}>
                      {n}
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      {/* Game area: NUEVO visualizador + tablero */}
      <div className="flex gap-6 w-full max-w-4xl items-start flex-wrap justify-center">

        {/* Visualizador de número (reemplaza la ruleta) */}
        <div className="flex-shrink-0">
          <NumberDisplay numero={null} girando={girando} resultado={resultado} />
        </div>

        {/* Tablero de apuestas (EXACTAMENTE IGUAL) */}
        <div className="rounded-xl border-2 p-2 overflow-x-auto flex-1 min-w-[280px]"
          style={{ background: "#0a2a10", borderColor: "#6a4010" }}>
          <div style={{ minWidth: 500 }}>

            <div className="flex gap-0.5 mb-0.5">
              <Cell zona={0} label="0"
                cls="text-xl rounded-l"
                style={{ width: 44, minHeight: 132, background: winZones.has("0") ? "#2aaa2a" : "#0a3a0a", color: "#80ff80", border: "1px solid rgba(255,255,255,0.1)" }} />

              <div className="flex flex-col gap-0.5 flex-1">
                {ROWS.map((row, ri) => (
                  <div key={ri} className="flex gap-0.5">
                    {row.map(n => (
                      <Cell key={n} zona={n} label={n}
                        cls="text-xs flex-1"
                        style={{ height: 44, background: winZones.has(String(n)) ? (ROJOS.has(n) ? "#ff3030" : "#555") : ROJOS.has(n) ? "#6a1010" : "#1a1a1a", color: ROJOS.has(n) ? "#ffbbbb" : "#ccc", border: `1px solid ${winZones.has(String(n)) ? "#f5c842" : "rgba(255,255,255,0.07)"}` }} />
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-0.5">
                {[["COL1", "2:1"], ["COL2", "2:1"], ["COL3", "2:1"]].map(([k, l]) => (
                  <Cell key={k} zona={k} label={l}
                    cls="text-[10px]"
                    style={{ width: 40, height: 44, background: winZones.has(k) ? "#236b38" : "#0e4020", color: "#80e090", border: "1px solid rgba(201,168,76,0.3)" }} />
                ))}
              </div>
            </div>

            <div className="flex gap-0.5 mb-0.5" style={{ marginLeft: 46, marginRight: 42 }}>
              {[["1-12", "1ª 12"], ["13-24", "2ª 12"], ["25-36", "3ª 12"]].map(([k, l]) => (
                <Cell key={k} zona={k} label={l}
                  cls="text-[11px] flex-1"
                  style={{ height: 30, background: winZones.has(k) ? "#236b38" : "#0e4020", color: "#80e090", border: "1px solid rgba(201,168,76,0.3)" }} />
              ))}
            </div>

            <div className="flex gap-0.5" style={{ marginLeft: 46, marginRight: 42 }}>
              {[
                ["1-18", "1 a 18", "#0e4020", "#80e090"],
                ["PAR", "Par", "#0e4020", "#80e090"],
                ["Rojo", "Rojo", "#6a1010", "#ffbbbb"],
                ["Negro", "Negro", "#1a1a1a", "#cccccc"],
                ["IMPAR", "Impar", "#0e4020", "#80e090"],
                ["19-36", "19 a 36", "#0e4020", "#80e090"],
              ].map(([k, l, bg, col]) => (
                <Cell key={k} zona={k} label={l}
                  cls="text-[11px] flex-1"
                  style={{ height: 30, background: winZones.has(k) ? "#3aaa3a" : bg, color: col, border: "1px solid rgba(255,255,255,0.07)" }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-col items-center gap-3 mt-5 w-full max-w-3xl">
        <div className="flex gap-3 px-4 py-2 rounded-full border flex-wrap justify-center"
          style={{ background: "#120600", borderColor: "#5a3a10" }}>
          {CHIP_VALUES.map(v => (
            <button key={v} onClick={() => setChip(v)}
              className={`w-12 h-12 rounded-full font-bold text-base transition-all duration-200 ${chip === v ? "scale-110 border-2 border-amber-300 shadow-lg ring-2 ring-amber-500/50" : "opacity-70 hover:opacity-100"}`}
              style={{
                background: v === 1 ? "linear-gradient(135deg,#e8c840,#b8860b)" : v === 5 ? "linear-gradient(135deg,#dc2626,#991b1b)" : v === 25 ? "linear-gradient(135deg,#3b82f6,#1e3a8a)" : "linear-gradient(135deg,#10b981,#065f46)",
                color: v === 1 ? "#3a1a00" : "white",
              }}>
              {v}
            </button>
          ))}
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          <button onClick={rebet}
            disabled={!Object.keys(ultimas).length || girando || totalApuesta > 0}
            className="px-5 py-3 rounded-full text-xs uppercase tracking-wider border transition-all duration-200 font-mono disabled:opacity-30 disabled:cursor-not-allowed hover:border-amber-600 hover:text-amber-400"
            style={{ background: "#120600", borderColor: "#5a3a10", color: "#c99820" }}>
            ↺ REPETIR
          </button>

          <button onClick={jugar}
            disabled={girando || !totalApuesta}
            className="px-9 py-4 rounded-full font-black text-xl uppercase tracking-widest transition-all duration-300 disabled:cursor-not-allowed shadow-xl"
            style={{
              fontFamily: "'Georgia', serif",
              background: (!totalApuesta || girando) ? "#2a2a2a" : "linear-gradient(135deg,#c9880c,#f5c842,#c9880c)",
              color: (!totalApuesta || girando) ? "#555" : "#1a0800",
              boxShadow: (totalApuesta && !girando) ? "0 6px 20px rgba(245,200,66,0.5)" : "none",
            }}>
            {girando ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                GIRANDO...
              </span>
            ) : "🎰 GIRAR"}
          </button>

          <button onClick={limpiar}
            disabled={girando}
            className="px-5 py-3 rounded-full text-xs uppercase tracking-wider border transition-all duration-200 font-mono disabled:opacity-30 disabled:cursor-not-allowed hover:border-red-700 hover:text-red-400"
            style={{ background: "#120600", borderColor: "#5a3a10", color: "#c99820" }}>
            ✕ LIMPIAR
          </button>
        </div>

        {resultado && !girando && !showWin && (
          <div className="px-7 py-3 rounded-full border-2 text-center"
            style={{ background: "#120600", borderColor: "#c99820", fontFamily: "'Georgia', serif", fontSize: 16 }}>
            🎲 Número <span className={`font-bold text-xl ${numColor}`}>{resultado.num}</span>
            {" — "}{nombre}
            {resultado.ganado > 0
              ? <span style={{ color: "#f5c842" }}> | 🍫 +{resultado.ganado}</span>
              : <span style={{ color: "#ff6060" }}> | ❌ Sin premio</span>}
          </div>
        )}
      </div>

      {showWin && resultado && (
        <WinOverlay num={resultado.num} ganado={resultado.ganado} onClose={() => setShowWin(false)} />
      )}
    </div>
  );
}