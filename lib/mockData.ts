'use client';

export const mockSellers: Record<string, { id: string; name: string; avatarUrl: string; rating: number; reviewsCount: number }> = {
  u1: {
    id: 'u1',
    name: 'María Gómez',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    rating: 4.8,
    reviewsCount: 12,
  },
  u2: {
    id: 'u2',
    name: 'Carlos Martín',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
    rating: 4.5,
    reviewsCount: 8,
  },
  u3: {
    id: 'u3',
    name: 'Ana López',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
    rating: 5.0,
    reviewsCount: 15,
  },
};

export const mockProducts = [
  {
    id: 'p1',
    title: 'Matemáticas 3º Primaria',
    price: 15,
    imageUrl: 'https://images.unsplash.com/photo-150784272343-583f20270319?w=200&h=200&fit=crop',
    condition: 'Buen estado',
    course: '3º Primaria',
    state: 'active' as const,
    description: 'Libro de Matemáticas sin escribir. Incluye CD con ejercicios.',
    sellerId: 'u1',
  },
  {
    id: 'p2',
    title: 'Uniforme Colegio Talla M',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1618886723857-ba0b32e2a1e9?w=200&h=200&fit=crop',
    condition: 'Como nuevo',
    course: 'Primaria',
    state: 'active' as const,
    description: 'Uniforme completo: falda, blusa y corbata. Poco usado.',
    sellerId: 'u2',
  },
  {
    id: 'p3',
    title: 'Mochila Escolar 25L',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
    condition: 'Buen estado',
    course: 'ESO',
    state: 'reserved' as const,
    description: 'Mochila ergonómica en azul marino. Con bolsillos para portátil.',
    sellerId: 'u3',
  },
  {
    id: 'p4',
    title: 'Diccionario Inglés-Español',
    price: 12,
    imageUrl: 'https://images.unsplash.com/photo-1507842721554-8ee5dd3f7e26?w=200&h=200&fit=crop',
    condition: 'Muy usado',
    course: '1º ESO',
    state: 'active' as const,
    description: 'Diccionario con notas. Sirve para clase de inglés.',
    sellerId: 'u1',
  },
  {
    id: 'p5',
    title: 'Cuadernos Rayados Lote',
    price: 8,
    imageUrl: 'https://images.unsplash.com/photo-1507842821343-583f20270319?w=200&h=200&fit=crop',
    condition: 'Sin usar',
    course: 'Todos',
    state: 'active' as const,
    description: 'Lote de 5 cuadernos A4 de 100 hojas sin rayar.',
    sellerId: 'u2',
  },
  {
    id: 'p6',
    title: 'Calculadora Científica',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b08f?w=200&h=200&fit=crop',
    condition: 'Buen estado',
    course: '3º ESO',
    state: 'sold' as const,
    description: 'Calculadora científica modelo CASIO FX-82MS.',
    sellerId: 'u3',
  },
];

export interface Message {
  id: string;
  senderType: 'user' | 'seller';
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  productId: string;
  sellerId: string;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: Date;
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    productId: 'p1',
    sellerId: 'u1',
    messages: [
      {
        id: 'm1',
        senderType: 'seller',
        text: 'Hola, el libro sigue disponible. ¿Tienes interés?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 'm2',
        senderType: 'user',
        text: '¿Está incluido el CD de ejercicios?',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      },
      {
        id: 'm3',
        senderType: 'seller',
        text: 'Sí, viene con todo. Está sin escribir prácticamente nuevo.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
    lastMessage: 'Sí, viene con todo. Está sin escribir prácticamente nuevo.',
    lastMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'conv2',
    productId: 'p2',
    sellerId: 'u2',
    messages: [
      {
        id: 'm4',
        senderType: 'seller',
        text: '¿Qué talla tienes?',
        timestamp: new Date(Date.now() - 4 * 60 * 1000),
      },
      {
        id: 'm5',
        senderType: 'user',
        text: 'Talla M pero necesito la falda un poco más larga',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
      },
    ],
    lastMessage: 'Talla M pero necesito la falda un poco más larga',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: 'conv3',
    productId: 'p4',
    sellerId: 'u1',
    messages: [
      {
        id: 'm6',
        senderType: 'user',
        text: '¿Dónde podemos quedar?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
    ],
    lastMessage: '¿Dónde podemos quedar?',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
  },
];
