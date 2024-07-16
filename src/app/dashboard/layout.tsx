import React, { PropsWithChildren } from "react";
import DashboardLayout from "./_components/DashboardLayout";
import { ssrGetMe } from "@/utils/ssr-user";
import { Title } from "@mantine/core";
import SocialLogin from "@/components/asides/widgets/SocialLogin";

const layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const { status } = await ssrGetMe();
  if (status !== 200) {
    return (
      <div className="flex flex-col h-screen w-96 mx-auto gap-4 my-4">
        <Title order={2}>Please login to continue</Title>
        <SocialLogin />
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default layout;
