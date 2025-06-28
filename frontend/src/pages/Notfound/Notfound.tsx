

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)
  const blackHoleRef = useRef<SVGCircleElement>(null)
  const digit4Ref1 = useRef<SVGPathElement>(null)
  const digit0Ref = useRef<SVGPathElement>(null)
  const digit4Ref2 = useRef<SVGPathElement>(null)
  const particleRefs = useRef<(SVGCircleElement | null)[]>([])
  const planetRefs = useRef<(SVGCircleElement | null)[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  const glitchTextRef = useRef<HTMLDivElement>(null)

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    // Timeline principale
    const masterTL = gsap.timeline({ repeat: -1 })

    // Animation du trou noir
    if (blackHoleRef.current) {
      gsap.to(blackHoleRef.current, {
        scale: 1.1,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })

      gsap.to(blackHoleRef.current, {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: "none",
      })
    }

    // Animation des chiffres 404 avec morphing simulé
    const digits = [digit4Ref1.current, digit0Ref.current, digit4Ref2.current]
    digits.forEach((digit, index) => {
      if (digit) {
        // Déformation gravitationnelle
        gsap.to(digit, {
          scaleY: 0.8,
          scaleX: 1.2,
          duration: 2 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        })

        // Rotation et translation vers le trou noir
        gsap.to(digit, {
          rotation: 5 * (index - 1),
          x: (index - 1) * 10,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        })
      }
    })

    // Animation des particules aspirées
    particleRefs.current.forEach((particle, index) => {
      if (particle) {
        // Mouvement spiral vers le centre
        const angle = index * 30
        const radius = 200 + Math.random() * 100

        gsap.set(particle, {
          x: Math.cos((angle * Math.PI) / 180) * radius,
          y: Math.sin((angle * Math.PI) / 180) * radius,
        })

        gsap.to(particle, {
          motionPath: {
            path: `M${Math.cos((angle * Math.PI) / 180) * radius},${Math.sin((angle * Math.PI) / 180) * radius} Q0,0 0,0`,
            autoRotate: true,
          },
          scale: 0,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          ease: "power2.in",
          delay: Math.random() * 2,
        })
      }
    })

    // Animation des planètes en orbite déformée
        planetRefs.current.forEach((planet, index) => {
      if (planet) {
        gsap.set(planet, { transformOrigin: "400px 300px" })

        gsap.to(planet, {
          rotation: 360,
          duration: 8 + index * 2,
          repeat: -1,
          ease: "none",
        })

        // Déformation de l'orbite
        gsap.to(planet, {
          scaleX: 0.7,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        })
      }
    })

    // Animation d'apparition du bouton
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        {
          scale: 0,
          rotation: 180,
          opacity: 0,
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1,
          ease: "back.out(1.7)",
          delay: 2,
        },
      )

      // Animation de hover
      const button = buttonRef.current
      button.addEventListener("mouseenter", () => {
        gsap.to(button, {
          scale: 1.1,
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
          duration: 0.3,
          ease: "power2.out",
        })
      })

      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          scale: 1,
          boxShadow: "0 0 0px rgba(59, 130, 246, 0)",
          duration: 0.3,
          ease: "power2.out",
        })
      })
    }

    // Animation du texte glitch
    if (glitchTextRef.current) {
      const glitchTL = gsap.timeline({ repeat: -1, repeatDelay: 3 })
      glitchTL
        .to(glitchTextRef.current, {
          x: -2,
          duration: 0.1,
        })
        .to(glitchTextRef.current, {
          x: 2,
          duration: 0.1,
        })
        .to(glitchTextRef.current, {
          x: 0,
          duration: 0.1,
        })
    }

    return () => {
      masterTL.kill()
    }
  }, [])

  // Effet parallax au mouvement de souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePos({ x, y })

      // Parallax sur les éléments
      gsap.to(".parallax-light", {
        x: x * 20,
        y: y * 20,
        duration: 0.5,
        ease: "power2.out",
      })

      gsap.to(".parallax-heavy", {
        x: x * 10,
        y: y * 10,
        duration: 0.8,
        ease: "power2.out",
      })

      // Déformation du trou noir selon la souris
      if (blackHoleRef.current) {
        gsap.to(blackHoleRef.current, {
          scaleX: 1 + Math.abs(x) * 0.1,
          scaleY: 1 + Math.abs(y) * 0.1,
          duration: 0.5,
          ease: "power2.out",
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse parallax-light"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Nebula Background */}
      <div className="absolute inset-0 opacity-20 parallax-heavy">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Content */}
      <div ref={containerRef} className="relative z-10 text-center">
        {/* SVG Container */}
        <div className="relative mb-8">
          <svg width="800" height="600" viewBox="0 0 800 600" className="max-w-full h-auto">
            <defs>
              {/* Gradients */}
              <radialGradient id="blackHoleGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#000000" stopOpacity="1" />
                <stop offset="70%" stopColor="#1a1a2e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#16213e" stopOpacity="0.3" />
              </radialGradient>

              <linearGradient id="digitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b6b" stopOpacity="1" />
                <stop offset="50%" stopColor="#4ecdc4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#45b7d1" stopOpacity="0.6" />
              </linearGradient>

              <radialGradient id="particleGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="#4ecdc4" stopOpacity="0.5" />
              </radialGradient>

              {/* Filters */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="distortion" x="-50%" y="-50%" width="200%" height="200%">
                <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
              </filter>
            </defs>

            {/* Trou noir central */}
            <circle
              ref={blackHoleRef}
              cx="400"
              cy="300"
              r="80"
              fill="url(#blackHoleGradient)"
              filter="url(#glow)"
              className="drop-shadow-2xl"
            />

            {/* Anneau de distorsion */}
            <circle
              cx="400"
              cy="300"
              r="100"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2"
              strokeDasharray="10,5"
              filter="url(#distortion)"
            />

            {/* Chiffres 404 déformés */}
            {/* Premier 4 */}
            <path
              ref={digit4Ref1}
              d="M150,200 L150,250 L180,250 L180,200 L180,180 L150,180 L120,180 L120,200 L120,250 L150,250"
              fill="url(#digitGradient)"
              filter="url(#glow)"
              className="parallax-light"
            />

            {/* 0 central */}
            <path
              ref={digit0Ref}
              d="M380,180 Q420,180 420,220 Q420,260 380,260 Q340,260 340,220 Q340,180 380,180 Z"
              fill="url(#digitGradient)"
              filter="url(#glow)"
              className="parallax-heavy"
            />

            {/* Deuxième 4 */}
            <path
              ref={digit4Ref2}
              d="M650,200 L650,250 L680,250 L680,200 L680,180 L650,180 L620,180 L620,200 L620,250 L650,250"
              fill="url(#digitGradient)"
              filter="url(#glow)"
              className="parallax-light"
            />

            {/* Particules aspirées */}
            {[...Array(15)].map((_, i) => (
              <circle
                key={`particle-${i}`}
                ref={(el) => { particleRefs.current[i] = el; }}
                r="3"
                fill="url(#particleGradient)"
                filter="url(#glow)"
              />
            ))}

            {/* Planètes en orbite déformée */}
            {[...Array(3)].map((_, i) => {
              const angle = i * 120 * (Math.PI / 180)
              const radius = 200 + i * 30
              const x = 400 + Math.cos(angle) * radius
              const y = 300 + Math.sin(angle) * radius

              return (
                <circle
                  key={`planet-${i}`}
                  ref={(el) => { planetRefs.current[i] = el; }}
                  cx={x}
                  cy={y}
                  r={8 + i * 2}
                  fill={`hsl(${i * 60 + 200}, 70%, 60%)`}
                  filter="url(#glow)"
                  className="parallax-heavy"
                />
              )
            })}

            {/* Lignes de distorsion */}
            {[...Array(8)].map((_, i) => {
              const angle = i * 45 * (Math.PI / 180)
              const x1 = 400 + Math.cos(angle) * 120
              const y1 = 300 + Math.sin(angle) * 120
              const x2 = 400 + Math.cos(angle) * 300
              const y2 = 300 + Math.sin(angle) * 300

              return (
                <line
                  key={`distortion-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1"
                  className="parallax-light"
                />
              )
            })}
          </svg>
        </div>

        {/* Texte principal */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 mb-4 parallax-light">
            404
          </h1>
          <div ref={glitchTextRef} className="text-xl md:text-2xl text-gray-300 mb-2 font-mono">
            PAGE ABSORBED BY BLACK HOLE
          </div>
          <p className="text-gray-400 max-w-md mx-auto parallax-heavy">
            La page que vous cherchez a été aspirée dans un trou noir cosmique. Elle dérive maintenant quelque part dans
            l'espace-temps...
          </p>
        </div>

        {/* Bouton de retour */}
        <button
          ref={buttonRef}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          onClick={() => window.history.back()}
        >
          🚀 Retour à la réalité
        </button>

        {/* Coordonnées spatiales */}
        <div className="absolute bottom-4 left-4 text-xs text-gray-500 font-mono parallax-light">
          COORDS: X:{mousePos.x.toFixed(2)} Y:{mousePos.y.toFixed(2)}
        </div>

        {/* Indicateur de gravité */}
        <div className="absolute top-4 right-4 text-xs text-gray-500 font-mono parallax-heavy">
          GRAVITY: {(Math.abs(mousePos.x) + Math.abs(mousePos.y)).toFixed(2)}G
        </div>
      </div>

      {/* Effet de vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-50 pointer-events-none" />
    </div>
  )
}
