import React from 'react';

const LoadingOverlay = ({ text = 'Memuat data...' }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-[60]">
    <div className="px-6 py-4 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center space-x-3">
      <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent animate-spin rounded-full" />
      <span className="text-sm text-gray-700 font-medium">{text}</span>
    </div>
  </div>
);

export default LoadingOverlay;