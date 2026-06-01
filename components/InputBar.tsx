'use client';

import { Send } from 'lucide-react';
import { useState } from 'react';

interface InputBarProps {
  onSendMessage: (text: string) => void;
}

export default function InputBar({ onSendMessage }: InputBarProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mensaje..."
        className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-20"
        rows={1}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition flex items-center justify-center"
        aria-label="Enviar"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
