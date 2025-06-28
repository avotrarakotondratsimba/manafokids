import { Bot } from "lucide-react";
import { motion } from "framer-motion";

export  const ChatHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 border-b border-border/10 backdrop-blur-sm"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
        <Bot className="w-5 h-5 text-primary" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Assistant IA</h1>
    </motion.div>
  );
};