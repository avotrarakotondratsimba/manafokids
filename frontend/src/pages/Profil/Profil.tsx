import React, { useState, useContext, type FC } from "react";
import {
  Mail,
  Lock,
  Bell,
  Settings,
  Edit,
  LogOut,
  Save,
  X,
  Award,
  Shield,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

interface AuthUser {
  userName?: string;
  email?: string;
  avatarUrl?: string | null;
  division?: string;
  xp?: number;
}

interface AuthContextType {
  authState: {
    user: AuthUser | null;
  };
}

interface UserData {
  name: string;
  email: string;
  notifications: boolean;
  theme: "light" | "dark" | "system";
  language: "fr" | "en";
  division: string;
  xp: number;
}

const Profil: FC = () => {
  const { t } = useTranslation("profile");
  const navigate = useNavigate();
  const themeContext = useContext(ThemeContext);
  const { authState } = useAuth() as AuthContextType;

  const darkMode = themeContext?.darkMode ?? false;
  const setDarkMode = themeContext?.setDarkMode ?? (() => {});

  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const rawName = authState.user?.userName || t("guest");
  const rawEmail = authState.user?.email || "";
  const rawDivision = authState.user?.division || "Non classé";
  const rawXp = authState.user?.xp || 0;

  const defaultUserData: UserData = {
    name: rawName,
    email: rawEmail,
    notifications: true,
    theme: darkMode ? "dark" : "light",
    language: i18n.language as "fr" | "en",
    division: rawDivision,
    xp: rawXp,
  };

  const [userData, setUserData] = useState(defaultUserData);
  const [tempData, setTempData] = useState({ ...defaultUserData });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const getRandomColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const user = {
    name: rawName,
    email: rawEmail,
    avatarUrl: authState.user?.avatarUrl || null,
    initials: getInitials(rawName),
    bgColor: getRandomColor(rawName),
    division: rawDivision,
    xp: rawXp,
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "light" | "dark" | "system";
    setTempData((prev) => ({ ...prev, theme: value }));

    if (value === "dark") {
      setDarkMode(true);
    } else if (value === "light") {
      setDarkMode(false);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setTempData({
      ...tempData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    setUserData({ ...tempData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({ ...userData });
    setIsEditing(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const getDivisionColor = (division: string) => {
    switch (division.toLowerCase()) {
      case "débutant":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "intermédiaire":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "expert":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "élite":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("profileTitle")}
          </h1>
          {user.name !== t("guest") && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isEditing
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white shadow-md hover:shadow-lg`}
            >
              {isEditing ? (
                <>
                  <X size={18} /> {t("cancel")}
                </>
              ) : (
                <>
                  <Edit size={18} /> {t("edit")}
                </>
              )}
            </button>
          )}
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div
              className={`rounded-xl p-6 transition-all ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border shadow-md hover:shadow-lg`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <div className="relative">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={t("userAvatarAlt")}
                      className={`w-24 h-24 rounded-full shadow-md transition-all ${
                        isHovering ? "ring-4 ring-indigo-500/30" : ""
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-md transition-all ${
                        isHovering ? "ring-4 ring-indigo-500/30" : ""
                      } ${user.bgColor}`}
                    >
                      {user.initials}
                    </div>
                  )}
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white shadow-md hover:scale-110 transition-transform">
                      <Edit size={16} />
                    </button>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={tempData.name}
                      onChange={handleInputChange}
                      className="text-2xl font-bold rounded px-3 py-1 w-full mb-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      disabled={user.name === t("guest")}
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {user.name}
                    </h2>
                  )}
                  {user.name === t("guest") && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {t("guestNotice")}
                    </p>
                  )}

                  {/* Division and XP */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 transition-all hover:scale-105 ${getDivisionColor(
                        user.division
                      )}`}
                    >
                      <Shield size={14} />
                      {user.division}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm font-medium flex items-center gap-1 transition-all hover:scale-105">
                      <Award size={14} />
                      {user.xp} XP
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail
                    size={20}
                    className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={tempData.email}
                      onChange={handleInputChange}
                      className="flex-1 rounded px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      disabled={user.name === t("guest")}
                      placeholder={t("email")}
                    />
                  ) : (
                    <span className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {user.email || t("notSpecified")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Security Section */}
            {user.name !== t("guest") && (
              <div
                className={`rounded-xl p-6 transition-all ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border shadow-md hover:shadow-lg`}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                  <Lock
                    size={20}
                    className="text-indigo-600 dark:text-indigo-400"
                  />{" "}
                  {t("security")}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate("/forgot-password")}
                    className="w-full flex justify-between items-center p-3 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {t("password")}
                    </span>
                    <Edit
                      size={16}
                      className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-between items-center p-3 rounded-lg transition-all hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <span className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                      {t("logout")}
                    </span>
                    <LogOut
                      size={16}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Notification Settings */}
            {user.name !== t("guest") && (
              <div
                className={`rounded-xl p-6 transition-all ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border shadow-md hover:shadow-lg`}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                  <Bell
                    size={20}
                    className="text-indigo-600 dark:text-indigo-400"
                  />{" "}
                  {t("notifications")}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t("enableNotifications")}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={tempData.notifications}
                      onChange={handleInputChange}
                      className="sr-only peer"
                      disabled={!isEditing}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* App Preferences */}
            <div
              className={`rounded-xl p-6 transition-all ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border shadow-md hover:shadow-lg`}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <Settings
                  size={20}
                  className="text-indigo-600 dark:text-indigo-400"
                />{" "}
                {t("preferences")}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                    {t("theme")}
                  </label>
                  <select
                    name="theme"
                    value={tempData.theme}
                    onChange={handleThemeChange}
                    className="w-full rounded px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="light">{t("light")}</option>
                    <option value="dark">{t("dark")}</option>
                    <option value="system">{t("system")}</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                    {t("language")}
                  </label>
                  <select
                    name="language"
                    value={tempData.language}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const lang = e.target.value as "fr" | "en";
                      setTempData({ ...tempData, language: lang });
                      i18n.changeLanguage(lang);
                    }}
                    className="w-full rounded px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="fr">{t("fr") || "Français"}</option>
                    <option value="en">{t("en") || "English"}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95"
              >
                <Save size={18} /> {t("save")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
