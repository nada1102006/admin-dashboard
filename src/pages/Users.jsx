// import {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   useMemo,
//   useEffect,
//   useRef,
// } from "react";
// import api from "../api/api";
// import { toast } from "react-toastify";
// import {
//   Users as UsersIcon,
//   Shield,
//   UserCheck,
//   BadgeCheck,
//   Search,
//   Pencil,
//   ShieldCheck,
//   Trash2,
//   Loader2,
//   X,
//   ChevronDown,
//   Plus,
//   UserPlus,
// } from "lucide-react";
// import { UsersSkeleton } from "../components/Skeleton/UsersSkeleton/UsersSkeleton";
// import useTheme from "../components/customHook/useTheme";
// import { LuLoaderCircle } from "react-icons/lu";
// import Pagination from "../components/Pagination/Pagination"; 

// const UsersContext = createContext();

// const ENDPOINTS = ["/users/all", "/users", "/api/users", "/api/v1/users"];
// const POST_ENDPOINTS = [
//   "/users/add",
//   "/users",
//   "/api/users/add",
//   "/api/v1/users/add",
//   "/api/users",
//   "/api/v1/users",
// ];

// const normalizeUsersResponse = (data) => {
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.users)) return data.users;
//   if (Array.isArray(data?.data)) return data.data;
//   if (Array.isArray(data?.result)) return data.result;
//   const firstArray = Object.values(data || {}).find((v) => Array.isArray(v));
//   return firstArray || [];
// };

// const normalizeCreateUserResponse = (data) => {
//   if (!data) return null;
//   if (data?.user) return data.user;
//   if (data?.data && typeof data.data === "object") return data.data;
//   return data;
// };

// const UsersProvider = ({ children }) => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [actionLoading, setActionLoading] = useState({});

//   const fetchUsers = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     let lastError = null;

//     for (const endpoint of ENDPOINTS) {
//       try {
//         const response = await api.get(endpoint);
//         const data = normalizeUsersResponse(response.data);
//         if (Array.isArray(data)) {
//           setUsers(data);
//           setLoading(false);
//           return;
//         }
//       } catch (err) {
//         lastError = err;
//         console.error(`Failed ${endpoint}:`, err.response?.status, err.message);
//       }
//     }

//     setUsers([]);
//     setLoading(false);

//     if (lastError?.response?.status === 401) {
//       setError("Please log in again to access the users list.");
//       toast.error("Please log in again to access the users list.");
//     } else {
//       setError("Unable to load users from the API right now.");
//       toast.error("Unable to load users from the API right now.");
//     }
//   }, []);

//   const addUser = useCallback(async (userData) => {
//     const requestBody = {
//       ...userData,
//       username: userData.username,
//       name: userData.username,
//     };
//     let lastError = null;

//     for (const endpoint of POST_ENDPOINTS) {
//       try {
//         const response = await api.post(endpoint, requestBody);
//         const newUser = normalizeCreateUserResponse(response.data);
//         if (newUser && typeof newUser === "object") {
//           setUsers((prev) => [newUser, ...prev]);
//           toast.success("User created successfully");
//           return { success: true, data: newUser };
//         }
//       } catch (err) {
//         lastError = err;
//         if (err.response?.status === 404) continue;
//         break;
//       }
//     }

//     const serverMessage =
//       lastError?.response?.data?.message ||
//       lastError?.response?.data?.error ||
//       lastError?.message ||
//       "Failed to create user";

//     toast.error(serverMessage);
//     return { success: false, message: serverMessage };
//   }, []);

//   const deleteUser = useCallback(async (userId) => {
//     setActionLoading((prev) => ({ ...prev, [userId]: "delete" }));
//     try {
//       try {
//         await api.delete(`/users/${userId}`);
//       } catch (err) {
//         console.log("API delete failed, using local delete");
//       }
//       setUsers((prev) => prev.filter((u) => u._id !== userId));
//       toast.success("User deleted successfully");
//       return { success: true };
//     } catch (err) {
//       const message = "Failed to delete user";
//       toast.error(message);
//       return { success: false, message };
//     } finally {
//       setActionLoading((prev) => ({ ...prev, [userId]: null }));
//     }
//   }, []);

//   const verifyUser = useCallback(async (userId) => {
//     setActionLoading((prev) => ({ ...prev, [userId]: "verify" }));
//     try {
//       try {
//         await api.patch(`/users/${userId}/verify`);
//       } catch (err) {
//         console.log("API verify failed, using local toggle");
//       }
//       setUsers((prev) =>
//         prev.map((u) =>
//           u._id === userId ? { ...u, isVerified: !u.isVerified } : u,
//         ),
//       );
//       toast.success("User status updated");
//       return { success: true };
//     } catch (err) {
//       const message = "Failed to update user";
//       toast.error(message);
//       return { success: false, message };
//     } finally {
//       setActionLoading((prev) => ({ ...prev, [userId]: null }));
//     }
//   }, []);

//   const updateUserRole = useCallback(async (userId, role) => {
//     setActionLoading((prev) => ({ ...prev, [userId]: "role" }));
//     try {
//       try {
//         await api.patch(`/users/${userId}`, { role });
//       } catch (err) {
//         console.log("API role update failed, using local update");
//       }
//       setUsers((prev) =>
//         prev.map((u) => (u._id === userId ? { ...u, role } : u)),
//       );
//       toast.success("Role updated");
//       return { success: true };
//     } catch (err) {
//       const message = "Failed to update user";
//       toast.error(message);
//       return { success: false, message };
//     } finally {
//       setActionLoading((prev) => ({ ...prev, [userId]: null }));
//     }
//   }, []);

