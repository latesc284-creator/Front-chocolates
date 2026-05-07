import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_URL_BACK;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ CORREGIDO: Eliminado el 'export' de aquí adentro
  const verifyAuth = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/verify`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        // Ajustamos según la estructura que recibes (data.player)
        const userData = data.player || data;
        setUser(userData);
        return userData;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  return (
    // ✅ Aquí es donde realmente se "exporta" para que otros componentes la usen
    <AuthContext.Provider value={{ user, setUser, loading, verifyAuth }}>
      {loading ? (
        <div className="h-screen w-full bg-[#0a0908] flex flex-col items-center justify-center gap-8">
          {/* Contenedor del Spinner */}
          <div className="relative flex items-center justify-center">

            {/* Efecto de resplandor de fondo (glow) */}
            <div className="absolute w-24 h-24 bg-[#a27b5c]/20 rounded-full blur-2xl animate-pulse"></div>

            {/* Spinner estilizado */}
            <div className="w-16 h-16 border-2 border-[#a27b5c]/10 border-t-[#a27b5c] rounded-full animate-spin"></div>

            {/* Icono central estático o con un pulso suave */}
            <div className="absolute text-2xl animate-bounce duration-[2s]">
              🍫
            </div>
          </div>

          {/* Texto con tipografía premium */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-white font-black uppercase tracking-[0.4em] text-xs">
              Cargando
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#a27b5c] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-[#a27b5c] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-[#a27b5c] rounded-full animate-bounce"></span>
            </div>
            <p className="text-[#a27b5c]/60 text-[10px] uppercase tracking-widest mt-2">
              Verificando sesión artesanal
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};