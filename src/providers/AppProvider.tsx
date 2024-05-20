"use client";

import { reactQueryClient } from "@/clients/react-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";
import AppMantineProvider from "./MantineProvider";

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={reactQueryClient}>
      <AppMantineProvider>{children}</AppMantineProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
