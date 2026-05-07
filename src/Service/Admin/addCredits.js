const API_URL_ADMIN = import.meta.env.VITE_URL_BACK;

export const addCredits = async (data) => {
  try {
    const response = await fetch(`${API_URL_ADMIN}/addCredits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message || "Add Credits failed");
    }
    return res;
  } catch (error) {
    console.error("Add Credits Error:", error.message);
    throw error;
  }
};
