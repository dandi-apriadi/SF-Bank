import React from 'react';

export const CriteriaList = ({ items=[], selectedId, onSelect }) => (
  <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
    {items.map(c => (
      <button
        key={c.id}
        onClick={()=>onSelect && onSelect(c.id)}
        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selectedId===c.id?'bg-blue-50 border-l-4 border-blue-500':''}`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-900">Kriteria {c.id}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor(c.status)}`}>{statusLabel(c.status)}</span>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2">{c.name}</p>
        <div className="mt-2 flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${progressColor(c.progress)}`} style={{width: c.progress+'%'}} />
          </div>
          <span className="text-[10px] text-gray-500 font-medium w-8 text-right">{c.progress}%</span>
        </div>
      </button>
    ))}
  </div>
);

const statusColor = (s) => {
  switch(s){
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
const statusLabel = (s) => s==='completed'?'Selesai': s==='in-progress'?'Progress': s==='pending'?'Pending': s;
const progressColor = (p) => p>=80?'bg-green-500': p>=60?'bg-blue-500': p>=40?'bg-amber-500':'bg-red-500';

export default CriteriaList;