import { i18nLangAtom } from "@/store/i18n-lang.atom";
import { useAtomValue } from "jotai";

import bn from "@/i18n/bn.json";

const dictionaries: {
  [key: string]: any;
} = { bn };

const _t = (key: string) => {
  const _lang = useAtomValue(i18nLangAtom) || "bn";
  return dictionaries[_lang]?.[key] || key;
};

export default _t;
