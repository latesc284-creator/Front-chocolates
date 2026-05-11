import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi"; // Importamos los iconos de ojo
import { changePassword } from "../../Service/user/ChangePassword"
import { useQueryClient } from "@tanstack/react-query";


const ChangePasswordModal = ({ isOpen, onClose }) => {
  // Estados para controlar la visibilidad de las contraseñas
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset 
  } = useForm();

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    await changePassword(data.password);
    queryClient.invalidateQueries(['userData']); 

    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity duration-300">
      {/* Contenedor principal con esquinas MUCHO MÁS redondeadas (rounded-2xl) */}
      <div className="bg-[#1a1614] border border-[#a27b5c]/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100">

        {/* Header - Un poco más alto para dar aire */}
        <div className="flex items-center justify-between p-7 border-b border-[#a27b5c]/10">
          <div className="flex items-center gap-3">
            <div className="bg-[#a27b5c]/10 p-2.5 rounded-full"> {/* Icono dentro de un círculo */}
              <HiLockClosed className="text-[#a27b5c] text-2xl" />
            </div>
            <h2 className="text-xl font-extrabold uppercase tracking-widest text-[#e7d4b5]">
              Seguridad
            </h2>
          </div>
        </div>

        {/* Formulario con padding más generoso */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-7 space-y-6">
          <div className="bg-[#a27b5c]/5 border border-[#a27b5c]/10 p-4 rounded-xl"> {/* Caja de info amigable */}
            <p className="text-sm text-[#e7d4b5]/90 leading-relaxed">
              Hola <span className="font-bold text-[#a27b5c]">Jugador</span>, por seguridad es necesario que establezcas una contraseña nueva para tu cuenta.
            </p>
          </div>

          {/* Campo: Nueva Contraseña */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-[#a27b5c] pl-1">Nueva Contraseña</label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"} // Cambia el tipo dinámicamente
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" }
                })}
                // Input con rounded-xl
                className="w-full bg-[#0d0a09] border border-[#a27b5c]/20 rounded-xl p-4 text-sm focus:outline-none focus:border-[#a27b5c] focus:ring-1 focus:ring-[#a27b5c] transition-all pr-12"
                placeholder="Mínimo 6 caracteres"
              />
              {/* Botón del ojito */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a27b5c]/50 hover:text-[#e7d4b5] transition-colors p-1"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <HiEyeOff className="text-xl" /> : <HiEye className="text-xl" />}
              </button>
            </div>
            {errors.password && <span className="text-red-400 text-[11px] mt-1 italic pl-1">{errors.password.message}</span>}
          </div>

          {/* Campo: Confirmar Contraseña */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-[#a27b5c] pl-1">Confirmar Contraseña</label>
            <div className="relative group">
              <input
                type={showConfirmPassword ? "text" : "password"} // Cambia el tipo dinámicamente
                {...register("confirmPassword", {
                  required: "Por favor confirma tu contraseña",
                  validate: (value) => value === watch('password') || "Las contraseñas no coinciden"
                })}
                // Input con rounded-xl
                className="w-full bg-[#0d0a09] border border-[#a27b5c]/20 rounded-xl p-4 text-sm focus:outline-none focus:border-[#a27b5c] focus:ring-1 focus:ring-[#a27b5c] transition-all pr-12"
                placeholder="Repite tu contraseña"
              />
              {/* Botón del ojito */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a27b5c]/50 hover:text-[#e7d4b5] transition-colors p-1"
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? <HiEyeOff className="text-xl" /> : <HiEye className="text-xl" />}
              </button>
            </div>
            {errors.confirmPassword && <span className="text-red-400 text-[11px] mt-1 italic pl-1">{errors.confirmPassword.message}</span>}
          </div>

          {/* Botón de acción con rounded-xl y efecto hover sutil */}
          <button
            type="submit"
            className="w-full bg-[#a27b5c] hover:bg-[#bd977a] text-[#0d0a09] font-extrabold py-4 rounded-xl uppercase tracking-[0.2em] text-xs transition-all duration-300 mt-6 shadow-lg shadow-[#a27b5c]/10 active:scale-[0.98]"
          >
            Actualizar y Continuar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;