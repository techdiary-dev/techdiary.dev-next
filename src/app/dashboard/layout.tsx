import { getSession } from "@/auth/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";
import DashboardScaffold from "./_components/DashboardScaffold";

const layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const _headers = await headers();
  const currentPath = _headers.get("x-current-path");
  const session = await getSession();

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  if (!session?.user) {
    redirect(`/login?next=${currentPath}`);
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <DashboardScaffold>{children}</DashboardScaffold>
    </SidebarProvider>
  );
};

export default layout;
