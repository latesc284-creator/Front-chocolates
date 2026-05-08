const API_URL_ADMIN = import.meta.env.VITE_URL_BACK_USER;

export const getCreditsRule = async () => {
  try {
    const response = await fetch(`${API_URL_ADMIN}/getSaldo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message || "Error al obtener los creditos");
    }
    return res;
  } catch (error) {
    console.error("Error al obtener los creditos:", error.message);
    throw error;
  }
};
