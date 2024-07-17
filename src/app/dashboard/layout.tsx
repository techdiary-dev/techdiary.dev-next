import { ssrGetMe } from "@/utils/ssr-user";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";
import DashboardLayout from "./_components/DashboardLayout";
import Image from "next/image";

const layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const { status } = await ssrGetMe();
  if (status !== 200) {
    redirect("/auth/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default layout;
