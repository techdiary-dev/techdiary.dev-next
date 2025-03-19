import bn from "@/i18n/bn.json";

const dictionaries: {
  [key: string]: any;
} = { bn };

const _t = async (key: string) => {
  return key;
  // const cookiesManager = await cookies();
  // const _lang = cookiesManager.get("language")?.value || "en";
  // return dictionaries[_lang]?.[key] || key;
};

export default _t;
