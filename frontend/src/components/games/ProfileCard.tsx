"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { kidAPI } from "@/service/api";

const ProfileCard = () => {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const { currentKid, setCurrentKid, getDivisionColor } = useGameStore();

  const avatars = ["🚀", "🤖", "👾", "🦄", "🐱", "🐶", "🦊", "🐼", "🦁", "🐸"];

  const handleAvatarChange = async (newAvatar: string) => {
    if (!currentKid) return;

    try {
      await kidAPI.updateProfilePic(currentKid.kidId, newAvatar);
      setCurrentKid({ ...currentKid, profilePic: newAvatar });
      setIsEditingAvatar(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar:", error);
      // Mettre à jour localement même en cas d'erreur
      setCurrentKid({ ...currentKid, profilePic: newAvatar });
      setIsEditingAvatar(false);
    }
  };

  const getAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getNextLevelXp = () => {
    return currentKid ? currentKid.level * 100 : 100;
  };

  const getProgressToNextLevel = () => {
    if (!currentKid) return 0;
    const currentLevelXp = (currentKid.level - 1) * 100;
    const nextLevelXp = currentKid.level * 100;
    const progress = currentKid.totalXp - currentLevelXp;
    const total = nextLevelXp - currentLevelXp;
    return Math.min((progress / total) * 100, 100);
  };

  const badgeInfo = {
    "robot-builder": { name: "Constructeur de Robot", emoji: "🤖" },
    "tech-genius": { name: "Génie Technologique", emoji: "🧠" },
    "circuit-master": { name: "Maître des Circuits", emoji: "⚡" },
    explorer: { name: "Explorateur", emoji: "🚀" },
    student: { name: "Étudiant Motivé", emoji: "📚" },
    champion: { name: "Champion", emoji: "🏆" },
  };

  if (!currentKid) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div
        className={`bg-gradient-to-r ${getDivisionColor(
          currentKid.divisionName
        )} rounded-3xl p-8 text-center text-white`}
      >
        <div className="relative inline-block mb-6">
          <div className="text-8xl mb-4">{currentKid.profilePic || "🚀"}</div>
          <button
            onClick={() => setIsEditingAvatar(true)}
            className="absolute -bottom-2 -right-2 bg-yellow-400 text-gray-800 rounded-full p-2 text-sm font-bold hover:bg-yellow-500 transition-colors"
          >
            ✏️
          </button>
        </div>

        <h2 className="text-4xl font-bold mb-2">
          Salut {currentKid.kidUserName} ! 👋
        </h2>
        <p className="text-xl opacity-90">
          {getAge(currentKid.birthDate)} ans • Explorateur Technologique
        </p>
        <p className="text-lg opacity-80 mt-2">
          Division:{" "}
          <span className="font-bold text-yellow-200">
            {currentKid.divisionName.toUpperCase()}
          </span>
        </p>

        <div className="mt-6 bg-white/20 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Niveau {currentKid.level}</span>
            <span className="font-medium">Niveau {currentKid.level + 1}</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-4 mb-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${getProgressToNextLevel()}%` }}
            ></div>
          </div>
          <p className="text-sm opacity-80">
            {currentKid.totalXp} / {getNextLevelXp()} XP pour le niveau suivant
          </p>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {isEditingAvatar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Choisis ton nouvel avatar ! 🎨
            </h3>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => handleAvatarChange(avatar)}
                  className={`text-4xl p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                    currentKid.profilePic === avatar
                      ? "bg-yellow-400 shadow-lg"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsEditingAvatar(false)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl p-6 text-white text-center">
          <div className="text-4xl mb-3">🏆</div>
          <div className="text-3xl font-bold">{currentKid.badges.length}</div>
          <div className="text-sm opacity-90">Badges obtenus</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white text-center">
          <div className="text-4xl mb-3">⭐</div>
          <div className="text-3xl font-bold">{currentKid.totalXp}</div>
          <div className="text-sm opacity-90">XP total</div>
        </div>

        <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-6 text-white text-center">
          <div className="text-4xl mb-3">📈</div>
          <div className="text-3xl font-bold">{currentKid.level}</div>
          <div className="text-sm opacity-90">Niveau actuel</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl p-6 text-white text-center">
          <div className="text-4xl mb-3">🔥</div>
          <div className="text-3xl font-bold">{currentKid.weekXp}</div>
          <div className="text-sm opacity-90">XP cette semaine</div>
        </div>
      </div>

      {/* Division Progress */}
      <div
        className={`bg-gradient-to-r ${getDivisionColor(
          currentKid.divisionName
        )} rounded-3xl p-6 text-center text-white`}
      >
        <h3 className="text-2xl font-bold mb-4">
          🏅 Ta Division: {currentKid.divisionName.toUpperCase()}
        </h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div
            className={`p-3 rounded-xl ${
              currentKid.divisionName === "bronze"
                ? "bg-white/30"
                : "bg-white/10"
            }`}
          >
            <div className="text-2xl mb-1">🥉</div>
            <div className="font-bold">BRONZE</div>
            <div className="opacity-80">Niveau 1-4</div>
          </div>
          <div
            className={`p-3 rounded-xl ${
              currentKid.divisionName === "silver"
                ? "bg-white/30"
                : "bg-white/10"
            }`}
          >
            <div className="text-2xl mb-1">🥈</div>
            <div className="font-bold">SILVER</div>
            <div className="opacity-80">Niveau 5-9</div>
          </div>
          <div
            className={`p-3 rounded-xl ${
              currentKid.divisionName === "gold" ? "bg-white/30" : "bg-white/10"
            }`}
          >
            <div className="text-2xl mb-1">🥇</div>
            <div className="font-bold">GOLD</div>
            <div className="opacity-80">Niveau 10+</div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          🌟 Derniers Succès
        </h3>

        {currentKid.badges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentKid.badges.slice(-3).map((badgeId, index) => {
              const badge = badgeInfo[badgeId as keyof typeof badgeInfo] || {
                name: "Badge Mystère",
                emoji: "🏆",
              };

              return (
                <div
                  key={`${badgeId}-${index}`}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-center transform hover:scale-105 transition-all duration-300"
                >
                  <div className="text-3xl mb-2">{badge.emoji}</div>
                  <div className="text-gray-800 font-bold text-sm">
                    {badge.name}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-white/60 py-8">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-lg">
              Joue aux jeux pour gagner tes premiers badges !
            </p>
          </div>
        )}
      </div>

      {/* Session Info */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl p-6 text-center text-white">
        <h3 className="text-xl font-bold mb-2">⏱️ Temps de jeu recommandé</h3>
        <p className="text-3xl font-bold mb-2">
          {currentKid.sessionDuration} minutes
        </p>
        <p className="text-sm opacity-80">
          Prends des pauses régulières pour protéger tes yeux ! 👀
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
