import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  FiTarget, 
  FiList, 
  FiTrendingUp, 
  FiPlus, 
  FiFilter, 
  FiSearch, 
  FiDownload,
  FiEye,
  FiX,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiUser,
  FiCalendar,
  FiAlertTriangle,
  FiCheckCircle,
  FiActivity,
  FiBarChart2
} from 'react-icons/fi';
import Button from 'components/button/Button';
import { actionTrackingService } from 'services/actionTrackingService';

const ActionTracking = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actions, setActions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Map UI <-> API status values
  const uiToApiStatus = {
    'in-progress': 'in_progress',
    'pending': 'open',
    'completed': 'done',
    'overdue': 'overdue'
  };
  const apiToUiStatus = {
    'in_progress': 'in-progress',
    'open': 'pending',
    'done': 'completed',
    'overdue': 'overdue'
  };

  const loadActions = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (selectedFilter !== 'all') params.status = uiToApiStatus[selectedFilter];
      if (searchQuery) params.q = searchQuery;
      const res = await actionTrackingService.list(params);
      const rows = (res?.rows || []).map(r => ({
        id: r.action_id,
        code: r.action_id?.slice(0, 8)?.toUpperCase(),
        title: r.title,
        description: r.description,
        category: r.phase,
        status: apiToUiStatus[r.status] || 'pending',
        owner: r.responsible?.fullname || '-',
        ownerEmail: r.responsible?.email || '-',
        department: r.ppepp_cycle?.study_program?.name || '-',
        assignedTeam: [],
        createdDate: r.created_at,
        startDate: r.created_at,
        dueDate: r.due_date,
        completedDate: undefined,
        progress: typeof r.progress === 'number' ? r.progress : 0,
        tags: [],
        lastUpdate: r.updated_at,
        _raw: r
      }));
      setActions(rows);
      setTotal(res?.total || rows.length);
    } catch (e) {
      setError(e.message || 'Gagal memuat data tindakan');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedFilter]);

  useEffect(() => {
    loadActions();
  }, [loadActions]);

  // Action handlers
  const handleExport = async () => {
    try {
      const params = {};
      if (selectedFilter !== 'all') params.status = uiToApiStatus[selectedFilter];
      if (searchQuery) params.q = searchQuery;
      const res = await actionTrackingService.exportCsv(params);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ppepp_actions_export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message || 'Gagal mengekspor data');
    }
  };

  const handleCreate = async () => {
    try {
      const title = window.prompt('Judul tindakan:');
      if (!title) return;
      const phase = window.prompt('Fase (penetapan/pelaksanaan/evaluasi/pengendalian/peningkatan):', 'evaluasi');
      const ppepp_id = window.prompt('PPEPP Cycle ID:');
      const responsible_user_id = window.prompt('User ID penanggung jawab:');
      const due_date = window.prompt('Tanggal target (YYYY-MM-DD):');
      await actionTrackingService.create({ title, phase, ppepp_id, responsible_user_id, due_date });
      await loadActions();
    } catch (e) {
      setError(e.message || 'Gagal menambahkan tindakan');
    }
  };

  // Previous prompt-based edit replaced by modal form below
  // handleEdit now acts as the form submit handler (see modal)

  const handleDelete = async (action) => {
    try {
      if (!window.confirm(`Hapus tindakan "${action.title}"?`)) return;
      await actionTrackingService.delete(action.id);
      await loadActions();
    } catch (e) {
      setError(e.message || 'Gagal menghapus tindakan');
    }
  };

  // Enhanced status configuration
  const statusConfig = {
    'completed': { 
      label: 'Selesai', 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: FiCheckCircle,
      dotColor: 'bg-green-600'
    },
    'in-progress': { 
      label: 'Sedang Berjalan', 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      icon: FiActivity,
      dotColor: 'bg-blue-500'
    },
    'pending': { 
      label: 'Menunggu', 
      color: 'bg-amber-100 text-amber-800 border-amber-200', 
      icon: FiClock,
      dotColor: 'bg-amber-500'
    },
    'overdue': { 
      label: 'Terlambat', 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: FiAlertTriangle,
      dotColor: 'bg-red-500'
    }
  };

  const priorityConfig = {
    'critical': { label: 'Kritis', color: 'bg-red-600 text-white', dotColor: 'bg-red-600' },
    'high': { label: 'Tinggi', color: 'bg-orange-500 text-white', dotColor: 'bg-orange-500' },
    'medium': { label: 'Sedang', color: 'bg-yellow-500 text-white', dotColor: 'bg-yellow-500' },
    'low': { label: 'Rendah', color: 'bg-green-500 text-white', dotColor: 'bg-green-500' }
  };

  // Filter and search functionality
  const filteredActions = useMemo(() => actions, [actions]);

  // Calculate statistics
  const stats = useMemo(() => {
  const total = actions.length;
  const completed = actions.filter(a => a.status === 'completed').length;
  const inProgress = actions.filter(a => a.status === 'in-progress').length;
  const overdue = actions.filter(a => a.status === 'overdue').length;
  const averageProgress = total > 0 ? Math.round(actions.reduce((sum, a) => sum + (a.progress || 0), 0) / total) : 0;
    
    return { total, completed, inProgress, overdue, averageProgress };
  }, [actions]);

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.color}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const config = priorityConfig[priority];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}></div>
        {config.label}
      </span>
    );
  };

  const ProgressBar = ({ progress, status }) => {
    const getProgressColor = () => {
  if (status === 'completed') return 'bg-green-600';
      if (status === 'overdue') return 'bg-red-500';
      if (progress >= 75) return 'bg-blue-500';
      if (progress >= 50) return 'bg-yellow-500';
      return 'bg-gray-400';
    };

    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-xs font-medium text-gray-600 min-w-[35px]">{progress}%</span>
      </div>
    );
  };

  // Detail modal state
  const [showDetail, setShowDetail] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const openDetail = (item) => { setDetailItem(item); setShowDetail(true); };
  const closeDetail = () => { setShowDetail(false); setDetailItem(null); };

  // Edit form/modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', progress: 0, status: 'pending' });
  const [editLoading, setEditLoading] = useState(false);

  const openEdit = (action) => {
    setEditItem(action);
    setEditForm({
      title: action.title || '',
      progress: typeof action.progress === 'number' ? action.progress : 0,
      status: action.status || 'pending'
    });
    setShowEditModal(true);
  };
  const closeEdit = () => { setShowEditModal(false); setEditItem(null); };

  const handleEdit = async (e) => {
    e?.preventDefault?.();
    if (!editItem) return;
    try {
      setEditLoading(true);
      setError('');
      const title = editForm.title;
      const progress = Math.max(0, Math.min(100, parseInt(editForm.progress, 10) || 0));
      const statusKey = editForm.status;
      const status = uiToApiStatus[statusKey] || 'open';
      await actionTrackingService.update(editItem.id, { title, progress, status });
      closeEdit();
      await loadActions();
    } catch (e) {
      setError(e.message || 'Gagal memperbarui tindakan');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6'>
      {/* Header Section */}
      <div className='mb-8'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
          <div className='flex items-start gap-4'>
            <div className='p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg'>
              <FiTarget className='text-white text-2xl' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                Pelacakan Tindakan
              </h1>
              <p className='text-gray-600 text-base leading-relaxed max-w-2xl'>
                Sistem monitoring dan evaluasi tindak lanjut rekomendasi peningkatan mutu institusi secara real-time
              </p>
            </div>
          </div>
          
          <div className='flex items-center gap-3'>
            <Button variant='secondary' size='sm' outlined leftIcon={<FiDownload />} onClick={handleExport}>
              Export Data
            </Button>
            <Button variant='primary' size='sm' leftIcon={<FiPlus />} onClick={handleCreate}>
              Tambah Tindakan
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8'>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-blue-50 rounded-lg'>
                <FiList className='text-blue-600 text-lg' />
              </div>
              <span className='text-sm font-medium text-gray-600'>Total Tindakan</span>
            </div>
            <div className='text-2xl font-bold text-gray-900'>{stats.total}</div>
            <div className='text-xs text-gray-500 mt-1'>Semua kategori</div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-green-50 rounded-lg'>
                <FiCheckCircle className='text-green-600 text-lg' />
              </div>
              <span className='text-sm font-medium text-gray-600'>Selesai</span>
            </div>
            <div className='text-2xl font-bold text-green-600'>{stats.completed}</div>
            <div className='text-xs text-gray-500 mt-1'>
              {Math.round((stats.completed / stats.total) * 100)}% dari total
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-blue-50 rounded-lg'>
                <FiActivity className='text-blue-600 text-lg' />
              </div>
              <span className='text-sm font-medium text-gray-600'>Berjalan</span>
            </div>
            <div className='text-2xl font-bold text-blue-600'>{stats.inProgress}</div>
            <div className='text-xs text-gray-500 mt-1'>Sedang dikerjakan</div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-red-50 rounded-lg'>
                <FiAlertTriangle className='text-red-600 text-lg' />
              </div>
              <span className='text-sm font-medium text-gray-600'>Terlambat</span>
            </div>
            <div className='text-2xl font-bold text-red-600'>{stats.overdue}</div>
            <div className='text-xs text-gray-500 mt-1'>Perlu perhatian</div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-purple-50 rounded-lg'>
                <FiBarChart2 className='text-purple-600 text-lg' />
              </div>
              <span className='text-sm font-medium text-gray-600'>Rata-rata Progres</span>
            </div>
            <div className='text-2xl font-bold text-purple-600'>{stats.averageProgress}%</div>
            <div className='text-xs text-gray-500 mt-1'>Keseluruhan</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm mb-6'>
        <div className='p-6'>
          <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
            {/* Search */}
            <div className='relative flex-1 max-w-md'>
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg' />
              <input
                type="text"
                placeholder="Cari berdasarkan judul, kode, atau penanggung jawab..."
                className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filters */}
            <div className='flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0'>
              <FiFilter className='text-gray-400 mr-2 flex-shrink-0' />
              {[
                { key: 'all', label: 'Semua', count: stats.total },
                { key: 'in-progress', label: 'Berjalan', count: stats.inProgress },
                { key: 'pending', label: 'Menunggu', count: actions.filter(a => a.status === 'pending').length },
                { key: 'completed', label: 'Selesai', count: stats.completed },
                { key: 'overdue', label: 'Terlambat', count: stats.overdue }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedFilter === filter.key
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions Table/Cards */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden'>
        {/* Desktop Table View */}
        <div className='hidden lg:block overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-100'>
              <tr>
                <th className='text-left px-6 py-4 font-semibold text-gray-700 text-sm'>Kode & Tindakan</th>
                <th className='text-left px-6 py-4 font-semibold text-gray-700 text-sm'>Status & Prioritas</th>
                <th className='text-left px-6 py-4 font-semibold text-gray-700 text-sm'>Progres</th>
                <th className='text-left px-6 py-4 font-semibold text-gray-700 text-sm'>Penanggung Jawab</th>
                <th className='text-left px-6 py-4 font-semibold text-gray-700 text-sm'>Waktu</th>
                <th className='text-center px-6 py-4 font-semibold text-gray-700 text-sm'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {filteredActions.map((action) => (
                <tr key={action.id} className='hover:bg-gray-50 transition-colors duration-150'>
                  <td className='px-6 py-4'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                          {action.code}
                        </span>
                        <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded'>
                          {action.category}
                        </span>
                      </div>
                      <h3 className='font-semibold text-gray-900 text-sm leading-tight'>
                        {action.title}
                      </h3>
                      <p className='text-xs text-gray-600 line-clamp-2'>
                        {action.description}
                      </p>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex flex-col gap-2'>
                      <StatusBadge status={action.status} />
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <ProgressBar progress={action.progress} status={action.status} />
                    <div className='text-xs text-gray-500 mt-1'></div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-2'>
                        <FiUser className='text-gray-400 text-sm' />
                        <span className='font-medium text-gray-900 text-sm'>{action.owner}</span>
                      </div>
                    <span className='text-xs text-gray-600'>{action.department}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex flex-col gap-1 text-xs text-gray-600'>
                      <div className='flex items-center gap-1'>
                        <FiCalendar className='text-gray-400' />
                        <span>Mulai: {new Date(action.startDate).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <FiClock className='text-gray-400' />
                        <span className={action.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                          Target: {action.dueDate ? new Date(action.dueDate).toLocaleDateString('id-ID') : '-'}
                        </span>
                      </div>
                      {action.completedDate && (
                        <div className='flex items-center gap-1 text-green-600'>
                          <FiCheckCircle className='text-green-600' />
                          <span>Selesai: {new Date(action.completedDate).toLocaleDateString('id-ID')}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-center gap-1'>
                      <Button variant='secondary' size='sm' outlined leftIcon={<FiEye />} onClick={() => openDetail(action)}>
                        Detail
                      </Button>
                      <Button variant='secondary' size='sm' outlined leftIcon={<FiEdit2 />} onClick={() => openEdit(action)}>
                        Edit
                      </Button>
                      <Button variant='secondary' size='sm' outlined leftIcon={<FiTrash2 />} onClick={() => handleDelete(action)}>
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className='lg:hidden'>
          {filteredActions.map((action) => (
            <div key={action.id} className='border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors duration-150'>
              <div className='flex items-start justify-between mb-3'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                    {action.code}
                  </span>
                  <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded'>
                    {action.category}
                  </span>
                </div>
                {/* Priority not available in API */}
              </div>
              
              <h3 className='font-semibold text-gray-900 mb-2'>{action.title}</h3>
              <p className='text-sm text-gray-600 mb-3 line-clamp-2'>{action.description}</p>
              
              <div className='flex items-center justify-between mb-3'>
                <StatusBadge status={action.status} />
                <ProgressBar progress={action.progress} status={action.status} />
              </div>

              <div className='grid grid-cols-2 gap-3 text-xs text-gray-600 mb-3'>
                <div>
                  <div className='flex items-center gap-1 mb-1'>
                    <FiUser className='text-gray-400' />
                    <span className='font-medium'>{action.owner}</span>
                  </div>
                  <span className='text-gray-500'>{action.department}</span>
                </div>
                <div>
                  <div className='flex items-center gap-1 mb-1'>
                    <FiClock className='text-gray-400' />
                    <span className={action.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                      {new Date(action.dueDate).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <span className='text-gray-500'>Progress: {action.progress}%</span>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Button variant='secondary' size='sm' outlined leftIcon={<FiEye />} onClick={() => openDetail(action)}>
                  Detail
                </Button>
                <Button variant='secondary' size='sm' outlined leftIcon={<FiEdit2 />} onClick={() => openEdit(action)}>
                  Edit
                </Button>
                <Button variant='secondary' size='sm' outlined leftIcon={<FiTrash2 />} onClick={() => handleDelete(action)}>
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className='text-center py-12'>Memuat data...</div>
        )}
        {!loading && error && (
          <div className='text-center py-12 text-red-600'>{error}</div>
        )}
        {!loading && !error && filteredActions.length === 0 && (
          <div className='text-center py-12'>
            <FiTarget className='text-gray-300 text-4xl mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>Tidak ada tindakan ditemukan</h3>
            <p className='text-gray-600 mb-6'>
              {searchQuery ? 'Coba ubah kata kunci pencarian atau filter status' : 'Mulai dengan menambahkan tindakan baru'}
            </p>
            <Button variant='primary' leftIcon={<FiPlus />} onClick={handleCreate}>
              Tambah Tindakan Baru
            </Button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div role="dialog" aria-modal="true" className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Detail Tindakan</h3>
                <p className="text-sm text-gray-500">Informasi lengkap mengenai tindakan.</p>
              </div>
              <button onClick={closeDetail} aria-label="Tutup" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"><FiX /></button>
            </div>
            <div className="p-5 space-y-3 text-sm text-gray-700">
              <div><span className="font-medium">Judul:</span> {detailItem.title}</div>
              <div><span className="font-medium">Fase:</span> {detailItem.category}</div>
              <div><span className="font-medium">Status:</span> {detailItem.status}</div>
              <div><span className="font-medium">Penanggung Jawab:</span> {detailItem.owner} ({detailItem.ownerEmail})</div>
              <div><span className="font-medium">Program Studi:</span> {detailItem.department}</div>
              <div><span className="font-medium">Target Selesai:</span> {detailItem.dueDate ? new Date(detailItem.dueDate).toLocaleDateString('id-ID') : '-'}</div>
              <div><span className="font-medium">Progres:</span> {detailItem.progress}%</div>
              <div className="pt-2"><span className="font-medium">Deskripsi:</span>
                <p className="text-gray-600 mt-1">{detailItem.description || '-'}</p>
              </div>
            </div>
            <div className="p-4 flex justify-end gap-2 border-t border-gray-100">
              <Button variant='secondary' outlined onClick={closeDetail}>Tutup</Button>
              <Button variant='primary' onClick={() => { closeDetail(); openEdit(detailItem); }}>Edit</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div role="dialog" aria-modal="true" className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Edit Tindakan</h3>
                <p className="text-sm text-gray-500">Perbarui status dan progres pelaksanaan tindakan.</p>
              </div>
              <button onClick={closeEdit} aria-label="Tutup" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"><FiX /></button>
            </div>
            <form onSubmit={handleEdit} className="p-5 space-y-3 text-sm text-gray-700">
              <div>
                <label className="font-medium block mb-1">Judul</label>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="font-medium block mb-1">Progres (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.progress}
                  onChange={(e) => setEditForm({ ...editForm, progress: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="font-medium block mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="pending">Menunggu</option>
                  <option value="in-progress">Sedang Berjalan</option>
                  <option value="completed">Selesai</option>
                  <option value="overdue">Terlambat</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant='secondary' outlined onClick={closeEdit} type="button">Batal</Button>
                <Button variant='primary' type="submit" disabled={editLoading}>{editLoading ? 'Menyimpan...' : 'Simpan'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {filteredActions.length > 0 && (
        <div className='mt-6 flex items-center justify-between text-sm text-gray-600'>
          <span>
            Menampilkan {filteredActions.length} dari {total} tindakan
            {searchQuery && (
              <span className='ml-2 text-blue-600'>
                untuk "{searchQuery}"
              </span>
            )}
          </span>
          <span>
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      )}
    </div>
  );
};

export default ActionTracking;
