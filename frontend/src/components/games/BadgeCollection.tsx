import { useGameStore } from "@/store/gameStore";

const BadgeCollection = () => {
  const { currentKid, getDivisionColor } = useGameStore();

  const allBadges = [
    {
      id: "robot-builder",
      name: "Constructeur de Robot",
      emoji: "🤖",
      description: "Assemble ton premier robot",
    },
    {
      id: "tech-genius",
      name: "Génie Technologique",
      emoji: "🧠",
      description: "Réponds correctement à toutes les questions du quiz",
    },
    {
      id: "circuit-master",
      name: "Maître des Circuits",
      emoji: "⚡",
      description: "Crée un circuit électrique fonctionnel",
    },
    {
      id: "explorer",
      name: "Explorateur",
      emoji: "🚀",
      description: "Découvre tous les jeux",
    },
    {
      id: "student",
      name: "Étudiant Motivé",
      emoji: "📚",
      description: "Accumule 500 XP",
    },
    {
      id: "champion",
      name: "Champion",
      emoji: "🏆",
      description: "Atteins la division Gold",
    },
  ];

  if (!currentKid) return null;

  const earnedBadges = allBadges.filter((badge) =>
    currentKid.badges.includes(badge.id)
  );
  const lockedBadges = allBadges.filter(
    (badge) => !currentKid.badges.includes(badge.id)
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[var(--accent)] mb-4">
          🏆 Collection de Badges
        </h2>
        <p className="text-xl text-[var(--accent)] ">
          Tu as gagné {earnedBadges.length} badge
          {earnedBadges.length > 1 ? "s" : ""} sur {allBadges.length} !
        </p>
        <div className="mt-4 bg-white/20 rounded-full h-4 max-w-md mx-auto">
          <div
            className="bg-[var(--accent)] rounded-full transition-all duration-500"
            style={{
              width: `${(earnedBadges.length / allBadges.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Player Stats Header */}
      <div
        className={`bg-white rounded-3xl p-6 text-center text-[var(--accent)]`}
      >
        <div className="flex items-center justify-center space-x-6 ">
          <div>
            <div className="text-3xl mb-1">{currentKid.profilePic || "🚀"}</div>
            <div className="font-bold">{currentKid.kidUserName}</div>
          </div>
          <div className="text-left">
            <div className="text-sm opacity-80">Division</div>
            <div className="text-xl font-bold">
              {currentKid.divisionName.toUpperCase()}
            </div>
          </div>
          <div className="text-left">
            <div className="text-sm opacity-80">Niveau</div>
            <div className="text-xl font-bold">{currentKid.level}</div>
          </div>
          <div className="text-left">
            <div className="text-sm opacity-80">XP Total</div>
            <div className="text-xl font-bold">{currentKid.totalXp}</div>
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-[var(--accent)] mb-6 text-center">
            ✨ Badges Obtenus ✨
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <div className="text-5xl mb-3 animate-bounce">
                  {badge.emoji}
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {badge.name}
                </h4>
                <p className="text-gray-700 text-sm">{badge.description}</p>
                <div className="mt-4 text-2xl">🌟</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-[var(--accent)] mb-6 text-center">
            🔒 Badges à Débloquer
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-gray-600/50 rounded-2xl p-6 text-center opacity-75 hover:opacity-90 transition-opacity duration-300 border-2 border-dashed border-gray-400"
              >
                <div className="text-5xl mb-3 grayscale">{badge.emoji}</div>
                <h4 className="text-xl font-bold text-white/80 mb-2">
                  {badge.name}
                </h4>
                <p className="text-white/60 text-sm mb-3">
                  {badge.description}
                </p>
                <div className="text-2xl">🔒</div>
                <p className="text-xs text-white/40 mt-2">À débloquer</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Stats */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          📊 Tes Statistiques
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-xl p-4">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-white">
              {earnedBadges.length}
            </div>
            <div className="text-white/80 text-sm">Badges</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-white">
              {currentKid.totalXp}
            </div>
            <div className="text-white/80 text-sm">XP Total</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-white">
              {currentKid.weekXp}
            </div>
            <div className="text-white/80 text-sm">XP Semaine</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-white">
              {Math.round((earnedBadges.length / allBadges.length) * 100)}%
            </div>
            <div className="text-white/80 text-sm">Complété</div>
          </div>
        </div>
      </div>

      {/* Motivation Section */}
      {earnedBadges.length === 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-8 text-center text-white">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold mb-2">Commence ton aventure !</h3>
          <p className="text-lg opacity-90 mb-4">
            Joue aux jeux pour débloquer tes premiers badges !
          </p>
          <p className="text-sm opacity-80">
            Chaque badge représente une nouvelle compétence acquise ! 💪
          </p>
        </div>
      )}
    </div>
  );
};

export default BadgeCollection;