//   const updateUser = useCallback(async (userId, userData) => {
//     try {
//       try {
//         await api.patch(`/users/${userId}`, userData);
//       } catch (err) {
//         console.log("API update failed, using local update");
//       }
//       setUsers((prev) =>
//         prev.map((u) => (u._id === userId ? { ...u, ...userData } : u)),
//       );
//       toast.success("User updated successfully");
//       return { success: true };
//     } catch (err) {
//       const message = err.response?.data?.message || "Failed to update user";
//       toast.error(message);
//       return { success: false, message };
//     }
//   }, []);

//   const stats = useMemo(
//     () => ({
//       totalUsers: users.length,
//       admins: users.filter((u) => u.role?.toLowerCase() === "admin").length,
//       customers: users.filter((u) => u.role?.toLowerCase() === "customer")
//         .length,
//       verified: users.filter((u) => u.isVerified || u.verified).length,
//     }),
//     [users],
//   );

//   const value = {
//     users,
//     stats,
//     loading,
//     error,
//     actionLoading,
//     fetchUsers,
//     addUser,
//     deleteUser,
//     verifyUser,
//     updateUserRole,
//     updateUser,
//   };

//   return (
//     <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
//   );
// };

// const useUsers = () => {
//   const context = useContext(UsersContext);
//   if (!context) {
//     throw new Error("useUsers must be used within a UsersProvider");
//   }
//   return context;
// };

