import React, { PropsWithChildren } from "react";
import DashboardLayout from "./_components/DashboardLayout";
import { ssrGetMe } from "@/utils/ssr-user";
import { Title } from "@mantine/core";
import SocialLogin from "@/components/asides/widgets/SocialLogin";
import { redirect } from "next/navigation";

const layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const { status } = await ssrGetMe();
  if (status !== 200) {
    redirect("/auth/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default layout;
