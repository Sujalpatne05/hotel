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
import React from "react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { getStoredRestaurantName } from "@/lib/session";

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
        <div className="flex items-center gap-3">
          <div className="gradient-warm rounded-lg p-2">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-base font-bold text-sidebar-primary-foreground">RestroHub</h1>
              <p className="text-xs text-sidebar-foreground/60">
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
    </Sidebar>
  );
}
