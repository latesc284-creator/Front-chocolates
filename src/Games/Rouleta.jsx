import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCreditsRule } from "../Service/user/getCreditsRule";
import Header from "../Components/User/Header/Header";

const ROJOS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const ROWS = [
  [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
];
const CHIP_VALUES = [100, 500, 1000, 2500, 5000, 10000, 25000];
const WIN_MSGS = [
  "¡El chocolate es tuyo! 🍫",
  "¡Qué suerte la tuya! ✨",
  "¡El cacao te favorece! 🍬",
  "¡Maestro de la ruleta! 🎩",
  "¡Increíble jugada! 🎰",
];

const API_GIRAR = import.meta.env.VITE_URL_BACK_USER + "/girarRuleta";

// Funciones para generar sonidos (Web Audio API)
const playBeepSound = (frequency, duration, volume = 0.3) => {
  if (typeof window === 'undefined') return;
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration);
    oscillator.stop(audioContext.currentTime + duration);
    
    // Limpiar después de terminar
    setTimeout(() => {
      audioContext.close();
    }, duration * 1000 + 100);
  } catch (e) {
    console.log("Audio no soportado");
  }
};

const playChipSound = () => {
  playBeepSound(880, 0.15, 0.2);
};

const playSpinSound = () => {
  // Sonido de ruleta girando (cambia de frecuencia rápidamente)
  if (typeof window === 'undefined') return;
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 440;
    gainNode.gain.value = 0.25;
    
    oscillator.start();
    
    // Barrido de frecuencia para simular ruleta girando
    const startTime = audioContext.currentTime;
    const duration = 1.8;
    
    const updateFrequency = () => {
      const elapsed = audioContext.currentTime - startTime;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        const freq = 440 + (progress * 800);
        oscillator.frequency.value = freq;
        requestAnimationFrame(updateFrequency);
      }
    };
    
    updateFrequency();
    
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration);
    oscillator.stop(audioContext.currentTime + duration);
    
    setTimeout(() => {
      audioContext.close();
    }, duration * 1000 + 100);
  } catch (e) {
    console.log("Audio no soportado");
  }
};

const playWinSound = () => {
  // Sonido de victoria (acorde ascendente)
  playBeepSound(523.25, 0.2, 0.25); // Do
  setTimeout(() => playBeepSound(659.25, 0.2, 0.25), 150); // Mi
  setTimeout(() => playBeepSound(783.99, 0.3, 0.3), 300); // Sol
  setTimeout(() => playBeepSound(1046.50, 0.5, 0.35), 500); // Do alto
};

const playResultSound = (numero, isWin) => {
  if (isWin) {
    playWinSound();
  } else {
    playBeepSound(293.66, 0.3, 0.2); // Re bajo (perdida)
  }
};

function getWinZones(num) {
  const z = [String(num)];
  if (num === 0) return z;
  z.push(ROJOS.has(num) ? "Rojo" : "Negro");
  z.push(num % 2 === 0 ? "PAR" : "IMPAR");
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

// ── ChipBadge (centrado) ─────────────────────────────────────────
function ChipBadge({ valor }) {
  if (!valor) return null;
  
  const formatValue = (v) => {
    if (v >= 1000 && v < 1000000) return (v / 1000).toFixed(0) + "k";
    if (v >= 1000000) return (v / 1000000).toFixed(1) + "M";
    return v;
  };
  
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold border-2 border-amber-100 z-20 pointer-events-none shadow-lg"
      style={{ background: "linear-gradient(135deg,#f5c842,#c9880c)", color: "#2a0a00" }}
    >
      {formatValue(valor)}
    </div>
  );
}

