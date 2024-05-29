import type { Metadata } from "next";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "../styles/app.scss";

import { ColorSchemeScript } from "@mantine/core";

export const metadata: Metadata = {
  title: "Techdiary - A blogging platform for developers",
  openGraph: { title: "Techdiary" },
  icons: { icon: "/favicon.png" },
};

import AppProvider from "@/providers/AppProvider";
import { fontKohinoorBanglaRegular } from "@/utils/fonts";
import React, { PropsWithChildren } from "react";
import RootWrapper from "../providers/RootWrapper";

const RootLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript key={"techdiary-color-scheme"} />
      </head>
      <body style={fontKohinoorBanglaRegular.style}>
        <RootWrapper>
          <AppProvider>{children}</AppProvider>
        </RootWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
