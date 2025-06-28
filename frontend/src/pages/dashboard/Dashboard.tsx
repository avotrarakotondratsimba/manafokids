import { useState, useEffect } from "react";
import GameCenter from "@/components/games/GameCenter";
import BadgeCollection from "@/components/games/BadgeCollection";
import { useNavigate } from "react-router-dom";
import ProfileCard from "@/components/games/ProfileCard";
import { useGameStore } from "@/store/gameStore";
import { kidAPI } from "@/service/api";
import AlgoKids from "../algoKids/AlgoKids";
const Dashboard = () => {
  const [currentSection, setCurrentSection] = useState<
    "games" | "badges" | "algorithme" | "design"
  >("games");
  const { currentKid, setCurrentKid, loading, error, getDivisionColor } =
    useGameStore();
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  // ID de l'enfant - à récupérer depuis l'authentification ou les props
  const kidId = "kid123"; // Remplacer par l'ID réel
  if (currentSection == "design") {
    navigate("/kidcanvas");
  }
  useEffect(() => {
    const loadKidData = async () => {
      try {
        // Simuler des données si l'API n'est pas disponible
        const mockKidData = {
          kidId: kidId,
          kidUserName: "Alex",
          birthDate: "2014-05-15T00:00:00.000Z",
          profilePic: "🚀",
          sessionDuration: 30,
          weekXp: 150,
          totalXp: 450,
          divisionName: "silver",
        };

        try {
          const kidData = await kidAPI.getKid(kidId);
          setCurrentKid({
            ...kidData,
            badges: [],
            level: Math.floor(kidData.totalXp / 100) + 1,
          });
        } catch (apiError) {
          console.log("API non disponible, utilisation des données mock");
          setCurrentKid({
            ...mockKidData,
            badges: [],
            level: Math.floor(mockKidData.totalXp / 100) + 1,
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadKidData();
  }, [kidId, setCurrentKid]);

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-200 to-purple-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🎮</div>
          <p className="text-2xl font-bold text-gray-800">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!currentKid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-200 to-purple-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-2xl font-bold text-gray-800">
            Impossible de charger les données
          </p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-200 to-purple-200 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Header */}

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center space-x-4 mb-8">
          {[
            { id: "games", label: "Jeux 🎮", emoji: "🎮" },
            { id: "algorithme", label: "Algorithme ⚙️", emoji: "⚙️" },
            { id: "badges", label: "Badges 🏆", emoji: "🏆" },
            { id: "design", label: "design 🖥️", emoji: "🖥️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentSection(tab.id as "games" | "badges")}
              className={`
                px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105
                ${
                  currentSection === tab.id
                    ? "bg-yellow-400 text-gray-800 shadow-lg"
                    : "bg-white/20 text-black hover:bg-white/30"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {currentSection === "games" && <GameCenter />}
          {currentSection === "badges" && <BadgeCollection />}
          {/* {currentSection === "profile" && <ProfileCard />} */}
          {currentSection === "algorithme" && <AlgoKids />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