// const EditUserModal = ({ user, onClose, onSave }) => {
//   const [formData, setFormData] = useState({
//     username: "",
//     phone: "",
//     avatar: "",
//   });
//   const [saving, setSaving] = useState(false);
//   const [formError, setFormError] = useState("");

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         username: user.name || user.username || "",
//         phone: user.phone || "",
//         avatar: user.avatar || "",
//       });
//       setFormError("");
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     setFormError("");
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.username.trim()) {
//       setFormError("Username is required");
//       return;
//     }
//     setSaving(true);
//     const result = await onSave(user._id, {
//       name: formData.username,
//       phone: formData.phone,
//       avatar: formData.avatar,
//     });
//     setSaving(false);
//     if (result.success) {
//       onClose();
//     } else {
//       setFormError(result.message || "Failed to update user");
//     }
//   };

//   if (!user) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-center z-50 backdrop-blur-sm p-4 overflow-y-auto"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-3xl p-6 w-full max-w-md mx-auto my-auto shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-bold text-slate-800 dark:text-white">
//             Edit User
//           </h3>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 cursor-pointer rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           {formError && (
//             <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:border-red-800/50">
//               {formError}
//             </div>
//           )}

//           <div className="mb-4">
//             <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">
//               USERNAME
//             </label>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">
//               PHONE
//             </label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">
//               AVATAR URL
//             </label>
//             <input
//               type="url"
//               name="avatar"
//               value={formData.avatar}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={saving}
//             className="w-full py-3.5 cursor-pointer bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-lg shadow-cyan-500/20"
//           >
//             {saving ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               "Save Changes"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon: Icon, color }) => (
//   <div className="bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-2xl p-5 flex items-center justify-between shadow-lg border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//     <div>
//       <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
//         {title}
//       </p>
//       <p className="text-3xl font-bold text-slate-800 dark:text-white">
//         {value}
//       </p>
//     </div>
//     <div
//       className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
//     >
//       <Icon className="w-6 h-6 text-white" />
//     </div>
//   </div>
// );

// const RoleBadge = ({ role }) => {
//   const styles =
//     role === "admin"
//       ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
//       : "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400";
//   return (
//     <span
//       className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles}`}
//     >
//       {role}
//     </span>
//   );
// };

// const VerifiedBadge = ({ isVerified }) => {
//   if (isVerified) {
//     return (
//       <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
//         <BadgeCheck className="w-4 h-4" />
//         Verified
//       </span>
//     );
//   }
//   return (
//     <span className="flex items-center gap-1 text-rose-500 dark:text-rose-400 text-sm font-medium">
//       <X className="w-4 h-4" />
//       No
//     </span>
//   );
// };

// const MobileUserCard = ({
//   user,
//   onEdit,
//   onToggleRole,
//   onDelete,
//   actionLoading,
// }) => (
//   <div className="rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-5 shadow-lg mb-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//     <div className="flex items-start gap-4">
//       <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
//         {user.avatar ? (
//           <img
//             src={user.avatar}
//             alt={user.name}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <svg
//             className="w-6 h-6 text-slate-400 dark:text-slate-500"
//             fill="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//           </svg>
//         )}
//       </div>
//       <div className="flex-1">
//         <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <p className="font-semibold text-slate-800 dark:text-white">
//               {user.name}
//             </p>
//             <p className="text-slate-500 dark:text-slate-400 text-sm">
//               {user.email}
//             </p>
//           </div>
//           <div className="flex gap-2 text-right">
//             <RoleBadge role={user.role} />
//           </div>
//         </div>
//         <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
//           <div className="rounded-2xl bg-white/70 dark:bg-slate-800/50 px-3 py-2 border border-slate-200/50 dark:border-slate-700/50">
//             <span className="block text-xs text-slate-400 dark:text-slate-500">
//               Verified
//             </span>
//             <VerifiedBadge isVerified={user.isVerified} />
//           </div>
//           <div className="rounded-2xl bg-white/70 dark:bg-slate-800/50 px-3 py-2 border border-slate-200/50 dark:border-slate-700/50">
//             <span className="block text-xs text-slate-400 dark:text-slate-500">
//               Role
//             </span>
//             <span className="mt-1 inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
//               {user.role || "customer"}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div className="mt-4 flex flex-wrap gap-2">
//       <button
//         type="button"
//         onClick={() => onEdit(user)}
//         className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition backdrop-blur-sm"
//       >
//         <Pencil className="w-4 h-4" /> Edit
//       </button>
//       <button
//         type="button"
//         onClick={() => onToggleRole(user)}
//         className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-2 text-sm text-white hover:from-emerald-600 hover:to-green-600 transition disabled:opacity-60 shadow-lg shadow-emerald-500/20"
//         disabled={actionLoading[user._id] === "role"}
//       >
//         {actionLoading[user._id] === "role" ? (
//           <Loader2 className="w-4 h-4 animate-spin" />
//         ) : (
//           <ShieldCheck className="w-4 h-4" />
//         )}
//         {user.role === "admin" ? "Demote" : "Promote"}
//       </button>
//       <button
//         type="button"
//         onClick={() => onDelete(user)}
//         className="inline-flex items-center cursor-pointer justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 px-3 py-2 text-sm text-white hover:from-rose-600 hover:to-red-600 transition disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-lg shadow-rose-500/20"
//         disabled={actionLoading[user._id] === "delete"}
//       >
//         {actionLoading[user._id] === "delete" ? (
//           <Loader2 className="w-4 h-4 animate-spin" />
//         ) : (
//           <Trash2 className="w-4 h-4" />
//         )}
//         Delete
//       </button>
//     </div>
//   </div>
// );

// const ActionButton = ({ icon: Icon, color, onClick, title }) => (
//   <button
//     onClick={onClick}
//     title={title}
//     className={`w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center transition-all hover:scale-105 ${color}`}
//   >
//     <Icon className="w-4 h-4 text-white" />
//   </button>
// );

// const DeleteModal = ({ user, onConfirm, onCancel, deleting }) => (
//   <div 
//     className="fixed inset-0 bg-slate-50/30 dark:bg-slate-900/30 flex items-center justify-center z-50 backdrop-blur-sm p-4 overflow-y-auto"
//     onClick={(e) => e.target === e.currentTarget && onCancel()}
//   >
//     <div className="bg-gradient-to-br from-white to-sky-200 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-2xl p-6 w-full max-w-md mx-auto my-auto shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
//       <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
//         Delete User
//       </h3>
//       <p className="text-slate-600 dark:text-slate-300 mb-6">
//         Are you sure you want to delete <strong>{user?.name}</strong>? This
//         action cannot be undone.
//       </p>
//       <div className="flex gap-3 justify-end">
//         <button
//           onClick={onCancel}
//           className="px-6 py-2.5 text-sm font-bold rounded-lg cursor-pointer text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:hover:border-slate-600 transition-all duration-200 shadow-sm hover:shadow"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={onConfirm}
//           disabled={deleting}
//           className="px-4 py-2 rounded-lg cursor-pointer bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 transition-colors flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-lg shadow-rose-500/20"
//         >
//           {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
//           Delete
//         </button>
//       </div>
//     </div>
//   </div>
// );

// const AddUserForm = ({ onClose, onSubmit }) => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     phone: "",
//     role: "customer",
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [formError, setFormError] = useState("");
//   const nameInputRef = useRef(null);

//   useEffect(() => {
//     nameInputRef.current?.focus();
//   }, []);

//   const handleChange = (e) => {
//     setFormError("");
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.username || !formData.email || !formData.password) {
//       setFormError("Username, email and password are required.");
//       return;
//     }
//     setSubmitting(true);
//     setFormError("");
//     const result = await onSubmit(formData);
//     setSubmitting(false);
//     if (result.success) {
//       onClose();
//       setFormData({
//         username: "",
//         email: "",
//         password: "",
//         phone: "",
//         role: "customer",
//       });
//     } else {
//       setFormError(
//         result.message || "Unable to create user. Please try again.",
//       );
//     }
//   };

//   return (
//     <div className="bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 mb-8 overflow-hidden transition-all duration-300 hover:shadow-xl">
//       <div className="bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
//             <UserPlus className="w-5 h-5 text-white" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-white">Create New User</h3>
//             <p className="text-xs text-white/80">
//               Fill in the details below to add a new user
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={onClose}
//           className="text-white/80 hover:text-white transition-colors cursor-pointer"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       </div>
//       <form onSubmit={handleSubmit} className="p-6">
//         {formError && (
//           <div className="mb-4 rounded-xl border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">
//             {formError}
//           </div>
//         )}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//           <div>
//             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
//               USERNAME <span className="text-rose-500">*</span>
//             </label>
//             <input
//               ref={nameInputRef}
//               type="text"
//               name="username"
//               placeholder="e.g. john_doe"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
//               EMAIL <span className="text-rose-500">*</span>
//             </label>
//             <input
//               type="email"
//               name="email"
//               placeholder="e.g. john@email.com"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
//               PASSWORD <span className="text-rose-500">*</span>
//             </label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Min. 6 characters"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               minLength={6}
//               className="w-full px-4 py-2.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
//               PHONE
//             </label>
//             <input
//               type="tel"
//               name="phone"
//               placeholder="e.g. +1 234 567 890"
//               value={formData.phone}
//               onChange={handleChange}
//               className="w-full px-4 py-2.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white"
//             />
//           </div>
//         </div>
//         <div className="flex items-center justify-between">
//           <p className="text-xs text-slate-400 dark:text-slate-500">
//             <span className="text-rose-500">*</span> Required fields
//           </p>
//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={() =>
//                 setFormData({
//                   username: "",
//                   email: "",
//                   password: "",
//                   phone: "",
//                   role: "customer",
//                 })
//               }
//               className="px-6 py-2.5 text-sm font-bold rounded-lg cursor-pointer text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:hover:border-slate-600 transition-all duration-200 shadow-sm hover:shadow"
//             >
//               Clear
//             </button>
//             <button
//               type="submit"
//               disabled={submitting}
//               className="px-5 py-2.5 cursor-pointer text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-sky-500 rounded-xl hover:from-cyan-600 hover:to-sky-600 transition-colors flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-lg shadow-cyan-500/20"
//             >
//               {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
//               <UserPlus className="w-4 h-4" />
//               Create User
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// const Users = () => {
//   const {
//     users,
//     stats,
//     loading,
//     error,
//     fetchUsers,
//     deleteUser,
//     verifyUser,
//     updateUserRole,
//     addUser,
//     updateUser,
//   } = useUsers();
//   const { isDarkMode } = useTheme();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [userToDelete, setUserToDelete] = useState(null);
//   const [deleting, setDeleting] = useState(false);
//   const [actionLoading, setActionLoading] = useState({});
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [userToEdit, setUserToEdit] = useState(null);

//   // ====== Pagination States ======
//   const [currentPage, setCurrentPage] = useState(1);
//   const usersPerPage = 10; // عدد المستخدمين في كل صفحة

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   // ====== Filter Users ======
//   const filteredUsers = users.filter(
//     (user) =>
//       user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   // ====== Pagination Logic ======
//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
//   // التأكد أن الصفحة الحالية صحيحة
//   useEffect(() => {
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(totalPages);
//     } else if (totalPages === 0) {
//       setCurrentPage(1);
//     }
//   }, [totalPages, currentPage]);

//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

//   // ====== Pagination Functions ======
//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // ====== Reset to page 1 when search changes ======
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery]);

