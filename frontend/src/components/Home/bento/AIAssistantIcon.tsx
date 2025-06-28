export function AIAssistantIcon() {
  return (
    <div className="w-32 h-32 relative">
      <svg viewBox="0 0 120 120" className="w-full h-full">
        {/* Corps du robot */}
        <rect x="40" y="45" width="40" height="35" rx="12" fill="#A78BFA" />
        <rect x="42" y="47" width="36" height="31" rx="10" fill="#C4B5FD" />

        {/* Tête */}
        <circle cx="60" cy="35" r="18" fill="#A78BFA" />
        <circle cx="60" cy="35" r="15" fill="#C4B5FD" />

        {/* Yeux */}
        <circle cx="54" cy="32" r="3" fill="#3B82F6" />
        <circle cx="66" cy="32" r="3" fill="#3B82F6" />
        <circle cx="54" cy="31" r="1" fill="white" />
        <circle cx="66" cy="31" r="1" fill="white" />

        {/* Sourire */}
        <path d="M 52 40 Q 60 45 68 40" stroke="#374151" strokeWidth="2" fill="none" />

        {/* Casque micro */}
        <path d="M 45 25 Q 45 20 50 20 Q 70 20 70 20 Q 75 20 75 25" stroke="#374151" strokeWidth="3" fill="none" />
        <circle cx="78" cy="32" r="4" fill="#374151" />
        <rect x="76" y="30" width="4" height="8" rx="2" fill="#374151" />

        {/* Bras */}
        <rect x="25" y="55" width="15" height="8" rx="4" fill="#A78BFA" />
        <rect x="80" y="55" width="15" height="8" rx="4" fill="#A78BFA" />

        {/* Mains qui gesticulent */}
        <circle cx="20" cy="59" r="5" fill="#DDD6FE" className="animate-bounce" />
        <circle cx="100" cy="59" r="5" fill="#DDD6FE" className="animate-bounce" />

        {/* Bulle de dialogue */}
        <ellipse cx="85" cy="20" rx="25" ry="12" fill="white" stroke="#A78BFA" strokeWidth="2" />
        <polygon points="70,25 75,30 80,25" fill="white" stroke="#A78BFA" strokeWidth="2" />

        {/* Texte dans la bulle */}
        <text x="85" y="18" textAnchor="middle" fontSize="8" fill="#374151" fontFamily="Arial">
          Bonjour !
        </text>
        <text x="85" y="26" textAnchor="middle" fontSize="6" fill="#6B7280" fontFamily="Arial">
          Comment puis-je
        </text>
        <text x="85" y="32" textAnchor="middle" fontSize="6" fill="#6B7280" fontFamily="Arial">
          t'aider ? 😊
        </text>

        {/* Particules magiques */}
        <circle cx="25" cy="30" r="2" fill="#FCD34D" className="animate-ping" />
        <circle cx="95" cy="40" r="1.5" fill="#F472B6" className="animate-ping" />
        <circle cx="30" cy="80" r="1" fill="#34D399" className="animate-ping" />
      </svg>
    </div>
  )
}