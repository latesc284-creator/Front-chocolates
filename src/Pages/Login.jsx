import  { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff, FiUser, FiLock, FiLogIn, FiShield } from 'react-icons/fi';
import {useNavigate} from "react-router-dom";

import { loginPlayer } from "../Service/Admin/auth/LoginPlayer"


const FeriaPremiumLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            nombreUsuario: '',
            contrasena: ''
        }
    });

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const onSubmit = async (data) => {
        setIsLoading(true);

        // Simular llamada al backend - Reemplazar con tu API real
        try {
            const res = await loginPlayer(data)
            if(res.status === 200 ) navigate("/Inicio")
            await new Promise(resolve => setTimeout(resolve, 1500));
            if (data.nombreUsuario === 'admin' && data.contrasena === 'admin123') {
                showNotification('¡Bienvenido a la experiencia premium!', 'success');
                reset();
                // Redirigir después del login
                // setTimeout(() => window.location.href = '/dashboard', 1500);
            } else {
                showNotification('Credenciales inválidas. Intenta de nuevo.', 'error');
            }
        } catch (error) {
            showNotification('Error al iniciar sesión', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d0a09] relative overflow-hidden">

            {/* Notification Toast */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-slide-in ${notification.type === 'success'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'bg-gradient-to-r from-red-500 to-rose-600'
                    } text-white`}>
                    {notification.type === 'success' ? <FiShield size={20} /> : <FiLock size={20} />}
                    <span className="font-semibold">{notification.message}</span>
                </div>
            )}

            {/* Luces de fondo */}
            <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-[#3d1d13] rounded-full blur-[150px] opacity-40"></div>
            <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-[#5c3d2e] rounded-full blur-[150px] opacity-30"></div>

            <div className="relative z-10 w-full max-w-[440px] p-6">

                {/* Contenedor principal */}
                <div className="bg-[#1a1614]/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border border-white/5 overflow-hidden">

                    <div className="p-10">
                        {/* Logo */}
                        <div className="text-center mb-12">
                            <div className="inline-block relative mb-4">
                                <div className="absolute inset-0 bg-[#d97706] blur-2xl opacity-20"></div>
                                <h1 className="relative text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-[#e7d4b5] to-[#a27b5c] tracking-tighter">
                                    FC
                                </h1>
                            </div>
                            <h2 className="text-white text-xs font-black uppercase tracking-[0.6em] mb-1">
                                Feria de Chocolates
                            </h2>

                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#a27b5c] ml-1 flex items-center gap-2">
                                    <FiUser size={14} />
                                    Nombre de Usuario
                                </label>
                                <input
                                    type="text"
                                    {...register("nombreUsuario", {
                                        required: "El nombre de usuario es requerido",
                                        minLength: {
                                            value: 3,
                                            message: "Mínimo 3 caracteres"
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: "Máximo 20 caracteres"
                                        }
                                    })}
                                    className={`w-full bg-white/[0.03] border text-[#e7d4b5] px-6 py-4 rounded-2xl focus:border-[#a27b5c] focus:ring-1 focus:ring-[#a27b5c] outline-none transition-all ${errors.nombreUsuario
                                        ? 'border-red-500/50'
                                        : 'border-white/10'
                                        }`}
                                    placeholder="ej: chocolover_2026"
                                />
                                {errors.nombreUsuario && (
                                    <p className="text-red-400 text-xs mt-1 ml-2">
                                        {errors.nombreUsuario.message}
                                    </p>
                                )}
                            </div>

                            {/* Contraseña */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#a27b5c] ml-1 flex items-center gap-2">
                                    <FiLock size={14} />
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register("contrasena", {
                                            required: "La contraseña es requerida",
                                            minLength: {
                                                value: 6,
                                                message: "Mínimo 6 caracteres"
                                            }
                                        })}
                                        className={`w-full bg-white/[0.03] border text-[#e7d4b5] px-6 py-4 rounded-2xl focus:border-[#a27b5c] focus:ring-1 focus:ring-[#a27b5c] outline-none transition-all ${errors.contrasena
                                            ? 'border-red-500/50'
                                            : 'border-white/10'
                                            }`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#a27b5c] hover:text-[#e7d4b5] transition-colors"
                                    >
                                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                {errors.contrasena && (
                                    <p className="text-red-400 text-xs mt-1 ml-2">
                                        {errors.contrasena.message}
                                    </p>
                                )}
                            </div>

                            {/* Botón de Ingreso */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full group relative mt-4 transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#5c3d2e] via-[#a27b5c] to-[#5c3d2e] rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative bg-[#2d2421] hover:bg-[#3d302c] border border-white/10 py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors">
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-[#e7d4b5] rounded-full animate-spin"></div>
                                            <span className="text-[#e7d4b5] font-bold uppercase tracking-[0.25em] text-xs">
                                                Ingresando...
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <FiLogIn className="text-[#a27b5c] group-hover:text-[#e7d4b5] transition-colors" size={16} />
                                            <span className="text-[#e7d4b5] font-bold uppercase tracking-[0.25em] text-xs">
                                                Ingresar
                                            </span>
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>




                    </div>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-[9px] text-white/20 uppercase tracking-[0.5em]">
                        Feria de Chocolates 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeriaPremiumLogin;