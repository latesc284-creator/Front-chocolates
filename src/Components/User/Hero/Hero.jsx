import React from 'react';
import { GiChocolateBar } from 'react-icons/gi';
import { BiSun } from 'react-icons/bi'; // Usaremos esto como destello de la ruleta

export default function Hero() {
    return (
        <div className="px-4">
            <section className="relative h-[450px] md:h-80 rounded-[3rem] overflow-hidden mb-12 bg-[#0a0908] border border-white/5 flex items-center">

                {/* Glow de fondo */}
                <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#a27b5c]/10 rounded-full blur-[120px]"></div>

                <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center px-8 md:px-20 gap-10">

                    {/* TEXTO IZQUIERDA */}
                    <div className="text-center md:text-left order-2 md:order-1">

                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight">
                            TU SUERTE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a27b5c] to-[#e7d4b5]">
                                TIENE SABOR
                            </span>
                        </h2>
                        <p className="mt-3 text-gray-500 text-sm md:text-lg font-medium max-w-sm">
                            Participá en la ruleta artesanal y llevate <span className="text-white">premios en cada chocolate.</span>
                        </p>
                    </div>

                    {/* RULETA DE CHOCOLATE (DERECHA) */}
                    <div className="relative order-1 md:order-2 flex items-center justify-center">

                        {/* Indicador de la ruleta (La flechita de arriba) */}
                        <div className="absolute -top-2 z-20 text-[#e7d4b5] text-3xl filter drop-shadow-md">
                            ▼
                        </div>

                        {/* Cuerpo de la Ruleta */}
                        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border-8 border-[#2d1b15] shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden animate-[spin_20s_linear_infinite]">

                            {/* Fondo de la ruleta dividido en "porciones" de chocolate */}
                            <div className="absolute inset-0 bg-[#3d1d13]"></div>

                            {/* Divisiones (Rayos de la ruleta) */}
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-full h-[2px] bg-[#a27b5c]/30"
                                    style={{ transform: `rotate(${i * 45}deg)` }}
                                ></div>
                            ))}

                            {/* Íconos en las porciones */}
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute text-[#a27b5c]/40 text-xl"
                                    style={{
                                        transform: `rotate(${i * 45 + 22.5}deg) translateY(-60px)`
                                    }}
                                >
                                    <GiChocolateBar />
                                </div>
                            ))}

                            {/* Centro de la Ruleta */}
                            <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-[#a27b5c] to-[#3d1d13] rounded-full border-4 border-[#1a1614] flex items-center justify-center shadow-xl">
                                <GiChocolateBar className="text-white text-2xl" />
                            </div>
                        </div>

                        {/* Brillo de fondo de la ruleta */}
                        <div className="absolute w-64 h-64 bg-[#a27b5c]/20 rounded-full blur-3xl -z-10"></div>
                    </div>

                </div>
            </section>
        </div>
    );
}