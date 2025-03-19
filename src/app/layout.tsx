import type { Metadata } from "next";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import "../styles/app.css";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";

export const metadata: Metadata = {
  title: "Techdiary - %s",
  openGraph: { title: "Techdiary" },
  icons: { icon: "/favicon.png" },
};

import AppProvider from "@/providers/AppProvider";
import { fontKohinoorBanglaRegular } from "@/utils/fonts";
import React, { PropsWithChildren } from "react";
import RootWrapper from "../providers/RootWrapper";

const RootLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
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
