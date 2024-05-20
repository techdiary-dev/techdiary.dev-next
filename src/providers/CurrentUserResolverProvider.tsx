"use client";
import { IUser } from "@/models/User.model";
import { jotaiStore } from "@/store/store";
import { userAtom } from "@/store/user.atom";
import { useHydrateAtoms } from "jotai/utils";
import React, { PropsWithChildren } from "react";

interface ICurrentUserResolverProviderProps {
  user: IUser | null;
}

const CurrentUserResolverProvider: React.FC<
  PropsWithChildren<ICurrentUserResolverProviderProps>
> = ({ children, user }) => {
  useHydrateAtoms([[userAtom, user] as const], {
    dangerouslyForceHydrate: true,
    store: jotaiStore,
  });

  return <>{children}</>;
};

export default CurrentUserResolverProvider;
