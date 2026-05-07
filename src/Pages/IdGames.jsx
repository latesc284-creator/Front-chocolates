import React, { useState } from 'react';

const GameView = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);

    return (
        <div className="min-h-screen bg-[#0d0a09] text-[#e7d4b5] flex flex-col">

            {/* BARRA SUPERIOR DE NAVEGACIÓN RÁPIDA */}
            <nav className="p-4 md:px-8 flex justify-between items-center bg-[#1a1614]/50 border-b border-white/5">
                <button className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#a27b5c] hover:text-[#e7d4b5] transition-colors">
                    <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Volver al Pabellón
                </button>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right leading-none">
                        <p className="text-[9px] uppercase text-[#a27b5c] font-black">Jugando a</p>
                        <p className="text-xs font-bold text-white tracking-widest uppercase italic">Cacao Catch Premium</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-[#a27b5c]/30 flex items-center justify-center bg-black/40 shadow-lg">
                        <span className="text-xl">🍫</span>
                    </div>
                </div>
            </nav>

            <main className="flex-1 flex flex-col lg:flex-row p-4 md:p-8 gap-6 max-w-[1600px] mx-auto w-full">

                {/* ÁREA DEL JUEGO (FRAME PRINCIPAL) */}
                <div className="flex-1 flex flex-col">
                    <div className="relative aspect-video lg:aspect-auto lg:h-[75vh] w-full bg-[#050505] rounded-[2.5rem] border-2 border-[#1a1614] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden group">

                        {/* Pantalla de Inicio / Overlay */}
                        {!isPlaying && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-all">
                                <div className="w-24 h-24 bg-gradient-to-br from-[#a27b5c] to-[#3d1d13] rounded-full flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(162,123,92,0.3)] mb-6">
                                    🍫
                                </div>
                                <h2 className="text-3xl font-serif italic mb-2 tracking-wide">¿Listo para la cosecha?</h2>
                                <p className="text-[#a27b5c] text-xs uppercase tracking-[0.4em] mb-8">Cuesta 10 bombones entrar</p>

                                <button
                                    onClick={() => setIsPlaying(true)}
                                    className="px-12 py-4 bg-[#e7d4b5] text-black font-black uppercase text-xs tracking-[0.3em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(231,212,181,0.4)]"
                                >
                                    Comenzar Partida
                                </button>
                            </div>
                        )}

                        {/* ESPACIO PARA EL JUEGO (Aquí renderizas tu canvas o lógica) */}
                        <div className="h-full w-full flex items-center justify-center relative">
                            {isPlaying ? (
                                <div className="text-center animate-pulse">
                                    <p className="text-white/20 uppercase tracking-[1em]">El juego está corriendo...</p>
                                    <button
                                        onClick={() => setScore(prev => prev + 50)}
                                        className="mt-4 text-[10px] text-[#a27b5c] border border-[#a27b5c] px-4 py-1 rounded-full"
                                    >
                                        Simular Puntos
                                    </button>
                                </div>
                            ) : (
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            )}
                        </div>

                        {/* Hud Inferior dentro del juego */}
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
                            <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-[#a27b5c] uppercase font-bold tracking-widest">Puntos</p>
                                <p className="text-xl font-black text-white">{score.toLocaleString()}</p>
                            </div>
                            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-[#a27b5c] uppercase font-bold tracking-widest">Multiplicador</p>
                                <p className="text-xl font-black text-orange-500">x1.5</p>
                            </div>
                        </div>
                    </div>

                    {/* Controles de Ayuda Móvil */}
                    <div className="mt-4 flex gap-4 lg:hidden">
                        <button className="flex-1 bg-[#1a1614] py-4 rounded-2xl text-2xl">⬅️</button>
                        <button className="flex-1 bg-[#1a1614] py-4 rounded-2xl text-2xl">🚀</button>
                        <button className="flex-1 bg-[#1a1614] py-4 rounded-2xl text-2xl">➡️</button>
                    </div>
                </div>

                {/* PANEL LATERAL (Estadísticas y Social) */}
                <aside className="w-full lg:w-[350px] space-y-6">

                    {/* Card de Usuario en Vivo */}
                    <div className="bg-gradient-to-br from-[#1a1614] to-[#0d0a09] p-6 rounded-[2rem] border border-white/5 shadow-xl">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#a27b5c] mb-6 border-b border-white/5 pb-4">Status de Sesión</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40 uppercase tracking-widest">Chocolates Ganados</span>
                                <span className="text-sm font-bold text-green-500">+{(score / 10).toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40 uppercase tracking-widest">Tiempo de Juego</span>
                                <span className="text-sm font-bold">04:22</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40 uppercase tracking-widest">Rango</span>
                                <span className="text-[10px] bg-[#a27b5c]/10 text-[#a27b5c] px-2 py-1 rounded font-black">EXPERTO</span>
                            </div>
                        </div>
                    </div>

                    {/* Ranking en Vivo (Simulado) */}
                    <div className="bg-[#1a1614]/30 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/5">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#a27b5c] mb-6">Top Maestros hoy</h3>
                        <div className="space-y-4">
                            {[
                                { n: "L. Wonka", p: "45k" },
                                { n: "C. Cacao", p: "32k" },
                                { n: "A. Choco", p: "28k" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 group cursor-default">
                                    <span className="text-[10px] font-bold text-white/20 group-hover:text-[#a27b5c]">0{i + 1}</span>
                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.n}`} alt="avatar" />
                                    </div>
                                    <span className="flex-1 text-xs font-medium text-white/70">{item.n}</span>
                                    <span className="text-xs font-black text-[#e7d4b5]">{item.p}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botón de Retirada */}
                    <button className="w-full py-4 rounded-2xl bg-red-950/20 border border-red-900/30 text-red-500 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-900/40 transition-all">
                        Abandonar Cosecha
                    </button>
                </aside>

            </main>
        </div>
    );
};

export default GameView;