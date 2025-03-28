import { getSession } from "@/auth/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

const layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const _headers = await headers();
  const currentUrl = _headers.get("x-current-url");
  const session = await getSession();

  if (!session?.user) {
    redirect(`/login?next=${currentUrl}`);
  }

  return <SidebarProvider>{children}</SidebarProvider>;
};

export default layout;
