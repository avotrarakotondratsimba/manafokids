import { Button } from "@/components/ui/button";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroImage from "/public/images/hero.png";
import { useTranslation } from "react-i18next";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HeroSection = () => {
  const { t } = useTranslation("home");
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const balloonsRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const flowersRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline pour l'animation d'entrée
      const tl = gsap.timeline();

      // Animation du titre
      tl.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
        }
      );

      // Animation de la description
      tl.fromTo(
        descriptionRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5"
      );

      // Animation du bouton
      tl.fromTo(
        buttonRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      );

      // Animation de l'image
      tl.fromTo(
        imageRef.current,
        {
          opacity: 0,
          x: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.8"
      );

      // Animation de la flèche qui tourne autour du bouton
      gsap.to(arrowRef.current, {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });

      // Animation des ballons flottants
      gsap.to(".balloon", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.5,
      });

      // Animation des étoiles scintillantes
      gsap.to(".star", {
        scale: 1.2,
        opacity: 0.7,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: 0.3,
      });

      // Animation des fleurs qui oscillent
      gsap.to(".flower", {
        rotation: 10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.8,
      });

      // Animation du bouton au hover (pulse)
      const button = buttonRef.current?.querySelector("button");
      if (button) {
        gsap.set(button, { transformOrigin: "center center" });

        button.addEventListener("mouseenter", () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        button.addEventListener("mouseleave", () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      }

      // Animations au scroll
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top center",
        end: "bottom center",
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(".floating-element", {
            y: progress * -50,
            duration: 0.3,
            ease: "none",
          });
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-12 md:py-20 md:pt-0 overflow-hidden transition-colors duration-300"
    >
      {/* Décorations SVG - Ballons */}
      <div ref={balloonsRef} className="absolute inset-0 pointer-events-none">
        <svg
          className="balloon absolute top-10 left-10 w-8 h-12 text-pink-300 dark:text-pink-400"
          viewBox="0 0 24 36"
          fill="currentColor"
        >
          <ellipse cx="12" cy="12" rx="8" ry="12" />
          <line
            x1="12"
            y1="24"
            x2="12"
            y2="36"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
        <svg
          className="balloon absolute top-20 right-20 w-6 h-10 text-blue-300 dark:text-blue-400"
          viewBox="0 0 24 36"
          fill="currentColor"
        >
          <ellipse cx="12" cy="12" rx="6" ry="10" />
          <line
            x1="12"
            y1="22"
            x2="12"
            y2="36"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
        <svg
          className="balloon absolute bottom-32 left-1/4 w-7 h-11 text-purple-300 dark:text-purple-400"
          viewBox="0 0 24 36"
          fill="currentColor"
        >
          <ellipse cx="12" cy="12" rx="7" ry="11" />
          <line
            x1="12"
            y1="23"
            x2="12"
            y2="36"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Décorations SVG - Étoiles */}
      <div ref={starsRef} className="absolute inset-0 pointer-events-none">
        <svg
          className="star absolute top-16 right-1/4 w-6 h-6 text-yellow-300 dark:text-yellow-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg
          className="star absolute bottom-20 right-10 w-4 h-4 text-pink-300 dark:text-pink-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg
          className="star absolute top-1/3 left-16 w-5 h-5 text-blue-300 dark:text-blue-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      {/* Décorations SVG - Fleurs */}
      <div ref={flowersRef} className="absolute inset-0 pointer-events-none">
        <svg
          className="flower absolute bottom-10 left-8 w-12 h-12 text-pink-200 dark:text-pink-300"
          viewBox="0 0 48 48"
          fill="currentColor"
        >
          <circle cx="24" cy="16" r="6" />
          <circle cx="16" cy="28" r="6" />
          <circle cx="32" cy="28" r="6" />
          <circle cx="24" cy="40" r="6" />
          <circle
            cx="24"
            cy="24"
            r="4"
            fill="white"
            className="dark:fill-gray-800"
          />
        </svg>
        <svg
          className="flower absolute top-1/2 right-8 w-10 h-10 text-purple-200 dark:text-purple-300"
          viewBox="0 0 48 48"
          fill="currentColor"
        >
          <circle cx="24" cy="16" r="5" />
          <circle cx="16" cy="28" r="5" />
          <circle cx="32" cy="28" r="5" />
          <circle cx="24" cy="40" r="5" />
          <circle
            cx="24"
            cy="24"
            r="3"
            fill="white"
            className="dark:fill-gray-800"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 my-36">
          {/* Texte */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1
              ref={titleRef}
              className="font-bjola text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-gray-900 dark:text-white transition-colors duration-300"
            >
              {t("libere")}
              <span className="text-[#C32E96] dark:text-pink-400 relative">
                {t("Génie")}
                <svg
                  className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 dark:text-yellow-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </span>{" "}
              {t("Créatif")}
              <br className="hidden md:block" />
              {t("enf")}
              <span className="text-[#05AEED] dark:text-blue-400">
                {t("ludique")}
              </span>
            </h1>

            <p
              ref={descriptionRef}
              className="mt-6 font-baloo text-gray-700 dark:text-gray-300 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed transition-colors duration-300"
            >
              {t("donne")}
            </p>

            <div ref={buttonRef} className="mt-8 relative">
              <Button className="bg-[#05AEED] hover:bg-[#0495cc] dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-6 rounded-full text-base md:text-lg w-full md:w-[250px] h-12 transition duration-300 ease-in-out shadow-lg hover:shadow-xl dark:shadow-blue-500/25">
                {t("commence")}
              </Button>

              {/* Flèche animée qui pointe vers le bouton */}
              <svg
                ref={arrowRef}
                className="absolute -right-16 top-1/2 transform -translate-y-1/2 w-12 h-12 text-[#C32E96] dark:text-pink-400 hidden md:block transition-colors duration-300"
                viewBox="0 0 48 48"
                fill="none"
              >
                <path
                  d="M24 8C24 8 36 16 36 24C36 32 24 40 24 40"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M32 24H12"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>
          </div>

          {/* Image */}
          <div ref={imageRef} className="w-full md:w-1/2 floating-element">
            <div className="relative">
              <img
                src={HeroImage}
                alt="Personnage robot cartoon coloré pour enfants"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />

              {/* Particules autour de l'image */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="star absolute top-8 right-8 w-4 h-4 bg-yellow-300 dark:bg-yellow-400 rounded-full"></div>
                <div className="star absolute bottom-12 left-8 w-3 h-3 bg-pink-300 dark:bg-pink-400 rounded-full"></div>
                <div className="star absolute top-1/2 right-4 w-2 h-2 bg-blue-300 dark:bg-blue-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trait courbé décoratif */}
    </section>
  );
};

export default HeroSection;
