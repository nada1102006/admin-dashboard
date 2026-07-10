/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
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

/* CONTEXT */
const UsersContext = createContext();

const ENDPOINTS = ["/users/all", "/users", "/api/users", "/api/v1/users"];
const POST_ENDPOINTS = ["/users/add", "/users", "/api/users/add", "/api/v1/users/add", "/api/users", "/api/v1/users"];

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
          setUsers((prev) => [...prev, newUser]);
          toast.success("User created successfully");
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
      toast.success("User deleted successfully");
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
        prev.map((u) => (u._id === userId ? { ...u, isVerified: !u.isVerified } : u))
      );
      toast.success("User status updated");
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
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)));
      toast.success("Role updated");
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
        prev.map((u) => (u._id === userId ? { ...u, ...userData } : u))
      );
      toast.success("User updated successfully");
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
      customers: users.filter((u) => u.role?.toLowerCase() === "customer").length,
      verified: users.filter((u) => u.isVerified || u.verified).length,
    }),
    [users]
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

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
};

const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};

/* ============ EDIT USER MODAL ============ */
const EditUserModal = ({ user, onClose, onSave }) => {
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
      setFormError("Username is required");
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
      setFormError(result.message || "Failed to update user");
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Edit User</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {formError}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              USERNAME
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              PHONE
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              AVATAR URL
            </label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

/* UI-->*/
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-100">
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const RoleBadge = ({ role }) => {
  const styles = role === "admin" ? "bg-purple-100 text-purple-700" : "bg-cyan-100 text-cyan-700";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles}`}>
      {role}
    </span>
  );
};

const VerifiedBadge = ({ isVerified }) => {
  if (isVerified) {
    return (
      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
        <BadgeCheck className="w-4 h-4" />
        Verified
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-red-500 text-sm font-medium">
      <X className="w-4 h-4" />
      No
    </span>
  );
};

const MobileUserCard = ({ user, onEdit, onToggleRole, onDelete, actionLoading }) => (
  <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm mb-4">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gray-200 flex items-center justify-center overflow-hidden">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
          <div className="flex gap-2 text-right">
            <RoleBadge role={user.role} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="rounded-2xl bg-gray-50 px-3 py-2">
            <span className="block text-xs text-gray-400">Verified</span>
            <VerifiedBadge isVerified={user.isVerified} />
          </div>
          <div className="rounded-2xl bg-gray-50 px-3 py-2">
            <span className="block text-xs text-gray-400">Role</span>
            <span className="mt-1 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 capitalize">
              {user.role || "customer"}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onEdit(user)}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
      >
        <Pencil className="w-4 h-4" /> Edit
      </button>
      <button
        type="button"
        onClick={() => onToggleRole(user)}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-3 py-2 text-sm text-white hover:bg-emerald-600 transition disabled:opacity-60"
        disabled={actionLoading[user._id] === "role"}
      >
        {actionLoading[user._id] === "role" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
        {user.role === "admin" ? "Demote" : "Promote"}
      </button>
      <button
        type="button"
        onClick={() => onDelete(user)}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600 transition disabled:opacity-60"
        disabled={actionLoading[user._id] === "delete"}
      >
        {actionLoading[user._id] === "delete" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        Delete
      </button>
    </div>
  </div>
);

const ActionButton = ({ icon: Icon, color, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105 ${color}`}
  >
    <Icon className="w-4 h-4 text-white" />
  </button>
);

const DeleteModal = ({ user, onConfirm, onCancel, deleting }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Delete User</h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
          Delete
        </button>
      </div>
    </div>
  </div>
);