// ── NumberDisplay (se muestra sobre la mesa cuando se gira) ──
function NumberDisplayOverlay({ girando, resultado, onClose }) {
  const [shown, setShown] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) clearInterval(ref.current);
    if (girando) {
      ref.current = setInterval(() => {
        setShown(Math.floor(Math.random() * 37));
      }, 75);
    } else if (resultado) {
      setShown(resultado.numeroGanador);
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShown(null);
    }
    return () => clearInterval(ref.current);
  }, [girando, resultado, onClose]);

  const n = shown;
  const isR = n !== null && ROJOS.has(n);
  const isZ = n === 0;

  let bgColor = "#1a0a00";
  let textColor = "#f5c842";
  let borderColor = "#c9880c";

  if (!girando && resultado) {
    if (isZ) { bgColor = "#0a5a0a"; textColor = "#80ff80"; borderColor = "#80ff80"; }
    else if (isR) { bgColor = "#8b1a1a"; textColor = "#ffbbbb"; borderColor = "#ff6060"; }
    else { bgColor = "#1e1e2e"; textColor = "#f0d090"; borderColor = "#c99820"; }
  }

  const label = n !== null ? n : "?";
  const colorName = !girando && resultado
    ? (isZ ? "VERDE" : isR ? "ROJO" : "NEGRO")
    : null;

  if (!girando && !resultado) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 backdrop-blur-md" style={{ margin: 0, padding: 0 }}>
      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-gradient-to-b from-amber-900/90 to-black/90 border-4 border-amber-500 shadow-2xl">
        <div style={{ position: "relative", width: 280, height: 280 }}>
          <div
            className={`relative rounded-[24px] flex flex-col items-center justify-center transition-all duration-300 w-full h-full ${girando ? "scale-105" : ""}`}
            style={{
              background: `radial-gradient(circle at 30% 30%, ${bgColor}, #120600 70%), linear-gradient(145deg,#3a1a00,#0a0400)`,
              border: `4px solid ${borderColor}`,
              boxShadow: `0 20px 40px rgba(0,0,0,.8), inset 0 0 20px rgba(255,255,255,.06)`,
            }}
          >
            <div className="absolute inset-0 rounded-[24px] pointer-events-none"
              style={{ background: "radial-gradient(circle at 25% 20%, rgba(255,255,255,.16), transparent 60%)" }} />
            <div className="absolute inset-2 rounded-[18px]"
              style={{ border: "1.5px solid rgba(245,200,66,.4)" }} />
            <span
              className={`font-black leading-none transition-colors duration-300 ${girando ? "animate-pulse" : ""}`}
              style={{
                fontSize: label === "?" ? 80 : String(label).length > 1 ? 90 : 110,
                fontFamily: "'Georgia', serif",
                color: textColor,
                textShadow: "0 4px 16px rgba(0,0,0,.8)",
              }}
            >{label}</span>
            <div className="flex gap-1.5 mt-2">
              <span className="text-base">🍫</span>
              <span className="text-base">✨</span>
              <span className="text-base">🍫</span>
            </div>
            {girando && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="animate-spin rounded-full"
                  style={{ width: 28, height: 28, border: `3px solid ${borderColor}`, borderTop: "3px solid transparent" }} />
              </div>
            )}
          </div>
        </div>

        {colorName && (
          <div className="px-5 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: "#120600", border: `2px solid ${borderColor}`, color: textColor, fontFamily: "'Courier New', monospace" }}>
            {colorName}
          </div>
        )}
      </div>
    </div>
  );
}

