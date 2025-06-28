import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          className="relative w-24 h-24 mx-auto mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-xl"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-30 blur-lg"></div>
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 opacity-40 blur-md"></div>
          <div className="absolute inset-6 rounded-full bg-white opacity-80"></div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2"
        >
          ChatSpace
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-muted-foreground"
        >
          Connexion en cours...
        </motion.p>
      </div>
    </motion.div>
  );
}
