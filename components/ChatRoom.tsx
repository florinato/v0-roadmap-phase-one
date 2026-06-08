'use client';

import { useState, useEffect } from 'react';
import ChatHeaderV2 from './ChatHeaderV2';
import MessageList from './MessageList';
import InputBar from './InputBar';
import TransactionConfirmModal from './TransactionConfirmModal';
import { useAuth } from '@/lib/authContext';
import {
  getProductById,
  getConversationMessages,
  sendMessage,
  updateProductState,
} from '@/lib/services/db';
import { mockProducts } from '@/lib/mockData';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

interface ChatRoomProps {
  conversationId: string;
  productId: string;
  initialMessages: Message[];
  onBack: () => void;
}

export default function ChatRoom({
  productId,
  conversationId,
  initialMessages,
  onBack,
}: ChatRoomProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState(initialMessages);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [productState, setProductState] = useState<'active' | 'reserved' | 'sold'>('active');
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar producto y mensajes desde Firebase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Cargar producto
        const productData = await getProductById(productId);
        if (productData) {
          setProduct(productData);
          setProductState(productData.state);
        } else {
          // Fallback a mockData
          const mockProduct = mockProducts.find((p) => p.id === productId);
          if (mockProduct) {
            setProduct(mockProduct);
            setProductState(mockProduct.state);
          }
        }

        // Cargar mensajes
        const messagesData = await getConversationMessages(conversationId);
        if (messagesData.length > 0) {
          setMessages(messagesData);
        }
      } catch (error) {
        console.error('[v0] Error loading chat data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [productId, conversationId]);

  const isCurrentUserSeller = product?.sellerId === user?.id;

  const handleSendMessage = async (text: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: user.id,
      text,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);

    try {
      await sendMessage(conversationId, user.id, text);
    } catch (error) {
      console.error('[v0] Error sending message:', error);
    }
  };

  const handleConfirmReserved = async () => {
    try {
      const success = await updateProductState(productId, 'reserved');
      if (success) {
        setProductState('reserved');
      }
    } catch (error) {
      console.error('[v0] Error marking as reserved:', error);
    }
  };

  const handleConfirmSold = async () => {
    try {
      const success = await updateProductState(productId, 'sold');
      if (success) {
        setProductState('sold');
      }
    } catch (error) {
      console.error('[v0] Error marking as sold:', error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Cargando chat...</div>;
  }

  if (!product) {
    return <div className="flex items-center justify-center h-full">Producto no encontrado</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeaderV2
        productImage={product.images?.[0] || product.imageUrl}
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

      <TransactionConfirmModal
        isOpen={isTransactionModalOpen}
        productTitle={product.title}
        buyerName="Comprador"
        onConfirmReserved={handleConfirmReserved}
        onConfirmSold={handleConfirmSold}
        onCancel={() => setIsTransactionModalOpen(false)}
      />
    </div>
  );
}
