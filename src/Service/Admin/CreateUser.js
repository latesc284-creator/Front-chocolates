const API_URL_ADMIN = import.meta.env.VITE_URL_BACK;

export const createUser = async (data) => {

  try {
    const response = await fetch(`${API_URL_ADMIN}/createPlayer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message || "Create User failed");
    }
    return res;
  } catch (error) {
    console.error("Create User Error:", error.message);
    throw error;
  }
};
