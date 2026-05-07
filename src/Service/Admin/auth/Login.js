const API_URL_ADMIN = import.meta.env.VITE_URL_BACK;

export const loginAdmin = async (data) => {
  try {
    const response = await fetch(`${API_URL_ADMIN}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email:data.username,
        password:data.password,
      }),
    });

    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message || "Login failed");
    }
    return res;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};
