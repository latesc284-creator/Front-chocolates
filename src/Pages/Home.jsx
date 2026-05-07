import { useState } from 'react';
import RulaImg from "../assets/rula.png";
import { Link } from "react-router-dom";



const FeriaHome = () => {
  // Simulación de datos
  const [user] = useState({ name: "Jose Arias", chocolates: 1250 });

  const games = [
    { id: 1, title: "Ruleta Royale Chocolate", type: "Agilidad", icon: RulaImg, color: "from-orange-900" },

  ];

  return (
    <div className="min-h-screen bg-[#0d0a09] text-[#e7d4b5] font-sans pb-10">

      <header className="sticky top-0 z-50 bg-[#1a1614]/90 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Logo y Nombre */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#a27b5c] to-[#3d1d13] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-serif font-bold">FC</span>
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-widest leading-none">Feria de Chocolates</h1>
              <span className="text-[10px] text-[#a27b5c] uppercase tracking-[0.3em]">Mundo de Exclusividad</span>
            </div>
          </div>

          {/* Info Usuario y Chocolates */}
          <div className="flex items-center gap-6 bg-black/40 px-6 py-2 rounded-full border border-white/5 shadow-inner">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase text-[#a27b5c] font-bold">Maestro</p>
              <p className="text-sm font-medium tracking-tight">{user.name}</p>
            </div>
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] uppercase text-[#a27b5c] font-bold">Balance</p>
                <p className="text-sm font-black text-white">{user.chocolates.toLocaleString()} <span className="text-[#a27b5c]">🍫</span></p>
              </div>
              <button className="bg-[#a27b5c] hover:bg-[#e7d4b5] text-black w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-lg active:scale-90">
                <span className="font-bold text-lg">+</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">

        <section className="relative h-48 md:h-64 rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2d1b15] to-[#0d0a09] z-0"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#a27b5c]/20 rounded-full blur-[100px]"></div>

          <div className="relative z-10 h-full flex flex-col justify-center px-10">
            <h2 className="text-3xl md:text-5xl font-serif italic mb-2">Bienvenido a la Selección</h2>
            <p className="text-[#a27b5c] max-w-md text-sm md:text-base leading-relaxed opacity-80">
              Explora los pabellones, participa en los desafíos y aumenta tu reserva de cacao premium.
            </p>
          </div>
        </section>
        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-xs uppercase tracking-[0.5em] font-black border-l-4 border-[#a27b5c] pl-4">Pabellones de Juego</h3>
            <button className="text-[10px] uppercase tracking-widest text-[#a27b5c] hover:text-white transition-colors">Ver todos →</button>
          </div>
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
                  <Link to="/Juego"> <button className="mt-auto relative overflow-hidden group/btn bg-[#a27b5c] text-[#1a1614] font-bold py-3 rounded-xl transition-all duration-300 hover:bg-[#e7d4b5] hover:shadow-[0_0_20px_rgba(162,123,92,0.4)] active:scale-95">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      PROBAR SUERTE
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FeriaHome;