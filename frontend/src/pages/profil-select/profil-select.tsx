"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FormKidsCreator from "@/components/Profil-selector/form";
import ProfileCard from "@/components/Profil-selector/ProfilCard";

import { useTranslation } from "react-i18next";

interface Profile {
  id: string;
  username: string;
  initials: string;
  color: string;
  age: number;
  birthday: string;
  timeLimit: number;
}

const colors = [
  "bg-gradient-to-br from-blue-500 to-blue-600",
  "bg-gradient-to-br from-purple-500 to-purple-600",
  "bg-gradient-to-br from-green-500 to-green-600",
  "bg-gradient-to-br from-orange-500 to-orange-600",
  "bg-gradient-to-br from-pink-500 to-pink-600",
  "bg-gradient-to-br from-indigo-500 to-indigo-600",
  "bg-gradient-to-br from-red-500 to-red-600",
  "bg-gradient-to-br from-teal-500 to-teal-600",
];

const getInitials = (username: string): string => {
  return username
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};

const ProfilSelect = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const navigate = useNavigate();

  const { t } = useTranslation("login");

  // Charger les profils depuis le localStorage au montage du composant
  useEffect(() => {
    const loadProfiles = () => {
      const childData = localStorage.getItem("childData");
      if (childData) {
        try {
          const parsedData = JSON.parse(childData);
          // Si c'est un seul profil
          if (parsedData.name) {
            const newProfile: Profile = {
              id:
                parsedData.apiData?.kid?.kidId?.toString() ||
                Date.now().toString(),
              username: parsedData.name,
              initials: getInitials(parsedData.name),
              color: colors[0], // Première couleur par défaut
              age: parsedData.age,
              birthday: parsedData.birthday,
              timeLimit: parsedData.timeLimit,
            };
            setProfiles([newProfile]);
          }
          // Si c'est un tableau de profils (si vous modifiez la structure plus tard)
          else if (Array.isArray(parsedData)) {
            const loadedProfiles = parsedData.map((data, index) => ({
              id: data.apiData?.kid?.kidId?.toString() || Date.now().toString(),
              username: data.name,
              initials: getInitials(data.name),
              color: colors[index % colors.length],
              age: data.age,
              birthday: data.birthday,
              timeLimit: data.timeLimit,
            }));
            setProfiles(loadedProfiles);
          }
        } catch (error) {
          console.error("Error parsing childData from localStorage", error);
        }
      }
    };

    loadProfiles();
  }, []);

  const handleCreateProfile = (username: string) => {
    const newProfile: Profile = {
      id: Date.now().toString(),
      username,
      initials: getInitials(username),
      color: colors[profiles.length % colors.length],
      age: 0, // Valeurs par défaut
      birthday: new Date().toISOString().split("T")[0],
      timeLimit: 30,
    };

    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);

    // Sauvegarder dans le localStorage
    const childData = updatedProfiles.map((profile) => ({
      name: profile.username,
      age: profile.age,
      birthday: profile.birthday,
      timeLimit: profile.timeLimit,
      apiData: {
        kid: {
          kidId: parseInt(profile.id),
          kidUserName: profile.username,
        },
      },
    }));

    localStorage.setItem(
      "childData",
      JSON.stringify(childData.length === 1 ? childData[0] : childData)
    );
  };

  const handleDeleteProfile = (id: string) => {
    const updatedProfiles = profiles.filter((profile) => profile.id !== id);
    setProfiles(updatedProfiles);

    // Mettre à jour le localStorage
    if (updatedProfiles.length === 0) {
      localStorage.removeItem("childData");
    } else {
      const childData = updatedProfiles.map((profile) => ({
        name: profile.username,
        age: profile.age,
        birthday: profile.birthday,
        timeLimit: profile.timeLimit,
        apiData: {
          kid: {
            kidId: parseInt(profile.id),
            kidUserName: profile.username,
          },
        },
      }));
      localStorage.setItem(
        "childData",
        JSON.stringify(childData.length === 1 ? childData[0] : childData)
      );
    }
  };

  const handleSelectProfile = (profile: Profile) => {
    navigate("/");
    // Vous pouvez aussi sauvegarder le profil sélectionné dans le localStorage si besoin
    localStorage.setItem("selectedProfile", JSON.stringify(profile));
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 min-h-screen w-full">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {t("select_profil")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{t("choose")}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* Bouton pour créer un nouveau profil */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Card className="w-24 h-24 border-2 border-dashed border-gray-300 hover:border-blue-400 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg bg-white/50 backdrop-blur-sm">
                <Plus className="w-8 h-8 text-gray-400 hover:text-blue-500 transition-colors" />
              </Card>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-0 shadow-xl">
              <div className="bg-white rounded-lg p-6">
                <FormKidsCreator
                  onSubmit={handleCreateProfile}
                  onClose={() => setIsPopoverOpen(false)}
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* Profils existants */}
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              username={profile.username}
              initials={profile.initials}
              color={profile.color}
              onDelete={() => handleDeleteProfile(profile.id)}
              onClick={() => handleSelectProfile(profile)}
            />
          ))}
        </div>

        {profiles.length === 0 && (
          <div className="text-center mt-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg">
              {t("nothing")}
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {t("click")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilSelect;
