import React from 'react';
import type { Block } from '@/types/Block';
import BlockItem from './BlockItem';

interface BlockListProps {
  onBlockSelect: (block: Block) => void;
}

const availableBlocks: Block[] = [
  {
    id: 'move-forward',
    type: 'action',
    label: 'Avancer',
    icon: '➡️',
    color: 'bg-blue-200',
    params: { direction: 'forward' }
  },
  {
    id: 'move-backward',
    type: 'action',
    label: 'Reculer',
    icon: '⬅️',
    color: 'bg-blue-300',
    params: { direction: 'backward' }
  },
  {
    id: 'jump',
    type: 'action',
    label: 'Sauter',
    icon: '🦘',
    color: 'bg-yellow-200',
    params: { direction: 'jump' }
  },
  {
    id: 'turn-left',
    type: 'action',
    label: 'Tourner à gauche',
    icon: '↩️',
    color: 'bg-green-200',
    params: { direction: 'left' }
  },
  {
    id: 'turn-right',
    type: 'action',
    label: 'Tourner à droite',
    icon: '↪️',
    color: 'bg-green-200',
    params: { direction: 'right' }
  },
  {
    id: 'shout',
    type: 'sound',
    label: 'Crier',
    icon: '📢',
    color: 'bg-orange-200',
    params: {}
  },
  {
    id: 'dance',
    type: 'action',
    label: 'Danser',
    icon: '💃',
    color: 'bg-pink-200',
    params: { direction: 'dance' }
  },
  {
    id: 'spin',
    type: 'action',
    label: 'Tourner sur soi',
    icon: '🌪️',
    color: 'bg-purple-200',
    params: { direction: 'spin' }
  },
  {
    id: 'wave',
    type: 'action',
    label: 'Saluer',
    icon: '👋',
    color: 'bg-cyan-200',
    params: { direction: 'wave' }
  },
  {
    id: 'wait',
    type: 'wait',
    label: 'Attendre',
    icon: '🕓',
    color: 'bg-purple-200',
    params: { duration: 2000 }
  }
];

const BlockList: React.FC<BlockListProps> = ({ onBlockSelect }) => {
  return (
    <div className="h-full bg-gradient-to-b from-blue-50 to-purple-50 p-4 rounded-r-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-700 mb-4 font-nunito flex items-center gap-2">
        <span>🧩</span>
        Mes Blocs
      </h2>
      <div className="space-y-2">
        {availableBlocks.map((block) => (
          <div
            key={block.id}
            onClick={() => onBlockSelect(block)}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <BlockItem
              block={block}
              onDragStart={() => {}}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockList;