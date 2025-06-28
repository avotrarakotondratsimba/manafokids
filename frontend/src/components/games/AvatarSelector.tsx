import React from 'react';

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedAvatar, onSelect }) => {
  const avatars = [
    '🤖', '👾', '🦁', '🐱', '🐶', '🐼', 
    '🦄', '🐸', '🦉', '🐧', '🦊', '🐨'
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {avatars.map((avatar) => (
        <button
          key={avatar}
          type="button"
          onClick={() => onSelect(avatar)}
          className={`
            p-4 rounded-xl text-4xl transition-all duration-300 transform hover:scale-110
            ${selectedAvatar === avatar 
              ? 'bg-yellow-400 shadow-lg scale-110' 
              : 'bg-white/20 hover:bg-white/30'
            }
          `}
        >
          {avatar}
        </button>
      ))}
    </div>
  );
};

export default AvatarSelector;
