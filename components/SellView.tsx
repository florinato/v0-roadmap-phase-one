
'use client';

import { useState } from 'react';
import UploadProductModal from './UploadProductModal';

export default function SellView() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleProductAdded = () => {
    setIsUploadModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <UploadProductModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleProductAdded}
      />
    </div>
  );
}
