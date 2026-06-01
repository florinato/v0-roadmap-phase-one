'use client';

import { useState } from 'react';
import ChatHeaderV2 from './ChatHeaderV2';
import MessageList from './MessageList';
import InputBar from './InputBar';
import TransactionConfirmModal from './TransactionConfirmModal';
import { Message, mockProducts, mockCurrentUser } from '@/lib/mockData';

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
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [productState, setProductState] = useState<'active' | 'reserved' | 'sold'>('active');

  const product = mockProducts.find((p) => p.id === productId);
  const isCurrentUserSeller = product?.sellerId === mockCurrentUser.id;

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

  const handleConfirmReserved = () => {
    setProductState('reserved');
    console.log('[v0] Producto marcado como reservado');
  };

  const handleConfirmSold = () => {
    setProductState('sold');
    console.log('[v0] Producto marcado como vendido');
  };

  if (!product) {
    return <div className="flex items-center justify-center h-full">Producto no encontrado</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeaderV2
        productImage={product.imageUrl}
        productTitle={product.title}
        productPrice={product.price}
        productState={productState}
        sellerName={product.description}
        isCurrentUserSeller={isCurrentUserSeller}
        onBack={onBack}
        onMarkReserved={() => setIsTransactionModalOpen(true)}
        onMarkSold={() => setIsTransactionModalOpen(true)}
      />
      <MessageList messages={messages} />
      <InputBar onSendMessage={handleSendMessage} />

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmModal
        isOpen={isTransactionModalOpen}
        productTitle={product.title}
        buyerName="Juan Pérez"
        onConfirmReserved={handleConfirmReserved}
        onConfirmSold={handleConfirmSold}
        onCancel={() => setIsTransactionModalOpen(false)}
      />
    </div>
  );
}
