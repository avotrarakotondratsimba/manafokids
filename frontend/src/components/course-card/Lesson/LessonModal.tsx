import { useState, useEffect } from "react";
import { X, ArrowRight, Star, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import useSound from "use-sound";
import CodeEditor from "@/pages/Cours/CodeEditor"; // Import du composant CodeEditor
import { useAuth } from "@/context/AuthContext";

interface LessonContent {
  type: "text" | "code";
  value: string;
  language?: string; // Nouveau: pour spécifier le langage de programmation
}

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    id: number;
    title: string;
    description: string;
    content: (string | LessonContent)[];
    quiz?: {
      title: string;
      questions: Array<{
        id: number;
        question: string;
        options: string[];
        correctAnswer: number;
      }>;
    };
  } | null;
  onComplete: (stars: number) => void;
}

const LessonModal = ({
  isOpen,
  onClose,
  lesson,
  onComplete,
}: LessonModalProps) => {
  const [currentContentStep, setCurrentContentStep] = useState(0);
  const [quizStep, setQuizStep] = useState<
    "not-started" | "in-progress" | "completed"
  >("not-started");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [playSuccessSound] = useSound("/sounds/confetti.mp3");

  const isContentPhase = quizStep === "not-started";
  const isQuizPhase = quizStep === "in-progress";
  const isCompletedPhase = quizStep === "completed";

  const { api } = useAuth();

  const childData = localStorage.getItem("childData");
  let kidId = "";

  if (childData) {
    try {
      const parsedData = JSON.parse(childData);
      kidId = parsedData?.apiData?.kid?.kidId || "";
    } catch (err) {
      console.error("Erreur de parsing childData:", err);
    }
  }

  const getStars = () => {
    if (!lesson?.quiz) return 0;
    const percentage = (score / lesson.quiz.questions.length) * 100;
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  useEffect(() => {
    if (isOpen && isCompletedPhase && lesson?.quiz && getStars() > 0) {
      playSuccessSound();
      fireConfetti();
    }
  }, [isCompletedPhase, isOpen, lesson?.quiz, playSuccessSound]);

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (!isOpen || !lesson) return null;

  const handleNextContent = () => {
    if (currentContentStep < lesson.content.length - 1) {
      setCurrentContentStep(currentContentStep + 1);
    } else {
      if (lesson.quiz) {
        setQuizStep("in-progress");
      } else {
        handleComplete(0);
      }
    }
  };

  const handlePrevContent = () => {
    if (currentContentStep > 0) {
      setCurrentContentStep(currentContentStep - 1);
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(optionIndex);
    setIsAnswered(true);

    if (optionIndex === lesson.quiz?.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (lesson.quiz && currentQuestion < lesson.quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setQuizStep("completed");
      }
    }, 1500);
  };

  const handleComplete = (stars: number) => {
    onComplete(stars);
    api.put(import.meta.env.VITE_API_URL + "/api/kids/xp/" + kidId, { xp: 10 });

    handleClose();
  };

  const handleClose = () => {
    setCurrentContentStep(0);
    setQuizStep("not-started");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    onClose();
  };

  const renderContent = () => {
    const content = lesson.content[currentContentStep];

    if (typeof content === "string") {
      return <p className="text-gray-700 whitespace-pre-line">{content}</p>;
    }

    if (content.type === "code") {
      return (
        <div className="mt-4 mb-6">
          <CodeEditor
            code={content.value}
            language={content.language || "javascript"}
            readOnly={true}
            height="300px"
          />
        </div>
      );
    }

    return null;
  };

  if (isCompletedPhase && lesson.quiz) {
    const stars = getStars();
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            {stars > 0 ? (
              <>
                <CheckCircle className="w-16 h-16 text-adventure-green mx-auto mb-4 animate-bounce-gentle" />
                <div className="fixed inset-0 pointer-events-none" />
              </>
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">😅</span>
              </div>
            )}
            <h2 className="text-2xl font-bold mb-2">
              {stars > 0 ? "Bravo !" : "Continue à essayer !"}
            </h2>
            <div className="flex justify-center space-x-1 mb-4">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-8 h-8 ${
                    i < stars
                      ? "text-adventure-yellow fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">
              Tu as répondu correctement à {score} sur{" "}
              {lesson.quiz.questions.length} questions !
            </p>
          </div>
          <Button
            onClick={() => handleComplete(stars)}
            className="w-full bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90"
          >
            Terminé
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--accent)]">
            {lesson.title}
          </h2>
          <Button variant="ghost" onClick={handleClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {isContentPhase && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                Étape {currentContentStep + 1}/{lesson.content.length}
              </span>
              <div className="w-full bg-gray-200 rounded-full h-2 mx-4">
                <div
                  className="bg-[var(--accent)] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentContentStep + 1) / lesson.content.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            {renderContent()}

            <div className="flex justify-between mt-6">
              {currentContentStep > 0 && (
                <Button variant="outline" onClick={handlePrevContent}>
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Précédent
                </Button>
              )}

              <div className={currentContentStep > 0 ? "" : "ml-auto"}>
                <Button
                  onClick={handleNextContent}
                  className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90"
                >
                  {currentContentStep === lesson.content.length - 1
                    ? lesson.quiz
                      ? "Commencer le quiz"
                      : "Terminer"
                    : "Suivant"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {isQuizPhase && lesson.quiz && (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                {lesson.quiz.title}
              </h3>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>
                  Question {currentQuestion + 1} sur{" "}
                  {lesson.quiz.questions.length}
                </span>
                <span>
                  Score: {score}/{lesson.quiz.questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-adventure-green h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / lesson.quiz.questions.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-6 text-center">
                {lesson.quiz.questions[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {lesson.quiz.questions[currentQuestion].options.map(
                  (option, index) => {
                    let buttonClass =
                      "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ";

                    if (!isAnswered) {
                      buttonClass +=
                        "border-gray-200 hover:border-[var(--accent)] hover:bg-[var(--accent)]/5";
                    } else {
                      if (
                        index ===
                        lesson.quiz?.questions[currentQuestion].correctAnswer
                      ) {
                        buttonClass +=
                          "border-adventure-green bg-adventure-green/10 text-adventure-green";
                      } else if (index === selectedAnswer) {
                        buttonClass += "border-red-500 bg-red-50 text-red-600";
                      } else {
                        buttonClass +=
                          "border-gray-200 bg-gray-50 text-gray-500";
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={isAnswered}
                        className={buttonClass}
                      >
                        <span className="font-medium">{option}</span>
                        {isAnswered &&
                          index ===
                            lesson.quiz?.questions[currentQuestion]
                              .correctAnswer && (
                            <CheckCircle className="w-5 h-5 text-adventure-green float-right mt-0.5" />
                          )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonModal;
