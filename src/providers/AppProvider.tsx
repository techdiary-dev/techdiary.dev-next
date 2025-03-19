"use client";

import { reactQueryClient } from "@/clients/react-query-client";
import { jotaiStore } from "@/store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import React, { PropsWithChildren } from "react";

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <JotaiProvider store={jotaiStore}>
      <QueryClientProvider client={reactQueryClient}>
        {children}
      </QueryClientProvider>
    </JotaiProvider>
  );
};

export default AppProvider;
