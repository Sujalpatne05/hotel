
import React, { useState } from "react";
import { saveAuthSession } from "@/lib/session";

const API_BASE_URL = (() => {
  const configured = (import.meta.env.VITE_API_URL || "").trim();
  if (typeof window !== "undefined" && window.location.protocol === "https:" && configured.startsWith("http://")) {
    return "/api";
  }
  // For localhost development, always use /api proxy
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "/api";
  }
  return configured || "/api";
})();

export default function SuperAdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          role: "superadmin",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Incorrect username or password. Please try again.");
        return;
      }

      // Always go directly to dashboard - no change password page
      saveAuthSession(
        data.token,
        data.user.role,
        data.user.name,
        String(data?.user?.restaurantName || ""),
        typeof data?.user?.restaurantId === "number" ? data.user.restaurantId : null,
        false
      );
      window.location.href = "/superadmin-dashboard";
    } catch {
      setError("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Super Admin Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border rounded-lg px-3 py-2"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded-lg px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium shadow hover:bg-blue-700 transition"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-gray-600 text-sm">
          <p>For authorized Super Admin users only.</p>
        </div>
      </div>
    </div>
  );
}