// ── WinOverlay ────────────────────────────────────────────────
function WinOverlay({ resultado, onClose }) {
  const { numeroGanador, totalPremio, desglose, creditosAnteriores, creditosActuales } = resultado;
  const isR = ROJOS.has(numeroGanador);
  const isZ = numeroGanador === 0;
  const col = isZ ? "#80ff80" : isR ? "#ff8080" : "#ffffff";
  const bgN = isZ ? "#0a5a0a" : isR ? "#8b1a1a" : "#2a2a3a";
  const name = isZ ? "VERDE" : isR ? "ROJO" : "NEGRO";
  const title = totalPremio >= 100 ? "🍫 ¡LLUVIA DE CHOCOLATES! 🍫"
    : totalPremio >= 36 ? "✨ ¡GRAN GANANCIA! ✨"
      : "🎉 ¡CHOCOLATES GANADOS! 🎉";
  const msg = WIN_MSGS[Math.floor(Math.random() * WIN_MSGS.length)];
  const desgloseEntries = desglose ? Object.entries(desglose) : [];

  const confColors = ["#f5c842", "#ff8080", "#80ff80", "#80c0ff", "#ffb060", "#ff80c0", "#c9880c"];
  const conf = Array.from({ length: 40 }, (_, i) => ({
    left: Math.random() * 100,
    color: confColors[i % confColors.length],
    size: 5 + Math.random() * 10,
    dur: 1.2 + Math.random() * 1.8,
    delay: Math.random() * 0.8,
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-3"
      style={{ background: "rgba(0,0,0,.88)", backdropFilter: "blur(4px)" }}>
      <style>{`
        @keyframes popwin{from{transform:scale(.2) rotate(-15deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}
        @keyframes bounce{from{transform:translateY(0) scale(1)}to{transform:translateY(-12px) scale(1.1)}}
        @keyframes pls{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
        @keyframes fall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(520px) rotate(720deg);opacity:0}}
        .pop{animation:popwin .5s cubic-bezier(.34,1.56,.64,1) forwards}
        .bounce-emo{animation:bounce .6s ease infinite alternate}
        .pulse-chip{animation:pls .9s ease infinite}
        .fall-c{animation:fall linear forwards}
      `}</style>

      <div className="pop relative rounded-2xl p-6 text-center overflow-hidden w-full max-w-sm"
        style={{
          background: "linear-gradient(145deg,#4a2000,#1a0800)",
          border: "3px solid #f5c842",
          boxShadow: "0 20px 50px rgba(0,0,0,.6)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {conf.map((c, i) => (
            <div key={i} className="fall-c absolute rounded-full"
              style={{
                left: `${c.left}%`, top: 0,
                width: c.size, height: c.size,
                background: c.color,
                animationDuration: `${c.dur}s`,
                animationDelay: `${c.delay}s`,
              }} />
          ))}
        </div>

        <div className="bounce-emo text-5xl mb-2">🍫✨</div>
        <div className="text-sm font-bold uppercase tracking-wider mb-3"
          style={{ color: "#f5c842", textShadow: "0 0 16px rgba(245,200,66,.4)", fontFamily: "Georgia,serif" }}>
          {title}
        </div>
        <div className="inline-block text-5xl font-bold rounded-xl px-5 py-1 mb-1"
          style={{ color: col, background: bgN, fontFamily: "'Courier New',monospace", border: "2px solid #f5c842" }}>
          {numeroGanador}
        </div>
        <div className="text-xs font-bold tracking-wider mb-3" style={{ color: "#c99820" }}>{name}</div>
        <div className="pulse-chip text-3xl font-bold mb-3"
          style={{ color: "#c8ff80", fontFamily: "'Courier New',monospace" }}>
          +{totalPremio} 🍫
        </div>

        {desgloseEntries.length > 0 && (
          <div className="mb-3 px-3 py-2 rounded-xl text-left"
            style={{ background: "rgba(0,0,0,.35)", border: "1px solid rgba(245,200,66,.2)" }}>
            <p className="text-[9px] uppercase tracking-widest mb-1.5"
              style={{ color: "#c99820", fontFamily: "'Courier New',monospace" }}>
              Desglose
            </p>
            {desgloseEntries.map(([zona, monto]) => (
              <div key={zona} className="flex justify-between items-center"
                style={{ fontFamily: "'Courier New',monospace", fontSize: 11, marginBottom: 2 }}>
                <span style={{ color: "#c99820" }}>{zona}</span>
                <span style={{ color: "#c8ff80", fontWeight: 700 }}>+{monto} 🍫</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-2 mb-3"
          style={{ fontFamily: "'Courier New',monospace", fontSize: 12 }}>
          <span style={{ color: "#888" }}>{creditosAnteriores}</span>
          <span style={{ color: "#f5c842" }}>→</span>
          <span style={{ color: "#c8ff80", fontWeight: 700, fontSize: 16 }}>{creditosActuales} 🍫</span>
        </div>

        <div className="text-[10px] uppercase px-4 py-1 rounded-full inline-block mb-4"
          style={{ background: "rgba(0,0,0,.35)", color: "#e8b830" }}>
          {msg}
        </div>
        <br />
        <button onClick={onClose}
          className="mt-2 px-7 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg,#c9880c,#f5c842)",
            color: "#1a0800",
            fontFamily: "Georgia,serif",
            border: "none",
            cursor: "pointer",
          }}>
          🎰 SEGUIR JUGANDO
        </button>
      </div>
    </div>
  );
}

// ── Mesa horizontal (Desktop) ─────────────────────────────────
function MesaHorizontal({ winZones, apuestas, apostar }) {
  const cellBase = "relative flex items-center justify-center font-bold cursor-pointer rounded-sm border transition-all duration-100 select-none hover:brightness-125 hover:scale-105 hover:z-10 hover:border-amber-400 active:scale-95";

  const Cell = ({ zona, cls = "", label, style = {} }) => {
    const isWin = winZones.has(String(zona));
    return (
      <div
        onClick={() => apostar(zona)}
        className={`${cellBase} ${cls} ${isWin ? "!border-amber-400 brightness-150 ring-1 ring-amber-400" : ""}`}
        style={{ ...style, animation: isWin ? "cw .4s ease 4" : "none" }}
      >
        {label}
        <ChipBadge valor={apuestas[zona]} />
      </div>
    );
  };

  return (
    <div className="rounded-xl border-2 p-1.5 overflow-x-auto flex-1 min-w-[260px]"
      style={{ background: "#0a2a10", borderColor: "#6a4010" }}>
      <div style={{ minWidth: 460 }}>
        <div className="flex gap-0.5 mb-0.5">
          <Cell zona={0} label="0" cls="text-lg rounded-l"
            style={{ width: 36, minHeight: 114, background: winZones.has("0") ? "#2aaa2a" : "#0a3a0a", color: "#80ff80", border: "1px solid rgba(255,255,255,.1)" }} />

          <div className="flex flex-col gap-0.5 flex-1">
            {ROWS.map((row, ri) => (
              <div key={ri} className="flex gap-0.5">
                {row.map(n => (
                  <Cell key={n} zona={n} label={n} cls="text-[10px] flex-1"
                    style={{
                      height: 36,
                      background: winZones.has(String(n)) ? (ROJOS.has(n) ? "#ff3030" : "#555") : (ROJOS.has(n) ? "#6a1010" : "#1a1a1a"),
                      color: ROJOS.has(n) ? "#ffbbbb" : "#ccc",
                      border: `1px solid ${winZones.has(String(n)) ? "#f5c842" : "rgba(255,255,255,.07)"}`,
                    }} />
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-0.5">
            {[["COL1", "3:1"], ["COL2", "3:1"], ["COL3", "3:1"]].map(([k, l]) => (
              <Cell key={k} zona={k} label={l} cls="text-[9px]"
                style={{ width: 32, height: 36, background: winZones.has(k) ? "#236b38" : "#0e4020", color: "#80e090", border: "1px solid rgba(201,168,76,.3)" }} />
            ))}
          </div>
        </div>

        <div className="flex gap-0.5 mb-0.5" style={{ marginLeft: 38, marginRight: 34 }}>
          {[["1-12", "1ª 12"], ["13-24", "2ª 12"], ["25-36", "3ª 12"]].map(([k, l]) => (
            <Cell key={k} zona={k} label={l} cls="text-[9px] flex-1"
              style={{ height: 24, background: winZones.has(k) ? "#236b38" : "#0e4020", color: "#80e090", border: "1px solid rgba(201,168,76,.3)" }} />
          ))}
        </div>

        <div className="flex gap-0.5" style={{ marginLeft: 38, marginRight: 34 }}>
          {[
            ["1-18", "1-18", "#0e4020", "#80e090"],
            ["PAR", "Par", "#0e4020", "#80e090"],
            ["Rojo", "Rojo", "#6a1010", "#ffbbbb"],
            ["Negro", "Negro", "#1a1a1a", "#cccccc"],
            ["IMPAR", "Impar", "#0e4020", "#80e090"],
            ["19-36", "19-36", "#0e4020", "#80e090"],
          ].map(([k, l, bg, col]) => (
            <Cell key={k} zona={k} label={l} cls="text-[8px] flex-1"
              style={{ height: 24, background: winZones.has(k) ? "#3aaa3a" : bg, color: col, border: "1px solid rgba(255,255,255,.07)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Mesa vertical (Móvil - mismo diseño pero vertical) ────────
function MesaVertical({ winZones, apuestas, apostar }) {
  const cellBase = "relative flex px-4 items-center justify-center font-bold cursor-pointer rounded-sm border transition-all duration-100 select-none hover:brightness-125 hover:scale-105 hover:z-10 hover:border-amber-400 active:scale-95";

  const Cell = ({ zona, cls = "", label, style = {} }) => {
    const isWin = winZones.has(String(zona));
    return (
      <div
        onClick={() => apostar(zona)}
        className={`${cellBase} ${cls} ${isWin ? "!border-amber-400 brightness-150 ring-1 ring-amber-400" : ""}`}
        style={{ ...style, animation: isWin ? "cw .4s ease 4" : "none" }}
      >
        {label}
        <ChipBadge valor={apuestas[zona]} />
      </div>
    );
  };

  const col1 = ROWS[2];
  const col2 = ROWS[1];
  const col3 = ROWS[0];

  return (
    <div className="rounded-xl border-2 p-2 w-full" style={{ background: "#0a2a10", borderColor: "#6a4010" }}>
      <div className="mb-2">
        <Cell 
          zona={0} 
          label="0" 
          cls="text-xl font-bold"
          style={{ 
            width: "100%", 
            minHeight: 50, 
            background: winZones.has("0") ? "#2aaa2a" : "#0a3a0a", 
            color: "#80ff80", 
            border: "1px solid rgba(255,255,255,.1)" 
          }} 
        />
      </div>

      <div className="flex gap-1 mb-2">
        <div className="flex-1 flex flex-col gap-0.5">
          {col1.map(n => (
            <Cell key={n} zona={n} label={n} cls="text-[10px]"
              style={{
                height: 32,
                background: winZones.has(String(n)) ? (ROJOS.has(n) ? "#ff3030" : "#555") : (ROJOS.has(n) ? "#6a1010" : "#1a1a1a"),
                color: ROJOS.has(n) ? "#ffbbbb" : "#ccc",
                border: `1px solid ${winZones.has(String(n)) ? "#f5c842" : "rgba(255,255,255,.07)"}`,
              }} />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-0.5">
          {col2.map(n => (
            <Cell key={n} zona={n} label={n} cls="text-[10px]"
              style={{
                height: 32,
                background: winZones.has(String(n)) ? (ROJOS.has(n) ? "#ff3030" : "#555") : (ROJOS.has(n) ? "#6a1010" : "#1a1a1a"),
                color: ROJOS.has(n) ? "#ffbbbb" : "#ccc",
                border: `1px solid ${winZones.has(String(n)) ? "#f5c842" : "rgba(255,255,255,.07)"}`,
              }} />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-0.5">
          {col3.map(n => (
            <Cell key={n} zona={n} label={n} cls="text-[10px]"
              style={{
                height: 32,
                background: winZones.has(String(n)) ? (ROJOS.has(n) ? "#ff3030" : "#555") : (ROJOS.has(n) ? "#6a1010" : "#1a1a1a"),
                color: ROJOS.has(n) ? "#ffbbbb" : "#ccc",
                border: `1px solid ${winZones.has(String(n)) ? "#f5c842" : "rgba(255,255,255,.07)"}`,
              }} />
          ))}
        </div>
      </div>

      <div className="flex gap-1 mb-2">
        {[["COL1", "3:1"], ["COL2", "3:1"], ["COL3", "3:1"]].map(([k, l]) => (
          <Cell key={k} zona={k} label={l} cls="text-[9px] flex-1"
            style={{ height: 32, background: winZones.has(k) ? "#236b38" : "#0e4020", color: "#80e090", border: "1px solid rgba(201,168,76,.3)" }} />
        ))}
      </div>

      <div className="flex gap-1 mb-2">
        {[["1-12", "1ª 12"], ["13-24", "2ª 12"], ["25-36", "3ª 12"]].map(([k, l]) => (
          <Cell key={k} zona={k} label={l} cls="text-[9px] flex-1"
            style={{ height: 28, background: winZones.has(k) ? "#236b38" : "#0e4020", color: "#80e090", border: "1px solid rgba(201,168,76,.3)" }} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-0.5">
        {[
          ["1-18", "1-18"],
          ["PAR", "Par"],
          ["Rojo", "Rojo"],
          ["Negro", "Negro"],
          ["IMPAR", "Impar"],
          ["19-36", "19-36"],
        ].map(([k, l]) => {
          let bg = "#0e4020", col = "#80e090";
          if (k === "Rojo") { bg = "#6a1010"; col = "#ffbbbb"; }
          if (k === "Negro") { bg = "#1a1a1a"; col = "#cccccc"; }
          return (
            <Cell key={k} zona={k} label={l} cls="text-[8px]"
              style={{ height: 28, background: winZones.has(k) ? "#3aaa3a" : bg, color: col, border: "1px solid rgba(255,255,255,.07)" }} />
          );
        })}
      </div>
    </div>
  );
}

// ── Botón de sonido ──────────────────────────────────────────
function SoundButton({ soundEnabled, setSoundEnabled }) {
  return (
    <button
      onClick={() => setSoundEnabled(!soundEnabled)}
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: "linear-gradient(135deg,#c9880c,#f5c842)",
        border: "2px solid #fff",
        cursor: "pointer",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      {soundEnabled ? "🔊" : "🔇"}
    </button>
  );
}

// ── App principal ─────────────────────────────────────────────
export default function RuletaChocolates() {
  const [balance, setBalance] = useState();
  const [apuestas, setApuestas] = useState({});
  const [ultimas, setUltimas] = useState({});
  const [girando, setGirando] = useState(false);
  const [chip, setChip] = useState(100);
  const [historial, setHistorial] = useState([]);
  const [numGan, setNumGan] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [showWin, setShowWin] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [error, setError] = useState(null);
  const [saldoMsg, setSaldoMsg] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [spinSoundPlayed, setSpinSoundPlayed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const totalApuesta = Object.values(apuestas).reduce((a, b) => a + b, 0);
  const winZones = numGan !== null ? new Set(getWinZones(numGan)) : new Set();

  const { data: creditosRule } = useQuery({
    queryKey: ["creditosRule"],
    queryFn: async () => {
      const res = await getCreditsRule();
      setBalance(Number(res.data?.creditos));
    },
  });

  // Efecto para reproducir sonido de ruleta cuando comienza a girar
  useEffect(() => {
    if (girando && !spinSoundPlayed && soundEnabled) {
      setSpinSoundPlayed(true);
      playSpinSound();
    }
    if (!girando) {
      setSpinSoundPlayed(false);
    }
  }, [girando, soundEnabled, spinSoundPlayed]);

  // Efecto para reproducir sonido de resultado cuando se obtiene un número
  useEffect(() => {
    if (resultado && !girando && soundEnabled) {
      const isWin = resultado.totalPremio > 0;
      playResultSound(resultado.numeroGanador, isWin);
    }
  }, [resultado, girando, soundEnabled]);

  const apostar = (zona) => {
    if (girando) return;
    if (balance < chip) {
      setSaldoMsg("❌ Saldo insuficiente para apostar");
      setTimeout(() => setSaldoMsg(null), 2000);
      return;
    }
    if (soundEnabled) playChipSound();
    setBalance(p => p - chip);
    setApuestas(p => ({ ...p, [zona]: (p[zona] || 0) + chip }));
    setError(null);
    setSaldoMsg(null);
  };

  const seleccionarFicha = (valor) => {
    if (soundEnabled) playChipSound();
    setChip(valor);
  };

  const duplicarApuesta = () => {
    if (girando) return;
    if (Object.keys(apuestas).length === 0) return;
    
    const nuevoTotal = totalApuesta * 2;
    if (balance < nuevoTotal) {
      setSaldoMsg("❌ No tienes suficiente saldo para duplicar la apuesta");
      setTimeout(() => setSaldoMsg(null), 2000);
      return;
    }
    
    if (soundEnabled) playChipSound();
    
    const nuevasApuestas = {};
    for (const [zona, monto] of Object.entries(apuestas)) {
      nuevasApuestas[zona] = monto * 2;
    }
    
    setBalance(p => p - nuevoTotal);
    setApuestas(nuevasApuestas);
    setSaldoMsg(null);
  };

  const limpiar = () => {
    if (girando) return;
    setBalance(p => p + totalApuesta);
    setApuestas({});
    setSaldoMsg(null);
  };

  const rebet = () => {
    if (girando || !Object.keys(ultimas).length) return;
    const needed = Object.values(ultimas).reduce((a, b) => a + b, 0);
    if (balance < needed) {
      setSaldoMsg("❌ Saldo insuficiente para repetir la apuesta");
      setTimeout(() => setSaldoMsg(null), 2000);
      return;
    }
    if (soundEnabled) playChipSound();
    setBalance(p => p - needed);
    setApuestas({ ...ultimas });
    setSaldoMsg(null);
  };

  const jugar = async () => {
    if (!totalApuesta || girando) return;
    
    const snap = { ...apuestas };
    setUltimas(snap);
    setGirando(true);
    setShowNumber(true);
    setNumGan(null);
    setResultado(null);
    setShowWin(false);
    setError(null);
    setSaldoMsg(null);

    try {
      const headers = { "Content-Type": "application/json" };
      const response = await fetch(API_GIRAR, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ apuestas: snap }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al procesar la apuesta");
        setApuestas(snap);
        setBalance(p => p + totalApuesta);
        setGirando(false);
        setShowNumber(false);
        return;
      }

      setTimeout(() => {
        setResultado(data);
        setBalance(data.creditosActuales);
        setNumGan(data.numeroGanador);
        setApuestas({});
        setGirando(false);

        if (data.historial && Array.isArray(data.historial)) {
          setHistorial(data.historial.slice(0, 8));
        } else {
          setHistorial(p => [data.numeroGanador, ...p].slice(0, 8));
        }

        if (data.totalPremio > 0) {
          setShowWin(true);
        }
        
        setTimeout(() => {
          setShowNumber(false);
        }, 2000);
      }, 2000);

    } catch (err) {
      console.error(err);
      setError("Sin conexión con el servidor");
      setApuestas(snap);
      setBalance(p => p + totalApuesta);
      setGirando(false);
      setShowNumber(false);
    }
  };

  const isR = resultado ? ROJOS.has(resultado.numeroGanador) : false;
  const numClr = resultado ? (resultado.numeroGanador === 0 ? "text-green-400" : isR ? "text-red-400" : "text-gray-300") : "";
  const nombre = resultado ? (resultado.numeroGanador === 0 ? "VERDE" : isR ? "ROJO" : "NEGRO") : "";

  return (
    <>
    <Header/>
   
    <div
      className="min-h-screen px-4 flex flex-col items-center px-2 py-3 pb-16 select-none"
      style={{
        background: "linear-gradient(145deg,#1a0a00 0%,#0a0400 100%)",
        fontFamily: "'Georgia','Times New Roman',serif",
        color: "#f0d090",
      }}
    >
      <SoundButton soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />

      <style>{`
        @keyframes cw{0%,100%{filter:brightness(1.6)}50%{filter:brightness(2.8)}}
        @keyframes glow{0%,100%{box-shadow:0 6px 20px rgba(245,200,66,.4)}50%{box-shadow:0 6px 30px rgba(245,200,66,.7)}}
        @keyframes slideup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .slide-up{animation:slideup .3s ease forwards}
      `}</style>

      {showNumber && (
        <NumberDisplayOverlay 
          girando={girando} 
          resultado={!girando ? resultado : null} 
          onClose={() => setShowNumber(false)}
        />
      )}

      <div className="text-center mb-3 mt-2">
        <h1 className="font-black uppercase"
          style={{
            fontSize: "clamp(15px,4vw,26px)",
            letterSpacing: "clamp(2px,1vw,5px)",
            color: "#f5c842",
            textShadow: "0 0 20px rgba(245,200,66,.5)",
          }}>
          🍫 RULETA DE CHOCOLATES 🍫
        </h1>
        <p className="mt-1"
          style={{ fontSize: "clamp(7px,1.5vw,9px)", letterSpacing: "3px", color: "#c99820", textTransform: "uppercase", fontFamily: "'Courier New',monospace" }}>
          Casino del Cacao — Ruleta Europea
        </p>
      </div>

      <div className="flex gap-2 w-full max-w-3xl mb-3 flex-wrap justify-center">
        <div className="flex flex-col gap-0.5 px-4 py-2 rounded-xl border-2 flex-1 min-w-[80px]"
          style={{ background: "linear-gradient(135deg,#1a0a00,#0a0500)", borderColor: "#c9880c" }}>
          <span style={{ fontSize: 9, color: "#e8b830", textTransform: "uppercase", letterSpacing: ".1em", fontFamily: "monospace" }}>💰 Saldo</span>
          <span className="font-bold" style={{ fontSize: "clamp(18px,4vw,26px)", color: "#f5c842" }}>{balance?.toLocaleString()}</span>
          <span style={{ fontSize: 8, color: "#c99820", fontFamily: "monospace" }}>CHOCOS</span>
        </div>
        <div className="flex flex-col gap-0.5 px-4 py-2 rounded-xl border-2 flex-1 min-w-[80px]"
          style={{ background: "linear-gradient(135deg,#1a0a00,#0a0500)", borderColor: "#c9880c" }}>
          <span style={{ fontSize: 9, color: "#e8b830", textTransform: "uppercase", letterSpacing: ".1em", fontFamily: "monospace" }}>🎲 Apuesta</span>
          <span className="font-bold" style={{ fontSize: "clamp(18px,4vw,26px)", color: "#f5c842" }}>{totalApuesta?.toLocaleString()}</span>
          <span style={{ fontSize: 8, color: "#c99820", fontFamily: "monospace" }}>CHOCOS</span>
        </div>
        <div className="flex flex-col gap-0.5 px-4 py-2 rounded-xl border-2 flex-1 min-w-[160px]"
          style={{ background: "linear-gradient(135deg,#1a0a00,#0a0500)", borderColor: "#c9880c" }}>
          <span style={{ fontSize: 9, color: "#e8b830", textTransform: "uppercase", letterSpacing: ".1em", fontFamily: "monospace" }}>📜 Últimos</span>
          <div className="flex gap-1.5 flex-wrap">
            {historial.length === 0
              ? <span style={{ fontSize: 10, color: "#8a6020", fontStyle: "italic" }}>Sin historial</span>
              : historial.map((n, i) => {
                const bg = n === 0 ? "#0e5a0e" : ROJOS.has(n) ? "#8b1a1a" : "#2a2a3a";
                const cl = n === 0 ? "#90ff90" : ROJOS.has(n) ? "#ffbbbb" : "#ddd";
                const br = n === 0 ? "#80ff80" : ROJOS.has(n) ? "#ff6060" : "#c99820";
                return (
                  <div key={i} style={{
                    width: 22, height: 22, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 700,
                    background: bg, color: cl, border: `1.5px solid ${br}`,
                    fontFamily: "monospace",
                  }}>{n}</div>
                );
              })}
          </div>
        </div>
      </div>

      {isMobile ? (
        <MesaVertical winZones={winZones} apuestas={apuestas} apostar={apostar} />
      ) : (
        <MesaHorizontal winZones={winZones} apuestas={apuestas} apostar={apostar} />
      )}

      <div className="flex flex-col items-center gap-3 mt-4 w-full max-w-3xl">

        {saldoMsg && (
          <div className="slide-up px-5 py-2 rounded-full text-xs font-bold"
            style={{ background: "#2a0a0a", border: "1.5px solid #ff4040", color: "#ff8080", fontFamily: "monospace" }}>
            {saldoMsg}
          </div>
        )}

        {error && (
          <div className="slide-up px-5 py-2 rounded-full text-xs font-bold"
            style={{ background: "#2a0a0a", border: "1.5px solid #ff4040", color: "#ff8080", fontFamily: "monospace" }}>
            ⚠ {error}
          </div>
        )}

        <div className="flex gap-2 px-4 py-2 rounded-full border flex-wrap justify-center"
          style={{ background: "#120600", borderColor: "#5a3a10" }}>
          {CHIP_VALUES.map(v => (
            <button key={v} onClick={() => seleccionarFicha(v)}
              className="rounded-full font-bold transition-all duration-200"
              style={{
                width: 50, height: 50,
                background: v === 100 ? "linear-gradient(135deg,#e8c840,#b8860b)"
                  : v === 500 ? "linear-gradient(135deg,#dc2626,#991b1b)"
                    : v === 1000 ? "linear-gradient(135deg,#3b82f6,#1e3a8a)"
                      : v === 2500 ? "linear-gradient(135deg,#10b981,#065f46)"
                        : v === 5000 ? "linear-gradient(135deg,#8b5cf6,#5b21b6)"
                          : v === 10000 ? "linear-gradient(135deg,#ec489a,#be185d)"
                            : "linear-gradient(135deg,#f59e0b,#b45309)",
                color: "white",
                border: chip === v ? "3px solid #fbbf24" : "3px solid transparent",
                transform: chip === v ? "scale(1.15)" : "scale(1)",
                boxShadow: chip === v ? "0 0 12px rgba(245,200,66,.5)" : "none",
                cursor: "pointer",
                fontSize: v >= 1000 ? 11 : 13,
                fontWeight: "bold",
              }}>
              {v >= 1000 ? (v/1000) + "k" : v}
            </button>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <button onClick={rebet}
            disabled={!Object.keys(ultimas).length || girando || totalApuesta > 0}
            style={{
              padding: "12px 20px", borderRadius: 999,
              fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em",
              cursor: "pointer", border: "1px solid #5a3a10", background: "#120600", color: "#c99820",
              fontFamily: "monospace",
              opacity: (!Object.keys(ultimas).length || girando || totalApuesta > 0) ? 0.28 : 1,
            }}>
            ↺ Repetir
          </button>

          <button onClick={duplicarApuesta}
            disabled={girando || Object.keys(apuestas).length === 0}
            style={{
              padding: "12px 20px", borderRadius: 999,
              fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em",
              cursor: "pointer", border: "1px solid #5a3a10", background: "#120600", color: "#c99820",
              fontFamily: "monospace",
              opacity: (girando || Object.keys(apuestas).length === 0) ? 0.28 : 1,
            }}>
            ×2 Duplicar
          </button>

          <button onClick={limpiar}
            disabled={girando}
            style={{
              padding: "12px 20px", borderRadius: 999,
              fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em",
              cursor: "pointer", border: "1px solid #5a1010", background: "#120600", color: "#c99820",
              fontFamily: "monospace", opacity: girando ? 0.28 : 1,
            }}>
            ✕ Limpiar
          </button>
        </div>

        {/* Botón GIRAR más grande y visible */}
        <button onClick={jugar}
          disabled={girando || !totalApuesta}
          style={{
            width: isMobile ? "90%" : "auto",
            minWidth: isMobile ? "auto" : "200px",
            padding: isMobile ? "18px 28px" : "14px 32px",
            borderRadius: 999,
            fontWeight: 900,
            fontSize: isMobile ? "clamp(18px,5vw,22px)" : "clamp(16px,2vw,18px)",
            textTransform: "uppercase",
            letterSpacing: ".15em",
            border: "none",
            cursor: girando || !totalApuesta ? "not-allowed" : "pointer",
            background: !totalApuesta || girando ? "#2a2a2a" : "linear-gradient(135deg,#c9880c,#f5c842,#c9880c)",
            color: !totalApuesta || girando ? "#555" : "#1a0800",
            boxShadow: totalApuesta && !girando ? "0 8px 30px rgba(245,200,66,.6)" : "none",
            fontFamily: "Georgia,serif",
            animation: totalApuesta && !girando ? "glow 2s ease infinite" : "none",
            marginTop: "8px",
            marginBottom: "8px",
          }}>
          {girando
            ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <div className="animate-spin" style={{ width: 20, height: 20, borderRadius: "50%", border: "3px solid currentColor", borderTop: "3px solid transparent" }} />
                GIRANDO...
              </span>
            : "🎰 GIRAR 🎰"}
        </button>

        {resultado && !girando && !showWin && !showNumber && (
          <div className="slide-up px-6 py-3 rounded-full border-2 text-center"
            style={{ background: "#120600", borderColor: "#c99820", fontFamily: "Georgia,serif", fontSize: "clamp(12px,2.5vw,15px)" }}>
            🎲 Número{" "}
            <span className={`font-bold text-xl ${numClr}`}>{resultado.numeroGanador}</span>
            {" — "}{nombre}
            {resultado.totalPremio > 0
              ? <span style={{ color: "#f5c842" }}> | 🍫 +{resultado.totalPremio}</span>
              : <span style={{ color: "#ff6060" }}> | ❌ Sin premio</span>}
            <br />
            <span style={{ fontSize: 11, color: "#c99820", fontFamily: "monospace" }}>
              {resultado.creditosAnteriores?.toLocaleString()} → {resultado.creditosActuales?.toLocaleString()} 🍫
            </span>
          </div>
        )}
      </div>

      {showWin && resultado && (
        <WinOverlay resultado={resultado} onClose={() => setShowWin(false)} />
      )}
    </div>
     </>
  );
}