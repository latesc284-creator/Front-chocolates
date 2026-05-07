 const API_URL_ADMIN = import.meta.env.VITE_URL_BACK_USER;

 export const getUser = async () => {
    try {
      const response = await fetch(`${API_URL_ADMIN}/data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.message || "Error al obtener el usuario");
      }
      return res;
    }
    catch (error) {
      console.error("Error al obtener el usuario:", error.message);
      throw error;
    }
  };