export function GameIcon() {
  return (
    <div className="w-24 h-24 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Oiseau cartoon */}
        <ellipse cx="50" cy="45" rx="15" ry="12" fill="#FB923C" />
        <ellipse cx="50" cy="45" rx="12" ry="9" fill="#FDBA74" />

        {/* Bec */}
        <polygon points="35,45 30,47 35,49" fill="#F97316" />

        {/* Œil */}
        <circle cx="45" cy="42" r="3" fill="white" />
        <circle cx="46" cy="41" r="1.5" fill="#374151" />

        {/* Ailes */}
        <ellipse cx="58" cy="40" rx="8" ry="5" fill="#EA580C" className="animate-bounce" />

        {/* Obstacles/plateformes */}
        <rect x="20" y="70" width="15" height="8" rx="4" fill="#10B981" />
        <rect x="45" y="75" width="15" height="8" rx="4" fill="#10B981" />
        <rect x="70" y="65" width="15" height="8" rx="4" fill="#10B981" />

        {/* Nuages */}
        <ellipse cx="25" cy="20" rx="8" ry="4" fill="white" opacity="0.8" />
        <ellipse cx="75" cy="25" rx="6" ry="3" fill="white" opacity="0.8" />
      </svg>
    </div>
  )
}