"use client";

import { tanstackQueryClient } from "@/lib/tanstack-query.client";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";

import { jotaiStore } from "@/store/store";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "next-themes";

const CommonProviders: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <JotaiProvider store={jotaiStore}>
      <QueryClientProvider client={tanstackQueryClient}>
        <ThemeProvider attribute="data-theme">{children}</ThemeProvider>
      </QueryClientProvider>
    </JotaiProvider>
  );
};

export default CommonProviders;
