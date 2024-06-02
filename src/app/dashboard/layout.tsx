import React, { PropsWithChildren } from "react";
import DashboardLayout from "./_components/DashboardLayout";

const layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default layout;
