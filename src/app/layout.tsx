import type { Metadata } from "next";
import "../styles/app.css";

import { getSession } from "@/auth/auth";
import CommonProviders from "@/components/providers/CommonProviders";
import I18nProvider from "@/components/providers/I18nProvider";
import { fontKohinoorBanglaRegular } from "@/lib/fonts";
import { cookies } from "next/headers";
import React, { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: {
    default: "TechDiary",
    template: "%s | TechDiary",
  },
  applicationName: "TechDiary",
  referrer: "origin-when-cross-origin",
  keywords: ["TechDiary", "টেকডায়েরি"],
  icons: { icon: "/favicon.png" },
  description: "Homepage of TechDiary",
  metadataBase: new URL("https://www.techdiary.dev"),
  openGraph: {
    title: "TechDiary - টেকডায়েরি",
    description: "চিন্তা, সমস্যা, সমাধান",
    url: "https://www.techdiary.dev",
    siteName: "TechDiary",
    locale: "bn_BD",
    type: "website",
    images: ["https://www.techdiary.dev/og.png"],
  },
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
