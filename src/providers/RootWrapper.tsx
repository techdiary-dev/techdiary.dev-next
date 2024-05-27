import CurrentUserResolverProvider from "@/providers/CurrentUserResolverProvider";
import { ssrGetMe } from "@/utils/ssr-user";
import { cookies } from "next/headers";
import React, { PropsWithChildren } from "react";

const RootWrapper: React.FC<PropsWithChildren> = async ({ children }) => {
  const { status, me } = await ssrGetMe();
  const _cookies = cookies();

  return (
    <>
      <CurrentUserResolverProvider
        user={status === 200 ? me : null}
        i18nLang={_cookies.get("language")?.value || "en"}
      >
        {children}
      </CurrentUserResolverProvider>
    </>
  );
};

export default RootWrapper;
