'use client';

import UploadForm from './UploadForm';

export default function SellView() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900">Vender</h1>
        <p className="text-sm text-gray-600">Publica tu artículo en segundos</p>
      </div>

      {/* Form Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-20">
        <UploadForm />
      </div>
    </div>
  );
}
