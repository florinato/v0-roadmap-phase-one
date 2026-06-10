'use client';

import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase'; // Importar supabase
import { useEffect, useState } from 'react';
import ChatHeaderV2 from './ChatHeaderV2';
import InputBar from './InputBar';
import MessageList from './MessageList';
import TransactionConfirmModal from './TransactionConfirmModal';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

interface ChatRoomProps {
  conversationId?: string; // Hacemos opcional conversationId ya que no la necesitamos
  productId: string | any; // Permitimos any para el caso de objetos de Next.js
  initialMessages?: Message[];
  onBack: () => void;
}

export default function ChatRoom({
  productId,
  conversationId,
  initialMessages = [],
  onBack,
}: ChatRoomProps) {
  const { user } = useAuth();
  // Aseguramos que user.id existe para usarlo directamente
  const currentUserId = user?.id as string;
  const currentUserMetadata = user?.user_metadata;

  const [messages, setMessages] = useState(initialMessages);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [productState, setProductState] = useState<'active' | 'reserved' | 'sold'>('active');
  const [product, setProduct] = useState<any>(null); // Usar any para simplificar, idealmente definir Product
  const [isLoading, setIsLoading] = useState(true);

  // Cargar producto y mensajes desde Supabase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const pid = typeof productId === 'object' ? productId.id : productId;

        if (!pid || pid === ':1' || pid === 'undefined') {
          console.warn('[v0] Invalid productId:', productId);
          setIsLoading(false);
          return;
        }

        // Cargar producto
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*, profiles(id, name, avatar_url, rating, reviews_count)') // Asegurarse de seleccionar el seller_id
          .eq('id', pid)
          .single();

        if (productError && productError.code !== 'PGRST116') { // PGRST116 means no rows found
          throw productError;
        }

        if (productData) {
          setProduct(productData);
          setProductState(productData.state);
        } else {
          setProduct(null);
        }

        // Cargar mensajes filtrando únicamente por product_id
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('id, content, created_at, buyer_id, seller_id') // Seleccionar columnas reales
          .eq('product_id', pid)
          .order('created_at', { ascending: true });
        
        if (messagesError) {
          throw messagesError;
        }

        if (messagesData) {
          setMessages(messagesData.map(msg => ({
            id: msg.id,
            senderId: msg.buyer_id === currentUserId ? msg.buyer_id : msg.seller_id, // Determinar senderId basado en el usuario actual
            text: msg.content,
            timestamp: new Date(msg.created_at),
          })));
        }

      } catch (error) {
        console.error('[v0] Error loading chat data:', error);
        setProduct(null);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [productId, currentUserId]); // Eliminamos conversationId de las dependencias

  const isCurrentUserSeller = product?.seller_id === currentUserId; // CAMBIO: user_id a seller_id

  const handleSendMessage = async (text: string) => {
    if (!currentUserId || !product) return;

    const newMessage: Message = {
      id: `${Date.now()}`,
      senderId: currentUserId,
      text,
      timestamp: new Date(),
    };

    // Optimistic update
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const { error } = await supabase.from('messages').insert({
        product_id: product.id,
        buyer_id: currentUserId, // El que envía el mensaje es el buyer
        seller_id: product.seller_id, // El vendedor del producto
        content: text,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('[v0] Error sending message:', error);
      // Revert optimistic update if there was an error
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== newMessage.id));
    }
  };

  const handleConfirmReserved = async () => {
    if (!product?.id) return;
    try {
      const { error } = await supabase
        .from('products')
        .update({ state: 'reserved' })
        .eq('id', product.id);

      if (error) throw error;

      setProductState('reserved');
      setIsTransactionModalOpen(false);
    } catch (error) {
      console.error('[v0] Error marking as reserved:', error);
    }
  };

  const handleConfirmSold = async () => {
    if (!product?.id) return;
    try {
      const { error } = await supabase
        .from('products')
        .update({ state: 'sold' })
        .eq('id', product.id);

      if (error) throw error;

      setProductState('sold');
      setIsTransactionModalOpen(false);
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
        productImage={product.image_url}
        productTitle={product.name}
        productPrice={product.price}
        productState={productState}
        sellerName={product.profiles.name} // Usar el nombre del vendedor del perfil
        isCurrentUserSeller={isCurrentUserSeller}
        onBack={onBack}
        onMarkReserved={() => setIsTransactionModalOpen(true)}
        onMarkSold={() => setIsTransactionModalOpen(true)}
      />
      <MessageList messages={messages} />
      <InputBar onSendMessage={handleSendMessage} />

      <TransactionConfirmModal
        isOpen={isTransactionModalOpen}
        productTitle={product.name}
        buyerName={currentUserMetadata?.full_name || 'Comprador'}
        onConfirmReserved={handleConfirmReserved}
        onConfirmSold={handleConfirmSold}
        onCancel={() => setIsTransactionModalOpen(false)}
      />
    </div>
  );
}
