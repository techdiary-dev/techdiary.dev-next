"use client";

import { tanstackQueryClient } from "@/lib/tanstack-query.client";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";

import { ThemeProvider } from "next-themes";

const CommonProviders: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={tanstackQueryClient}>
      <ThemeProvider attribute="data-theme">{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

export default CommonProviders;
