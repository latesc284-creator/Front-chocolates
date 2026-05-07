import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiUsers,
  FiPlusCircle,
  FiMinusCircle,
  FiSearch,
  FiRefreshCw,
  FiUserPlus,
  FiMenu,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiDollarSign,
  FiTrendingUp,
  FiAward,
  FiGrid,
  FiList,
  FiChevronLeft,
  FiChevronRight,
  FiActivity
} from "react-icons/fi";
import { createUser } from "../Service/Admin/CreateUser";
import { getAlluser } from "../Service/Admin/getAlluser";
import { removeCredits } from "../Service/Admin/removeCredits";
import { addCredits } from "../Service/Admin/addCredits";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [viewMode, setViewMode] = useState("grid");
  const itemsPerPage = 8;

  const queryClient = useQueryClient();

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const closeModals = () => {
    setActiveModal(null);
    setSelectedUser(null);
  };

  // Queries
  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getAlluser,
    staleTime: 30000,
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      showNotification("Usuario creado con éxito", "success");
      closeModals();
    },
    onError: (error) => showNotification(error.response?.data?.message || "Error al crear", "error"),
  });

  const addCreditsMutation = useMutation({
    mutationFn: addCredits,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      showNotification(`Créditos cargados correctamente`, "success");
      closeModals();
    },
    onError: () => showNotification("Error en la carga", "error"),
  });

  const removeCreditsMutation = useMutation({
    mutationFn: removeCredits,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      showNotification(`Créditos retirados con éxito`, "success");
      closeModals();
    },
    onError: () => showNotification("Error al retirar", "error"),
  });

  // Logic
  const filteredUsers = usersData?.data?.filter((user) =>
    user.UserName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const sortedUsers = [...filteredUsers].sort((a, b) => (b.credits || 0) - (a.credits || 0));
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- Modals ---
  const CreateUserModal = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
        <div className="bg-[#111113] border border-yellow-500/30 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Nuevo Jugador</h2>
            <button onClick={closeModals} className="text-gray-500 hover:text-white"><FiX size={24} /></button>
          </div>
          <form onSubmit={handleSubmit((data) => createUserMutation.mutate(data))} className="space-y-5">
            <input
              {...register("UserName", { required: "Username requerido" })}
              className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl focus:border-yellow-500 outline-none text-white transition-all"
              placeholder="Nombre de usuario"
            />
            <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-2xl transition-all active:scale-95 uppercase tracking-widest">
              {createUserMutation.isPending ? "Procesando..." : "Registrar"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const CreditsModal = ({ type }) => {
    const { register, handleSubmit } = useForm({ defaultValues: { UserName: selectedUser?.UserName } });
    const isAdd = type === "add";

    const onAction = (data) => {
      const payload = { UserName: data.UserName, amount: Number(data.amount) };
      isAdd ? addCreditsMutation.mutate(payload) : removeCreditsMutation.mutate(payload);
    };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in zoom-in-95 duration-200">
        <div className={`bg-[#111113] border ${isAdd ? 'border-green-500/30' : 'border-red-500/30'} rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl`}>
          <h2 className="text-xl font-black text-white uppercase mb-6 flex items-center gap-2">
            {isAdd ? <FiPlusCircle className="text-green-500" /> : <FiMinusCircle className="text-red-500" />}
            {isAdd ? "Cargar Saldo" : "Retirar Saldo"}
          </h2>
          <form onSubmit={handleSubmit(onAction)} className="space-y-6">
            <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
              <p className="text-[10px] text-gray-500 uppercase font-black">Jugador</p>
              <p className="text-white font-bold">{selectedUser?.UserName}</p>
            </div>
            <div className="relative">
              <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" />
              <input
                type="number"
                {...register("amount", { required: true, min: 1 })}
                className="w-full pl-10 pr-5 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white text-xl font-bold outline-none focus:border-white transition-all"
                placeholder="Monto"
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={closeModals} className="flex-1 py-4 text-gray-400 font-bold">Cancelar</button>
              <button className={`flex-1 py-4 rounded-2xl font-black text-white uppercase tracking-widest ${isAdd ? 'bg-green-600' : 'bg-red-600'}`}>
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-100 selection:bg-yellow-500/30">

      {/* HEADER SUPERIOR */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#111113]/80 backdrop-blur-xl border-b border-gray-800 z-50 px-6 flex items-center justify-between lg:px-12">
        <div className="flex items-center gap-3">

          <h1 className="text-lg font-black uppercase italic tracking-tighter"> Panel Admin</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-3 bg-gray-800 rounded-xl text-yellow-500"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <div className="hidden lg:flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Server Online</span>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        {/* SIDEBAR DESLIZANTE */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-[#111113] border-r border-gray-800 transform transition-transform duration-500 ease-in-out pt-20
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)]
        `}>
          <div className="p-8 space-y-4">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Administración</p>
            <button
              onClick={() => { setActiveModal("createUser"); setSidebarOpen(false); }}
              className="w-full flex items-center gap-4 px-6 py-4 bg-yellow-500 text-black rounded-2xl font-black transition-all hover:scale-[1.02] shadow-lg shadow-yellow-500/10"
            >
              <FiUserPlus size={20} /> CREAR USER
            </button>
            <button
              onClick={() => { refetch(); showNotification("Sincronizado"); setSidebarOpen(false); }}
              className="w-full flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-white hover:bg-gray-800 rounded-2xl transition-all font-bold"
            >
              <FiRefreshCw size={20} /> ACTUALIZAR
            </button>
          </div>
        </aside>

        {/* OVERLAY PARA MÓVIL */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 lg:p-10 w-full">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-[#111113] p-6 rounded-[2rem] border border-gray-800">
              <FiUsers className="text-yellow-500 mb-2" size={20} />
              <p className="text-2xl font-black text-white">{filteredUsers.length}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Total Jugadores</p>
            </div>
            <div className="bg-[#111113] p-6 rounded-[2rem] border border-gray-800">
              <FiDollarSign className="text-green-500 mb-2" size={20} />
              <p className="text-2xl font-black text-white">{filteredUsers.reduce((s, u) => s + (u.credits || 0), 0).toLocaleString()}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Créditos en Red</p>
            </div>
          </div>

          {/* Search Bar & View Toggle */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar jugador por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111113] border border-gray-800 rounded-2xl py-4 pl-14 pr-6 focus:border-yellow-500 outline-none transition-all"
              />
            </div>
            <div className="flex bg-[#111113] p-1.5 rounded-2xl border border-gray-800 self-end md:self-auto">
              <button onClick={() => setViewMode("grid")} className={`p-3 rounded-xl ${viewMode === 'grid' ? 'bg-gray-800 text-yellow-500' : 'text-gray-500'}`}><FiGrid /></button>
              <button onClick={() => setViewMode("list")} className={`p-3 rounded-xl ${viewMode === 'list' ? 'bg-gray-800 text-yellow-500' : 'text-gray-500'}`}><FiList /></button>
            </div>
          </div>

          {/* User List */}
          {isLoading ? (
            <div className="h-64 flex items-center justify-center"><FiRefreshCw className="animate-spin text-yellow-500" size={32} /></div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6" : "space-y-3"}>
              {paginatedUsers.map((user) => (
                <div key={user._id} className={`bg-[#111113] border border-gray-800 rounded-[2rem] p-6 hover:border-yellow-500/40 transition-all group ${viewMode === 'list' ? 'flex items-center justify-between gap-6 py-4' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center text-yellow-500 font-black border border-gray-700">
                      {user.UserName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white leading-none">{user.UserName}</h3>
                      <p className="text-[10px] text-gray-500 font-mono mt-1 italic">{user._id?.slice(-8)}</p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 ${viewMode === 'grid' ? 'my-6 py-3 bg-black/20 rounded-2xl justify-center border border-gray-800/50' : 'px-6'}`}>
                    <FiDollarSign className="text-yellow-500" size={14} />
                    <span className="text-xl font-black text-white">{user.credits || 0}</span>
                  </div>

                  <div className="flex gap-2 justify-center w-full">
                    <button
                      onClick={() => { setSelectedUser(user); setActiveModal("addCredits"); }}
                      className="flex items-center justify-center gap-2 bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white p-3 rounded-xl   transition-all border border-green-600/20"
                    >
                      <FiPlusCircle size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Cargar</span>
                    </button>
                    <button
                      onClick={() => { setSelectedUser(user); setActiveModal("removeCredits"); }}
                      className="flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white p-3 rounded-xl transition-all border border-red-600/20"
                    >
                      <FiMinusCircle size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Quitar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-4">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="w-12 h-12 bg-[#111113] border border-gray-800 rounded-xl flex items-center justify-center text-gray-500 hover:text-yellow-500"><FiChevronLeft size={20} /></button>
              <div className="text-sm font-black text-gray-500 uppercase tracking-widest">{currentPage} / {totalPages}</div>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="w-12 h-12 bg-[#111113] border border-gray-800 rounded-xl flex items-center justify-center text-gray-500 hover:text-yellow-500"><FiChevronRight size={20} /></button>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {activeModal === "createUser" && <CreateUserModal />}
      {activeModal === "addCredits" && <CreditsModal type="add" />}
      {activeModal === "removeCredits" && <CreditsModal type="remove" />}

      {/* Notifications */}
      {notification.show && (
        <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border animate-in slide-in-from-bottom-5 ${notification.type === 'success' ? 'bg-green-600 border-green-400' : 'bg-red-600 border-red-400'} text-white`}>
          {notification.type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
          <span className="font-bold text-sm">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;