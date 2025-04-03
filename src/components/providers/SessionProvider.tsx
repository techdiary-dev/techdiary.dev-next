"use client";

import React, { PropsWithChildren } from "react";
import { useHydrateAtoms } from "jotai/utils";
import { sessionAtom } from "@/store/session.atom";
import { SessionResult } from "@/backend/services/action-type";

interface AuthProviderProps {
  session: SessionResult;
}

const SessionProvider: React.FC<PropsWithChildren<AuthProviderProps>> = ({
  session,
  children,
}) => {
  useHydrateAtoms([[sessionAtom, session]]);
  return <>{children}</>;
};

export default SessionProvider;
