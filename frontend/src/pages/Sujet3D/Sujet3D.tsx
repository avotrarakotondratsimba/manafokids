import React, { useState } from "react";
import Single3DView from "../../components/model-view-3d/Single3DView";
import { useTranslation } from "react-i18next";

const images = [
  { id: 1, title: "Ordinateur", src: "/images/ordinateur.jpg", route: "/3d/1" },
  { id: 2, title: "CPU", src: "/images/cpu.jpg", route: "/3d/2" },
  { id: 3, title: "Microscope", src: "/images/microscope.jpg", route: "/3d/3" },
  { id: 5, title: "Clavier", src: "/images/clavier.jpg", route: "/3d/4" },
  { id: 6, title: "Souris", src: "/images/souris.jpg", route: "/3d/5" },
  { id: 7, title: "Configuration", src: "/images/setup.jpg", route: "/3d/6" },
];

export default function Sujet3D() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const { t } = useTranslation("cours");

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12">
            {t("gallery_title")}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-2 bg-white dark:bg-gray-700"
                onClick={() => setSelectedModel(item.id.toString())}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <h3 className="text-white text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {t("badge_3d")}
                  </span>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 transition-colors duration-300">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-300 text-sm">
                      {t("click_to_view")}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal 3D */}
        {selectedModel && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Fond sombre */}
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
                onClick={() => setSelectedModel(null)}
              >
                <div className="absolute inset-0 bg-black opacity-75"></div>
              </div>

              {/* Contenu du modal */}
              <div className="inline-block align-bottom rounded-lg text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <Single3DView
                  id={selectedModel}
                  onClose={() => setSelectedModel(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
