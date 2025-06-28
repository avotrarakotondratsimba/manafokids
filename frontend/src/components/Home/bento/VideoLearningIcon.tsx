export function VideoLearningIcon() {
  return (
    <div className="w-24 h-24 relative">
        
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Tablette */}
        <rect x="20" y="25" width="60" height="40" rx="8" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2" />
        <rect x="25" y="30" width="50" height="30" rx="4" fill="#EFF6FF dark:fill-gray-800" />

        {/* Play button */}
        <polygon points="40,40 40,50 50,45" fill="#3B82F6" className="dark:fill-blue-400" />

        {/* Enfant cartoon */}
        <circle cx="50" cy="75" r="8" fill="#FED7AA" className="dark:fill-orange-300" />
        <circle cx="47" cy="73" r="1" fill="#374151" className="dark:fill-gray-200" />
        <circle cx="53" cy="73" r="1" fill="#374151" className="dark:fill-gray-200" />
        <path d="M 47 77 Q 50 79 53 77" stroke="#374151" strokeWidth="1" fill="none" className="dark:stroke-gray-200" />

        {/* Étoiles */}
        <g className="animate-pulse">
          <polygon
            points="15,15 16,18 19,18 17,20 18,23 15,21 12,23 13,20 11,18 14,18"
            fill="#FCD34D"
            className="dark:fill-yellow-300"
          />
          <polygon
            points="85,20 86,23 89,23 87,25 88,28 85,26 82,28 83,25 81,23 84,23"
            fill="#FCD34D"
            className="dark:fill-yellow-300"
          />
          <polygon
            points="75,10 76,13 79,13 77,15 78,18 75,16 72,18 73,15 71,13 74,13"
            fill="#FCD34D"
            className="dark:fill-yellow-300"
          />
        </g>
      </svg>
    </div>
  )
}