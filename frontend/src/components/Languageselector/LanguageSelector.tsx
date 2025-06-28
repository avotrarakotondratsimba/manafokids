import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSelector.css";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { i18n } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = [
    { code: "fr", name: "Français", flag: "/images/fr.png" },
    { code: "en", name: "English", flag: "/images/us.png" },
    // Ajoutez d'autres langues si nécessaire
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="lang-selector" ref={dropdownRef}>
      <button
        className="lang-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
      >
        {currentLanguage && (
          <>
            <img
              src={currentLanguage.flag}
              alt={currentLanguage.name}
              className="lang-flag"
            />
            <span className="lang-text">
              {currentLanguage.code.toUpperCase()}
            </span>
          </>
        )}
      </button>

      <div className={`lang-dropdown ${isOpen ? "open" : ""}`}>
        {languages.map((lang) => (
          <div
            key={lang.code}
            className={`lang-option ${
              i18n.language === lang.code ? "active" : ""
            }`}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <img src={lang.flag} alt={lang.name} className="lang-flag" />
            <span className="lang-text">{lang.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