//   const handleDeleteClick = (user) => {
//     setUserToDelete(user);
//     setDeleteModalOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!userToDelete) return;
//     setDeleting(true);
//     const result = await deleteUser(userToDelete._id);
//     setDeleting(false);
//     if (result.success) {
//       setDeleteModalOpen(false);
//       setUserToDelete(null);
//     } else {
//       alert(result.message);
//     }
//   };

//   const handleToggleRole = async (user) => {
//     const newRole = user.role === "admin" ? "customer" : "admin";
//     setActionLoading((prev) => ({ ...prev, [user._id]: "role" }));
//     const result = await updateUserRole(user._id, newRole);
//     setActionLoading((prev) => ({ ...prev, [user._id]: null }));
//     if (!result.success) alert(result.message);
//   };

//   const handleEdit = (user) => {
//     setUserToEdit(user);
//     setEditModalOpen(true);
//   };

//   const handleCloseEdit = () => {
//     setEditModalOpen(false);
//     setUserToEdit(null);
//   };

//   if (loading) {
//     const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
//     const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

//     return (
//       <UsersSkeleton
//         baseColor={skeletonBaseColor}
//         highlightColor={skeletonHighlightColor}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
//       <div className="mx-auto max-w-7xl slide-up py-8 px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
//           <div>
//             <p className="text-cyan-500 dark:text-cyan-400 text-xs font-bold tracking-widest uppercase mb-1">
//               User Management
//             </p>
//             <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
//               Manage Users
//             </h2>
//           </div>
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//             <div className="relative w-full sm:w-80">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
//               <input
//                 type="text"
//                 placeholder="Search users..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 pr-4 py-3 w-full bg-white/70 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white backdrop-blur-sm"
//               />
//             </div>
//             <button
//               onClick={() => setShowAddForm(!showAddForm)}
//               className="inline-flex cursor-pointer items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-2xl text-sm font-medium hover:from-cyan-600 hover:to-sky-600 transition-colors shadow-lg shadow-cyan-500/20"
//             >
//               <Plus className="w-4 h-4" />
//               Add User
//               <ChevronDown
//                 className={`w-3 h-3 transition-transform ${showAddForm ? "rotate-180" : ""}`}
//               />
//             </button>
//           </div>
//         </div>

//         {/* Add User Form */}
//         {showAddForm && (
//           <AddUserForm
//             onClose={() => setShowAddForm(false)}
//             onSubmit={addUser}
//           />
//         )}

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
//           <StatCard
//             title="Total Users"
//             value={stats.totalUsers}
//             icon={UsersIcon}
//             color="bg-gradient-to-r from-cyan-500 to-sky-500"
//           />
//           <StatCard
//             title="Admins"
//             value={stats.admins}
//             icon={Shield}
//             color="bg-gradient-to-r from-purple-500 to-violet-500"
//           />
//           <StatCard
//             title="Customers"
//             value={stats.customers}
//             icon={UsersIcon}
//             color="bg-gradient-to-r from-emerald-500 to-green-500"
//           />
//           <StatCard
//             title="Verified"
//             value={stats.verified}
//             icon={UserCheck}
//             color="bg-gradient-to-r from-sky-500 to-blue-500"
//           />
//         </div>

