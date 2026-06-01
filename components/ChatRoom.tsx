'use client';

import { useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import InputBar from './InputBar';
import { Message } from '@/lib/mockData';

interface ChatRoomProps {
  conversationId: string;
  productId: string;
  initialMessages: Message[];
  onBack: () => void;
}

export default function ChatRoom({
  productId,
  initialMessages,
  onBack,
}: ChatRoomProps) {
  const [messages, setMessages] = useState(initialMessages);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderType: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);

    // Simular respuesta después de 1 segundo
    setTimeout(() => {
      const responses = [
        '¿Podemos hablar de reunirnos?',
        'Genial, ¿cuándo te va bien?',
        'Ok, te parece bien a las 5pm?',
        'Perfecto, nos vemos entonces',
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: `m${Date.now()}`,
          senderType: 'seller',
          text: randomResponse,
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader productId={productId} onBack={onBack} />
      <MessageList messages={messages} />
      <InputBar onSendMessage={handleSendMessage} />
    </div>
  );
}
