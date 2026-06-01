'use client';

import { Message } from '@/lib/mockData';

interface MessageListProps {
  messages: Message[];
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `hace ${diffMins}m`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  if (diffDays < 7) return `hace ${diffDays}d`;
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs px-3 py-2 rounded-lg ${
              msg.senderType === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            <p
              className={`text-xs mt-1 ${
                msg.senderType === 'user'
                  ? 'text-blue-100'
                  : 'text-gray-500'
              }`}
            >
              {formatTime(msg.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
