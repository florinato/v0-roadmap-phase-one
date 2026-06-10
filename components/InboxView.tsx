
'use client';


interface InboxViewProps {
  onSelectConversation?: (conversationId: string, productId: string) => void;
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `hace ${diffMins}m`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
}

export default function InboxView({ onSelectConversation }: InboxViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50">
      <div className="text-center">
        <p className="text-gray-500 font-medium">No hay conversaciones</p>
        <p className="text-gray-400 text-sm">
          Empieza a contactar con vendedores
        </p>
      </div>
    </div>
  );
}
