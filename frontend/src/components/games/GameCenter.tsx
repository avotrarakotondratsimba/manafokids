import { useState } from "react";
import RobotPuzzle from "@/components/games/RobotPuzzle";
import TechQuiz from "@/components/games/TechQuiz";
import CircuitBuilder from "@/components/games/Circuitbuilder";
import { Card } from "@/components/ui/card";
import { useGameStore } from "@/store/gameStore";
import JeuxDeMot from "@/pages/Jeux de mot/JeuxDeMot";

const GameCenter = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const updateXp = useGameStore((state) => state.updateXp);
  const userId = "user123"; // peut venir du login/context
  const games = [
    {
      id: "robot-puzzle",
      title: "Puzzle Robot",
      description: "Assemble ton robot et programme-le !",
      emoji: "🤖",
      difficulty: "Facile",
      points: 10,
    },
    {
      id: "tech-quiz",
      title: "Quiz Tech",
      description: "Teste tes connaissances technologiques !",
      emoji: "🧠",
      difficulty: "Moyen",
      points: 15,
    },
    {
      id: "circuit-builder",
      title: "Constructeur de Circuits",
      description: "Crée des circuits électroniques !",
      emoji: "⚡",
      difficulty: "Avancé",
      points: 20,
    },
    {
      id: "Jeux-de-Mot",
      title: "Jeux de Mot",
      description: "trouver les bons mots !",
      emoji: "⚡",
      difficulty: "Avancé",
      points: 20,
    },
  ];

  const handleGameComplete = (points: number, badge?: string) => {
    updateXp(userId, points, badge);
    setSelectedGame(null);
  };

  if (selectedGame) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        <button
          onClick={() => setSelectedGame(null)}
          className="mb-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors"
        >
          ← Retour aux jeux
        </button>

        {selectedGame === "robot-puzzle" && (
          <RobotPuzzle userId="user123" onComplete={handleGameComplete} />
        )}
        {selectedGame === "tech-quiz" && (
          <TechQuiz userId="user123" onComplete={handleGameComplete} />
        )}
        {selectedGame === "circuit-builder" && (
          <CircuitBuilder userId="user123" onComplete={handleGameComplete} />
        )}
        {selectedGame === "Jeux-de-Mot" && <JeuxDeMot />}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <Card
          key={game.id}
          className="bg-gray-100 backdrop-blur-lg rounded-3xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-white/20"
          onClick={() => setSelectedGame(game.id)}
        >
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce">{game.emoji}</div>
            <h3 className="text-2xl font-bold text-black dark:text-white">
              {game.title}
            </h3>
            <p className="text-black dark:text-white/80 ">{game.description}</p>

            <div className="flex justify-between items-center text-sm">
              <span
                className={`
                px-3 py-1 rounded-full font-medium
                ${
                  game.difficulty === "Facile"
                    ? "bg-green-500 text-white"
                    : game.difficulty === "Moyen"
                    ? "bg-yellow-500 text-white"
                    : "bg-red-500 text-white"
                }
              `}
              >
                {game.difficulty}
              </span>
              <span className="text-yellow-400 font-bold">
                +{game.points} points
              </span>
            </div>

            <button className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all duration-300">
              Jouer ! 🎮
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GameCenter;
