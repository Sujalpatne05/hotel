import React, { useEffect, useMemo, useState } from "react";
import SuperAdminLayout from "../components/SuperAdminLayout";
import { MoreVertical, Search, Shield, UserPlus } from "lucide-react";
import { buildAuthHeaders, clearAuthSession, isAuthError } from "@/lib/session";

const API_BASE_URL = (() => {
  const configured = (import.meta.env.VITE_API_URL || "").trim();
  if (typeof window !== "undefined" && window.location.protocol === "https:" && configured.startsWith("http://")) {
    return "/api";
  }
  return configured || (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "/api" : "http://localhost:5000");
})();

type ApiAdminUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  restaurant_name: string;
  is_active: boolean;
  must_change_password: boolean;
  created_at?: string;
};

export default function SuperAdminUsers() {
  const [users, setUsers] = useState<ApiAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [deleteUser, setDeleteUser] = useState<ApiAdminUser | null>(null);
  const [restaurants, setRestaurants] = useState<Array<{ id: number; name: string }>>([]);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    role: "manager",
    restaurantId: "",
    temporaryPassword: "",
  });

  const headers = buildAuthHeaders();

  const fetchRestaurants = async () => {
    if (!headers) return;
    try {
      const response = await fetch(`${API_BASE_URL}/superadmin/restaurants`, { headers });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setRestaurants(data.map((r: any) => ({ id: r.id, name: r.name })));
      }
    } catch {
      // Silently fail, restaurants optional
    }
  };

  const fetchAdmins = async () => {
    if (!headers) {
      setError("Session expired. Login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/superadmin/users`, { headers });
      const data = await response.json();
      if (!response.ok) {
        if (isAuthError(response.status)) {
          clearAuthSession();
          window.location.href = "/superadmin-login";
          return;
        }
        setError(data?.error || "Unable to load admin users.");
        return;
      }
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setError("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    fetchAdmins();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = search.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        String(user.restaurant_name || "").toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  const handleCreateAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!headers) return;

    // Validate all required fields
    if (!addForm.name.trim()) {
      setError("Please enter full name");
      return;
    }

    if (!addForm.email.trim()) {
      setError("Please enter email address");
      return;
    }

    if (!addForm.temporaryPassword.trim()) {
      setError("Please enter temporary password");
      return;
    }

    if (!addForm.restaurantId) {
      setError("Please select a restaurant");
      return;
    }

    try {
      setError("");
      setMessage("");
      const response = await fetch(`${API_BASE_URL}/superadmin/users`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: addForm.name.trim(),
          email: addForm.email.trim(),
          role: addForm.role,
          restaurantId: Number(addForm.restaurantId),
          temporaryPassword: addForm.temporaryPassword,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Unable to create user.");
        return;
      }

      const roleLabel = addForm.role.charAt(0).toUpperCase() + addForm.role.slice(1);
      setMessage(`${roleLabel} created. Temporary credentials dispatched (demo queue).`);
      setAddForm({ name: "", email: "", role: "manager", restaurantId: "", temporaryPassword: "" });
      setShowAddModal(false);
      await fetchAdmins();
    } catch {
      setError("Unable to connect to backend.");
    }
  };

  const handleToggleStatus = async (user: ApiAdminUser) => {
    if (!headers) return;
    try {
      const response = await fetch(`${API_BASE_URL}/superadmin/users/${user.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ isActive: !user.is_active }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Unable to update status.");
        return;
      }
      setUsers((current) => current.map((item) => (item.id === data.id ? data : item)));
      setMessage(`User ${data.name} is now ${data.is_active ? "active" : "inactive"}.`);
    } catch {
      setError("Unable to connect to backend.");
    }
  };

  const handleResetTempPassword = async (userId: number) => {
    if (!headers) return;
    const temp = window.prompt("Enter new temporary password (min 8 chars):", "Temp@1234");
    if (!temp) return;

    try {
      const response = await fetch(`${API_BASE_URL}/superadmin/users/${userId}/reset-password`, {
        method: "POST",
        headers,
        body: JSON.stringify({ temporaryPassword: temp }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Unable to reset temporary password.");
        return;
      }
      setMessage("Temporary password reset. Credentials dispatch queued (demo).");
      await fetchAdmins();
    } catch {
      setError("Unable to connect to backend.");
    }
  };

  const handleDeleteAdmin = async () => {
    if (!headers || !deleteUser) return;
    try {
      const response = await fetch(`${API_BASE_URL}/superadmin/users/${deleteUser.id}`, {
        method: "DELETE",
        headers,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Unable to delete user.");
        return;
      }
      if (data.success) {
        setUsers((current) => current.filter((user) => user.id !== deleteUser.id));
        setMessage("User deleted successfully.");
        setDeleteUser(null);
      }
    } catch {
      setError("Unable to connect to backend.");
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-5 p-3 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">User Access Control</h1>
            <p className="text-sm text-slate-500">Create and manage admin, manager, and staff accounts with role-based access control.</p>
          </div>
          <button
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, restaurant"
              className="w-full rounded-lg border border-slate-300 py-3 pl-9 pr-3 text-sm"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          {message && <p className="mt-3 text-sm font-semibold text-emerald-700">{message}</p>}
          {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">User</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Role</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Restaurant</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Status</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Password Policy</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-5 text-sm text-slate-500" colSpan={6}>Loading users...</td>
                  </tr>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <tr key={user.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          user.role === "admin" ? "bg-amber-100 text-amber-800" :
                          user.role === "manager" ? "bg-blue-100 text-blue-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          <Shield className="h-3.5 w-3.5" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{user.restaurant_name || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${user.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                          {user.is_active ? "active" : "inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold">
                        {user.must_change_password ? (
                          <span className="rounded-full bg-red-100 px-2.5 py-1 text-red-700">Reset Required</span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">Compliant</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="relative inline-block text-left">
                          <button className="min-h-10 min-w-10 rounded-full p-2.5 hover:bg-slate-100" onClick={() => setShowMenu(idx)}>
                            <MoreVertical className="h-5 w-5 text-slate-400" />
                          </button>
                          {showMenu === idx && (
                            <div className="absolute right-0 z-10 mt-2 w-44 rounded-lg border border-slate-200 bg-white shadow-lg">
                              <button className="block min-h-10 w-full px-4 py-2 text-left text-sm hover:bg-slate-50" onClick={() => { setShowMenu(null); handleToggleStatus(user); }}>
                                {user.is_active ? "Deactivate" : "Activate"}
                              </button>
                              <button className="block min-h-10 w-full px-4 py-2 text-left text-sm hover:bg-slate-50" onClick={() => { setShowMenu(null); handleResetTempPassword(user.id); }}>
                                Reset Temp Password
                              </button>
                              <button className="block min-h-10 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50" onClick={() => { setShowMenu(null); setDeleteUser(user); }}>
                                Delete User
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
            <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
              <h2 className="text-xl font-bold text-slate-900">Add User</h2>
              <p className="mt-1 text-sm text-slate-500">Create a new user with role-based access control.</p>
              <form className="mt-4 space-y-3" onSubmit={handleCreateAdmin}>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Full Name</label>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2" value={addForm.name} onChange={(event) => setAddForm((prev) => ({ ...prev, name: event.target.value }))} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Email (Login ID)</label>
                  <input type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2" value={addForm.email} onChange={(event) => setAddForm((prev) => ({ ...prev, email: event.target.value }))} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Role</label>
                  <select value={addForm.role} onChange={(event) => setAddForm((prev) => ({ ...prev, role: event.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="admin">Admin (Full Access)</option>
                    <option value="manager">Manager (High Access)</option>
                    <option value="staff">Staff (Limited Access)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Restaurant</label>
                  <select value={addForm.restaurantId} onChange={(event) => setAddForm((prev) => ({ ...prev, restaurantId: event.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2" required>
                    <option value="">Select a restaurant</option>
                    {restaurants.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Temporary Password</label>
                  <input type="password" minLength={8} className="w-full rounded-lg border border-slate-300 px-3 py-2" value={addForm.temporaryPassword} onChange={(event) => setAddForm((prev) => ({ ...prev, temporaryPassword: event.target.value }))} required />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" className="min-h-10 rounded-lg border border-slate-300 px-4 py-2 text-sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="min-h-10 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
              <h2 className="text-xl font-bold text-slate-900">Delete User</h2>
              <p className="mt-2 text-sm text-slate-600">Are you sure you want to delete <span className="font-semibold">{deleteUser.name}</span>?</p>
              <div className="mt-5 flex justify-end gap-2">
                <button className="min-h-10 rounded-lg border border-slate-300 px-4 py-2 text-sm" onClick={() => setDeleteUser(null)}>
                  Cancel
                </button>
                <button className="min-h-10 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white" onClick={handleDeleteAdmin}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}

