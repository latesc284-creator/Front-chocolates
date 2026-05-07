import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginAdmin } from "../Service/Admin/auth/Login";
function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [errorServer, setErrorServer] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setErrorServer("");

    try {


      const res = await loginAdmin(data);


      navigate("/dashboard");


    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-80 flex flex-col gap-4"
      >
        <h2 className="text-white text-2xl font-bold text-center">
          Upps 🤔
        </h2>
        <div>
          <input
            type="text"
            placeholder="Usuario"
            className="w-full p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            {...register("username", {
              required: "El usuario es obligatorio",
              minLength: {
                value: 3,
                message: "Mínimo 3 caracteres",
              },
            })}
          />
          {errors.username && (
            <p className="text-red-400 text-xs mt-1">
              {errors.username.message}
            </p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "Mínimo 6 caracteres",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        {errorServer && (
          <p className="text-red-500 text-sm text-center">
            {errorServer}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 transition p-2 rounded text-white font-semibold disabled:opacity-50"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}

export default Login;