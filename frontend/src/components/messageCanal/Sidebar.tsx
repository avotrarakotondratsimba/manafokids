import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { ThemeToggle } from './ThemeToggle';
import { Avatar } from './Avatar';

export function Sidebar() {
  const { currentUser } = useChatStore();

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 h-full bg-card/50 backdrop-blur-md border-r border-border/50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div>
            <h1 className="font-semibold text-foreground">ChatSpace</h1>
            <p className="text-xs text-muted-foreground">Canal général</p>
          </div>
        </motion.div>
      </div>

      {/* Online Users */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            En ligne — 4
          </h2>
          <div className="space-y-3">
            {['Alice Martin', 'Bob Johnson', 'Clara Dupuis'].map((name, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + 0.1 * index }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="relative">
                  <Avatar name={name} size="sm" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                <span className="text-sm text-foreground">{name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar name={currentUser.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">En ligne</p>
            </div>
          </div>
          <div className="flex gap-1">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-full glass dark:glass-dark hover:bg-accent/50 flex items-center justify-center transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}