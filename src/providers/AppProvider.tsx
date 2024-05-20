"use client";

import { reactQueryClient } from "@/clients/react-query-client";
import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={reactQueryClient}>
      <MantineProvider>{children}</MantineProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
