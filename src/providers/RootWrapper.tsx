import { http } from "@/clients/http.client";
import { IUser } from "@/models/User.model";
import CurrentUserResolverProvider from "@/providers/CurrentUserResolverProvider";
import { cookies } from "next/headers";
import React, { PropsWithChildren } from "react";

const RootWrapper: React.FC<PropsWithChildren> = async ({ children }) => {
  const _cookies = cookies().getAll();
  const me = await http.get<IUser>("api/profile/me", {
    headers: {
      Cookie: _cookies.map((c) => `${c.name}=${c.value}`).join("; "),
      referer: process.env.NEXT_PUBLIC_APP_URL,
    },
    validateStatus: () => true,
  });

  return (
    <>
      <CurrentUserResolverProvider user={me?.status === 200 ? me.data : null}>
        {children}
      </CurrentUserResolverProvider>
    </>
  );
};

export default RootWrapper;
