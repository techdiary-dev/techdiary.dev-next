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

/**
 * Converts a given title to a slug format, handling both English and Bangla text.
 * @param title The text to convert to a slug
 * @param separator The character to use as a separator (defaults to "-")
 * @returns The slugified string
 */
export function slugify(title: string, separator: string = "-"): string {
  // Convert Bangla to English
  title = title
    .split("")
    .map((char) => banglaToEnglishMap[char] || char)
    .join("");

  // Normalize text: Remove special characters except separator, letters, numbers, and spaces
  title = title.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
  title = title.replace(/[^a-zA-Z0-9\s-]/g, ""); // Keep only letters, numbers, and spaces

  // Replace multiple spaces/dashes with a single separator
  title = title.trim().replace(/\s+/g, separator).toLowerCase();

  return title;
}
