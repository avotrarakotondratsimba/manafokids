// lib/profileUtils.ts

export interface Profile {
  id: string;
  username: string;
  initials: string;
  color: string;
}

export const PROFILES_STORAGE_KEY = "techkids_profiles";

export const colors = [
  "bg-gradient-to-br from-blue-500 to-blue-600",
  "bg-gradient-to-br from-purple-500 to-purple-600",
  "bg-gradient-to-br from-green-500 to-green-600",
  "bg-gradient-to-br from-orange-500 to-orange-600",
  "bg-gradient-to-br from-pink-500 to-pink-600",
  "bg-gradient-to-br from-indigo-500 to-indigo-600",
  "bg-gradient-to-br from-red-500 to-red-600",
  "bg-gradient-to-br from-teal-500 to-teal-600",
];

export const getInitials = (username: string): string => {
  return username
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};

/**
 * Charge les profils depuis le local storage.
 * @returns {Profile[]} Le tableau des profils ou un tableau vide.
 */
export const loadProfiles = (): Profile[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const storedProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
    return storedProfiles ? JSON.parse(storedProfiles) : [];
  } catch (error) {
    console.error("Failed to load profiles from local storage:", error);
    return [];
  }
};

/**
 * Sauvegarde les profils dans le local storage.
 * @param {Profile[]} profiles Le tableau des profils à sauvegarder.
 */
export const saveProfiles = (profiles: Profile[]): void => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error("Failed to save profiles to local storage:", error);
  }
};
