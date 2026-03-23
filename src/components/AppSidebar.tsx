import {
  LayoutDashboard,
  Receipt,
  Users,
  BarChart3,
  UtensilsCrossed,
  Package,
  ShoppingCart,
  ChefHat,
  BookOpen,
  UserCog,
  Table,
  Calendar,
  CreditCard,
  Monitor,
  Truck,
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
import { SupportStatCard } from "@/components/StatCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { getStoredRestaurantName } from "@/lib/session";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Billing", url: "/billing", icon: Receipt },
  { title: "Payroll", url: "/payroll", icon: Users },
  { title: "Tasks", url: "/tasks", icon: BarChart3 },
  { title: "Menu Management", url: "/menu", icon: UtensilsCrossed },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "CRM", url: "/crm", icon: Users },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Payments Overview", url: "/payments-overview", icon: CreditCard },
  // { title: "Recipe Management", url: "/recipe-management", icon: BookOpen },
  { title: "Table Management", url: "/table-management", icon: Table },
  { title: "Reservations", url: "/reservations", icon: Calendar },
  { title: "Kitchen Display", url: "/kitchen-display", icon: Monitor },
  { title: "Delivery Management", url: "/delivery-management", icon: Truck },
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
    function handleTouchStart(e) {
      startX = e.touches[0].clientX;
    }
    function handleTouchMove(e) {
      if (startX === null) return;
      const currentX = e.touches[0].clientX;
      // Swipe right to open
      if (currentX - startX > 60) {
        setOpenMobile(true);
        startX = null;
      }
      // Swipe left to close
      if (startX - currentX > 60) {
        setOpenMobile(false);
        startX = null;
      }
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
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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
      </SidebarContent>
      {!collapsed && (
        <div className="mt-auto mb-4 flex justify-center">
          <div className="p-0 w-[90%] flex items-center gap-3">
            <img src="/support247.svg" alt="24/7 Support Icon" width={24} height={24} />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Support</p>
              <p className="text-sm font-semibold">24/7 multiple language support</p>
              <p className="text-xs text-muted-foreground mt-1">Call us anytime for help!</p>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
