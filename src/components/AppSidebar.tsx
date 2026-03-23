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
  Phone,
  Mail,
  MessageSquare,
  X,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Billing", url: "/billing", icon: Receipt },
  { title: "Kitchen Display", url: "/kitchen-display", icon: Monitor },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Menu Management", url: "/menu", icon: UtensilsCrossed },
  { title: "Table Management", url: "/table-management", icon: Table },
  { title: "Payments Overview", url: "/payments-overview", icon: CreditCard },
  { title: "Payroll", url: "/payroll", icon: Users },
  { title: "Tasks", url: "/tasks", icon: BarChart3 },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "CRM", url: "/crm", icon: Users },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Reservations", url: "/reservations", icon: Calendar },
  { title: "Delivery Management", url: "/delivery-management", icon: Truck },
  // { title: "Recipe Management", url: "/recipe-management", icon: BookOpen },
];

export function AppSidebar() {
  const { state, openMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");
  const isMobile = useIsMobile();
  const restaurantName = getStoredRestaurantName();
  const [showSupportModal, setShowSupportModal] = useState(false);

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
          <button
            onClick={() => setShowSupportModal(true)}
            className="p-4 w-[90%] flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all cursor-pointer border border-orange-400/30"
          >
            <div className="bg-white rounded p-1.5 flex-shrink-0">
              <span className="text-orange-600 font-bold text-sm">24/7</span>
            </div>
            <div className="text-left">
              <p className="text-xs text-orange-100 mb-0.5">Support</p>
              <p className="text-sm font-semibold text-white">24/7 multiple language support</p>
              <p className="text-xs text-orange-100 mt-1">Call us anytime for help!</p>
            </div>
          </button>
        </div>
      )}

      <Dialog open={showSupportModal} onOpenChange={setShowSupportModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Support Center</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">24/7 Multiple Language Support</h3>
              <p className="text-sm text-orange-800">We're here to help you anytime, in your preferred language.</p>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
                <Phone className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Call Us</p>
                  <p className="text-xs text-gray-600">+1 (800) 123-4567</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
                <Mail className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Email Us</p>
                  <p className="text-xs text-gray-600">support@restrohub.com</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
                <MessageSquare className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Live Chat</p>
                  <p className="text-xs text-gray-600">Chat with our team now</p>
                </div>
              </button>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                <span className="font-semibold">Response Time:</span> Average 2-5 minutes during business hours
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
