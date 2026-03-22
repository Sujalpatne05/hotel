import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Building, CreditCard, Users, BarChart2, Settings, LifeBuoy } from "lucide-react";

const sidebarNav = [
  { label: "Dashboard", icon: <Home />, route: "/superadmin-dashboard" },
  { label: "Restaurants", icon: <Building />, route: "/superadmin-restaurants" },
  { label: "Subscriptions", icon: <CreditCard />, route: "/superadmin-subscriptions" },
  { label: "Revenue", icon: <BarChart2 />, route: "/superadmin-revenue" },
  { label: "Users", icon: <Users />, route: "/superadmin-users" },
  { label: "Analytics", icon: <BarChart2 />, route: "/superadmin-analytics" },
  { label: "System Settings", icon: <Settings />, route: "/superadmin-settings" },
  { label: "Support", icon: <LifeBuoy />, route: "/superadmin-support" },
];

export default function SuperAdminLayout({ children }) {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const handleLogout = () => {
    localStorage.removeItem("isSuperAdmin");
    localStorage.removeItem("userRole");
    window.location.href = "/admin-login";
  };
  return (
    <div className="min-h-screen flex bg-[#f7f8fa]">
      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b shadow-sm">
        <div className="px-3 py-2 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-red-600">Super Admin</h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1.5 rounded font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
        <nav className="px-2 pb-2 flex gap-2 overflow-x-auto">
          {sidebarNav.map((item) => (
            <button
              key={item.label}
              className={`whitespace-nowrap flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${currentPath === item.route ? "bg-red-100 text-red-600" : "hover:bg-gray-100 text-gray-700"}`}
              onClick={() => navigate(item.route)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-20 lg:w-64 bg-white shadow-lg p-2 lg:p-6 flex-col gap-2 lg:gap-4 border-r relative min-h-screen">
        <h2 className="text-xl sm:text-2xl font-extrabold mb-4 sm:mb-8 text-red-600 text-center sm:text-left">Super Admin</h2>
        <nav className="flex flex-col gap-2 w-full">
          {sidebarNav.map(item => (
            <button
              key={item.label}
              className={`flex items-center justify-center lg:justify-start gap-0 lg:gap-3 px-0 lg:px-4 py-2 rounded-lg font-bold transition w-full ${currentPath === item.route ? "bg-red-100 text-red-600" : "hover:bg-gray-100 text-gray-700 font-medium"}`}
              onClick={() => navigate(item.route)}
            >
              {item.icon}
              <span className="hidden lg:inline">{item.label}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-2 rounded font-semibold hover:bg-red-700 transition mt-4 lg:mt-auto w-full"
        >
          Logout
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-6 md:p-10 pt-24 md:pt-10">{children}</main>
    </div>
  );
}
