import React from "react";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const { t } = useTranslation("cours");

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={t("search_placeholder")}
        className="w-full pl-4 pr-4 py-2 
                   bg-white dark:bg-gray-800 
                   border border-gray-300 dark:border-gray-600 
                   text-sm text-gray-900 dark:text-white 
                   placeholder-gray-400 dark:placeholder-gray-500 
                   rounded-lg 
                   focus:outline-none 
                   focus:ring-1 focus:ring-blue-500 
                   focus:border-blue-500 dark:focus:border-blue-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 absolute right-3 top-2.5 text-gray-400 dark:text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

export default SearchBar;
