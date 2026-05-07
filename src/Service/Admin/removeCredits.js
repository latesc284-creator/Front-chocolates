const API_URL_ADMIN = import.meta.env.VITE_URL_BACK;

export const removeCredits = async (data) => {
  const datos ={
    UserName: data.UserName,
    amount: data.amount,
  }
  try {
    const response = await fetch(`${API_URL_ADMIN}/removeCredits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(datos),
    });

    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message || "Remove Credits failed");
    }
    return res;
  } catch (error) {
    console.error("Remove Credits Error:", error.message);
    throw error;
  }
};
