import { useEffect, useRef, useState } from "react";
import { useUsers } from "../context/UsersContext";
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

// Add User Form Component
const AddUserForm = ({ onClose, onSubmit, autoStartField }) => {
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
    if (autoStartField === "name" && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [autoStartField]);

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
      setFormData({ name: "", email: "", password: "", phone: "", role: "customer" });
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
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
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

const Users = () => {
  const { users, stats, loading, error, fetchUsers, deleteUser, verifyUser, updateUserRole, addUser } = useUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [autoStartField, setAutoStartField] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

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

  const handleEdit = (user) => {
    console.log("Edit user:", user);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Page Title & Search */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-cyan-500 text-xs font-bold tracking-widest uppercase mb-1">User Management</p>
          <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-64 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              const opening = !showAddForm;
              setShowAddForm(opening);
              setAutoStartField(opening ? "username" : null);
            }}
            className="px-4 py-2.5 bg-cyan-500 text-white rounded-xl text-sm font-medium hover:bg-cyan-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add User
            <ChevronDown className={`w-3 h-3 transition-transform ${showAddForm ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <AddUserForm
          onClose={() => {
            setShowAddForm(false);
            setAutoStartField(null);
          }}
          onSubmit={addUser}
          autoStartField={autoStartField}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Users" value={stats.totalUsers} icon={UsersIcon} color="bg-cyan-500" />
        <StatCard title="Admins" value={stats.admins} icon={Shield} color="bg-cyan-500" />
        <StatCard title="Customers" value={stats.customers} icon={UsersIcon} color="bg-cyan-500" />
        <StatCard title="Verified" value={stats.verified} icon={UserCheck} color="bg-cyan-500" />
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
    </div>
  );
};

export default Users;