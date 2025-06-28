import React, { useState, useCallback } from "react";
import type { Block, AlgorithmBlock } from "@/types/Block";
import BlockList from "@/components/algo/BlockList";
import DropZone from "@/components/algo//DropZone";
import Player from "@/components/algo/Player";
import RunButton from "@/components/algo/RunButton";

const AlgoKids = () => {
  const [algorithm, setAlgorithm] = useState<AlgorithmBlock[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentExecutingIndex, setCurrentExecutingIndex] = useState(-1);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);

  // Gestion du drag & drop simplifiée
  const handleBlockSelect = useCallback((block: Block) => {
    setDraggedBlock(block);
  }, []);

  const handleAddBlock = useCallback(
    (block: Block) => {
      const newBlock: AlgorithmBlock = {
        ...block,
        id: `${block.id}-${Date.now()}`,
        position: algorithm.length,
      };
      setAlgorithm((prev) => [...prev, newBlock]);
      setDraggedBlock(null);
    },
    [algorithm.length]
  );

  const handleRemoveBlock = useCallback((index: number) => {
    setAlgorithm((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Exécution de l'algorithme simplifiée
  const executeAlgorithm = useCallback(async () => {
    if (algorithm.length === 0) return;

    setIsExecuting(true);
    setCurrentExecutingIndex(0);

    for (let i = 0; i < algorithm.length; i++) {
      const currentBlock = algorithm[i];
      setCurrentExecutingIndex(i);

      // Utiliser l'ID du bloc pour l'animation
      setCurrentAction(currentBlock.id);

      console.log("Executing block:", currentBlock.id, currentBlock.label);

      // Attendre selon le type de bloc
      let duration = 1000;
      if (currentBlock.type === "wait") {
        duration = currentBlock.params?.duration || 2000;
      } else if (currentBlock.type === "sound") {
        duration = 1500; // Plus long pour les effets sonores
      }

      await new Promise((resolve) => setTimeout(resolve, duration));
    }

    setIsExecuting(false);
    setCurrentExecutingIndex(-1);
    setCurrentAction(null);
  }, [algorithm]);

  const stopExecution = useCallback(() => {
    setIsExecuting(false);
    setCurrentExecutingIndex(-1);
    setCurrentAction(null);
  }, []);

  return (
    <div className="min-h-screen font-nunito">
      {/* Header */}

      {/* Interface principale */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-180px)]">
          {/* Colonne gauche - Liste des blocs */}
          <div className="col-span-3">
            <BlockList onBlockSelect={handleBlockSelect} />
          </div>

          {/* Colonne centrale - Zone de construction */}
          <div className="col-span-6 flex flex-col gap-4">
            <div className="flex-1">
              <DropZone
                algorithm={algorithm}
                onAddBlock={handleAddBlock}
                onRemoveBlock={handleRemoveBlock}
                currentExecutingIndex={currentExecutingIndex}
                draggedBlock={draggedBlock}
              />
            </div>

            {/* Bouton d'exécution */}
            <RunButton
              onStart={executeAlgorithm}
              onStop={stopExecution}
              isExecuting={isExecuting}
              canExecute={algorithm.length > 0}
            />
          </div>

          {/* Colonne droite - Aire d'exécution */}
          <div className="col-span-3">
            <Player isExecuting={isExecuting} currentAction={currentAction} />
          </div>
        </div>
      </div>

      {/* Footer ludique */}
      <footer className="bg-white border-t-4 border-yellow-300 mt-8">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-gray-600 font-nunito">
            <div className="flex justify-center items-center gap-2 text-sm">
              <span>🌟</span>
              <span>Créé avec amour pour les petits développeurs en herbe</span>
              <span>🌟</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AlgoKids;
