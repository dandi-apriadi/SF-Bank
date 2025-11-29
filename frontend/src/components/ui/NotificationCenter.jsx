import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markRead, clearAll } from 'store/slices/notificationSlice';

const priorityStyles = {
  high: 'border-red-300 bg-red-50 text-red-700',
  medium: 'border-amber-300 bg-amber-50 text-amber-700',
  low: 'border-blue-300 bg-blue-50 text-blue-700'
};

const NotificationCenter = ({ maxVisible = 6 }) => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector(s=>s.notifications);
  const unread = items.filter(n=>!n.read).length;
  const [open, setOpen] = useState(false);

  useEffect(()=>{ if(!items.length) dispatch(fetchNotifications()); }, [items.length, dispatch]);

  return (
    <div className="relative">
      <button onClick={()=>setOpen(o=>!o)} className="relative inline-flex items-center px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-400 shadow-sm">
        <span className="text-sm font-medium text-gray-700">Notifikasi</span>
        {unread > 0 && (
          <span className="ml-2 inline-block text-xs bg-red-600 text-white rounded-full px-2 py-0.5">{unread}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-700">Pusat Notifikasi</span>
            <div className="space-x-2">
              <button onClick={()=>dispatch(clearAll())} className="text-xs text-gray-500 hover:text-red-600">Clear</button>
              <button onClick={()=>dispatch(fetchNotifications())} className="text-xs text-gray-500 hover:text-blue-600">Reload</button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
            {isLoading && <div className="p-4 text-xs text-gray-500">Memuat...</div>}
            {!isLoading && items.slice(0, maxVisible).map(n=> (
              <div key={n.id} className={`p-3 text-xs cursor-pointer flex items-start space-x-2 hover:bg-gray-50 ${priorityStyles[n.priority] || ''} border-l-4`} onClick={()=>dispatch(markRead(n.id))}>
                <div className="flex-1">
                  <p className="font-medium leading-snug">{n.message}</p>
                  <p className="mt-1 text-[10px] opacity-70">{new Date(n.createdAt).toLocaleTimeString('id-ID')}</p>
                </div>
                {!n.read && <span className="w-2 h-2 mt-1 rounded-full bg-blue-500" />}
              </div>
            ))}
            {!isLoading && !items.length && <div className="p-4 text-xs text-gray-400">Tidak ada notifikasi</div>}
          </div>
          <div className="px-3 py-2 border-t border-gray-100 text-right">
            <button className="text-[11px] text-blue-600 hover:underline">Lihat Semua</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;