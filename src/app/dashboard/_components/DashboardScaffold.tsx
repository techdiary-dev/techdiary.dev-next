import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import React, { PropsWithChildren } from "react";
import DashboardSidebar from "./DashboardSidebar";
import AuthenticatedUserMenu from "@/components/Navbar/AuthenticatedUserMenu";
import ThemeSwitcher from "@/components/Navbar/ThemeSwitcher";

interface DashboardScaffoldProps {}

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const DashboardScaffold: React.FC<
  PropsWithChildren<DashboardScaffoldProps>
> = ({ children }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full">
        <div className="p-4 flex items-center gap-2 justify-between">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <AuthenticatedUserMenu />
          </div>
        </div>
        <div className="flex-1 p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardScaffold;
