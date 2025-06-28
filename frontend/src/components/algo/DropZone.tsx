import React from 'react';
import type { Block, AlgorithmBlock } from '@/types/Block';
import BlockItem from './BlockItem';

interface DropZoneProps {
  algorithm: AlgorithmBlock[];
  onAddBlock: (block: Block) => void;
  onRemoveBlock: (index: number) => void;
  currentExecutingIndex: number;
  draggedBlock: Block | null;
}

const DropZone: React.FC<DropZoneProps> = ({ 
  algorithm, 
  onAddBlock, 
  onRemoveBlock, 
  currentExecutingIndex,
  draggedBlock 
}) => {
  const handleClick = () => {
    if (draggedBlock) {
      onAddBlock(draggedBlock);
    }
  };

  return (
    <div className="h-full bg-white p-6 flex flex-col">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 font-nunito flex items-center gap-2">
        <span>🚀</span>
        Mon Algorithme
      </h2>
      
      <div
        onClick={handleClick}
        className={`
          flex-1 border-4 border-dashed rounded-xl p-4 transition-all duration-300 cursor-pointer
          ${draggedBlock ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${algorithm.length === 0 ? 'flex items-center justify-center' : ''}
        `}
      >
        {algorithm.length === 0 ? (
          <div className="text-center text-gray-500 font-nunito">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-lg">
              {draggedBlock ? `Clique pour ajouter "${draggedBlock.label}"` : 'Sélectionne un bloc puis clique ici !'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {algorithm.map((block, index) => (
              <div
                key={block.id}
                className={`
                  transform transition-all duration-300
                  ${currentExecutingIndex === index ? 'scale-110 ring-4 ring-yellow-400 shadow-lg' : ''}
                `}
              >
                <BlockItem
                  block={block}
                  onDragStart={() => {}}
                  isInAlgorithm={true}
                  onRemove={() => onRemoveBlock(index)}
                />
              </div>
            ))}
            {draggedBlock && (
              <div className="border-2 border-dashed border-blue-400 rounded-lg p-3 text-center text-blue-600">
                + Ajouter "{draggedBlock.label}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropZone;