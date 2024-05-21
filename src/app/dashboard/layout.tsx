import React, { PropsWithChildren } from "react";

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>;
};

export default DashboardLayout;
