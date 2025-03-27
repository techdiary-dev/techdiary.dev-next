import Navbar from "@/components/Navbar/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { PropsWithChildren } from "react";

const layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};

export default layout;
