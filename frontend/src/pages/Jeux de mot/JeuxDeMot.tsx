"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Lock, Trophy, Play } from "lucide-react";
import GameInterface from "@/components/jeuxDeMot/game-interface";
import UserProfile from "@/components/jeuxDeMot/user-profile";

type LevelType = "facile" | "moyen" | "difficile";

export default function JeuxDeMot() {
  const [currentView, setCurrentView] = useState<"home" | "game" | "profile">(
    "home"
  );
  const [selectedLevel, setSelectedLevel] = useState<LevelType>("facile");

  const [userProgress, setUserProgress] = useState(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("motGameProgress")
        : null;
    return stored
      ? JSON.parse(stored)
      : {
          facileCompleted: 0,
          moyenCompleted: 0,
          difficileCompleted: 0,
          totalStars: 0,
          unlockedLevels: ["facile"],
        };
  });
  const getPreviousLevel = (level: LevelType): LevelType | null => {
    switch (level) {
      case "moyen":
        return "facile";
      case "difficile":
        return "moyen";
      default:
        return null;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("motGameProgress", JSON.stringify(userProgress));
    }
  }, [userProgress]);

  const isLevelUnlocked = (level: string) => {
    return userProgress.unlockedLevels.includes(level);
  };

  const getLevelProgress = (level: LevelType) => {
    switch (level) {
      case "facile":
        return (userProgress.facileCompleted / 5) * 100;
      case "moyen":
        return (userProgress.moyenCompleted / 10) * 100;
      case "difficile":
        return (userProgress.difficileCompleted / 15) * 100;
      default:
        return 0;
    }
  };

  const unlockNextLevels = (progress: typeof userProgress) => {
    const newUnlocked = [...progress.unlockedLevels];

    if (progress.facileCompleted >= 1 && !newUnlocked.includes("moyen")) {
      newUnlocked.push("moyen");
    }

    if (progress.moyenCompleted >= 1 && !newUnlocked.includes("difficile")) {
      newUnlocked.push("difficile");
    }

    return newUnlocked;
  };

  const startGame = (level: LevelType) => {
    if (isLevelUnlocked(level)) {
      setSelectedLevel(level);
      setCurrentView("game");
    }
  };

  if (currentView === "game") {
    return (
      <GameInterface
        level={selectedLevel}
        onBack={() => setCurrentView("home")}
        onComplete={(stars: number) => {
          setUserProgress((prev: typeof userProgress) => {
            const updated = {
              ...prev,
              [`${selectedLevel}Completed`]:
                prev[`${selectedLevel}Completed`] + 1,
              totalStars: prev.totalStars + stars,
            };
            updated.unlockedLevels = unlockNextLevels(updated);
            return updated;
          });
          setCurrentView("home");
        }}
      />
    );
  }

  if (currentView === "profile") {
    return (
      <UserProfile
        userProgress={userProgress}
        onBack={() => setCurrentView("home")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Chasseur de Mots
              </h1>
              <p className="text-white/80">
                Trouve les mots cachés et deviens un champion !
              </p>
            </div>
          </div>
        </div>

        {/* Niveaux */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              id: "facile",
              title: "🌟 Facile",
              description:
                "Mots simples et amusants pour commencer ton aventure !",
              color: "green",
              stars: 3,
              max: 5,
            },
            {
              id: "moyen",
              title: "🔥 Moyen",
              description: "Des défis plus corsés pour les vrais champions !",
              color: "orange",
              stars: 5,
              max: 10,
              requirement: "Termine 5 niveaux Facile pour débloquer",
            },
            {
              id: "difficile",
              title: "⚡ Difficile",
              description: "Le défi ultime pour les maîtres des mots !",
              color: "red",
              stars: 7,
              max: 15,
              requirement: "Termine 10 niveaux Moyen pour débloquer",
            },
          ].map(
            ({ id, title, description, color, stars, max, requirement }) => {
              const unlocked = isLevelUnlocked(id);
              return (
                <Card
                  key={id}
                  className="bg-white/95 shadow-xl border-0 overflow-hidden"
                >
                  <CardHeader className={`bg-${color}-400 text-white`}>
                    <CardTitle className="flex items-center justify-between">
                      <span>{title}</span>
                      {unlocked ? (
                        <Badge className={`bg-${color}-600`}>Débloqué</Badge>
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <p className="text-gray-600">{description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span>
                            {userProgress[`${id}Completed`]}/{max} niveaux
                          </span>
                        </div>
                        <Progress
                          value={getLevelProgress(id as LevelType)}
                          className="h-2"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">
                          {stars} étoiles par niveau
                        </span>
                      </div>
                      {!unlocked && requirement && (
                        <p className="text-xs text-gray-500">{requirement}</p>
                      )}
                      <Button
                        onClick={() => startGame(id as LevelType)}
                        disabled={!unlocked}
                        className={`w-full bg-${color}-500 hover:bg-${color}-600 disabled:bg-gray-300`}
                      >
                        {unlocked ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Jouer
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Verrouillé
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>

        {/* Objectif du jour */}
        <Card className="mt-8 bg-white/95 shadow-xl border-0">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                🎯 Ton Objectif du Jour
              </h2>
              <p className="text-gray-600">
                Trouve 10 mots aujourd'hui pour gagner un badge spécial !
              </p>

              <div className="flex justify-center">
                <Progress value={60} className="w-64 h-3" />
              </div>
              <p className="text-sm text-gray-500">
                6/10 mots trouvés aujourd'hui
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
