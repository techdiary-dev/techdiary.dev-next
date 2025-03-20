import type { Metadata } from "next";
import "../styles/app.css";

import React, { PropsWithChildren } from "react";
import CommonProviders from "@/components/providers/CommonProviders";
import { fontKohinoorBanglaRegular } from "@/lib/fonts";
import I18nProvider from "@/components/providers/I18nProvider";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Techdiary - %s",
  openGraph: { title: "Techdiary" },
  icons: { icon: "/favicon.png" },
};

const RootLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  const _cookies = await cookies();
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={fontKohinoorBanglaRegular.style}>
        <I18nProvider currentLanguage={_cookies.get("language")?.value || "en"}>
          <CommonProviders>{children}</CommonProviders>
        </I18nProvider>
      </body>
    </html>
  );
};

export default RootLayout;
