import { getSession } from "@/auth/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

const layout: React.FC<PropsWithChildren> = async ({ children }) => {
  // const headersList = await headers();
  // const header_url = headersList.get("x-current-url");
  // console.log({ header_url });
  const session = await getSession();

  if (!session?.session) {
    redirect(`/login?next=${encodeURIComponent(window.location.pathname)}`);
  }

  return <SidebarProvider>{children}</SidebarProvider>;
};

export default layout;
