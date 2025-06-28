import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Hash, Users } from 'lucide-react';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { useChatStore } from '@/store/chatStore';

export function ChatWindow() {
  const { messages, currentUser } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col h-full bg-background/30"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <Hash className="w-5 h-5 text-muted-foreground" />
          <div>
            <h1 className="font-semibold text-foreground text-lg">
              général
            </h1>
            <p className="text-sm text-muted-foreground">
              Canal principal pour tous
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">4 membres</span>
          </div>
        </motion.div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-64"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                  <Hash className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Bienvenue dans #général
                </h3>
                <p className="text-muted-foreground text-sm">
                  Canal principal pour tous
                </p>
              </div>
            </motion.div>
          ) : (
            messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isOwn={message.author.id === currentUser.id}
              />
            ))
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput />
    </motion.div>
  );
}