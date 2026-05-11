const API_URL_ADMIN = import.meta.env.VITE_URL_BACK_USER;

export const changePassword = async ( newPassword) => {
    try {
        const response = await fetch(`${API_URL_ADMIN}/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ newPassword }),
        });

        const res = await response.json();
        if (!response.ok) {
            throw new Error(res.message || "Error al cambiar la contraseña");
        }
        return res;
    }
    catch (error) {
        console.error("Error al cambiar la contraseña:", error.message);
    }
}