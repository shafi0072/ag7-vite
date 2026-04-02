import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";
import es from "@/locales/es.json";
import fr from "@/locales/fr.json";
import de from "@/locales/de.json";
import zh from "@/locales/zh.json";
import ja from "@/locales/ja.json";
import ar from "@/locales/ar.json";
import hi from "@/locales/hi.json";
import bn from "@/locales/bn.json";
import pt from "@/locales/pt.json";
import ru from "@/locales/ru.json";
import tr from "@/locales/tr.json";
import ko from "@/locales/ko.json";
import it from "@/locales/it.json";

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  zh: { translation: zh },
  "zh-tw": { translation: zh },
  ja: { translation: ja },
  ar: { translation: ar },
  hi: { translation: hi },
  bn: { translation: bn },
  pt: { translation: pt },
  "pt-br": { translation: pt },
  ru: { translation: ru },
  tr: { translation: tr },
  ko: { translation: ko },
  it: { translation: it },
};

function getSavedLanguage(): string {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem("ag7_language") || "en";
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
