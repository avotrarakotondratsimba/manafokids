export function QuizIcon() {
  return (
    <div className="w-24 h-24 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Écran de quiz */}
        <rect x="25" y="20" width="50" height="40" rx="8" fill="white" stroke="#10B981" strokeWidth="2" />

        {/* Cases à cocher */}
        <rect x="30" y="28" width="6" height="6" rx="1" fill="#10B981" />
        <rect x="30" y="38" width="6" height="6" rx="1" fill="white" stroke="#10B981" strokeWidth="1" />
        <rect x="30" y="48" width="6" height="6" rx="1" fill="white" stroke="#10B981" strokeWidth="1" />

        {/* Checkmark */}
        <path d="M 31 31 L 33 33 L 35 29" stroke="white" strokeWidth="1.5" fill="none" />

        {/* Lignes de texte */}
        <rect x="40" y="30" width="25" height="2" rx="1" fill="#D1D5DB" />
        <rect x="40" y="40" width="20" height="2" rx="1" fill="#D1D5DB" />
        <rect x="40" y="50" width="22" height="2" rx="1" fill="#D1D5DB" />

        {/* Smiley joyeux */}
        <circle cx="50" cy="75" r="12" fill="#FDE047" />
        <circle cx="45" cy="70" r="2" fill="#374151" />
        <circle cx="55" cy="70" r="2" fill="#374151" />
        <path d="M 42 80 Q 50 85 58 80" stroke="#374151" strokeWidth="2" fill="none" />

        {/* Confettis */}
        <rect x="20" y="10" width="3" height="3" fill="#F472B6" className="animate-pulse" />
        <rect x="77" y="15" width="3" height="3" fill="#A78BFA" className="animate-pulse" />
        <rect x="15" y="65" width="3" height="3" fill="#34D399" className="animate-pulse" />
      </svg>
    </div>
  )
}