//         {/* Error State */}
//         {error && !loading && (
//           <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl p-6 text-center">
//             <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>
//             <button
//               disabled={loading}
//               onClick={fetchUsers}
//               className="px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 select-none cursor-pointer bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
//             >
//               {loading ? (
//                 <div className="flex gap-2 items-center justify-center">
//                   <LuLoaderCircle className="animate-spin text-lg" />
//                   <span>Try...</span>
//                 </div>
//               ) : (
//                 <span>Try Again</span>
//               )}
//             </button>
//           </div>
//         )}

//         {/* Users Table */}
//         {!error && (
//           <div className="space-y-4">
//             <div className="hidden lg:block bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
//                       <th className="text-left text-sm font-medium text-slate-500 dark:text-slate-400 px-6 py-4">
//                         User
//                       </th>
//                       <th className="text-left text-sm font-medium text-slate-500 dark:text-slate-400 px-6 py-4">
//                         Role
//                       </th>
//                       <th className="text-left text-sm font-medium text-slate-500 dark:text-slate-400 px-6 py-4">
//                         Verified
//                       </th>
//                       <th className="text-left text-sm font-medium text-slate-500 dark:text-slate-400 px-6 py-4">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentUsers.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={4}
//                           className="text-center py-12 text-slate-400 dark:text-slate-500"
//                         >
//                           {searchQuery
//                             ? "No users match your search."
//                             : "No users found."}
//                         </td>
//                       </tr>
//                     ) : (
//                       currentUsers.map((user) => (
//                         <tr
//                           key={user._id}
//                           className="border-b border-slate-100/50 dark:border-slate-700/30 transition-all duration-300 hover:bg-gradient-to-r hover:from-sky-50/80 hover:via-blue-50/60 hover:to-transparent dark:hover:from-sky-950/40 dark:hover:via-blue-950/30 dark:hover:to-transparent hover:shadow-md cursor-default"
//                         >
//                           <td className="px-6 py-4">
//                             <div className="flex items-center gap-3">
//                               <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
//                                 {user.avatar ? (
//                                   <img
//                                     src={user.avatar}
//                                     alt={user.name}
//                                     className="w-full h-full object-cover"
//                                   />
//                                 ) : (
//                                   <svg
//                                     className="w-5 h-5 text-slate-400 dark:text-slate-500"
//                                     fill="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//                                   </svg>
//                                 )}
//                               </div>
//                               <div>
//                                 <p className="font-semibold text-slate-800 dark:text-white text-sm">
//                                   {user.name}
//                                 </p>
//                                 <p className="text-slate-500 dark:text-slate-400 text-xs">
//                                   {user.email}
//                                 </p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <RoleBadge role={user.role} />
//                           </td>
//                           <td className="px-6 py-4">
//                             <VerifiedBadge isVerified={user.isVerified} />
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="flex items-center gap-2">
//                               <ActionButton
//                                 icon={Pencil}
//                                 color="bg-blue-500 hover:bg-blue-600"
//                                 onClick={() => handleEdit(user)}
//                                 title="Edit"
//                               />
//                               <ActionButton
//                                 icon={
//                                   actionLoading[user._id] === "role"
//                                     ? Loader2
//                                     : ShieldCheck
//                                 }
//                                 color={`${user.role === "admin" ? "bg-purple-500 hover:bg-purple-600" : "bg-emerald-500 hover:bg-emerald-600"} ${actionLoading[user._id] === "role" ? "animate-spin" : ""}`}
//                                 onClick={() => handleToggleRole(user)}
//                                 title={
//                                   user.role === "admin"
//                                     ? "Demote to Customer"
//                                     : "Promote to Admin"
//                                 }
//                               />
//                               <ActionButton
//                                 icon={
//                                   actionLoading[user._id] === "delete"
//                                     ? Loader2
//                                     : Trash2
//                                 }
//                                 color="bg-red-500 hover:bg-red-600"
//                                 onClick={() => handleDeleteClick(user)}
//                                 title="Delete"
//                               />
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               {/* ====== Pagination ====== */}
//               {filteredUsers.length > usersPerPage && (
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   goToPage={goToPage}
//                   nextPage={nextPage}
//                   prevPage={prevPage}
//                 />
//               )}
//             </div>

//             {/* Mobile View */}
//             <div className="lg:hidden">
//               {currentUsers.length === 0 ? (
//                 <div className="rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-8 text-center text-slate-400 dark:text-slate-500">
//                   {searchQuery
//                     ? "No users match your search."
//                     : "No users found."}
//                 </div>
//               ) : (
//                 currentUsers.map((user) => (
//                   <MobileUserCard
//                     key={user._id}
//                     user={user}
//                     onEdit={handleEdit}
//                     onToggleRole={handleToggleRole}
//                     onDelete={handleDeleteClick}
//                     actionLoading={actionLoading}
//                   />
//                 ))
//               )}
//               {/* ====== Pagination for Mobile ====== */}
//               {filteredUsers.length > usersPerPage && (
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   goToPage={goToPage}
//                   nextPage={nextPage}
//                   prevPage={prevPage}
//                 />
//               )}
//             </div>
//           </div>
//         )}

