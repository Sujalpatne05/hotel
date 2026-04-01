import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Building, CreditCard, Users, BarChart2, Settings, LifeBuoy, Menu, X } from "lucide-react";

const sidebarNav = [
  { label: "Dashboard", icon: <Home size={18} />, route: "/superadmin-dashboard" },
  { label: "Restaurants", icon: <Building size={18} />, route: "/superadmin-restaurants" },
  { label: "Subscriptions", icon: <CreditCard size={18} />, route: "/superadmin-subscriptions" },
  { label: "Revenue", icon: <BarChart2 size={18} />, route: "/superadmin-revenue" },
  { label: "Users", icon: <Users size={18} />, route: "/superadmin-users" },
  { label: "Analytics", icon: <BarChart2 size={18} />, route: "/superadmin-analytics" },
  { label: "System Settings", icon: <Settings size={18} />, route: "/superadmin-settings" },
  { label: "Support", icon: <LifeBuoy size={18} />, route: "/superadmin-support" },
];

export default function SuperAdminLayout({ children }) {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isSuperAdmin");
    localStorage.removeItem("userRole");
    window.location.href = "/admin-login";
  };

  const handleNav = (route: string) => {
    navigate(route);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#f7f8fa]">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b shadow-sm flex items-center justify-between px-4 py-3">
        <h2 className="text-lg font-extrabold text-red-600">Super Admin</h2>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1 rounded hover:bg-gray-100">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white z-20 shadow-xl transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-red-600">Super Admin</h2>
          <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {sidebarNav.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition w-full text-left ${currentPath === item.route ? "bg-red-100 text-red-600" : "hover:bg-gray-100 text-gray-700"}`}
              onClick={() => handleNav(item.route)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t">
          <button onClick={handleLogout} className="w-full bg-red-600 text-white px-3 py-2 rounded font-semibold hover:bg-red-700 transition">
            Logout
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-20 lg:w-64 bg-white shadow-lg p-2 lg:p-6 flex-col gap-2 lg:gap-4 border-r min-h-screen">
        <h2 className="text-xl font-extrabold mb-6 text-red-600 text-center lg:text-left">Super Admin</h2>
        <nav className="flex flex-col gap-2 w-full">
          {sidebarNav.map(item => (
            <button
              key={item.label}
              className={`flex items-center justify-center lg:justify-start gap-0 lg:gap-3 px-0 lg:px-4 py-2.5 rounded-lg font-semibold transition w-full ${currentPath === item.route ? "bg-red-100 text-red-600" : "hover:bg-gray-100 text-gray-700"}`}
              onClick={() => navigate(item.route)}
            >
              {item.icon}
              <span className="hidden lg:inline">{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-2 rounded font-semibold hover:bg-red-700 transition mt-auto w-full">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-6 pt-16 md:pt-6 overflow-x-hidden">{children}</main>
    </div>
  );
}
