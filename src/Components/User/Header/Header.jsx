import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineLogout, HiOutlineMenuAlt3, HiX, HiOutlineUserCircle } from 'react-icons/hi';
import { getUser } from "../../../Service/user/dataUser";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Petición de datos con TanStack Query
    const { data: response, isLoading, isError } = useQuery({
        queryKey: ['userData'],
        queryFn: getUser,
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

   

    // Mapeo según tu JSON: { data: { name, credits, id } }
    const player = response?.data;

    const handleLogout = () => {
        // 1. Limpiamos el caché de React Query
        queryClient.clear();

        // 2. Aquí eliminas lo que uses para persistir (Cookie o LocalStorage)
        // Document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // 3. Redirección forzada al login
        navigate("/");
        window.location.reload(); // Forzamos recarga para limpiar cualquier estado residual
    };

    if (isError) return null; // Si falla la carga, el header no estorba

    return (
        <header className="sticky top-0 z-50 bg-[#0a0908]/95 backdrop-blur-md border-b border-white/5 px-4 py-3">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/Inicio">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-[#3d1d13] to-[#a27b5c] rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-serif font-bold text-xl">F</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-sm font-black uppercase tracking-widest text-white leading-none">Feria de Chocolates</h1>
                            <p className="text-[9px] text-[#a27b5c] uppercase tracking-[0.3em] font-medium">Exclusivity Club</p>
                        </div>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Balance</p>
                            <p className="text-lg font-bold text-white">
                                {isLoading ? "..." : player?.credits?.toLocaleString()} <span className="text-[#a27b5c] text-sm">🍫</span>
                            </p>
                        </div>

                        <div className="h-8 w-[1px] bg-white/10"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-bold text-white leading-none">{player?.name || "Invitado"}</p>
                                <p className="text-[10px] text-[#a27b5c] font-medium mt-1 uppercase">Maestro</p>
                            </div>
                            <HiOutlineUserCircle size={32} className="text-[#a27b5c]" />
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                        <HiOutlineLogout size={22} />
                    </button>
                </div>

                {/* MOBILE UI */}
                <div className="md:hidden flex items-center gap-4">
                    <HiOutlineUserCircle size={32} className="text-[#a27b5c]" />
                    <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">

                        <span className="text-xs font-bold text-white">{player?.credits?.toLocaleString()} 🍫</span>
                    </div>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#a27b5c]">
                        {isMenuOpen ? <HiX size={28} /> : <HiOutlineMenuAlt3 size={28} />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {
                isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-[#0a0908] border-b border-white/10 p-6 animate-in fade-in duration-200">
                        <div className="flex flex-col gap-5">
                            <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4">
                                <HiOutlineUserCircle size={40} className="text-[#a27b5c]" />
                                <div>
                                    <p className="text-white font-bold capitalize">{player?.name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Saldo: {player?.credits} 🍫</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-bold uppercase text-xs flex items-center justify-center gap-2"
                            >
                                <HiOutlineLogout size={18} /> Cerrar Sesión
                            </button>
                        </div>
                    </div>
                )
            }
        </header >
    );
}