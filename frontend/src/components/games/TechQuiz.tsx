import React, { useState } from "react";
import { useGameStore } from "@/store/gameStore";

interface TechQuizProps {
  onComplete: (points: number, badge?: string) => void;
  userId: string;
}

const TechQuiz: React.FC<TechQuizProps> = ({ onComplete, userId }) => {
  const updateXp = useGameStore((state) => state.updateXp);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const questions = [
    {
      question: "Que fait un robot ? 🤖",
      answers: [
        "Il mange des gâteaux",
        "Il exécute des tâches programmées",
        "Il dort toute la journée",
        "Il regarde la télé",
      ],
      correct: 1,
      emoji: "🤖",
    },
    {
      question: "Qu'est-ce qu'un ordinateur utilise pour penser ? 🧠",
      answers: ["Son estomac", "Ses pieds", "Son processeur", "Ses oreilles"],
      correct: 2,
      emoji: "💻",
    },
    {
      question: "À quoi sert Internet ? 🌐",
      answers: [
        "À connecter les ordinateurs du monde",
        "À faire voler les avions",
        "À cuisiner des pizzas",
        "À peindre des maisons",
      ],
      correct: 0,
      emoji: "🌐",
    },
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
        setTimeout(() => {
          const points = score >= 2 ? 15 : 5;
          updateXp(userId, points, "robot-genius");
          const badge = score === 3 ? "tech-genius" : undefined;
          onComplete(points, badge);
        }, 2000);
      }
    }, 1500);
  };

  if (showResult) {
    return (
      <div className="bg-white p-8 rounded-3xl text-center space-y-6 animate-fade-in shadow-lg max-w-md mx-auto">
        <div className="text-8xl animate-bounce">
          {score >= 2 ? "🎉" : "👍"}
        </div>
        <h2 className="text-4xl font-bold text-gray-900">
          {score >= 2 ? "Excellent !" : "Bien joué !"}
        </h2>
        <p className="text-xl text-gray-700">
          Tu as répondu correctement à {score} question{score > 1 ? "s" : ""}{" "}
          sur {questions.length} !
        </p>
        <div className="text-6xl animate-pulse">
          {score === 3 ? "🏆" : score >= 2 ? "⭐" : "👏"}
        </div>
        <div className="bg-yellow-400 text-gray-800 px-6 py-3 rounded-full font-bold text-xl inline-block">
          +{score >= 2 ? "15" : "5"} points ! 🏆
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg max-w-lg mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">🧠 Quiz Tech</h2>
        <div className="text-gray-700 text-lg mb-4">
          Question {currentQuestion + 1} sur {questions.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-3xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">{question.emoji}</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {question.question}
          </h3>
        </div>

        <div className="grid gap-4">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`
                p-4 rounded-xl text-left font-medium transition-all duration-300 transform hover:scale-105
                ${
                  isAnswered
                    ? index === question.correct
                      ? "bg-green-500 text-white"
                      : selectedAnswer === index
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }
              `}
            >
              {answer}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <div className="text-gray-700">
          Score actuel :{" "}
          <span className="text-yellow-500 font-bold">
            {score}/{questions.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TechQuiz;
