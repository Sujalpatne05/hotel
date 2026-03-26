import {
  LayoutDashboard,
  Receipt,
  Users,
  BarChart3,
  UtensilsCrossed,
  Package,
  ShoppingCart,
  ChefHat,
  Table,
  Calendar,
  CreditCard,
  Monitor,
  Truck,
  BookOpen,
  UserCog,
  ClipboardList,
  Wallet,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { getStoredRestaurantName, buildAuthHeaders } from "@/lib/session";

const API_BASE_URL = (() => {
  const configured = (import.meta.env.VITE_API_URL || "").trim();
  if (typeof window !== "undefined" && window.location.protocol === "https:" && configured.startsWith("http://")) return "/api";
  return configured || (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "/api" : "http://localhost:5000");
})();

const menuGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Orders & Billing",
    items: [
      { title: "POS Billing", url: "/billing", icon: Receipt },
      { title: "Billing", url: "/bill-settlement", icon: Wallet },
      { title: "Kitchen Display", url: "/kitchen-display", icon: Monitor },
      { title: "Orders", url: "/orders", icon: ShoppingCart },
    ],
  },
  {
    label: "Restaurant",
    items: [
      { title: "Menu Management", url: "/menu", icon: UtensilsCrossed },
      { title: "Table Management", url: "/table-management", icon: Table },
      { title: "Reservations", url: "/reservations", icon: Calendar },
      { title: "Delivery Management", url: "/delivery-management", icon: Truck },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Payments Overview", url: "/payments-overview", icon: CreditCard },
      { title: "Reports & Tally", url: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Inventory", url: "/inventory", icon: Package },
      { title: "Payroll", url: "/payroll", icon: Users },
      { title: "Tasks", url: "/tasks", icon: ClipboardList },
      { title: "CRM", url: "/crm", icon: UserCog },
    ],
  },
];

export function AppSidebar() {
  const { state, openMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");
  const isMobile = useIsMobile();
  const restaurantName = getStoredRestaurantName();
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const headers = buildAuthHeaders();
        if (!headers) return;

        const profileRes = await fetch(`${API_BASE_URL}/profile`, { headers });
        const profileData = await profileRes.json();
        
        if (profileData?.restaurantLogo) {
          console.log("✅ Logo fetched from profile");
          setLogo(profileData.restaurantLogo);
        } else {
          console.log("❌ No logo in profile, using default");
          setLogo("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23FF6B35' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='40' fill='white' text-anchor='middle' dy='.3em'%3E🍽️%3C/text%3E%3C/svg%3E");
        }
      } catch (e) {
        console.error("Failed to fetch logo:", e);
        setLogo("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23FF6B35' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='40' fill='white' text-anchor='middle' dy='.3em'%3E🍽️%3C/text%3E%3C/svg%3E");
      }
    };

    fetchLogo();
  }, []);

  // Swipe gesture for mobile sidebar
  React.useEffect(() => {
    if (!isMobile) return;
    let startX = null;
    function handleTouchStart(e) { startX = e.touches[0].clientX; }
    function handleTouchMove(e) {
      if (startX === null) return;
      const currentX = e.touches[0].clientX;
      if (currentX - startX > 60) { setOpenMobile(true); startX = null; }
      if (startX - currentX > 60) { setOpenMobile(false); startX = null; }
    }
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isMobile, setOpenMobile]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex flex-col items-center gap-3">
          {logo && (
            <img 
              src={logo} 
              alt="Restaurant Logo" 
              className="h-16 w-16 rounded-lg flex-shrink-0"
            />
          )}
          {!collapsed && (
            <div className="text-center">
              <p className="text-sm font-semibold text-sidebar-foreground">
                {userRole === "admin" && restaurantName ? restaurantName : "Management System"}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40 px-3 py-1">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <NavLink
                        to={item.url}
                        end
                        className="hover:bg-sidebar-accent"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="text-center border-t border-sidebar-border pt-3">
            <p className="text-xs text-sidebar-foreground/60">
              Created by <span className="font-semibold">RestroHub</span>
            </p>
            <p className="text-xs text-sidebar-foreground/50 mt-1">
              © {new Date().getFullYear()}
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
