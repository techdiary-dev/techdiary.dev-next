import type { Metadata } from "next";
import "../styles/app.css";
import AppProvider from "@/providers/AppProvider";
import { fontKohinoorBanglaRegular } from "@/utils/fonts";
import React, { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Techdiary - %s",
  openGraph: { title: "Techdiary" },
  icons: { icon: "/favicon.png" },
};

const RootLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  return (
    <html lang="en">
      <body style={fontKohinoorBanglaRegular.style}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;
