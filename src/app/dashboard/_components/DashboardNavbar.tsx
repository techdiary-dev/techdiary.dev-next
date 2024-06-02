import { NavLink, Skeleton } from "@mantine/core";
import React from "react";

const items = [
  { name: "Dashboard", href: "#" },
  { name: "Projects", href: "#" },
  { name: "Team", href: "#" },
  { name: "Settings", href: "#" },
];

const DashboardNavbar = () => {
  return (
    <div>
      {items.map((item) => (
        <NavLink key={item.name} href={item.href} label={item.name} />
      ))}
    </div>
  );
};

export default DashboardNavbar;
