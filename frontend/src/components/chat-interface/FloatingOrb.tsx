import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme-provider';

const FloatingOrb = () => {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Static Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className={`w-96 h-96 rounded-full blur-3xl ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20' 
            : 'bg-gradient-to-r from-blue-300/30 via-purple-300/30 to-cyan-300/30'
        }`} />
      </motion.div>

      <motion.div
        className="absolute top-3/4 right-1/4"
        animate={{
          scale: [1, 1.5, 1],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div className={`w-64 h-64 rounded-full blur-2xl ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-pink-500/15 to-orange-500/15' 
            : 'bg-gradient-to-r from-pink-300/25 to-orange-300/25'
        }`} />
      </motion.div>

      {/* Mouse Following Orb */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          x: mousePosition.x - 150,
          y: mousePosition.y - 150,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
        }}
      >
        <div className={`w-72 h-72 rounded-full blur-3xl ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-blue-500/10' 
            : 'bg-gradient-to-r from-violet-300/20 via-indigo-300/20 to-blue-300/20'
        }`} />
      </motion.div>

      {/* Additional Floating Orbs */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{
          rotate: [0, 360],
          scale: [0.8, 1.1, 0.8],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className={`w-48 h-48 rounded-full blur-2xl ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15' 
            : 'bg-gradient-to-r from-emerald-300/25 to-teal-300/25'
        }`} />
      </motion.div>
    </div>
  );
};

export default  FloatingOrb 