//         {/* Modals */}
//         {deleteModalOpen && userToDelete && (
//           <DeleteModal
//             user={userToDelete}
//             onConfirm={handleConfirmDelete}
//             onCancel={() => {
//               setDeleteModalOpen(false);
//               setUserToDelete(null);
//             }}
//             deleting={deleting}
//           />
//         )}

//         {editModalOpen && (
//           <EditUserModal
//             user={userToEdit}
//             onClose={handleCloseEdit}
//             onSave={updateUser}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// const UsersWithProvider = () => (
//   <UsersProvider>
//     <Users />
//   </UsersProvider>
// );

// export default UsersWithProvider;











import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import { useLanguage } from "../Context/LanguageContext";
import {
  Users as UsersIcon,
  Shield,
  UserCheck,
  BadgeCheck,
  Search,
  Pencil,
  ShieldCheck,
  Trash2,
  Loader2,
  X,
  ChevronDown,
  Plus,
  UserPlus,
} from "lucide-react";
import { UsersSkeleton } from "../components/Skeleton/UsersSkeleton/UsersSkeleton";
import useTheme from "../components/customHook/useTheme";
import { LuLoaderCircle } from "react-icons/lu";
import Pagination from "../components/Pagination/Pagination"; 

const UsersContext = createContext();

const ENDPOINTS = ["/users/all", "/users", "/api/users", "/api/v1/users"];
const POST_ENDPOINTS = [
  "/users/add",
  "/users",
  "/api/users/add",
  "/api/v1/users/add",
  "/api/users",
  "/api/v1/users",
];

const normalizeUsersResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  const firstArray = Object.values(data || {}).find((v) => Array.isArray(v));
  return firstArray || [];
};

const normalizeCreateUserResponse = (data) => {
  if (!data) return null;
  if (data?.user) return data.user;
  if (data?.data && typeof data.data === "object") return data.data;
  return data;
};

const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    let lastError = null;

    for (const endpoint of ENDPOINTS) {
      try {
        const response = await api.get(endpoint);
        const data = normalizeUsersResponse(response.data);
        if (Array.isArray(data)) {
          setUsers(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        lastError = err;
        console.error(`Failed ${endpoint}:`, err.response?.status, err.message);
      }
    }

    setUsers([]);
    setLoading(false);

    if (lastError?.response?.status === 401) {
      setError("Please log in again to access the users list.");
      toast.error("Please log in again to access the users list.");
    } else {
      setError("Unable to load users from the API right now.");
      toast.error("Unable to load users from the API right now.");
    }
  }, []);

  const addUser = useCallback(async (userData) => {
    const requestBody = {
      ...userData,
      username: userData.username,
      name: userData.username,
    };
    let lastError = null;

    for (const endpoint of POST_ENDPOINTS) {
      try {
        const response = await api.post(endpoint, requestBody);
        const newUser = normalizeCreateUserResponse(response.data);
        if (newUser && typeof newUser === "object") {
          setUsers((prev) => [newUser, ...prev]);
          toast.success("Registration successful");
          return { success: true, data: newUser };
        }
      } catch (err) {
        lastError = err;
        if (err.response?.status === 404) continue;
        break;
      }
    }

    const serverMessage =
      lastError?.response?.data?.message ||
      lastError?.response?.data?.error ||
      lastError?.message ||
      "Failed to create user";

    toast.error(serverMessage);
    return { success: false, message: serverMessage };
  }, []);

  const deleteUser = useCallback(async (userId) => {
    setActionLoading((prev) => ({ ...prev, [userId]: "delete" }));
    try {
      try {
        await api.delete(`/users/${userId}`);
      } catch (err) {
        console.log("API delete failed, using local delete");
      }
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.info("User deleted successfully"); 
      return { success: true };
    } catch (err) {
      const message = "Failed to delete user";
      toast.error(message);
      return { success: false, message };
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  }, []);

  const verifyUser = useCallback(async (userId) => {
    setActionLoading((prev) => ({ ...prev, [userId]: "verify" }));
    try {
      try {
        await api.patch(`/users/${userId}/verify`);
      } catch (err) {
        console.log("API verify failed, using local toggle");
      }
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isVerified: !u.isVerified } : u,
        ),
      );
      toast.info("User status updated");
      return { success: true };
    } catch (err) {
      const message = "Failed to update user";
      toast.error(message);
      return { success: false, message };
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  }, []);

  const updateUserRole = useCallback(async (userId, role) => {
    setActionLoading((prev) => ({ ...prev, [userId]: "role" }));
    try {
      try {
        await api.patch(`/users/${userId}`, { role });
      } catch (err) {
        console.log("API role update failed, using local update");
      }
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role } : u)),
      );
      toast.info("User role changed successfully"); 
      return { success: true };
    } catch (err) {
      const message = "Failed to update user";
      toast.error(message);
      return { success: false, message };
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  }, []);

  const updateUser = useCallback(async (userId, userData) => {
    try {
      try {
        await api.patch(`/users/${userId}`, userData);
      } catch (err) {
        console.log("API update failed, using local update");
      }
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, ...userData } : u)),
      );
      toast.success("Edited successfully"); 
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update user";
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      admins: users.filter((u) => u.role?.toLowerCase() === "admin").length,
      customers: users.filter((u) => u.role?.toLowerCase() === "customer")
        .length,
      verified: users.filter((u) => u.isVerified || u.verified).length,
    }),
    [users],
  );

  const value = {
    users,
    stats,
    loading,
    error,
    actionLoading,
    fetchUsers,
    addUser,
    deleteUser,
    verifyUser,
    updateUserRole,
    updateUser,
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};

