import bn from "@/i18n/bn.json";
import { i18nLangAtom } from "@/store/i18n-lang.atom";
import { useAtomValue } from "jotai";
const dictionaries: {
  [key: string]: any;
} = { bn };

export const useTranslation = () => {
  const _lang = useAtomValue(i18nLangAtom) || "en";
  return {
    _t: (key: string) => dictionaries[_lang]?.[key] || key,
    currentLang: _lang,
  };
};
