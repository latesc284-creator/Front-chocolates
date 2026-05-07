import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../Pages/Login";
import Home from "../Pages/Home";
import IdGames from "../Pages/IdGames";
import Roulete from "../Games/Rouleta";

import AdminLogin from "../Pages/LoginAdmin";
import AdminDashboard from "../Pages/Dashboard";

import ProtectedRoute from "./ProtectRoutes";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/adminLogin" element={<AdminLogin />} />
                <Route path="/" element={<Login />} />

                {/* Grupo Protegido: Usuarios Estándar */}
                <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                    <Route path="/Inicio" element={<Home />} />
                    <Route path="/Juego" element={<Roulete />} />
                </Route>

                {/* Grupo Protegido: EXCLUSIVO Admins ('ella') */}
                <Route element={<ProtectedRoute allowedRoles={['ella']} />}>
                    {/* Ahora el dashboard es una ruta hija, el Outlet lo renderizará */}
                    <Route path="/dashboard" element={<AdminDashboard />} />
                </Route>

                {/* Opcional: Ruta para cuando no tienen permiso */}
                <Route path="/unauthorized" element={<h1>No tienes acceso</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;