import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Activity {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  points: number;
}

interface ActivityModalProps {
  activity: Activity;
  onClose: () => void;
  onComplete: (points: number) => void;
}

const ActivityModal = ({ activity, onClose, onComplete }: ActivityModalProps) => {
  const [step, setStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Define a type for activity steps with optional options property
  interface ActivityStep {
    title: string;
    content: string;
    interaction: string;
    visual: React.ReactNode;
    options?: string[];
  }

  // Simulated activity steps based on activity type
  const getActivitySteps = (): ActivityStep[] => {
    switch (activity.id) {
      case 1: // Robot Danseur
        return [
          {
            title: "Découverte du Robot",
            content: "Voici ton nouveau ami robot ! Il s'appelle Dancy et il adore danser. Clique sur lui pour le saluer !",
            interaction: "click",
            visual: "🤖"
          },
          {
            title: "Choisir la Musique",
            content: "Quelle musique veux-tu que Dancy danse ? Choisis ton style préféré !",
            interaction: "select",
            options: ["🎵 Pop", "🎸 Rock", "🎼 Classique", "🎤 Hip-Hop"],
            visual: "🎵"
          },
          {
            title: "Programmer les Mouvements",
            content: "Maintenant, programme les mouvements de Dancy ! Glisse les actions dans l'ordre.",
            interaction: "drag",
            visual: "💃"
          },
          {
            title: "C'est parti !",
            content: "Super ! Regarde Dancy danser avec tes instructions !",
            interaction: "watch",
            visual: "🎉"
          }
        ];
      case 2: // Circuit Magique
        return [
          {
            title: "Les Composants",
            content: "Découvre les composants électroniques : pile, LED, résistance, et interrupteur !",
            interaction: "learn",
            visual: "⚡"
          },
          {
            title: "Construire le Circuit",
            content: "Connecte les composants pour allumer la LED. Glisse-les au bon endroit !",
            interaction: "build",
            visual: "🔌"
          },
          {
            title: "Test du Circuit",
            content: "Appuie sur l'interrupteur pour voir si ton circuit fonctionne !",
            interaction: "test",
            visual: "💡"
          }
        ];
      default:
        return [
          {
            title: "Introduction",
            content: "Commençons cette super activité !",
            interaction: "intro",
            visual: activity.icon
          },
          {
            title: "Pratique",
            content: "Maintenant, c'est à toi de jouer !",
            interaction: "practice",
            visual: "✨"
          },
          {
            title: "Résultat",
            content: "Bravo ! Tu as réussi !",
            interaction: "complete",
            visual: "🎉"
          }
        ];
    }
  };

  const steps = getActivitySteps();
  const currentStep = steps[step];

  useEffect(() => {
    setProgress((step / (steps.length - 1)) * 100);
  }, [step, steps.length]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsCompleted(true);
      setTimeout(() => {
        onComplete(activity.points);
      }, 2000);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white rounded-3xl shadow-2xl border-4 border-blue-200 overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${activity.color} p-6 text-white relative`}>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{activity.icon}</div>
              <div>
                <h2 className="text-2xl font-bold">{activity.title}</h2>
                <p className="opacity-90">{activity.description}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progression</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="bg-white/30" />
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {!isCompleted ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center space-y-6"
              >
                <div className="text-8xl mb-4">
                  {currentStep.visual}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800">
                  {currentStep.title}
                </h3>
                
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  {currentStep.content}
                </p>

                {/* Interactive Elements */}
                <div className="space-y-4">
                  {currentStep.interaction === 'select' && currentStep.options && (
                    <div className="grid grid-cols-2 gap-4">
                      {currentStep.options.map((option, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleNext}
                          className="p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-200"
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {currentStep.interaction === 'click' && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleNext}
                      className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full text-6xl mx-auto shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      🤖
                    </motion.button>
                  )}

                  {(currentStep.interaction === 'learn' || currentStep.interaction === 'intro') && (
                    <Button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-2xl text-lg"
                    >
                      J'ai compris ! <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}

                  {(currentStep.interaction === 'drag' || currentStep.interaction === 'build' || currentStep.interaction === 'practice') && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl">
                        {['⬆️', '➡️', '⬇️'].map((arrow, index) => (
                          <motion.div
                            key={index}
                            drag
                            whileDrag={{ scale: 1.1 }}
                            className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-2xl cursor-grab active:cursor-grabbing border-2 border-gray-200"
                          >
                            {arrow}
                          </motion.div>
                        ))}
                      </div>
                      <Button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-2xl"
                      >
                        Tester mon programme !
                      </Button>
                    </div>
                  )}

                  {(currentStep.interaction === 'test' || currentStep.interaction === 'watch') && (
                    <div className="space-y-4">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: 2 }}
                        className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center text-3xl shadow-lg"
                      >
                        {currentStep.visual}
                      </motion.div>
                      <Button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-2xl"
                      >
                        Super ! Continuer <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-8xl"
                >
                  🎉
                </motion.div>
                
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h3 className="text-3xl font-bold text-gray-800">
                    Bravo champion !
                  </h3>
                  <p className="text-lg text-gray-600">
                    Tu as terminé l'activité "{activity.title}" avec succès !
                  </p>
                  
                  <div className="flex items-center justify-center space-x-2 bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-200">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    <span className="text-xl font-bold text-yellow-700">
                      +{activity.points} points gagnés !
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ActivityModal;