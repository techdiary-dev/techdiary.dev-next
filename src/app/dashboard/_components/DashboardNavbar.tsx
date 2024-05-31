import { Skeleton } from "@mantine/core";
import React from "react";

const DashboardNavbar = () => {
  return (
    <div>
      Navbar
      {Array(15)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} h={28} mt="sm" animate={false} />
        ))}
    </div>
  );
};

export default DashboardNavbar;
