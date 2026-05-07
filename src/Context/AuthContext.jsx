import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_URL_BACK;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {

        const res = await fetch(`${API_URL}/verify`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          credentials: 'include'
        });

        if (res.ok) {
          const data = await res.json();

          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {loading ? <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Verificando sesión...</p>
      </div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);