import React, { useState, useEffect } from "react";
import { saveAuthSession } from "@/lib/session";
import { ChefHat, Mail, Lock, Eye, EyeOff } from "lucide-react";

const API_BASE_URL = (() => {
  const configured = (import.meta.env.VITE_API_URL || "").trim();
  if (typeof window !== "undefined" && window.location.protocol === "https:" && configured.startsWith("http://")) {
    return "/api";
  }
  return configured || (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "/api" : "http://localhost:5000");
})();

const LoginFixed = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      console.log('[NEW LOGIN] Sending WITHOUT role parameter');
      const payload = { username: username.trim(), password: password.trim() };
      console.log('[NEW LOGIN] Payload:', payload);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log('[NEW LOGIN] Response:', response.status, data);

      if (!response.ok) {
        setError(data?.error || "Invalid credentials");
        return;
      }

      const mustChangePassword = Boolean(data?.user?.mustChangePassword);
      saveAuthSession(
        data.token,
        data.user.role,
        data.user.name,
        String(data?.user?.restaurantName || ""),
        typeof data?.user?.restaurantId === "number" ? data.user.restaurantId : null,
        mustChangePassword
      );
      
      if (mustChangePassword) {
        window.location.href = "/change-password";
        return;
      }
      
      window.location.href = data.user.role === "superadmin" ? "/superadmin-dashboard" : "/";
    } catch (err) {
      console.error('[NEW LOGIN] Error:', err);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "0 20px" }}>
        <div style={{ borderRadius: 20, background: "white", padding: "40px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ width: 70, height: 70, borderRadius: 15, margin: "0 auto 15px", background: "linear-gradient(135deg,#e53935,#ff6f00)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChefHat style={{ width: 40, height: 40, color: "white" }} />
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1a1a2e", margin: "0 0 5px" }}>RestroHub</h1>
            <p style={{ color: "#999", fontSize: 13, margin: 0 }}>Fixed Login - All Roles</p>
          </div>

          {error && (
            <div style={{ marginBottom: 20, padding: "12px", borderRadius: 10, background: "#fff5f5", border: "1px solid #fed7d7", color: "#c53030", fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 8 }}>Email or Username</label>
              <div style={{ position: "relative" }}>
                <Mail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#ccc" }} />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  placeholder="Enter your email"
                  style={{ width: "100%", paddingLeft: 40, padding: "12px", borderRadius: 10, border: "2px solid #f0f0f0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 8 }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#ccc" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  style={{ width: "100%", paddingLeft: 40, paddingRight: 40, padding: "12px", borderRadius: 10, border: "2px solid #f0f0f0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  {showPassword ? <EyeOff style={{ width: 18, height: 18, color: "#ccc" }} /> : <Eye style={{ width: 18, height: 18, color: "#ccc" }} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "14px", borderRadius: 10, background: loading ? "#ffb3b3" : "linear-gradient(135deg,#e53935,#ff6f00)", border: "none", color: "white", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "#999" }}>
            ✓ Works for all roles: Staff, Manager, Admin, Super Admin
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFixed;
