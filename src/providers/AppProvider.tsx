"use client";

import { reactQueryClient } from "@/clients/react-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import React, { PropsWithChildren } from "react";
import AppMantineProvider from "./MantineProvider";
import { jotaiStore } from "@/store/store";

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <JotaiProvider store={jotaiStore}>
      <QueryClientProvider client={reactQueryClient}>
        <AppMantineProvider>{children}</AppMantineProvider>
      </QueryClientProvider>
    </JotaiProvider>
  );
};

export default AppProvider;
