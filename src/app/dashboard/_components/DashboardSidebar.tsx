"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslation } from "@/i18n/use-translation";
import { BellIcon, Bookmark, Home, Settings, Settings2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardSidebar = () => {
  const { _t } = useTranslation();
  const pathName = usePathname();
  const items = [
    {
      title: _t("Dashboard"),
      url: "",
      icon: Home,
    },
    {
      title: _t("Notifications"),
      url: "/notifications",
      icon: BellIcon,
    },
    {
      title: _t("Bookmarks"),
      url: "/bookmarks",
      icon: Bookmark,
    },
    {
      title: _t("Settings"),
      url: "/settings",
      icon: Settings2,
    },
    {
      title: "Sessions",
      url: "/sessions",
      icon: Settings,
    },
  ];
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{_t("Dashboard")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, key) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathName === `/dashboard${item.url}`}
                  >
                    <Link
                      className="text-muted-foreground"
                      href={`/dashboard${item.url}`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
