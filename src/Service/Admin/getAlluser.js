const API_URL_ADMIN = import.meta.env.VITE_URL_BACK;

export const getAlluser = async () => {
  try {
    const response = await fetch(`${API_URL_ADMIN}/allPlayers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message || "Get All Users failed");
    }
    return res;
  } catch (error) {
    console.error("Get All Users Error:", error.message);
    throw error;
  }
};