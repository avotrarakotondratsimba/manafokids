import { LoadingScreen } from './LoadingScreen';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import FloatingOrb from '@/components/chat-interface/FloatingOrb';
const MessageInterface = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    
      <div className="min-h-screen w-full overflow-hidden">
        <FloatingOrb />
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingScreen key="loading" />
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-screen w-full"
            >
              <Sidebar />
              <ChatWindow />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    
  );
};

export default MessageInterface;
