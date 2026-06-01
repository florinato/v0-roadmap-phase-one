'use client';

interface TransactionConfirmModalProps {
  isOpen: boolean;
  productTitle: string;
  buyerName: string;
  onConfirmReserved: () => void;
  onConfirmSold: () => void;
  onCancel: () => void;
}

export default function TransactionConfirmModal({
  isOpen,
  productTitle,
  buyerName,
  onConfirmReserved,
  onConfirmSold,
  onCancel,
}: TransactionConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="w-full bg-white rounded-t-2xl p-6 animate-in slide-in-from-bottom-5">
        {/* Header */}
        <h2 className="text-lg font-bold text-gray-900 mb-2">Confirmar transacción</h2>
        <p className="text-sm text-gray-600 mb-4">
          "{productTitle}" con {buyerName}
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-4"></div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {/* Reserve Button */}
          <button
            onClick={() => {
              onConfirmReserved();
              onCancel();
            }}
            className="w-full py-3 px-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-between"
          >
            <span>Marcar como Reservado</span>
            <span className="text-xs bg-amber-600 px-2 py-1 rounded">Temporal</span>
          </button>

          {/* Sold Button */}
          <button
            onClick={() => {
              onConfirmSold();
              onCancel();
            }}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-between"
          >
            <span>Marcar como Vendido</span>
            <span className="text-xs bg-green-700 px-2 py-1 rounded">Permanente</span>
          </button>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="w-full py-3 px-4 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>

        {/* Info Text */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          Reservado: El producto se oculta temporalmente. Vendido: Se oculta permanentemente.
        </p>
      </div>
    </div>
  );
}
