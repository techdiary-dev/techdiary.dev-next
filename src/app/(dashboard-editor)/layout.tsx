import { cookies, headers } from "next/headers";
import React, { PropsWithChildren } from "react";
import * as sessionActions from "@/backend/services/session.actions";
import { redirect } from "next/navigation";

const layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const _headers = await headers();
  const currentPath = _headers.get("x-current-path");
  const session = await sessionActions.getSession();

  if (!session?.user) {
    redirect(`/login?next=${currentPath}`);
  }

  return <>{children}</>;
};

export default layout;
