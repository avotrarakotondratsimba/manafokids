import React, { useState, useEffect } from "react";
import type { Module } from "@/components/course-card/CourseCard"; // Modifié Course en Module
import CourseCard from "@/components/course-card/CourseCard";
import CourseFilter from "@/components/course-card/CourseFilter";
import SearchBar from "@/components/course-card/SearchBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ApiResponse {
  data: Module[]; // Modifié Course[] en Module[]
  success: boolean;
  message?: string;
}

const Courses: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [courses, setCourses] = useState<Module[]>([]); // Modifié Course[] en Module[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation("cours");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const childData = localStorage.getItem("childData");
        let birthDate = "";

        if (childData) {
          try {
            const parsedData = JSON.parse(childData);
            if (Array.isArray(parsedData)) {
              birthDate = parsedData[0]?.birthday || "";
            } else {
              birthDate = parsedData.birthday || "";
            }
          } catch (err) {
            console.error("Erreur de parsing childData:", err);
          }
        }

        const apiUrl = `${
          import.meta.env.VITE_API_URL
        }/api/modules?birthDate=${birthDate}`;

        const response = await fetch(apiUrl, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message || `Erreur HTTP! Statut: ${response.status}`
          );
        }

        const data: ApiResponse = await response.json();

        if (!data.success) {
          throw new Error(data.message || "La requête a échoué");
        }

        if (!data.data || !Array.isArray(data.data)) {
          throw new Error("Format de données invalide");
        }

        // Transformation des données pour correspondre à l'interface Module
        const formattedData = data.data.map((module) => ({
          ...module,
          // Ajoutez ici des champs supplémentaires si nécessaire
        }));

        setCourses(formattedData);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Une erreur inconnue est survenue";
        setError(errorMessage);
        console.error("Erreur lors du chargement des cours:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewCourse = (moduleId: number) => {
    // Changé id en moduleId pour correspondre à l'interface
    navigate(`/cours/${moduleId}`);
  };

  // Filtrer les modules
  const filteredCourses = courses.filter((module) => {
    const title = module.moduleName?.toLowerCase() || ""; // Changé course.title en module.moduleName
    const category = module.theme?.themeName || ""; // Utilisation du nom du thème comme catégorie
    return (
      title.includes(search.toLowerCase()) &&
      (filter === "Tous" || category === filter)
    );
  });

  if (loading) {
    return (
      <div className="p-6 max-w-[85rem] mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-[85rem] mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-medium mb-2">{t("error_title")}</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pt-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 
    text-[var(--foreground)]"
    >
      <div
        className="p-6 max-w-[85rem] mx-auto min-h-screen 
        text-[var(--foreground)]"
      >
        {" "}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {t("title")}
            </h1>
            <p className="text-gray-500 mt-1 dark:text-gray-300">
              {t("subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex-1 min-w-[200px]">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <div className="w-full sm:w-auto">
              <CourseFilter selected={filter} onChange={setFilter} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map(
            (
              module // Changé course en module
            ) => (
              <CourseCard
                key={module.moduleId} // Changé course.id en module.moduleId
                course={module}
                onViewCourse={() => handleViewCourse(module.moduleId)} // Changé course.id en module.moduleId
              />
            )
          )}
        </div>
        {filteredCourses.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {t("no_results_title")}
            </h3>
            <p className="text-gray-500">{t("no_results_description")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
