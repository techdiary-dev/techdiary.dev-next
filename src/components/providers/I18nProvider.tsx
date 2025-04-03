"use client";

import React, { PropsWithChildren } from "react";
import { useHydrateAtoms } from "jotai/utils";
import { i18nLangAtom } from "@/store/i18n-lang.atom";
import { jotaiStore } from "@/store/store";

interface Props {
  currentLanguage?: string;
}
const I18nProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
  currentLanguage,
}) => {
  useHydrateAtoms([[i18nLangAtom, currentLanguage]] as any, {
    dangerouslyForceHydrate: true,
    store: jotaiStore,
  });

  return <>{children}</>;
};

export default I18nProvider;
