import { useState, useEffect } from "react";
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

  FiLogOut,
  FiGrid,
  FiList,
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
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getAlluser,
    staleTime: 30000,
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      showNotification("User created successfully!", "success");
      setActiveModal(null);
    },
    onError: (error) => {
      showNotification(error.response?.data?.message || "Error creating user", "error");
    },
  });

  const addCreditsMutation = useMutation({
    mutationFn: addCredits,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["users"]);
      showNotification(`Added ${data?.amount || data?.data?.amount} credits!`, "success");
      setActiveModal(null);
      setSelectedUser(null);
    },
    onError: (error) => {
      showNotification(error.response?.data?.message || "Error adding credits", "error");
    },
  });

  const removeCreditsMutation = useMutation({
    mutationFn: removeCredits,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["users"]);
      showNotification(`Removed ${data?.amount || data?.data?.amount} credits!`, "success");
      setActiveModal(null);
      setSelectedUser(null);
    },
    onError: (error) => {
      showNotification(error.response?.data?.message || "Error removing credits", "error");
    },
  });

  const filteredUsers = usersData?.data?.filter((user) =>
    user.UserName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Sort users by credits (highest first)
  const sortedUsers = [...paginatedUsers].sort((a, b) => (b.credits || 0) - (a.credits || 0));

  const CreateUserModal = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = (data) => {
      createUserMutation.mutate(data);
      reset();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-md p-6 border border-yellow-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <FiUserPlus className="text-black" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Create New User</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                {...register("UserName", { required: "Username is required" })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Enter username"
              />
              {errors.UserName && (
                <p className="text-red-400 text-sm mt-1">{errors.UserName.message}</p>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={createUserMutation.isPending}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-3 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              >
                {createUserMutation.isPending ? "Creating..." : "Create User"}
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex-1 bg-gray-700 text-gray-300 py-3 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const CreditsModal = ({ type }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
      defaultValues: { UserName: selectedUser?.UserName || "" }
    });

    const onSubmit = (data) => {
      const mutation = type === "add" ? addCreditsMutation : removeCreditsMutation;
      mutation.mutate({ UserName: data.UserName, amount: parseInt(data.amount) });
      reset();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-md p-6 border border-yellow-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${type === "add" ? "bg-green-500" : "bg-red-500"}`}>
              {type === "add" ? <FiPlusCircle className="text-white" size={24} /> : <FiMinusCircle className="text-white" size={24} />}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {type === "add" ? "Add Credits" : "Remove Credits"}
            </h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                {...register("UserName", { required: "Username is required" })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                readOnly={!!selectedUser}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
              <input
                type="number"
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 1, message: "Amount must be positive" }
                })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                placeholder="Enter amount"
              />
              {errors.amount && (
                <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={addCreditsMutation.isPending || removeCreditsMutation.isPending}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 ${type === "add"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500"
                  : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500"
                  }`}
              >
                {type === "add" ? "Add Credits" : "Remove Credits"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setSelectedUser(null);
                }}
                className="flex-1 bg-gray-700 text-gray-300 py-3 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const UserCardGrid = ({ user, index }) => (
    <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 hover:border-yellow-500/50">
      {/* Card Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Top Rank Badge */}
      {index < 3 && (
        <div className="absolute top-3 right-3 z-10">
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-500 text-black' : index === 1 ? 'bg-gray-400 text-black' : 'bg-orange-600 text-white'}`}>
            #{index + 1}
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xl">
              {user.UserName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg">{user.UserName}</h3>
            <p className="text-gray-400 text-xs">ID: {user._id?.slice(-8)}</p>
          </div>
        </div>

        <div className="bg-black/30 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total Credits</span>
            <div className="flex items-center gap-1">
              <FiDollarSign className="text-yellow-500" size={18} />
              <span className="text-2xl font-bold text-yellow-500">{user.credits || 0}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedUser(user);
              setActiveModal("addCredits");
            }}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
          >
            <FiPlusCircle size={16} /> Add
          </button>
          <button
            onClick={() => {
              setSelectedUser(user);
              setActiveModal("removeCredits");
            }}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
          >
            <FiMinusCircle size={16} /> Remove
          </button>
        </div>
      </div>
    </div>
  );

  const UserCardList = ({ user, index }) => (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-yellow-500/50">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
            <span className="text-black font-bold">{user.UserName?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-bold text-white">{user.UserName}</h3>
            <p className="text-gray-400 text-xs">ID: {user._id?.slice(-8)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg">
          <FiDollarSign className="text-yellow-500" size={18} />
          <span className="text-xl font-bold text-yellow-500">{user.credits || 0}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedUser(user);
              setActiveModal("addCredits");
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition flex items-center gap-2"
          >
            <FiPlusCircle size={16} /> Add
          </button>
          <button
            onClick={() => {
              setSelectedUser(user);
              setActiveModal("removeCredits");
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition flex items-center gap-2"
          >
            <FiMinusCircle size={16} /> Remove
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading casino dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-6 py-4 rounded-xl shadow-2xl animate-slide-in ${notification.type === "success"
          ? "bg-gradient-to-r from-green-500 to-green-600"
          : "bg-gradient-to-r from-red-500 to-red-600"
          } text-white`}>
          {notification.type === "success" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black p-3 rounded-xl shadow-xl"
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition duration-300 ease-in-out
        z-40 w-72 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl
      `}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-yellow-500 rounded-xl">
             hoola
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Casino Admin</h1>
              <p className="text-yellow-500 text-xs">Premium Dashboard</p>
            </div>
          </div>

          <nav className="space-y-3">
            <button
              onClick={() => setActiveModal("createUser")}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-yellow-500/20 rounded-xl transition-all duration-200 group"
            >
              <FiUserPlus className="text-yellow-500" size={20} />
              <span className="font-medium">Create User</span>
            </button>
            <button
              onClick={() => {
                refetch();
                showNotification("Refreshing users...", "success");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-yellow-500/20 rounded-xl transition-all duration-200 group"
            >
              <FiRefreshCw className="text-yellow-500" size={20} />
              <span className="font-medium">Refresh</span>
            </button>
            <div className="pt-6 mt-6 border-t border-gray-700">
              <div className="px-4 py-3">
                <p className="text-gray-500 text-xs">Total Users Managed</p>
                <p className="text-2xl font-bold text-white">{filteredUsers.length}</p>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72 p-4 lg:p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <FiUsers className="text-yellow-500" size={24} />
                <span className="text-xs text-gray-400">Total Users</span>
              </div>
              <p className="text-3xl font-bold text-white">{filteredUsers.length}</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <FiDollarSign className="text-yellow-500" size={24} />
                <span className="text-xs text-gray-400">Total Credits</span>
              </div>
              <p className="text-3xl font-bold text-yellow-500">
                {filteredUsers.reduce((sum, user) => sum + (user.credits || 0), 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <FiTrendingUp className="text-yellow-500" size={24} />
                <span className="text-xs text-gray-400">Average Credits</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {filteredUsers.length > 0
                  ? Math.round(filteredUsers.reduce((sum, user) => sum + (user.credits || 0), 0) / filteredUsers.length).toLocaleString()
                  : 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <FiAward className="text-yellow-500" size={24} />
                <span className="text-xs text-gray-400">Top Player</span>
              </div>
              <p className="text-lg font-bold text-white truncate">
                {sortedUsers[0]?.UserName || "N/A"}
              </p>
              <p className="text-yellow-500 text-sm">{sortedUsers[0]?.credits || 0} credits</p>
            </div>
          </div>

          {/* Search and View Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search players by username..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all duration-200 ${viewMode === "grid"
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
              >
                <FiGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all duration-200 ${viewMode === "list"
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
              >
                <FiList size={20} />
              </button>
            </div>
          </div>

          {/* Users Grid/List */}
          {sortedUsers.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedUsers.map((user, idx) => (
                  <UserCardGrid key={user._id} user={user} index={idx} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedUsers.map((user, idx) => (
                  <UserCardList key={user._id} user={user} index={idx} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-20 bg-gray-800/50 rounded-2xl">
              <FiUsers className="mx-auto text-gray-600" size={64} />
              <p className="text-gray-400 mt-4 text-lg">No players found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition text-white font-medium"
              >
                Previous
              </button>
              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg transition font-medium ${currentPage === pageNum
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition text-white font-medium"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {activeModal === "createUser" && <CreateUserModal />}
      {activeModal === "addCredits" && <CreditsModal type="add" />}
      {activeModal === "removeCredits" && <CreditsModal type="remove" />}
    </div>
  );
};

export default AdminDashboard;