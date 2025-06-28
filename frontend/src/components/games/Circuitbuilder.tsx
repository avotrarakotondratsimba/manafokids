"use client";

import { useGameStore } from "@/store/gameStore";
import type React from "react";
import { useState, useEffect } from "react";

interface CircuitBuilderProps {
  onComplete: (points: number, badge?: string) => void;
  userId: string;
}

const CircuitBuilder: React.FC<CircuitBuilderProps> = ({
  onComplete,
  userId,
}) => {
  const { updateXp, loading } = useGameStore();
  const [components, setComponents] = useState([
    { id: 1, type: "battery", emoji: "🔋", placed: false, position: "start" },
    { id: 2, type: "wire", emoji: "➖", placed: false, position: "wire1" },
    { id: 3, type: "resistor", emoji: "🔧", placed: false, position: "middle" },
    { id: 4, type: "wire", emoji: "➖", placed: false, position: "wire2" },
    { id: 5, type: "led", emoji: "💡", placed: false, position: "end" },
  ]);

  const [isComplete, setIsComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [circuitPowered, setCircuitPowered] = useState(false);

  const handleComponentClick = (componentId: number) => {
    if (isProcessing || loading) return;

    setComponents((comps) =>
      comps.map((comp) =>
        comp.id === componentId ? { ...comp, placed: !comp.placed } : comp
      )
    );
  };

  useEffect(() => {
    const allPlaced = components.every((comp) => comp.placed);
    if (allPlaced && !isComplete && !isProcessing) {
      setCircuitPowered(true);
      setTimeout(() => {
        setIsComplete(true);
        setShowSuccess(true);
        setIsProcessing(true);

        setTimeout(async () => {
          try {
            await updateXp(userId, 60, "circuit-master"); // 60 XP pour le jeu le plus difficile
            onComplete(60, "circuit-master");
          } catch (error) {
            console.error("Erreur lors de la mise à jour XP:", error);
            onComplete(60, "circuit-master");
          } finally {
            setIsProcessing(false);
          }
        }, 2000);
      }, 1000);
    }
  }, [components, isComplete, onComplete, userId, updateXp, isProcessing]);

  if (showSuccess) {
    return (
      <div className="text-center space-y-6 animate-fade-in bg-white">
        <div className="text-8xl animate-bounce">🎉</div>
        <h2 className="text-4xl font-bold text-gray-900">Fantastique !</h2>
        <p className="text-xl text-gray-900">
          Ton circuit électrique fonctionne parfaitement !
        </p>
        <div className="text-6xl animate-pulse">⚡💡✨</div>
        <div className="bg-yellow-400 text-gray-800 px-6 py-3 rounded-full font-bold text-xl inline-block">
          {isProcessing || loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin">⚡</div>
              Sauvegarde...
            </span>
          ) : (
            "+60 XP ! 🏆"
          )}
        </div>
        <div className="bg-green-500 text-gray-900 px-4 py-2 rounded-full font-medium text-sm inline-block">
          Badge "Maître des Circuits" débloqué ! ⚡
        </div>
      </div>
    );
  }

  const placedCount = components.filter((comp) => comp.placed).length;
  const progress = (placedCount / components.length) * 100;

  return (
    <div className="space-y-8 bg-white">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ⚡ Constructeur de Circuits
        </h2>
        <p className="text-gray-900 text-lg">
          Construis un circuit électrique fonctionnel !
        </p>

        {/* Progress */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-900 mb-2">
            <span>Progression</span>
            <span>
              {placedCount}/{components.length} composants
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-400 to-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Circuit Display */}
      <div className="bg-white/20 rounded-3xl p-8 mx-auto max-w-2xl">
        <div className="flex items-center justify-center space-x-4">
          {/* Battery */}
          <div
            className={`
            w-16 h-16 rounded-lg border-4 border-dashed border-white/50 flex items-center justify-center text-3xl transition-all duration-300
            ${
              components.find((c) => c.position === "start")?.placed
                ? `bg-green-400 border-green-400 ${
                    circuitPowered ? "animate-pulse" : ""
                  }`
                : "hover:border-white/70"
            }
          `}
          >
            {components.find((c) => c.position === "start")?.placed
              ? "🔋"
              : "?"}
          </div>

          {/* Wire 1 */}
          <div
            className={`
            w-12 h-4 border-4 border-dashed border-white/50 flex items-center justify-center transition-all duration-300
            ${
              components.find((c) => c.position === "wire1")?.placed
                ? `bg-yellow-400 border-yellow-400 ${
                    circuitPowered ? "animate-pulse" : ""
                  }`
                : "hover:border-white/70"
            }
          `}
          >
            {components.find((c) => c.position === "wire1")?.placed
              ? "➖"
              : "?"}
          </div>

          {/* Resistor */}
          <div
            className={`
            w-16 h-16 rounded-lg border-4 border-dashed border-white/50 flex items-center justify-center text-3xl transition-all duration-300
            ${
              components.find((c) => c.position === "middle")?.placed
                ? `bg-blue-400 border-blue-400 ${
                    circuitPowered ? "animate-pulse" : ""
                  }`
                : "hover:border-white/70"
            }
          `}
          >
            {components.find((c) => c.position === "middle")?.placed
              ? "🔧"
              : "?"}
          </div>

          {/* Wire 2 */}
          <div
            className={`
            w-12 h-4 border-4 border-dashed border-white/50 flex items-center justify-center transition-all duration-300
            ${
              components.find((c) => c.position === "wire2")?.placed
                ? `bg-yellow-400 border-yellow-400 ${
                    circuitPowered ? "animate-pulse" : ""
                  }`
                : "hover:border-white/70"
            }
          `}
          >
            {components.find((c) => c.position === "wire2")?.placed
              ? "➖"
              : "?"}
          </div>

          {/* LED */}
          <div
            className={`
            w-16 h-16 rounded-full border-4 border-dashed border-white/50 flex items-center justify-center text-3xl transition-all duration-300
            ${
              components.find((c) => c.position === "end")?.placed
                ? `bg-red-400 border-red-400 ${
                    circuitPowered ? "animate-bounce" : ""
                  }`
                : "hover:border-white/70"
            }
          `}
          >
            {components.find((c) => c.position === "end")?.placed ? "💡" : "?"}
          </div>
        </div>

        {circuitPowered && (
          <div className="text-center mt-6">
            <div className="text-4xl animate-bounce">
              ⚡ Circuit alimenté ! ⚡
            </div>
            <p className="text-green-400 font-bold mt-2">
              L'électricité circule parfaitement !
            </p>
          </div>
        )}
      </div>

      {/* Components */}
      <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
        {components.map((component) => (
          <div key={component.id} className="text-center">
            <button
              onClick={() => handleComponentClick(component.id)}
              className={`
                w-full p-4 rounded-xl text-4xl transition-all duration-300 transform hover:scale-110 relative
                ${
                  component.placed
                    ? "bg-gray-600 opacity-50 cursor-not-allowed"
                    : "bg-white/20 hover:bg-white/30 hover:shadow-lg cursor-pointer"
                }
                ${
                  isProcessing || loading
                    ? "pointer-events-none opacity-75"
                    : ""
                }
              `}
              disabled={component.placed || isProcessing || loading}
            >
              {component.emoji}
              {component.placed && (
                <div className="absolute -top-1 -right-1 text-green-400 text-lg">
                  ✓
                </div>
              )}
            </button>
            <p className="text-white/60 text-xs mt-2 capitalize">
              {component.type}
            </p>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="text-center text-white/60 text-sm max-w-md mx-auto space-y-2">
        <p>
          💡 Astuce: Place tous les composants dans l'ordre pour créer un
          circuit fonctionnel !
        </p>
        <p>🔋 Batterie → ➖ Fil → 🔧 Résistance → ➖ Fil → 💡 LED</p>
        {placedCount > 0 && placedCount < components.length && (
          <p className="text-yellow-400">
            Plus que {components.length - placedCount} composant
            {components.length - placedCount > 1 ? "s" : ""} !
          </p>
        )}
      </div>

      {/* Loading State */}
      {(isProcessing || loading) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center">
            <div className="animate-spin text-4xl mb-4">⚡</div>
            <p className="text-white font-medium">Sauvegarde en cours...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CircuitBuilder;
