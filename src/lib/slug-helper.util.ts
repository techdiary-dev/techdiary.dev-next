/*
 * File: slug-helper.util.ts
 * Responsibility: Utility functions for slug generation. 
 *  - slugify: Converts a given title to a slug format, handling both English and Bangla text.
 *  - separateWords: it can separate words from a given string.
 *  - maxLength: it can trim the max length of a given string and handle the word completion.

 * Author: Rasel Hossain
 * Created: 2025-04-02
 * Last Modified By: Null
 * Last Modified At: Null
 * Version: 1.0.0

 */

const banglaToEnglishMap: Record<string, string> = {
  অ: "o",
  আ: "a",
  ই: "i",
  ঈ: "ee",
  উ: "u",
  ঊ: "oo",
  ঋ: "ri",
  এ: "e",
  ঐ: "oi",
  ও: "o",
  ঔ: "ou",
  ক: "k",
  খ: "kh",
  গ: "g",
  ঘ: "gh",
  ঙ: "ng",
  চ: "ch",
  ছ: "chh",
  জ: "j",
  ঝ: "jh",
  ঞ: "n",
  ট: "t",
  ঠ: "th",
  ড: "d",
  ঢ: "dh",
  ণ: "n",
  ত: "t",
  থ: "th",
  দ: "d",
  ধ: "dh",
  ন: "n",
  প: "p",
  ফ: "ph",
  ব: "b",
  ভ: "bh",
  ম: "m",
  য: "y",
  র: "r",
  ল: "l",
  শ: "sh",
  ষ: "sh",
  স: "s",
  হ: "h",
  ড়: "r",
  ঢ়: "rh",
  য়: "y",
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9",

  // Handle special phonetic cases
  "া": "a",
  "ি": "i",
  "ী": "ee",
  "ু": "u",
  "ূ": "oo",
  "ৃ": "ri",
  "ে": "e",
  "ৈ": "oi",
  "ো": "o",
  "ৌ": "ou",
  "ং": "ng",
  "ঃ": "h",
  "ঁ": "",
};

type SlugifyOptions = Partial<{
  separator: string;
  maxLength: number;
}>;

const DEFAULT_OPTIONS: Required<SlugifyOptions> = {
  separator: "-",
  maxLength: 100,
};

/**
 * Converts a given title to a slug format, handling both English and Bangla text.
 * @param title The text to convert to a slug
 * @property {options.separator} [separator="-"] - Character to use as word separator
 * @property {option.maxLength} [maxLength=100] - Maximum length of the generated slug
 * @example ```
 * const slug= slugify("আমি তোমাকে ভালোবাসি", { separator: "-", maxLength: 10 });
 * console.log(slug); // ami-tomake
 * ```
 */
export function slugify(title: string, options?: SlugifyOptions): string {
  if (title.length === 0) return "";

  // Merge options with defaults
  const { separator, maxLength } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  // Escape special characters in separator for regex
  const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Convert Bangla to English
  title = title
    .split("")
    .map((char) => banglaToEnglishMap[char] || char)
    .join("");

  // Normalize text: Remove special characters except separator, letters, numbers, and spaces
  title = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(new RegExp(`[^a-zA-Z0-9\\s${separator}]`, "g"), "") // Keep only letters, numbers, and spaces
    .trim()
    .replace(/\s+/g, escapedSeparator) // Replace multiple spaces/dashes with a single separator
    .toLowerCase();

  /**
   * Trim the max length and handle the word completion
   * example1: maxLength = 10, separator = "-", title = "আমি তোমাকে ভালোবাসি"
   * result = 'ami-tomake"
   *
   * example2: maxLength = 5, separator = "-", title = "আমি তোমাকে ভালবাসি"
   * result = "ami" it will remove the last separator because the word is not complete
   * */
  if (maxLength && title.length > maxLength) {
    const lastSeparatorIndex = title.lastIndexOf(separator, maxLength);
    title =
      lastSeparatorIndex > 0
        ? title.substring(0, lastSeparatorIndex)
        : title.substring(0, maxLength);
  }

  // Remove leading/trailing separators
  // this logic is more efficient then if , else case with startWith and endsWith condition
  title = title.replace(
    new RegExp(`^${escapedSeparator}+|${escapedSeparator}+$`, "g"),
    ""
  );

  return title;
}
