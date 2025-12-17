import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import pt from "./locales/pt/translate.json";
import en from "./locales/en/translate.json";

const savedLanguage = localStorage.getItem("lang") || "pt";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
    },
    lng: savedLanguage,
    fallbackLng: "pt", //idioma padrão
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
});

export default i18n;
