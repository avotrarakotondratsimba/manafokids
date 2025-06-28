import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PlayerProps {
  isExecuting: boolean;
  currentAction: string | null;
}

const Player: React.FC<PlayerProps> = ({ isExecuting, currentAction }) => {
  const robotRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!robotRef.current || !currentAction) return;

    const robot = robotRef.current;
    const message = messageRef.current;
    
    // Extract the action type from the block ID (e.g., "move-forward-123456" -> "move-forward")
    const actionType = currentAction.split('-').slice(0, -1).join('-');
    console.log('Animating action:', actionType);

    switch (actionType) {
      case 'move-forward':
        const direction = robot.style.transform.includes('rotate') ? 
          robot.style.transform.match(/rotate\(([^)]+)\)/)?.[1] || '0deg' : '0deg';
        
        if (direction === '0deg' || direction === '360deg') {
          gsap.to(robot, {
            x: "+=60",
            duration: 0.8,
            ease: "power2.out"
          });
        } else if (direction === '90deg') {
          gsap.to(robot, {
            y: "+=60",
            duration: 0.8,
            ease: "power2.out"
          });
        } else if (direction === '180deg') {
          gsap.to(robot, {
            x: "-=60",
            duration: 0.8,
            ease: "power2.out"
          });
        } else if (direction === '270deg') {
          gsap.to(robot, {
            y: "-=60",
            duration: 0.8,
            ease: "power2.out"
          });
        }
        break;

      case 'move-backward':
        const backDirection = robot.style.transform.includes('rotate') ? 
          robot.style.transform.match(/rotate\(([^)]+)\)/)?.[1] || '0deg' : '0deg';
        
        if (backDirection === '0deg' || backDirection === '360deg') {
          gsap.to(robot, {
            x: "-=60",
            duration: 0.8,
            ease: "power2.out"
          });
        } else if (backDirection === '90deg') {
          gsap.to(robot, {
            y: "-=60",
            duration: 0.8,
            ease: "power2.out"
          });
        } else if (backDirection === '180deg') {
          gsap.to(robot, {
            x: "+=60",
            duration: 0.8,
            ease: "power2.out"
          });
        } else if (backDirection === '270deg') {
          gsap.to(robot, {
            y: "+=60",
            duration: 0.8,
            ease: "power2.out"
          });
        }
        break;

      case 'jump':
        gsap.timeline()
          .to(robot, {
            y: "-=40",
            duration: 0.3,
            ease: "power2.out"
          })
          .to(robot, {
            y: "+=40",
            duration: 0.3,
            ease: "bounce.out"
          });
        break;

      case 'turn-left':
        gsap.to(robot, {
          rotation: "-=90",
          duration: 0.5,
          ease: "back.out(1.7)"
        });
        break;
        
      case 'turn-right':
        gsap.to(robot, {
          rotation: "+=90",
          duration: 0.5,
          ease: "back.out(1.7)"
        });
        break;

      case 'shout':
        if (message) {
          message.textContent = "WOOOOH! 🎉";
          gsap.timeline()
            .set(message, { opacity: 1, scale: 1 })
            .to(message, {
              scale: 1.5,
              duration: 0.2,
              ease: "back.out(2)"
            })
            .to(message, {
              scale: 1,
              duration: 0.3
            })
            .to(message, {
              opacity: 0,
              duration: 0.5,
              delay: 0.5
            });
        }
        gsap.to(robot, {
          scale: 1.2,
          duration: 0.1,
          yoyo: true,
          repeat: 3,
          ease: "power2.out"
        });
        break;

      case 'dance':
        gsap.timeline()
          .to(robot, {
            rotation: "+=15",
            scale: 1.1,
            duration: 0.2
          })
          .to(robot, {
            rotation: "-=30",
            duration: 0.2
          })
          .to(robot, {
            rotation: "+=15",
            scale: 1,
            duration: 0.2
          });
        break;

      case 'spin':
        gsap.to(robot, {
          rotation: "+=360",
          duration: 1,
          ease: "power2.inOut"
        });
        break;

      case 'wave':
        gsap.timeline()
          .to(robot, {
            rotationZ: 10,
            duration: 0.2,
            ease: "power2.out"
          })
          .to(robot, {
            rotationZ: -10,
            duration: 0.2
          })
          .to(robot, {
            rotationZ: 10,
            duration: 0.2
          })
          .to(robot, {
            rotationZ: 0,
            duration: 0.2
          });
        break;

      case 'wait':
        // Animation de pensée pour le wait
        if (message) {
          message.textContent = "💭 Réflexion...";
          gsap.timeline()
            .set(message, { opacity: 1 })
            .to(message, {
              opacity: 0,
              duration: 0.5,
              delay: 1
            });
        }
        gsap.to(robot, {
          scale: 0.9,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
        break;
    }
  }, [currentAction]);

  const resetPosition = () => {
    if (!robotRef.current) return;
    
    gsap.to(robotRef.current, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 1,
      ease: "power2.out"
    });
  };

  return (
    <div className="h-full bg-gradient-to-b from-green-50 to-blue-50 p-6 rounded-l-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-700 font-nunito flex items-center gap-2">
          <span>🤖</span>
          Robi l'Explorateur
        </h2>
        <button
          onClick={resetPosition}
          className="bg-orange-200 hover:bg-orange-300 px-3 py-1 rounded-lg font-nunito text-sm transition-colors"
        >
          🏠 Reset
        </button>
      </div>
      
      <div className="relative h-80 bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <div
          ref={robotRef}
          className="absolute top-1/2 left-8 transform -translate-y-1/2 text-6xl transition-all"
        >
          🤖
        </div>
        
        <div
          ref={messageRef}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-orange-600 opacity-0 font-nunito"
        >
        </div>
        
        <div className="absolute bottom-4 left-4 text-gray-400 text-sm font-nunito">
          <div className="flex items-center gap-1">
            <span>👣</span>
            <span>Suis moi !</span>
          </div>
        </div>
      </div>
      
      {isExecuting && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-200 px-4 py-2 rounded-full font-nunito font-semibold text-gray-700">
            <span className="animate-spin">⚡</span>
            En cours d'exécution...
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;