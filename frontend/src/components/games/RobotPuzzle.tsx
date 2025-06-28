"use client";

import { useGameStore } from "@/store/gameStore";
import type React from "react";
import { useState, useEffect } from "react";

interface RobotPuzzleProps {
  onComplete: (points: number, badge?: string) => void;
  userId: string;
}

const RobotPuzzle: React.FC<RobotPuzzleProps> = ({ onComplete, userId }) => {
  const { updateXp, loading } = useGameStore();
  const [puzzlePieces, setPuzzlePieces] = useState([
    { id: 1, emoji: "🤖", placed: false, position: "head" },
    { id: 2, emoji: "🔧", placed: false, position: "arm-left" },
    { id: 3, emoji: "⚙️", placed: false, position: "body" },
    { id: 4, emoji: "🔩", placed: false, position: "arm-right" },
    { id: 5, emoji: "🦾", placed: false, position: "leg-left" },
    { id: 6, emoji: "🦿", placed: false, position: "leg-right" },
  ]);

  const [isComplete, setIsComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePieceClick = (pieceId: number) => {
    if (isProcessing || loading) return;

    setPuzzlePieces((pieces) =>
      pieces.map((piece) =>
        piece.id === pieceId ? { ...piece, placed: !piece.placed } : piece
      )
    );
  };

  useEffect(() => {
    const allPlaced = puzzlePieces.every((piece) => piece.placed);
    if (allPlaced && !isComplete && !isProcessing) {
      setIsComplete(true);
      setShowSuccess(true);
      setIsProcessing(true);

      setTimeout(async () => {
        try {
          // Mettre à jour l'XP via l'API backend
          await updateXp(userId, 25, "robot-builder"); // 25 XP au lieu de 10 points
          onComplete(25, "robot-builder");
        } catch (error) {
          console.error("Erreur lors de la mise à jour XP:", error);
          // Fallback: appeler onComplete même en cas d'erreur
          onComplete(25, "robot-builder");
        } finally {
          setIsProcessing(false);
        }
      }, 2000);
    }
  }, [puzzlePieces, isComplete, onComplete, userId, updateXp, isProcessing]);

  if (showSuccess) {
    return (
      <div className="text-center space-y-6 animate-fade-in bg-white p-8 rounded-xl shadow-lg">
        <div className="text-8xl animate-bounce">🎉</div>
        <h2 className="text-4xl font-bold text-gray-900">Bravo !</h2>
        <p className="text-xl text-gray-700">Tu as assemblé ton robot !</p>
        <div className="text-6xl animate-pulse">🤖✨</div>
        <div className="bg-yellow-400 text-gray-800 px-6 py-3 rounded-full font-bold text-xl inline-block">
          {isProcessing || loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin">⚡</div>
              Sauvegarde...
            </span>
          ) : (
            "+25 XP ! 🏆"
          )}
        </div>
        <div className="bg-green-500 text-white px-4 py-2 rounded-full font-medium text-sm inline-block">
          Badge "Constructeur de Robot" débloqué ! 🤖
        </div>
      </div>
    );
  }

  const placedCount = puzzlePieces.filter((piece) => piece.placed).length;
  const progress = (placedCount / puzzlePieces.length) * 100;

  return (
    <div className="space-y-8 bg-white p-8 rounded-xl shadow-md max-w-lg mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🤖 Puzzle Robot
        </h2>
        <p className="text-gray-700 text-lg">
          Clique sur les pièces pour assembler ton robot !
        </p>

        {/* Progress Bar */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Progression</span>
            <span>
              {placedCount}/{puzzlePieces.length} pièces
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Robot Display */}
      <div className="bg-gray-100 rounded-3xl p-8 mx-auto max-w-md">
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Head */}
          <div className="col-span-3 flex justify-center">
            <div
              className={`
                w-16 h-16 rounded-full border-4 border-dashed border-gray-400 flex items-center justify-center text-3xl transition-all duration-300
                ${
                  puzzlePieces.find((p) => p.position === "head")?.placed
                    ? "bg-green-400 border-green-400 animate-pulse text-white"
                    : "hover:border-gray-600 cursor-pointer text-gray-600"
                }
              `}
            >
              {puzzlePieces.find((p) => p.position === "head")?.placed
                ? "🤖"
                : "?"}
            </div>
          </div>

          {/* Arms and Body */}
          <div className="flex justify-center">
            <div
              className={`
                w-12 h-12 rounded-full border-4 border-dashed border-gray-400 flex items-center justify-center text-2xl transition-all duration-300
                ${
                  puzzlePieces.find((p) => p.position === "arm-left")?.placed
                    ? "bg-green-400 border-green-400 animate-pulse text-white"
                    : "hover:border-gray-600 cursor-pointer text-gray-600"
                }
              `}
            >
              {puzzlePieces.find((p) => p.position === "arm-left")?.placed
                ? "🔧"
                : "?"}
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className={`
                w-16 h-16 rounded-lg border-4 border-dashed border-gray-400 flex items-center justify-center text-3xl transition-all duration-300
                ${
                  puzzlePieces.find((p) => p.position === "body")?.placed
                    ? "bg-green-400 border-green-400 animate-pulse text-white"
                    : "hover:border-gray-600 cursor-pointer text-gray-600"
                }
              `}
            >
              {puzzlePieces.find((p) => p.position === "body")?.placed
                ? "⚙️"
                : "?"}
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className={`
                w-12 h-12 rounded-full border-4 border-dashed border-gray-400 flex items-center justify-center text-2xl transition-all duration-300
                ${
                  puzzlePieces.find((p) => p.position === "arm-right")?.placed
                    ? "bg-green-400 border-green-400 animate-pulse text-white"
                    : "hover:border-gray-600 cursor-pointer text-gray-600"
                }
              `}
            >
              {puzzlePieces.find((p) => p.position === "arm-right")?.placed
                ? "🔩"
                : "?"}
            </div>
          </div>

          {/* Legs */}
          <div className="flex justify-center">
            <div
              className={`
                w-12 h-12 rounded-lg border-4 border-dashed border-gray-400 flex items-center justify-center text-2xl transition-all duration-300
                ${
                  puzzlePieces.find((p) => p.position === "leg-left")?.placed
                    ? "bg-green-400 border-green-400 animate-pulse text-white"
                    : "hover:border-gray-600 cursor-pointer text-gray-600"
                }
              `}
            >
              {puzzlePieces.find((p) => p.position === "leg-left")?.placed
                ? "🦾"
                : "?"}
            </div>
          </div>

          <div></div>

          <div className="flex justify-center">
            <div
              className={`
                w-12 h-12 rounded-lg border-4 border-dashed border-gray-400 flex items-center justify-center text-2xl transition-all duration-300
                ${
                  puzzlePieces.find((p) => p.position === "leg-right")?.placed
                    ? "bg-green-400 border-green-400 animate-pulse text-white"
                    : "hover:border-gray-600 cursor-pointer text-gray-600"
                }
              `}
            >
              {puzzlePieces.find((p) => p.position === "leg-right")?.placed
                ? "🦿"
                : "?"}
            </div>
          </div>
        </div>
      </div>

      {/* Puzzle Pieces */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {puzzlePieces.map((piece) => (
          <button
            key={piece.id}
            onClick={() => handlePieceClick(piece.id)}
            className={`
              p-4 rounded-xl text-4xl transition-all duration-300 transform hover:scale-110 relative
              ${
                piece.placed
                  ? "bg-gray-400 opacity-50 cursor-not-allowed text-white"
                  : "bg-blue-400 text-white hover:bg-blue-500 hover:shadow-lg cursor-pointer"
              }
              ${isProcessing || loading ? "pointer-events-none opacity-75" : ""}
            `}
            disabled={piece.placed || isProcessing || loading}
          >
            {piece.emoji}
            {piece.placed && (
              <div className="absolute -top-1 -right-1 text-green-400 text-lg">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="text-center text-gray-600 text-sm max-w-md mx-auto">
        <p>
          💡 Astuce: Place toutes les pièces pour assembler ton robot et gagner
          25 XP !
        </p>
        {placedCount > 0 && placedCount < puzzlePieces.length && (
          <p className="mt-2 text-yellow-500 font-semibold">
            Plus que {puzzlePieces.length - placedCount} pièce
            {puzzlePieces.length - placedCount > 1 ? "s" : ""} à placer !
          </p>
        )}
      </div>
    </div>
  );
};

export default RobotPuzzle;
