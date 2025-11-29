import React from 'react';
import { DocumentTextIcon, ArrowDownTrayIcon, EyeIcon } from '@heroicons/react/24/outline';

const EvidenceItem = ({ item }) => (
  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex items-center space-x-4">
      <div className="p-2 bg-blue-100 rounded-lg">
        <DocumentTextIcon className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
        <p className="text-xs text-gray-500">{item.type} • {item.size} • {item.uploadDate}</p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium ${statusBadge(item.status)}`}>
        {item.status === 'approved' ? 'Disetujui' : item.status==='pending' ? 'Pending':'Revisi'}
      </span>
      <button className="p-2 text-gray-400 hover:text-gray-600">
        <EyeIcon className="h-4 w-4" />
      </button>
      <button className="p-2 text-gray-400 hover:text-gray-600">
        <ArrowDownTrayIcon className="h-4 w-4" />
      </button>
    </div>
  </div>
);

const statusBadge = (s) => s==='approved'? 'bg-green-100 text-green-800': s==='pending'?'bg-amber-100 text-amber-800':'bg-red-100 text-red-800';

export default EvidenceItem;