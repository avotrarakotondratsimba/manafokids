import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // 👈 Importer i18n

interface CourseFilterProps {
  selected: string;
  onChange: (cat: string) => void;
}

const CourseFilter: React.FC<CourseFilterProps> = ({ selected, onChange }) => {
  const { t } = useTranslation("cours"); // 👈 Utilise le namespace "cours"
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const childData = localStorage.getItem("childData");
        let birthDate = "";

        if (childData) {
          try {
            const parsedData = JSON.parse(childData);
            birthDate = Array.isArray(parsedData)
              ? parsedData[0]?.birthday || ""
              : parsedData.birthday || "";
          } catch (err) {
            console.error("Erreur de parsing childData:", err);
          }
        }

        const apiUrl = `${
          import.meta.env.VITE_API_URL
        }/api/themes?birthDate=${birthDate}`;

        const response = await fetch(apiUrl, {
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const themeNames = result.data.map((theme: any) => theme.themeName);
          setCategories([t("all"), ...themeNames]); // 👈 Traduction ici
        } else {
          console.error("Réponse inattendue :", result);
        }
      } catch (error) {
        console.error("Erreur fetch :", error);
      }
    };

    fetchThemes();
  }, [t]); // 👈 Inclure `t` comme dépendance

  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="w-full sm:w-auto px-3 py-2
               border border-gray-300 dark:border-gray-600
               rounded-lg
               focus:outline-none
               focus:ring-1 focus:ring-blue-500
               focus:border-blue-500 dark:focus:border-blue-400
               text-sm
               bg-white dark:bg-gray-800
               text-gray-900 dark:text-white
               transition-colors duration-200"
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
};

export default CourseFilter;
