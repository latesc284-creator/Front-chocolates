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
        <div className="h-screen flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Verificando sesión...</p>
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