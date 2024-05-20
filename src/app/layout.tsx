import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/app.scss";

import { ColorSchemeScript } from "@mantine/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Techdiary - A blogging platform for developers",
  openGraph: { title: "Techdiary" },
};

import AppProvider from "@/providers/AppProvider";
import React, { PropsWithChildren } from "react";
import RootWrapper from "../providers/RootWrapper";

const RootLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript key={"techdiary-color-scheme"} />
      </head>
      <body className={inter.className}>
        <RootWrapper>
          <AppProvider>{children}</AppProvider>
        </RootWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
