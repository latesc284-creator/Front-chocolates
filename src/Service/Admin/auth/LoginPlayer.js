const API_URL_ADMIN = import.meta.env.VITE_URL_BACK_USER;

export const loginPlayer = async (data) => {
  console.log("data", data);

  try {
    const response = await fetch(`${API_URL_ADMIN}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        UserName: data.nombreUsuario,
        password: data.contrasena,
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
