export function CodeBlocksIcon() {
  return (
    <div className="w-24 h-24 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Robot cartoon */}
        <rect x="35" y="35" width="30" height="25" rx="8" fill="#FDE047" />
        <rect x="37" y="37" width="26" height="21" rx="6" fill="#FEF3C7" />

        {/* Yeux robot */}
        <circle cx="42" cy="45" r="3" fill="#3B82F6" />
        <circle cx="58" cy="45" r="3" fill="#3B82F6" />
        <circle cx="42" cy="45" r="1" fill="white" />
        <circle cx="58" cy="45" r="1" fill="white" />

        {/* Bouche */}
        <rect x="47" y="52" width="6" height="3" rx="1.5" fill="#374151" />

        {/* Antennes */}
        <line x1="45" y1="35" x2="45" y2="28" stroke="#374151" strokeWidth="2" />
        <line x1="55" y1="35" x2="55" y2="30" stroke="#374151" strokeWidth="2" />
        <circle cx="45" cy="28" r="2" fill="#EF4444" />
        <circle cx="55" cy="30" r="2" fill="#10B981" />

        {/* Blocs de code colorés */}
        <rect x="15" y="20" width="12" height="8" rx="2" fill="#3B82F6" className="animate-pulse" />
        <rect x="73" y="25" width="12" height="8" rx="2" fill="#EF4444" className="animate-pulse" />
        <rect x="20" y="70" width="12" height="8" rx="2" fill="#10B981" className="animate-pulse" />
        <rect x="68" y="75" width="12" height="8" rx="2" fill="#A78BFA" className="animate-pulse" />

        {/* Lignes de connexion */}
        <path d="M 27 24 Q 35 30 35 40" stroke="#D1D5DB" strokeWidth="2" fill="none" strokeDasharray="3,3" />
        <path d="M 73 29 Q 65 35 65 40" stroke="#D1D5DB" strokeWidth="2" fill="none" strokeDasharray="3,3" />
      </svg>
    </div>
  )
}