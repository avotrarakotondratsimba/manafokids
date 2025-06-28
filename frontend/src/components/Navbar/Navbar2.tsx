import React, { useEffect, useState, useRef } from "react";
import {
  User,
  Menu,
  X,
  UserCircle,
  LogOut,
  Moon,
  Sun,
  LogIn,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getInitials, getRandomColor } from "../../utils/avatar";
import confetti from "canvas-confetti";
import LanguageSelector from "../Languageselector/LanguageSelector";

import { useTheme } from "@/components/theme-provider";
import Logo from "/images/logo1.png";

import { useTranslation } from "react-i18next";

interface MenuItem {
  label: string;
  href: string;
}

interface LocalStorageUser {
  name: string;
  age?: number;
  birthday?: string;
  timeLimit?: number;
  apiData?: {
    kid?: {
      kidId: number;
      kidUserName: string;
    };
  };
}

const Navbar: React.FC = () => {
  const { t } = useTranslation("navbar");
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [localUser, setLocalUser] = useState<LocalStorageUser | null>(null);
  const userIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserModalOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const childData = localStorage.getItem("childData");
    if (childData) {
      try {
        const parsedData = JSON.parse(childData);
        setLocalUser(parsedData);
      } catch (error) {
        console.error("Error parsing childData from localStorage", error);
      }
    }
  }, []);

  const user = localUser
    ? {
        name: localUser.name || t("guest"),
        email: "",
        avatarUrl: null,
        initials: getInitials(localUser.name || ""),
        bgColor: getRandomColor(localUser.name || ""),
      }
    : null;

  const handleViewProfile = () => {
    if (localUser) {
      navigate("/profil-select");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("childData");
    localStorage.removeItem("selectedProfile");
    navigate("/login");
  };

  const menuItems: MenuItem[] = [
    { label: t("home"), href: "/" },
    { label: t("Cours"), href: "/cours" },
    { label: t("Jeu"), href: "/jeu" },
    { label: t("Galerie 3D"), href: "/sujet-3d" },
    { label: t("AgentIA"), href: "/chat" },
  ];

  const handleDarkModeToggle = () => {
    if (location.pathname === "/") {
      const audio = new Audio("/sounds/theme-toggle.mp3");
      audio.play();

      confetti({
        angle: 90,
        spread: 360,
        startVelocity: 60,
        particleCount: 150,
        origin: { x: 0.5, y: 0.5 },
      });
    }

    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="md:px-14 px-6 pt-2 sticky top-0 z-50 font-baloo bg-gradient-to-tr from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between w-full">
          <div className="text-2xl text-[var(--text-color)]">
            <div className="text-2xl text-[var(--text-color)]">
              <img className="w-45" src={Logo} />
            </div>
          </div>

          {/* Menu Desktop */}
          <div className="hidden lg:flex space-x-6 items-center relative">
            <ul className="flex space-x-6 bg-[#05AEED] py-3 px-6 rounded-4xl font-baloo font-semibold">
              {menuItems.map(({ label, href }) => (
                <li key={label} className="nav-item">
                  <Link className="text-white!" to={href}>
                    <span className="text-white hover:text-black tracking-[0.1em] transition">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={handleDarkModeToggle}
              className="cursor-pointer text-[var(--text-color)]"
              aria-label={t("toggle_theme")}
            >
              {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            <LanguageSelector />

            {user ? (
              <div className="relative">
                <div
                  ref={userIconRef}
                  onClick={() => setUserModalOpen((prev) => !prev)}
                  className="cursor-pointer"
                  aria-label={t("user_menu")}
                  tabIndex={0}
                  onKeyDown={() => setUserModalOpen((prev) => !prev)}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                    style={{ backgroundColor: user.bgColor }}
                  >
                    {user.initials}
                  </div>
                </div>

                {userModalOpen && (
                  <div
                    className="absolute right-0 top-full mt-4 w-72 bg-[var(--bg-user-modal)] border border-[var(--border)] rounded-2xl shadow-lg z-50 animate-fade-in transition-all"
                    style={{
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                    }}
                  >
                    <div className="p-6 flex flex-col items-center text-center space-y-4">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-sm"
                        style={{ backgroundColor: user.bgColor }}
                      >
                        {user.initials}
                      </div>

                      <div>
                        <div className="text-lg font-semibold tracking-wide text-[var(--text-color)]">
                          {user.name}
                        </div>
                      </div>

                      <div className="mt-3 w-full flex flex-col gap-4">
                        <button
                          onClick={handleViewProfile}
                          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl bg-[var(--accent)] text-white font-medium hover:scale-105 transition-transform duration-200"
                        >
                          <UserCircle className="w-5 h-5" />
                          {t("edit_profile")}
                        </button>

                        <button
                          onClick={handleLogout}
                          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-full border border-[var(--border)] text-[var(--text-color)] font-medium hover:scale-105 transition-transform duration-200"
                        >
                          <LogOut className="w-5 h-5" />
                          {t("change_profile")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-semibold transition hover:scale-105 duration-200"
              >
                {t("login")}
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={handleDarkModeToggle}
              className="cursor-pointer text-[var(--text-color)]"
              aria-label={t("toggle_theme")}
            >
              {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            <LanguageSelector />

            {user ? (
              <button
                onClick={handleViewProfile}
                aria-label={t("edit_profile")}
                className="text-[var(--text-color)]"
              >
                <User size={24} />
              </button>
            ) : (
              <Link to="/login" aria-label={t("login")}>
                <LogIn size={24} className="text-[var(--text-color)]" />
              </Link>
            )}

            {menuOpen ? (
              <X
                size={24}
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer text-[var(--text-color)]"
              />
            ) : (
              <Menu
                size={24}
                onClick={() => setMenuOpen(true)}
                className="cursor-pointer text-[var(--text-color)]"
              />
            )}
          </div>
        </div>

        {/* Mobile Menu Items */}
        {menuOpen && (
          <div className="lg:hidden absolute left-0 w-full bg-[var(--background)] border border-[var(--border)] z-50">
            <ul className="flex flex-col items-center space-y-4 py-6">
              {menuItems.map(({ label, href }) => (
                <li key={label} className="nav-item">
                  <Link
                    to={href}
                    className="text-[var(--text-color)] hover:text-[var(--accent)] transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