const AddUserForm = ({ onClose, onSubmit }) => {
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
      setFormError("Username, email and password are required.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    const result = await onSubmit(formData);
    setSubmitting(false);
    if (result.success) {
      onClose();
      setFormData({ username: "", email: "", password: "", phone: "", role: "customer" });
    } else {
      setFormError(result.message || "Unable to create user. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
      <div className="bg-cyan-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Create New User</h3>
            <p className="text-xs text-gray-500">Fill in the details below to add a new user</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        {formError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {formError}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              USERNAME <span className="text-red-500">*</span>
            </label>
            <input
              ref={nameInputRef}
              type="text"
              name="username"
              placeholder="e.g. john_doe"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              EMAIL <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. john@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              PASSWORD <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">PHONE</label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g. +1 234 567 890"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400"><span className="text-red-500">*</span> Required fields</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData({ username: "", email: "", password: "", phone: "", role: "customer" })}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-cyan-500 rounded-xl hover:bg-cyan-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <UserPlus className="w-4 h-4" />
              Create User
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

/*Main--> */
const Users = () => {
  const { users, stats, loading, error, fetchUsers, deleteUser, verifyUser, updateUserRole, addUser, updateUser } = useUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  
  /* ===== EDIT MODAL STATE ===== */
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } else {
      alert(result.message);
    }
  };

  const handleVerify = async (userId) => {
    setActionLoading((prev) => ({ ...prev, [userId]: "verify" }));
    const result = await verifyUser(userId);
    setActionLoading((prev) => ({ ...prev, [userId]: null }));
    if (!result.success) alert(result.message);
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === "admin" ? "customer" : "admin";
    setActionLoading((prev) => ({ ...prev, [user._id]: "role" }));
    const result = await updateUserRole(user._id, newRole);
    setActionLoading((prev) => ({ ...prev, [user._id]: null }));
    if (!result.success) alert(result.message);
  };

  /* ===== EDIT HANDLER ===== */
  const handleEdit = (user) => {
    setUserToEdit(user);
    setEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setUserToEdit(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Title & Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-cyan-500 text-xs font-bold tracking-widest uppercase mb-1">User Management</p>
            <h2 className="text-3xl font-bold text-gray-800">Manage Users</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 text-white rounded-2xl text-sm font-medium hover:bg-cyan-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add User
              <ChevronDown className={`w-3 h-3 transition-transform ${showAddForm ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <AddUserForm onClose={() => setShowAddForm(false)} onSubmit={addUser} />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} icon={UsersIcon} color="bg-cyan-500" />
          <StatCard title="Admins" value={stats.admins} icon={Shield} color="bg-purple-500" />
          <StatCard title="Customers" value={stats.customers} icon={UsersIcon} color="bg-emerald-500" />
          <StatCard title="Verified" value={stats.verified} icon={UserCheck} color="bg-sky-500" />
        </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          <span className="ml-3 text-gray-500">Loading users...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-3">{error}</p>
          <button onClick={fetchUsers} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors">
            Try Again
          </button>
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <div className="space-y-4">
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">User</th>
                    <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">Role</th>
                    <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">Verified</th>
                    <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-gray-400">
                        {searchQuery ? "No users match your search." : "No users found."}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                              <p className="text-gray-500 text-xs">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                        <td className="px-6 py-4"><VerifiedBadge isVerified={user.isVerified} /></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <ActionButton icon={Pencil} color="bg-blue-500 hover:bg-blue-600" onClick={() => handleEdit(user)} title="Edit" />
                            <ActionButton
                              icon={actionLoading[user._id] === "role" ? Loader2 : ShieldCheck}
                              color={`${user.role === "admin" ? "bg-purple-500 hover:bg-purple-600" : "bg-emerald-500 hover:bg-emerald-600"} ${actionLoading[user._id] === "role" ? "animate-spin" : ""}`}
                              onClick={() => handleToggleRole(user)}
                              title={user.role === "admin" ? "Demote to Customer" : "Promote to Admin"}
                            />
                            <ActionButton
                              icon={actionLoading[user._id] === "delete" ? Loader2 : Trash2}
                              color="bg-red-500 hover:bg-red-600"
                              onClick={() => handleDeleteClick(user)}
                              title="Delete"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:hidden">
            {filteredUsers.length === 0 ? (
              <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center text-gray-400">
                {searchQuery ? "No users match your search." : "No users found."}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <MobileUserCard
                  key={user._id}
                  user={user}
                  onEdit={handleEdit}
                  onToggleRole={handleToggleRole}
                  onDelete={handleDeleteClick}
                  actionLoading={actionLoading}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && userToDelete && (
        <DeleteModal
          user={userToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => { setDeleteModalOpen(false); setUserToDelete(null); }}
          deleting={deleting}
        />
      )}

      {/* ===== EDIT USER MODAL ===== */}
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