import React from "react";
import { useTranslation } from "react-i18next"; // 👈 Import i18n

export interface Module {
  moduleId: number;
  moduleName: string;
  moduleUrl: string | null;
  themeId: number;
  ageGroup: number;
  theme: {
    themeId: number;
    themeName: string;
    themeUrl: string | null;
    ageGroup: number;
  };
  lessons: any[];
}

interface CourseCardProps {
  course: Module;
  onViewCourse?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onViewCourse }) => {
  const { t } = useTranslation("cours"); // 👈 Utilise le namespace "cours"

  const imageUrl = course.moduleUrl || "https://via.placeholder.com/300x200";
  const progress = 0;
  const duration = "30 min";

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 flex flex-col h-full border border-gray-100 hover:border-blue-100 dark:hover:border-blue-400">
      {/* Image */}
      <div className="relative h-60 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={course.moduleName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <span
          style={{ background: "var(--accent)" }}
          className="absolute top-2 left-2 text-white text-xs font-medium px-2 py-0.5 rounded"
        >
          {course.theme.themeName}
        </span>
      </div>

      {/* Contenu */}
      <div className="flex-1 flex flex-col p-4 space-y-3">
        {/* Titre et durée */}
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white leading-tight truncate w-[70%]">
            {course.moduleName}
          </h2>

          <span className="flex items-center text-xs text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {duration}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
          {course.theme.themeName} <br />-{" "}
          {t("for_ages", { age: course.ageGroup })}
        </p>

        {/* Barre de progression */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{t("progress")}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bouton */}
        <button
          onClick={onViewCourse}
          style={{
            background: "var(--accent)",
            color: "#fff",
          }}
          className="mt-2 w-full py-2 rounded-md transition-all duration-200 flex items-center justify-center text-sm font-medium shadow-sm hover:shadow"
        >
          {t("continue")}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
