
import { Bot, Copy, MoreHorizontal, ThumbsDown, ThumbsUp, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import FloatingOrb from "./FloatingOrb"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
}

const ChatMessages = ({ messages, isLoading = false }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center relative">
        <FloatingOrb />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center z-10"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
          >
            <Bot className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-semibold mb-2">Bonjour !</h2>
          <p className="text-muted-foreground">Comment puis-je vous aider aujourd'hui ?</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden">
      <FloatingOrb />
      <ScrollArea className="h-full">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    delay: index * 0.05,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  scale: 0.95,
                  transition: { duration: 0.2 },
                }}
                className={`group flex gap-4 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                onMouseEnter={() => setHoveredMessage(message.id)}
                onMouseLeave={() => setHoveredMessage(null)}
              >
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.1, type: "spring" }}
                >
                  <Avatar
                    className={`h-10 w-10 ring-2 ring-offset-2 transition-all duration-200 ${
                      message.type === "user"
                        ? "ring-primary/20 ring-offset-background"
                        : "ring-secondary/20 ring-offset-background"
                    }`}
                  >
                    <AvatarFallback
                      className={`flex items-center justify-center ${
                        message.type === "user"
                          ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                          : "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground"
                      }`}
                    >
                      {message.type === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                {/* Message Content */}
                <div
                  className={`flex-1 max-w-[80%] ${message.type === "user" ? "items-end" : "items-start"} flex flex-col`}
                >
                  {/* Message Bubble */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`relative group/message rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 ${
                      message.type === "user"
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md"
                        : "bg-gradient-to-br from-card to-card/50 border border-border/50 text-card-foreground rounded-bl-md hover:border-border/80"
                    }`}
                  >
                    {/* Message Text */}
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p
                        className={`leading-relaxed whitespace-pre-wrap m-0 ${
                          message.type === "user" ? "text-primary-foreground" : "text-foreground"
                        }`}
                      >
                        {message.content}
                      </p>
                    </div>

                    {/* Message Actions */}
                    <AnimatePresence>
                      {hoveredMessage === message.id && message.type === "ai" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute -bottom-2 left-4 flex items-center gap-1 bg-background border border-border/50 rounded-full px-2 py-1 shadow-lg"
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 hover:bg-muted"
                                  onClick={() => copyToClipboard(message.content)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copier</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted">
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Utile</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted">
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Pas utile</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Plus d'options</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Timestamp */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredMessage === message.id ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`text-xs text-muted-foreground mt-1 px-2 ${
                      message.type === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
              <Avatar className="h-10 w-10 ring-2 ring-secondary/20 ring-offset-2 ring-offset-background">
                <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 max-w-[80%]">
                <motion.div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-muted-foreground/60 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">L'assistant réfléchit...</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  )
}

export default ChatMessages
