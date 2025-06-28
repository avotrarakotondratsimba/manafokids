import React, { useEffect, useRef, useState } from "react";
import BentoGrid from "@/components/Home/Bento";
import HeroSection from "@/components/Home/Hero";
import { Volume2, VolumeX } from "lucide-react";

const Home = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.warn("Lecture automatique bloquée.");
        });
      }
    }
  }, []);

  const toggleMute = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      try {
        await audio.play();
      } catch (err) {
        console.warn("Impossible de relancer la lecture:", err);
      }
    } else {
      audio.muted = true;
    }

    setIsMuted(!isMuted);
  };

  return (
    <div className="relative">
      {/* Musique de fond */}
      <audio ref={audioRef} loop>
        <source src="/music.mp3" type="audio/mpeg" />
        Votre navigateur ne supporte pas l'audio.
      </audio>

      <HeroSection />
      <BentoGrid />

      {/* Bouton Mute / Unmute */}
      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 bg-white/80 dark:bg-black/70 text-black dark:text-white p-3 rounded-full shadow-xl hover:scale-110 hover:bg-gradient-to-tr from-purple-400 to-indigo-500 hover:text-white transition-all duration-300 backdrop-blur-lg"
        aria-label="Toggle sound"
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6" />
        ) : (
          <Volume2 className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default Home;
