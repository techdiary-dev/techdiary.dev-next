import type { Metadata } from "next";
import "../styles/app.css";

import React, { PropsWithChildren } from "react";
import CommonProviders from "@/components/providers/CommonProviders";
import { fontKohinoorBanglaRegular } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Techdiary - %s",
  openGraph: { title: "Techdiary" },
  icons: { icon: "/favicon.png" },
};

const RootLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={fontKohinoorBanglaRegular.style}>
        <CommonProviders>{children}</CommonProviders>
      </body>
    </html>
  );
};

export default RootLayout;
