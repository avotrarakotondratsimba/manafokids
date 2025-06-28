import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import profileFR from "./fr/profile.json";
import profileEN from "./eng/profile.json";

import loginFR from "./fr/login.json";
import loginEN from "./eng/login.json";

import homeFR from "./fr/home.json";
import homeEN from "./eng/home.json";

import navbarFR from "./fr/navbar.json";
import navbarEN from "./eng/navbar.json";

import coursFR from "./fr/cours.json";
import coursEN from "./eng/cours.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        profile: profileFR,
        home: homeFR,
        navbar: navbarFR,
        login: loginFR,
        cours: coursFR,
      },
      en: {
        profile: profileEN,
        home: homeEN,
        navbar: navbarEN,
        login: loginEN,
        cours: coursEN,
      },
    },
    fallbackLng: "fr",
    ns: ["profile", "home", "navbar", "login", "cours"],
    defaultNS: "profile",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
