import React from 'react';
import type { Block } from '@/types/Block';

interface BlockItemProps {
  block: Block;
  onDragStart: (block: Block) => void;
  isInAlgorithm?: boolean;
  onRemove?: () => void;
}

const BlockItem: React.FC<BlockItemProps> = ({ block, onDragStart, isInAlgorithm, onRemove }) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(block);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`
        ${block.color} p-3 m-2 rounded-lg shadow-md cursor-grab active:cursor-grabbing
        transform transition-all duration-200 hover:scale-105 hover:shadow-lg
        font-nunito font-semibold text-gray-800 flex items-center gap-2
        ${isInAlgorithm ? 'relative group' : ''}
      `}
    >
      <span className="text-xl">{block.icon}</span>
      <span className="text-sm">{block.label}</span>
      {isInAlgorithm && onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default BlockItem;