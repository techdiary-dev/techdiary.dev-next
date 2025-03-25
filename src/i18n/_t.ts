"use server";

import { cookies } from "next/headers";
import bn from "@/i18n/bn.json";

const dictionaries: {
  [key: string]: any;
} = { bn };

const _t = async (key: string) => {
  const cookiesStore = await cookies();
  const _lang = cookiesStore.get("language")?.value || "en";
  return dictionaries[_lang]?.[key] || key;
};

export const getLang = async () => {
  const cookiesStore = await cookies();
  const _lang = cookiesStore.get("language")?.value || "en";
  return _lang;
};

export default _t;
