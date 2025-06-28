import React, { useState } from "react";
import {
  GameIcon,
  CodeBlocksIcon,
  VideoLearningIcon,
  QuizIcon,
  AIAssistantIcon,
} from "./bento/index";

import { useTranslation } from "react-i18next";

interface FeatureCardProps {
  title: string;
  description: string;
  bgColor: string;
  darkBgColor: string;
  icon: React.ReactNode;
  className?: string;
  isLarge?: boolean;
}

function FeatureCard({
  title,
  description,
  bgColor,
  darkBgColor,
  icon,
  className = "",
  isLarge = false,
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        ${bgColor} ${darkBgColor} ${className}
        rounded-3xl p-6 shadow-md border-2 border-white/50 dark:border-gray-700/50
        hover:scale-105 hover:shadow-xl hover:-translate-y-1
        dark:hover:shadow-2xl dark:hover:shadow-purple-500/20
        transition-all duration-300 ease-out
        cursor-pointer group
        ${isLarge ? "col-span-full" : ""}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex ${
          isLarge
            ? "flex-row items-center gap-8"
            : "flex-col items-center text-center gap-4"
        }`}
      >
        <div
          className={`transition-transform duration-300 ${
            isHovered ? "scale-110" : ""
          }`}
        >
          {icon}
        </div>
        <div className={isLarge ? "flex-1" : ""}>
          <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BentoGrid() {
  const { t } = useTranslation("home"); // ✅ Corrigé ici

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">
            {t("subtitle")}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FeatureCard
            title={t("courses.title")}
            description={t("courses.description")}
            bgColor="bg-blue-100"
            darkBgColor="dark:bg-blue-900/40"
            icon={<VideoLearningIcon />}
          />
          <FeatureCard
            title={t("games.title")}
            description={t("games.description")}
            bgColor="bg-orange-100"
            darkBgColor="dark:bg-orange-900/40"
            icon={<GameIcon />}
          />
          <FeatureCard
            title={t("quiz.title")}
            description={t("quiz.description")}
            bgColor="bg-green-100"
            darkBgColor="dark:bg-green-900/40"
            icon={<QuizIcon />}
          />
          <FeatureCard
            title={t("code.title")}
            description={t("code.description")}
            bgColor="bg-yellow-100"
            darkBgColor="dark:bg-yellow-900/40"
            icon={<CodeBlocksIcon />}
          />
        </div>

        {/* Assistante IA */}
        <FeatureCard
          title={t("assistant.title")}
          description={t("assistant.description")}
          bgColor="bg-purple-100"
          darkBgColor="dark:bg-purple-900/40"
          icon={<AIAssistantIcon />}
          isLarge
          className="min-h-[200px]"
        />

        {/* Footer */}
        <div className="text-center mt-12 p-6">
          <div className="flex justify-center items-center gap-4 text-2xl mb-4">
            <span className="animate-bounce">🚀</span>
            <span className="animate-pulse">✨</span>
            <span className="animate-bounce">🎨</span>
            <span className="animate-pulse">🌈</span>
            <span className="animate-bounce">🎯</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">
            {t("footer")}
          </p>
        </div>
      </div>
    </section>
  );
}
