import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface RunButtonProps {
  onStart: () => void;
  onStop: () => void;
  isExecuting: boolean;
  canExecute: boolean;
}

const RunButton: React.FC<RunButtonProps> = ({ onStart, onStop, isExecuting, canExecute }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;

    if (canExecute && !isExecuting) {
      // Animation de pulsation pour attirer l'attention
      gsap.to(button, {
        scale: 1.05,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });
    } else {
      gsap.killTweensOf(button);
      gsap.set(button, { scale: 1 });
    }

    return () => {
      gsap.killTweensOf(button);
    };
  }, [canExecute, isExecuting]);

  const handleClick = () => {
    if (!buttonRef.current) return;

    // Animation de clic
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
      onComplete: () => {
        if (isExecuting) {
          onStop();
        } else {
          onStart();
        }
      }
    });
  };

  return (
    <div className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg shadow-lg">
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={!canExecute && !isExecuting}
        className={`
          w-full py-4 px-6 rounded-xl font-nunito font-bold text-lg transition-all duration-300
          ${isExecuting 
            ? 'bg-red-400 hover:bg-red-500 text-white' 
            : canExecute 
              ? 'bg-green-400 hover:bg-green-500 text-white shadow-lg' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">
            {isExecuting ? '⏹️' : '▶️'}
          </span>
          <span>
            {isExecuting ? 'Arrêter' : 'Lancer le Programme !'}
          </span>
        </div>
      </button>
      
      {!canExecute && !isExecuting && (
        <p className="text-center text-gray-600 mt-2 font-nunito text-sm">
          🧠 Ajoute des blocs pour commencer !
        </p>
      )}
    </div>
  );
};

export default RunButton;