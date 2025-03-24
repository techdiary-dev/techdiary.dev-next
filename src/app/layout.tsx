import type { Metadata } from "next";
import "../styles/app.css";

import { getSession } from "@/auth/auth";
import CommonProviders from "@/components/providers/CommonProviders";
import I18nProvider from "@/components/providers/I18nProvider";
import { fontKohinoorBanglaRegular } from "@/lib/fonts";
import { cookies } from "next/headers";
import React, { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Techdiary - %s",
  openGraph: { title: "Techdiary" },
  icons: { icon: "/favicon.png" },
};

const RootLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  const _cookies = await cookies();
  const session = await getSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={fontKohinoorBanglaRegular.style}>
        <I18nProvider currentLanguage={_cookies.get("language")?.value || "en"}>
          <CommonProviders session={session}>{children}</CommonProviders>
        </I18nProvider>
      </body>
    </html>
  );
};

export default RootLayout;
