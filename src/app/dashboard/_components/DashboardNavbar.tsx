import { useTranslation } from "@/i18n/use-translation";
import { NavLink, Skeleton } from "@mantine/core";
import {
  BellIcon,
  BookmarkIcon,
  DashboardIcon,
  GearIcon,
  LockOpen1Icon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface INavItem {
  name: string;
  path: string;
  Icon?: React.ForwardRefExoticComponent<
    any & React.RefAttributes<SVGSVGElement>
  >;
}

const DashboardNavbar = () => {
  const { _t } = useTranslation();
  const routerPath = usePathname();
  const items: INavItem[] = [
    { name: _t("Dashboard"), path: "", Icon: DashboardIcon },
    {
      name: _t("Notifications"),
      path: "notifications",
      Icon: BellIcon,
    },
    { name: _t("Bookmarks"), path: "bookmarks", Icon: BookmarkIcon },
    {
      name: _t("Settings"),
      path: "settings",
      Icon: GearIcon,
    },
    {
      name: _t("Personal access token"),
      path: "personal-access-token",
      Icon: LockOpen1Icon,
    },
  ];

  const getIsActive = (path: string) => {
    const _routerPath = routerPath.replace("/dashboard", "").replace("/", "");
    console.log({ _routerPath, path });
    return _routerPath === path;
  };

  return (
    <div>
      {items.map((item) => (
        <NavLink
          style={{ "--nl-bg": "var(--muted)", "--nl-hover": "var(--muted)" }}
          key={item.name}
          component={Link}
          href={`/dashboard/${item.path}`}
          active={getIsActive(item.path)}
          color="primary"
          label={item.name}
          leftSection={
            item.Icon ? <item.Icon size={18} /> : <Skeleton height={18} />
          }
        />
      ))}
    </div>
  );
};

export default DashboardNavbar;
