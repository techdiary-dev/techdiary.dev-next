"use client";
import { IUser } from "@/http/models/User.model";
import { i18nLangAtom } from "@/store/i18n-lang.atom";
import { jotaiStore } from "@/store/store";
import { userAtom } from "@/store/user.atom";
import { useHydrateAtoms } from "jotai/utils";
import React, { PropsWithChildren } from "react";

interface ICurrentUserResolverProviderProps {
  user: IUser | null;
  i18nLang?: string;
}

const CurrentUserResolverProvider: React.FC<
  PropsWithChildren<ICurrentUserResolverProviderProps>
> = ({ children, user, i18nLang }) => {
  useHydrateAtoms(
    [
      [userAtom, user],
      [i18nLangAtom, i18nLang],
    ] as any,
    {
      dangerouslyForceHydrate: true,
      store: jotaiStore,
    }
  );

  return <>{children}</>;
};

export default CurrentUserResolverProvider;
