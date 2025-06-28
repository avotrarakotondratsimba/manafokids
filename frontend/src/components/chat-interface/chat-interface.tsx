import { useState } from 'react';
import { ChatHeader } from './chatHeader';
import ChatInput from './chatInput';
import ChatMessages from './chatMessage';
import axios from 'axios';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isVoiceMessage?: boolean;
  audioDuration?: number;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);



  // MESSAGE TEXT
  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Envoie le message au backend n8n avec le body
      const response = await axios.post(
        import.meta.env.VITE_WEBHOOK_URL,
        { message: content } 
      );
      console.log("Réponse n8n :", response.data);

      const aiMessage: Message = {
        id: `${Date.now() + 1}`,
        type: 'ai',
        content: response.data || 'Réponse AI indisponible',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erreur lors de la récupération du message AI', error);
      setMessages(prev => [
        ...prev,
        {
          id: `${Date.now() + 2}`,
          type: 'ai',
          content: "Erreur de l'IA",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };


  // MESSAGE VOICE
  const handleSendVoiceMessage = async (audioBlob: Blob, duration: number) => {
  const userMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    content: `Message vocal (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')})`,
    timestamp: new Date(),
    isVoiceMessage: true,
    audioDuration: duration,
  };

  setMessages(prev => [...prev, userMessage]);
  setIsLoading(true);

  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice-message.webm');
    formData.append('duration', duration.toString());
    formData.append('type', 'voice'); // 👈 Ajoute cette ligne pour indiquer que c’est un message vocal

    const response = await axios.post(
      // import.meta.env.VITE_WEBHOOK_URL, // ou une URL spécifique si tu veux séparer
      "https://n8n.srv867342.hstgr.cloud/webhook/59171bbb-6e4e-41b5-a380-f45969c03992",

      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log("Réponse n8n (vocal) :", response.data);

    const aiMessage: Message = {
      id: `${Date.now() + 1}`,
      type: 'ai',
      content: response.data || 'Réponse AI indisponible pour le message vocal',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
  } catch (error) {
    console.error('Erreur lors du traitement du message vocal', error);
    setMessages(prev => [
      ...prev,
      {
        id: `${Date.now() + 2}`,
        type: 'ai',
        content: "Erreur lors du traitement du message vocal",
        timestamp: new Date(),
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      <ChatHeader />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput 
        onSendMessage={handleSendMessage} 
        onSendVoiceMessage={handleSendVoiceMessage}
        isLoading={isLoading} 
      />
    </div>
  );
};

export default ChatInterface;