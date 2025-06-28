import React, { useState } from "react";
import LessonModal from "@/components/course-card/Lesson/LessonModal";
import { lessons1 } from "@/data/lesson";

const IconPage: React.FC = () => {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(
    null
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const isUnlocked = (index: number) =>
    index === 0 || completedLessons.includes(index - 1);

  const icons = lessons1.map((_, i) => {
    if (completedLessons.includes(i)) return "📖";
    if (isUnlocked(i)) return "▶️";
    return "🔒";
  });

  const spacingX = 190;
  const amplitudeY = 60;
  const startX = 100;
  const centerY = 300;

  const getPosition = (index: number) => {
    const x = startX + index * spacingX;
    const angle = index * 0.8;
    const y = centerY + Math.sin(angle) * amplitudeY;
    return { x, y };
  };

  const getCircleStyle = (index: number) => {
    if (completedLessons.includes(index))
      return "border-4 border-purple-500 bg-purple-100 shadow-purple-300";
    else if (isUnlocked(index))
      return "border-4 border-green-500 bg-green-100 shadow-green-300";
    else
      return "border-4 border-gray-400 bg-gray-100 shadow-gray-300 opacity-60";
  };

  return (
    <div
      className="relative h-[89vh] w-full overflow-hidden"
      style={{
        backgroundImage: "var(--background-image-cours)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0">
        {icons.map((icon, index) => {
          const { x, y } = getPosition(index);
          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition hover:scale-105 cursor-pointer ${getCircleStyle(
                  index
                )}`}
                onClick={() => {
                  if (isUnlocked(index)) {
                    setSelectedLessonIndex(index);
                    setModalOpen(true);
                  }
                }}
              >
                <span className="text-4xl">{icon}</span>
              </div>
              <p className="text-center mt-2 text-[var(--text-color)] font-semibold">
                Leçon {index + 1}
              </p>
            </div>
          );
        })}
      </div>

      {selectedLessonIndex !== null && (
        <LessonModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          lesson={lessons1[selectedLessonIndex]}
          onComplete={(stars) => {
            console.log("Leçon complétée avec", stars, "étoiles");

            if (
              selectedLessonIndex !== null &&
              !completedLessons.includes(selectedLessonIndex)
            ) {
              setCompletedLessons([...completedLessons, selectedLessonIndex]);
            }

            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default IconPage;
