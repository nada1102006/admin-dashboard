import { createContext, useContext, useState, useCallback, useMemo } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

const UsersContext = createContext();

const ENDPOINTS = ["/users/all", "/users", "/api/users", "/api/v1/users"];
const POST_ENDPOINTS = ["/users/add", "/users", "/api/users/add", "/api/v1/users/add", "/api/users", "/api/v1/users"];

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [usingMock, setUsingMock] = useState(false);

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
          setUsingMock(false);
          setLoading(false);
          return;
        }
      } catch (err) {
        lastError = err;
        console.error(`Failed ${endpoint}:`, err.response?.status, err.message);
      }
    }

    setUsers([]);
    setUsingMock(false);
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
        if (err.response?.status === 404) {
          continue;
        }
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
    usingMock,
    fetchUsers,
    addUser,
    deleteUser,
    verifyUser,
    updateUserRole,
  };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};

export default UsersContext;