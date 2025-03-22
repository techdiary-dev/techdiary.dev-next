"use client";

import { tanstackQueryClient } from "@/lib/tanstack-query.client";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";
import "jotai-devtools/styles.css";
import { DevTools as JotaiDevtools } from "jotai-devtools";

import { jotaiStore } from "@/store/store";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "next-themes";
import { SessionResult } from "@/auth/auth";
import SessionProvider from "@/auth/SessionProvider";

interface Props {
  session: SessionResult;
}

const CommonProviders: React.FC<PropsWithChildren<Props>> = ({
  children,
  session,
}) => {
  return (
    <JotaiProvider store={jotaiStore}>
      <QueryClientProvider client={tanstackQueryClient}>
        <SessionProvider session={session}>
          <ThemeProvider attribute="data-theme">{children}</ThemeProvider>
        </SessionProvider>
      </QueryClientProvider>
      <JotaiDevtools />
    </JotaiProvider>
  );
};

export default CommonProviders;
