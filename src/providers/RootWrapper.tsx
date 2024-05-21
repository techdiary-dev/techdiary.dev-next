import CurrentUserResolverProvider from "@/providers/CurrentUserResolverProvider";
import { ssrGetMe } from "@/utils/ssr-user";
import React, { PropsWithChildren } from "react";

const RootWrapper: React.FC<PropsWithChildren> = async ({ children }) => {
  const { status, me } = await ssrGetMe();

  return (
    <>
      <CurrentUserResolverProvider user={status === 200 ? me : null}>
        {children}
      </CurrentUserResolverProvider>
    </>
  );
};

export default RootWrapper;
