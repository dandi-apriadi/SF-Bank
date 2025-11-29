import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { notificationService } from 'services/notificationService';

// Simple badge component
const PriorityBadge = ({ level }) => {
  const base = 'px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide';
  if (level === 'high') return <span className={`${base} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300`}>HIGH</span>;
  if (level === 'medium') return <span className={`${base} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300`}>MEDIUM</span>;
  return <span className={`${base} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300`}>LOW</span>;
};

const NotificationsPage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector(s => s.auth.user?.role);

  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reload = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await notificationService.list({ order: 'created_at:DESC', limit: 100 });
      // backend list returns { total, rows }
      const rows = Array.isArray(res) ? res : (res.rows || []);
      // map to UI
      const mapped = rows.map(r => ({
        id: r.notification_id || r.id,
        type: r.type,
        title: r.title,
        message: r.message,
        priority: r.priority || (r.type === 'task' || r.type === 'reminder' ? 'high' : 'low'),
        read: !!r.is_read,
        createdAt: r.created_at || r.createdAt || new Date().toISOString()
      }));
      setItems(mapped);
    } catch (e) {
      setError(e.message || 'Gagal memuat notifikasi');
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return items.filter(n => {
      if (priorityFilter !== 'all' && n.priority !== priorityFilter) return false;
      if (statusFilter === 'unread' && n.read) return false;
      if (statusFilter === 'read' && !n.read) return false;
      if (search && !n.message.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, priorityFilter, statusFilter, search]);

  const unreadCount = items.filter(i => !i.read).length;

  const heading = role === 'koordinator' ? 'Notifikasi Program Studi'
  : role === 'ppmpp' ? 'Notifikasi PPMPP'
    : role === 'pimpinan' ? 'Notifikasi Pimpinan Institusi'
    : 'Notifikasi';

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">{heading}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Kelola dan tinjau semua notifikasi sistem. ({unreadCount} belum dibaca)</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={reload} className="px-3 py-2 text-xs font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow">
            Reload
          </button>
          <button onClick={async () => {
            // Client-side loop until backend bulk endpoint exists
            const unread = items.filter(i => !i.read);
            for (const n of unread) {
              try { await notificationService.markRead(n.id); } catch {}
            }
            await reload();
          }} disabled={!unreadCount} className="px-3 py-2 text-xs font-medium rounded-md bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 text-white shadow">
            Tandai Semua
          </button>
          <button onClick={async () => {
            // Client-side loop delete; consider backend bulk delete in future
            for (const n of items) {
              try { await notificationService.delete(n.id); } catch {}
            }
            await reload();
          }} disabled={!items.length} className="px-3 py-2 text-xs font-medium rounded-md bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 text-white shadow">
            Hapus Semua
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="p-4 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800">
            <h3 className="text-sm font-semibold text-navy-700 dark:text-white mb-3">Filter</h3>
            <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Prioritas</label>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="w-full mb-3 rounded-md border-gray-300 dark:border-navy-600 dark:bg-navy-700 dark:text-white text-sm">
              <option value="all">Semua</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full mb-3 rounded-md border-gray-300 dark:border-navy-600 dark:bg-navy-700 dark:text-white text-sm">
              <option value="all">Semua</option>
              <option value="unread">Belum dibaca</option>
              <option value="read">Sudah dibaca</option>
            </select>
            <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Pencarian</label>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pesan..." className="w-full rounded-md border-gray-300 dark:border-navy-600 dark:bg-navy-700 dark:text-white text-sm" />
          </div>
          <div className="p-4 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs space-y-2">
            <h4 className="text-sm font-semibold text-navy-700 dark:text-white">Ringkasan</h4>
            <div className="flex justify-between"><span>Total</span><span className="font-semibold">{items.length}</span></div>
            <div className="flex justify-between"><span>Belum dibaca</span><span className="font-semibold">{unreadCount}</span></div>
            <div className="flex justify-between"><span>High</span><span className="font-semibold">{items.filter(i=>i.priority==='high').length}</span></div>
            <div className="flex justify-between"><span>Medium</span><span className="font-semibold">{items.filter(i=>i.priority==='medium').length}</span></div>
            <div className="flex justify-between"><span>Low</span><span className="font-semibold">{items.filter(i=>i.priority==='low').length}</span></div>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="p-4 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-navy-700 dark:text-white">Daftar Notifikasi</h3>
              {isLoading && <span className="text-[11px] text-gray-500">Memuat...</span>}
            </div>
            {error && <div className="text-xs text-red-600 dark:text-red-400 mb-3">{error}</div>}
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {!isLoading && !filtered.length && (
                <div className="text-xs text-gray-500 dark:text-gray-400">Tidak ada notifikasi sesuai filter.</div>
              )}
              {filtered.map(n => (
                <div key={n.id} className={`p-4 rounded-lg border transition-colors group cursor-pointer ${n.read ? 'bg-gray-50 dark:bg-navy-700/40 border-gray-200 dark:border-navy-600' : 'bg-blue-50 dark:bg-navy-700 border-blue-200 dark:border-navy-500 hover:bg-blue-100/70 dark:hover:border-blue-400'} `} onClick={async () => { try { await notificationService.markRead(n.id); await reload(); } catch {} }}>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <PriorityBadge level={n.priority} />
                        {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                      </div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white leading-snug">{n.message}</p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500 dark:text-gray-300">
                        <span>{new Date(n.createdAt).toLocaleString('id-ID')}</span>
                        <button onClick={async e => { e.stopPropagation(); try { await notificationService.markRead(n.id); await reload(); } catch {} }} className="text-blue-600 dark:text-blue-400 hover:underline">Tandai dibaca</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
