// src/utils/getLanguageName.ts
import { $Enums } from "@prisma/client";

// We accept string keys instead of forcing exact enum literals.
// This is simpler and avoids weird TS edge cases.
export const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिन्दी)",
  bn: "Bengali (বাংলা)",
  gu: "Gujarati (ગુજરાતી)",
  kn: "Kannada (ಕನ್ನಡ)",
  ml: "Malayalam (മലയാളം)",
  mr: "Marathi (मराठी)",
  ne: "Nepali (नेपाली)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
  sa: "Sanskrit (संस्कृत)",
  ta: "Tamil (தமிழ்)",
  te: "Telugu (తెలుగు)",
  ur: "Urdu (اردو)",

  es: "Spanish (Español)",
  pt: "Portuguese (Português)",
}

export function getLanguageName(code: $Enums.LanguageType | null | undefined): string {
  if (!code) return "Unknown";
  return LANGUAGE_NAMES[code] ?? "Unknown";
}

export function getLanguageOptions(){
  return Object.entries(LANGUAGE_NAMES).map(
    ([value, label]) => ({
      value,
      label,
    })
  )
}