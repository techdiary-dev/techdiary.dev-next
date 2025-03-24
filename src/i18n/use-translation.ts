import bn from "@/i18n/bn.json";
import { i18nLangAtom } from "@/store/i18n-lang.atom";
import { useAtom } from "jotai";
import { setLanguage } from "./i18n.server-action";
const dictionaries: {
  [key: string]: any;
} = { bn };

export const useTranslation = () => {
  const [lang, setLang] = useAtom(i18nLangAtom);
  return {
    _t: (key: string) => dictionaries?.[lang || "en"]?.[key] || key,
    lang,
    toggle: () => {
      setLang(lang === "en" ? "bn" : "en");
      setLanguage(lang === "en" ? "bn" : "en");
    },
  };
};
