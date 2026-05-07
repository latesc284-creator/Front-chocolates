import { useState } from 'react';
import RulaImg from "../../../assets/rula.png";
import { Link } from "react-router-dom";


export default function CardGames() {
    const games = [
        { id: 1, title: "Ruleta Royale Chocolate", type: "Agilidad", icon: RulaImg, color: "from-orange-900" },
    ];
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="group relative bg-gradient-to-br from-[#2a2420] to-[#1a1614] rounded-[2rem] p-[2px] overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a27b5c]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>

                        <div className="relative bg-[#1a1614]/95 backdrop-blur-sm rounded-[1.9rem] p-6 flex flex-col h-full z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-1 bg-[#a27b5c] rounded-full opacity-50"></div>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-[#a27b5c] font-bold">Artesanal</span>
                            </div>
                            <div className="relative overflow-hidden rounded-2xl mb-6 shadow-inner bg-[#251f1c]">
                                <img
                                    src={game.icon}
                                    alt={game.title}
                                    className="w-full h-40 object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                            </div>

                            <div className="flex flex-col mb-6">
                                <h4 className="text-2xl font-serif font-semibold text-[#e7d4b5] group-hover:text-white transition-colors duration-300">
                                    {game.title}
                                </h4>
                                <p className="text-xs text-[#a27b5c]/70 mt-1 italic">Gira y gana premios dulces</p>
                            </div>
                            <Link to="/Juego" className="mt-auto">
                                <button className="w-full relative overflow-hidden group/btn px-6 py-4 rounded-2xl transition-all duration-500 active:scale-[0.97]">
                                    {/* Fondo con gradiente metálico */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#a27b5c] via-[#c4a484] to-[#a27b5c] transition-all duration-500 group-hover/btn:brightness-110"></div>

                                    {/* Efecto de Brillo (Shine) que cruza el botón */}
                                    <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                                    {/* Contenido del botón */}
                                    <span className="relative z-10 flex items-center justify-center gap-3 text-[#1a1614] font-black text-xs uppercase tracking-[0.2em]">
                                        Probar Suerte
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
