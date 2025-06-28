

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function Loader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<SVGCircleElement>(null)
  const orbitRefs = useRef<(SVGGElement | null)[]>([])
  const particleRefs = useRef<(SVGCircleElement | null)[]>([])
  const waveRefs = useRef<(SVGCircleElement | null)[]>([])
  const energyPathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Timeline principale
    const masterTL = gsap.timeline({ repeat: -1 })

    // Animation du noyau central - morphing simulé avec scale et rotation
    if (coreRef.current) {
      const coreTL = gsap.timeline({ repeat: -1 })
      coreTL
        .to(coreRef.current, {
          scale: 1.3,
          rotation: 90,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(coreRef.current, {
          scale: 0.8,
          rotation: 180,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(coreRef.current, {
          scale: 1.1,
          rotation: 270,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(coreRef.current, {
          scale: 1,
          rotation: 360,
          duration: 1,
          ease: "power2.inOut",
        })
    }

    // Animation des orbites planétaires
    orbitRefs.current.forEach((orbit, index) => {
      if (orbit) {
        gsap.set(orbit, { transformOrigin: "200px 200px" })
        gsap.to(orbit, {
          rotation: 360,
          duration: 6 + index * 2,
          repeat: -1,
          ease: "none",
        })

        // Animation des planètes dans chaque orbite
        const planets = orbit.querySelectorAll(".planet")
        planets.forEach((planet, planetIndex) => {
          gsap.to(planet, {
            scale: 1.5,
            duration: 1.5 + planetIndex * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
          })
        })
      }
    })

    // Animation des particules flottantes
    particleRefs.current.forEach((particle) => {
      if (particle) {
        // Mouvement flottant
        gsap.to(particle, {
          x: `+=${Math.random() * 40 - 20}`,
          y: `+=${Math.random() * 40 - 20}`,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        })

        // Pulsation
        gsap.to(particle, {
          opacity: 0.3,
          scale: 0.5,
          duration: 2 + Math.random(),
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        })
      }
    })

    // Animation des vagues d'énergie
    waveRefs.current.forEach((wave, index) => {
      if (wave) {
        const waveTL = gsap.timeline({ repeat: -1 })
        waveTL.set(wave, { scale: 0, opacity: 1 }).to(wave, {
          scale: 3,
          opacity: 0,
          duration: 2,
          ease: "power2.out",
          delay: index * 0.5,
        })
      }
    })

    // Animation du chemin d'énergie
    if (energyPathRef.current) {
      gsap.to(energyPathRef.current, {
        strokeDashoffset: -100,
        duration: 2,
        repeat: -1,
        ease: "none",
      })
    }

    // Animation globale de rotation
    gsap.to(containerRef.current.querySelector(".main-container"), {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    })

    return () => {
      masterTL.kill()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
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
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Main Loader */}
      <div ref={containerRef} className="relative">
        <div className="main-container">
          <svg width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-2xl">
            <defs>
              {/* Gradients */}
              <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff6b6b" stopOpacity="1" />
                <stop offset="50%" stopColor="#4ecdc4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#45b7d1" stopOpacity="0.6" />
              </radialGradient>

              <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#764ba2" stopOpacity="0.4" />
              </linearGradient>

              <radialGradient id="planetGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffeaa7" stopOpacity="1" />
                <stop offset="100%" stopColor="#fab1a0" stopOpacity="0.8" />
              </radialGradient>

              <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00cec9" stopOpacity="0" />
                <stop offset="50%" stopColor="#00cec9" stopOpacity="1" />
                <stop offset="100%" stopColor="#00cec9" stopOpacity="0" />
              </linearGradient>

              {/* Filters */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Vagues d'énergie */}
            {[...Array(4)].map((_, i) => (
              <circle
                key={`wave-${i}`}
                ref={(el) => { waveRefs.current[i] = el; }}
                cx="200"
                cy="200"
                r="30"
                fill="none"
                stroke="url(#energyGradient)"
                strokeWidth="2"
                opacity="0"
                filter="url(#glow)"
              />
            ))}

            {/* Orbites planétaires */}
            {[60, 90, 120].map((radius, orbitIndex) => (
              <g key={`orbit-${orbitIndex}`} ref={(el) => { orbitRefs.current[orbitIndex] = el; }}>
                {/* Trace de l'orbite */}
                <circle
                  cx="200"
                  cy="200"
                  r={radius}
                  fill="none"
                  stroke="url(#orbitGradient)"
                  strokeWidth="1"
                  strokeDasharray="5,10"
                  opacity="0.3"
                />

                {/* Planètes sur l'orbite */}
                {[...Array(3)].map((_, planetIndex) => {
                  const angle = planetIndex * 120 * (Math.PI / 180)
                  const x = 200 + Math.cos(angle) * radius
                  const y = 200 + Math.sin(angle) * radius

                  return (
                    <circle
                      key={`planet-${orbitIndex}-${planetIndex}`}
                      className="planet"
                      cx={x}
                      cy={y}
                      r={3 + orbitIndex}
                      fill="url(#planetGradient)"
                      filter="url(#innerGlow)"
                    />
                  )
                })}
              </g>
            ))}

            {/* Particules flottantes */}
            {[...Array(20)].map((_, i) => {
              const angle = i * 18 * (Math.PI / 180)
              const radius = 140 + Math.random() * 60
              const x = 200 + Math.cos(angle) * radius
              const y = 200 + Math.sin(angle) * radius

              return (
                <circle
                  key={`particle-${i}`}
                  ref={(el) => { particleRefs.current[i] = el; }}
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill="#00cec9"
                  filter="url(#glow)"
                />
              )
            })}

            {/* Chemin d'énergie spiralé */}
            <path
              ref={energyPathRef}
              d="M200,200 Q220,180 240,200 Q220,220 200,200 Q180,180 160,200 Q180,220 200,200"
              fill="none"
              stroke="url(#energyGradient)"
              strokeWidth="2"
              strokeDasharray="10,5"
              filter="url(#glow)"
              opacity="0.7"
            />

            {/* Noyau central */}
            <circle
              ref={coreRef}
              cx="200"
              cy="200"
              r="25"
              fill="url(#coreGradient)"
              filter="url(#glow)"
              className="drop-shadow-lg"
            />

            {/* Cercle intérieur du noyau */}
            <circle
              cx="200"
              cy="200"
              r="15"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1"
              opacity="0.6"
              filter="url(#innerGlow)"
            />
          </svg>
        </div>

        {/* Loading Text */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center">
          <div className="text-cyan-300 text-2xl font-bold tracking-wider mb-3 animate-pulse">COSMIC ENERGY</div>
          <div className="text-purple-300 text-sm font-mono tracking-widest opacity-80">
            INITIALIZING QUANTUM FIELD...
          </div>
          <div className="flex space-x-2 justify-center mt-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.5s",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Corner Energy Indicators */}
      <div className="absolute top-8 left-8">
        <div
          className="w-12 h-12 border-2 border-cyan-400 rounded-full animate-spin opacity-60"
          style={{ animationDuration: "3s" }}
        >
          <div className="w-2 h-2 bg-cyan-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="absolute top-8 right-8">
        <div
          className="w-12 h-12 border-2 border-purple-400 rounded-full animate-spin opacity-60"
          style={{ animationDuration: "4s", animationDirection: "reverse" }}
        >
          <div className="w-2 h-2 bg-purple-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="absolute bottom-8 left-8">
        <div
          className="w-12 h-12 border-2 border-pink-400 rounded-full animate-spin opacity-60"
          style={{ animationDuration: "5s" }}
        >
          <div className="w-2 h-2 bg-pink-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="absolute bottom-8 right-8">
        <div
          className="w-12 h-12 border-2 border-yellow-400 rounded-full animate-spin opacity-60"
          style={{ animationDuration: "3.5s", animationDirection: "reverse" }}
        >
          <div className="w-2 h-2 bg-yellow-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  )
}