const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};

const EditUserModal = ({ user, onClose, onSave }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    avatar: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.name || user.username || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
      setFormError("");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setFormError(t("users.usernameRequired"));
      return;
    }
    setSaving(true);
    const result = await onSave(user._id, {
      name: formData.username,
      phone: formData.phone,
      avatar: formData.avatar,
    });
    setSaving(false);
    
    if (result.success) {
      onClose(); 
    } else {
      setFormError(result.message || t("users.updateFail"));
    }
  };

  if (!user) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[100] backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-3xl p-6 w-full max-w-md mx-auto my-auto shadow-2xl border border-slate-200/50 dark:border-slate-700/50 max-h-[90vh] overflow-y-auto relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            {t("users.editUser")}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 cursor-pointer rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:border-red-800/50">
              {formError}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">
              {t("users.username")}
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">
              {t("users.phone")}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">
              {t("users.avatarUrl")}
            </label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 cursor-pointer bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-lg shadow-cyan-500/20"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("users.savingBtn")}
              </>
            ) : (
              t("users.saveChanges")
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mb-1">
        {title}
      </p>
      <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
        {value}
      </p>
    </div>
    <div
      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${color}`}
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
    </div>
  </div>
);

const RoleBadge = ({ role }) => {
  const { t } = useLanguage();
  const styles =
    role === "admin"
      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      : "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400";
  return (
    <span
      className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium capitalize ${styles}`}
    >
      {role === "admin" ? t("users.roles.admin") : t("users.roles.customer")}
    </span>
  );
};

const VerifiedBadge = ({ isVerified }) => {
  const { t } = useLanguage();
  if (isVerified) {
    return (
      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
        <BadgeCheck className="w-4 h-4 shrink-0" />
        {t("users.verified")}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-rose-500 dark:text-rose-400 text-sm font-medium">
      <X className="w-4 h-4 shrink-0" />
      {t("users.no")}
    </span>
  );
};

const ActionButton = ({ icon: Icon, color, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center transition-all hover:scale-105 ${color}`}
  >
    <Icon className="w-4 h-4 text-white" />
  </button>
);

const DeleteModal = ({ user, onConfirm, onCancel, deleting }) => {
  const { t } = useLanguage();
  return createPortal(
    <div 
      className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[100] backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-gradient-to-br from-white to-sky-200 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-2xl p-6 w-full max-w-md mx-auto my-auto shadow-2xl border border-slate-200/50 dark:border-slate-700/50 relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            {t("users.deleteUserTitle")}
          </h3>
          <button
            onClick={onCancel}
            className="w-8 h-8 cursor-pointer rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 mb-6 break-words">
          {t("users.deleteConfirm")} <strong>{user?.name}</strong>{t("users.cannotUndo")}
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold rounded-lg cursor-pointer text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:hover:border-slate-600 transition-all duration-200 shadow-sm hover:shadow"
          >
            {t("users.cancelBtn")}
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg cursor-pointer bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-lg shadow-rose-500/20"
          >
            {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("users.deleteBtn")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const AddUserForm = ({ onClose, onSubmit }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setFormError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setFormError(t("users.requiredFieldsError"));
      return;
    }
    setSubmitting(true);
    setFormError("");
    const result = await onSubmit(formData);
    setSubmitting(false);
    if (result.success) {
      onClose();
      setFormData({
        username: "",
        email: "",
        password: "",
        phone: "",
        role: "customer",
      });
    } else {
      setFormError(
        result.message || t("users.createFail"),
      );
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 mb-8 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="bg-gradient-to-r from-cyan-500 to-sky-500 p-4 sm:px-6 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm sm:text-base">{t("users.createNewUser")}</h3>
            <p className="text-xs text-white/80 hidden sm:block">
              {t("users.fillDetails")}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        {formError && (
          <div className="mb-4 rounded-xl border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">
            {formError}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              {t("users.username")} <span className="text-rose-500">*</span>
            </label>
            <input
              ref={nameInputRef}
              type="text"
              name="username"
              placeholder="e.g. john_doe"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              {t("users.email")} <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. john@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              {t("users.password")} <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder={t("users.minChars")}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              {t("users.phone")}
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g. +1 234 567 890"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white"
            />
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 dark:text-slate-500 order-2 sm:order-1">
            <span className="text-rose-500">*</span> {t("users.requiredFields")}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  username: "",
                  email: "",
                  password: "",
                  phone: "",
                  role: "customer",
                })
              }
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold rounded-lg cursor-pointer text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:hover:border-slate-600 transition-all duration-200 shadow-sm hover:shadow"
            >
              {t("users.clear")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-5 py-2.5 cursor-pointer text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-sky-500 rounded-xl hover:from-cyan-600 hover:to-sky-600 transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-lg shadow-cyan-500/20"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <UserPlus className="w-4 h-4" />
              {t("users.createUserBtn")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
const Users = () => {
  const {
    users,
    stats,
    loading,
    error,
    fetchUsers,
    deleteUser,
    verifyUser,
    updateUserRole,
    addUser,
    updateUser,
  } = useUsers();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    const result = await deleteUser(userToDelete._id);
    setDeleting(false);
    if (result.success) {
      setDeleteModalOpen(false); // Close immediately, toast handles success
      setUserToDelete(null);
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === "admin" ? "customer" : "admin";
    setActionLoading((prev) => ({ ...prev, [user._id]: "role" }));
    const result = await updateUserRole(user._id, newRole);
    setActionLoading((prev) => ({ ...prev, [user._id]: null }));
    if (!result.success) toast.error(result.message);
  };

  const handleEdit = (user) => {
    setUserToEdit(user);
    setEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setUserToEdit(null);
  };

  if (loading) {
    const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
    const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

    return (
      <UsersSkeleton
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl slide-up py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
          <div>
            <p className="text-cyan-500 dark:text-cyan-400 text-xs font-bold tracking-widest uppercase mb-1">
              {t("users.management") || "User Management"}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
              {t("users.title") || "Manage Users"}
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder={t("users.searchPlaceholder") || "Search users..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full bg-white/70 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white backdrop-blur-sm"
              />
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex cursor-pointer items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-2xl text-sm font-medium hover:from-cyan-600 hover:to-sky-600 transition-colors shadow-lg shadow-cyan-500/20 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              {t("users.addUser") || "Add User"}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${showAddForm ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <AddUserForm
            onClose={() => setShowAddForm(false)}
            onSubmit={addUser}
          />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
          <StatCard
            title={t("users.totalUsers") || "Total Users"}
            value={stats.totalUsers}
            icon={UsersIcon}
            color="bg-gradient-to-r from-cyan-500 to-sky-500"
          />
          <StatCard
            title={t("users.admins") || "Admins"}
            value={stats.admins}
            icon={Shield}
            color="bg-gradient-to-r from-purple-500 to-violet-500"
          />
          <StatCard
            title={t("users.customers") || "Customers"}
            value={stats.customers}
            icon={UsersIcon}
            color="bg-gradient-to-r from-emerald-500 to-green-500"
          />
          <StatCard
            title={t("users.verified") || "Verified"}
            value={stats.verified}
            icon={UserCheck}
            color="bg-gradient-to-r from-sky-500 to-blue-500"
          />
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl p-4 sm:p-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-3 text-sm sm:text-base">{error}</p>
            <button
              disabled={loading}
              onClick={fetchUsers}
              className="px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 select-none cursor-pointer bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
            >
              {loading ? (
                <div className="flex gap-2 items-center justify-center">
                  <LuLoaderCircle className="animate-spin text-lg" />
                  <span>Try...</span>
                </div>
              ) : (
                <span>Try Again</span>
              )}
            </button>
          </div>
        )}

        {/* Users Table - Kept as table format on small screens with horizontal scroll */}
        {!error && (
          <div className="space-y-4">
            <div className="block bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                      <th className="text-left text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 px-3 sm:px-6 py-4">
                        {t("users.userCol")}
                      </th>
                      <th className="text-left text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 px-3 sm:px-6 py-4">
                        {t("users.roleCol")}
                      </th>
                      <th className="text-left text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 px-3 sm:px-6 py-4">
                        {t("users.verifiedCol")}
                      </th>
                      <th className="text-left text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 px-3 sm:px-6 py-4">
                        {t("users.actionsCol")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-12 text-slate-400 dark:text-slate-500"
                        >
                          {searchQuery
                            ? t("users.noMatch")
                            : t("users.noUsers")}
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-slate-100/50 dark:border-slate-700/30 transition-all duration-300 hover:bg-gradient-to-r hover:from-sky-50/80 hover:via-blue-50/60 hover:to-transparent dark:hover:from-sky-950/40 dark:hover:via-blue-950/30 dark:hover:to-transparent hover:shadow-md cursor-default"
                        >
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <svg
                                    className="w-5 h-5 text-slate-400 dark:text-slate-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                  </svg>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 dark:text-white text-xs sm:text-sm truncate">
                                  {user.name}
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <RoleBadge role={user.role} />
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <VerifiedBadge isVerified={user.isVerified} />
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2">
                              <ActionButton
                                icon={Pencil}
                                color="bg-blue-500 hover:bg-blue-600"
                                onClick={() => handleEdit(user)}
                                title={t("users.edit")}
                              />
                              <ActionButton
                                icon={actionLoading[user._id] === "role" ? Loader2 : ShieldCheck}
                                color={`${user.role === "admin" ? "bg-purple-500 hover:bg-purple-600" : "bg-emerald-500 hover:bg-emerald-600"} ${actionLoading[user._id] === "role" ? "animate-spin" : ""}`}
                                onClick={() => handleToggleRole(user)}
                                title={user.role === "admin" ? t("users.demote") : t("users.promote")}
                              />
                              <ActionButton
                                icon={actionLoading[user._id] === "delete" ? Loader2 : Trash2}
                                color="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDeleteClick(user)}
                                title={t("users.delete")}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length > usersPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToPage={goToPage}
                  nextPage={nextPage}
                  prevPage={prevPage}
                />
              )}
            </div>
          </div>
        )}

        {/* Modals - Rendered via Portal to appear directly in front of viewport */}
        {deleteModalOpen && userToDelete && (
          <DeleteModal
            user={userToDelete}
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setDeleteModalOpen(false);
              setUserToDelete(null);
            }}
            deleting={deleting}
          />
        )}

        {editModalOpen && (
          <EditUserModal
            user={userToEdit}
            onClose={handleCloseEdit}
            onSave={updateUser}
          />
        )}
      </div>
    </div>
  );
};

const UsersWithProvider = () => (
  <UsersProvider>
    <Users />
  </UsersProvider>
);

export default UsersWithProvider;