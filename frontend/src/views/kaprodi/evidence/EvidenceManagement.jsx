import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from 'react-redux';
import { evidenceService } from 'services/evidenceService';
import { apiClient } from 'services/api';
import {
  FiDatabase,
  FiUpload,
  FiTag,
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiDownload,
  FiFile,
  FiImage,
  FiVideo,
  FiArchive
} from "react-icons/fi";
import Card from "components/card";
import ButtonPrimary from 'components/ui/ButtonPrimary';
import { colors, tokenClasses } from 'styles/designTokens';

const EvidenceManagement = () => {
  const auth = useSelector(state => state.auth?.user);
  const [evidenceData, setEvidenceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [uploadForm, setUploadForm] = useState({ file: null, cycle_id: '', criteria_id: '' });
  const [cycles, setCycles] = useState([]);
  const [criteriaList, setCriteriaList] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  useEffect(() => {
    loadEvidence();
  }, []);

  useEffect(() => {
    // Load cycles and criteria for selectors
    const loadSelectors = async () => {
      try {
        const [cycleRes, criteriaRes] = await Promise.all([
          apiClient.get('/api/accreditation-cycles?limit=200'),
          apiClient.get('/api/accreditation-criteria?limit=500')
        ]);
        setCycles(Array.isArray(cycleRes) ? cycleRes : (cycleRes.rows || cycleRes));
        setCriteriaList(Array.isArray(criteriaRes) ? criteriaRes : (criteriaRes.rows || criteriaRes));
      } catch (e) {
        console.warn('Failed to load cycles/criteria for selectors', e && e.message);
      }
    };
    loadSelectors();
  }, []);

  const mapRowToUI = (row) => {
    const type = row.mime_type?.includes('pdf') ? 'pdf'
      : row.mime_type?.includes('image') ? 'image'
      : row.mime_type?.includes('excel') || row.mime_type?.includes('spreadsheet') ? 'excel'
      : row.mime_type?.includes('zip') ? 'archive'
      : 'file';
    const criteriaLabel = row.accreditation_criteria?.code || '';
    return {
      id: row.evidence_id,
      title: row.file_name,
      description: `${row.accreditation_criteria?.title || 'Bukti Akreditasi'}`,
      fileName: row.file_name,
      fileSize: row.file_size ? `${(row.file_size/1024/1024).toFixed(1)} MB` : '-',
      fileType: type,
      uploadDate: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '-',
      uploadedBy: row.user?.fullname || row.uploaded_by || '-',
      criteria: criteriaLabel ? [criteriaLabel] : [],
      tags: (row.evidence_tags || []).map(t => t.tag),
      status: row.status === 'validated' ? 'approved' : (row.status === 'uploaded' ? 'pending' : (row.status === 'rejected' ? 'revision' : row.status)),
      version: `v${row.version_no || 1}`,
      _raw: row
    };
  };

  const loadEvidence = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await evidenceService.list({ limit: 100 });
      const mapped = (res.rows || []).map(mapRowToUI);
      setEvidenceData(mapped);
    } catch (e) {
      setError(e.message || 'Gagal memuat data eviden');
      showToast(e.message || 'Gagal memuat data eviden', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FiFile className="h-5 w-5 text-red-500" />;
      case "excel":
        return <FiFile className="h-5 w-5 text-green-500" />;
      case "image":
        return <FiImage className="h-5 w-5 text-blue-500" />;
      case "video":
        return <FiVideo className="h-5 w-5 text-purple-500" />;
      case "archive":
        return <FiArchive className="h-5 w-5 text-amber-500" />;
      default:
        return <FiFile className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return colors.badgeCompleted;
      case 'pending': return colors.badgePending;
      case 'revision': return colors.badgeError;
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Disetujui";
      case "pending":
        return "Menunggu";
      case "revision":
        return "Revisi";
      default:
        return "Draft";
    }
  };

  const onView = (e) => {
    const url = evidenceService.buildFileUrl(e._raw.file_path);
    if (url) window.open(url, '_blank');
  };

  const onDownload = async (e) => {
    const url = evidenceService.buildFileUrl(e._raw.file_path);
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = e.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const onDelete = async (e) => {
    if (!window.confirm(`Hapus eviden ${e.fileName}?`)) return;
    try {
      await evidenceService.delete(e.id);
      await loadEvidence();
      showToast('Eviden berhasil dihapus', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal menghapus eviden', 'error');
    }
  };

  const onEdit = async (e) => {
    // Toggle status to 'tagged'
    if (!e || !e.id) return;
    try {
      setUpdatingId(e.id);
      await evidenceService.update(e.id, { status: 'tagged' });
      await loadEvidence();
      showToast('Eviden berhasil diperbarui', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal memperbarui eviden', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredEvidence = evidenceData.filter(evidence => {
    const matchesSearch = evidence.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evidence.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evidence.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCriteria = filterCriteria === "all" || 
      evidence.criteria.some(c => c.startsWith(filterCriteria));

    const matchesType = filterType === "all" || evidence.fileType === filterType;

    return matchesSearch && matchesCriteria && matchesType;
  });

  const criteriaOptions = [
    { value: 'all', label: 'Semua Kriteria' },
    ...criteriaList.map(c => ({ value: c.criteria_id, label: `${c.code || c.title || c.criteria_id} ${c.title ? '- ' + c.title : ''}` }))
  ];

  const typeOptions = [
    { value: "all", label: "Semua Tipe" },
    { value: "pdf", label: "PDF" },
    { value: "excel", label: "Excel" },
    { value: "image", label: "Gambar" },
    { value: "video", label: "Video" },
    { value: "archive", label: "Archive" }
  ];

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white px-6 py-3 rounded-lg shadow-lg`}> 
          <div className="flex items-center gap-2">
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    {/* Header */}
  <Card extra="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Manajemen Bukti Akreditasi
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Kelola dan organisir semua dokumen bukti untuk persiapan akreditasi program studi
            </p>
          </div>
          
          <ButtonPrimary onClick={() => setShowUploadModal(true)} className="inline-flex px-6 py-2">
            <FiUpload className="mr-2 h-4 w-4" />
            Upload Bukti
          </ButtonPrimary>
        </div>
      </Card>

      {/* Search and Filters */}
  <Card extra="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan judul, deskripsi, atau tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Criteria Filter */}
          <div>
            <select
              value={filterCriteria}
              onChange={(e) => setFilterCriteria(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {criteriaOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{evidenceData.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Dokumen</div>
        </Card>
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-green-600">
            {evidenceData.filter(e => e.status === "approved").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Disetujui</div>
        </Card>
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-amber-600">
            {evidenceData.filter(e => e.status === "pending").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Menunggu Review</div>
        </Card>
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-red-600">
            {evidenceData.filter(e => e.status === "revision").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Perlu Revisi</div>
        </Card>
      </div>

      {/* Evidence List */}
  <div className="space-y-4">
        {isLoading && (
          <Card extra="p-8 text-center">
            <div className="text-gray-600 dark:text-gray-400">Memuat data...</div>
          </Card>
        )}
        {error && (
          <Card extra="p-8 text-center">
            <div className="text-red-600">{error}</div>
          </Card>
        )}
        {filteredEvidence.length === 0 ? (
          <Card extra="p-8 text-center">
            <FiDatabase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
              Tidak ada dokumen bukti
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              {searchTerm ? "Tidak ditemukan dokumen yang sesuai dengan pencarian." : "Belum ada dokumen bukti yang diupload."}
            </p>
          </Card>
        ) : (
          filteredEvidence.map((evidence) => (
            <Card key={evidence.id} extra="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {getFileIcon(evidence.fileType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {evidence.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(evidence.status)}`}>
                        {getStatusText(evidence.status)}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {evidence.version}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {evidence.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>{evidence.fileName}</span>
                      <span>{evidence.fileSize}</span>
                      <span>Upload: {evidence.uploadDate}</span>
                      <span>Oleh: {evidence.uploadedBy}</span>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {evidence.criteria.map((criterion, index) => (
                        <span key={index} className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          Kriteria {criterion}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      {evidence.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          <FiTag className="inline mr-1 h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button onClick={() => onView(evidence)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                    <FiEye className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDownload(evidence)} className="rounded-lg p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 transition-colors">
                    <FiDownload className="h-4 w-4" />
                  </button>
                  <button onClick={() => onEdit(evidence)} disabled={updatingId===evidence.id} className={`rounded-lg p-2 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors ${updatingId===evidence.id? 'opacity-60 cursor-wait' : ''}`}>
                    <FiEdit className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDelete(evidence)} className="rounded-lg p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition-colors">
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Upload Bukti</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Pilih Cycle</label>
                <select value={uploadForm.cycle_id} onChange={e=>setUploadForm(f=>({...f, cycle_id:e.target.value}))} className="w-full rounded border border-gray-300 p-2 text-sm dark:bg-gray-700 dark:text-white">
                  <option value="">-- Pilih Cycle --</option>
                  {cycles.map(c => (
                    <option key={c.cycle_id} value={c.cycle_id}>{`${c.instrument_type || ''} • ${c.year || ''} • ${c.cycle_id.substring ? c.cycle_id.substring(0,8) : c.cycle_id}`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Pilih Kriteria</label>
                <select value={uploadForm.criteria_id} onChange={e=>setUploadForm(f=>({...f, criteria_id:e.target.value}))} className="w-full rounded border border-gray-300 p-2 text-sm dark:bg-gray-700 dark:text-white">
                  <option value="">-- Pilih Kriteria --</option>
                  {criteriaList.map(c => (
                    <option key={c.criteria_id} value={c.criteria_id}>{`${c.code || ''} ${c.title ? '- ' + c.title : ''}`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">File</label>
                <input type="file" onChange={e=>setUploadForm(f=>({...f, file:e.target.files?.[0]||null}))} className="w-full rounded border border-gray-300 p-2 text-sm dark:bg-gray-700 dark:text-white" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={()=>setShowUploadModal(false)} className="rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Batal</button>
              <button onClick={async ()=>{
                if(!uploadForm.file||!uploadForm.cycle_id||!uploadForm.criteria_id){
                  showToast('Lengkapi semua field', 'error');
                  return;
                }
                // Client-side file size check to avoid needless uploads
                const MAX_SIZE = 20 * 1024 * 1024; // 20MB
                if (uploadForm.file.size > MAX_SIZE) {
                  showToast('Ukuran file terlalu besar. Maksimum 20MB.', 'error');
                  return;
                }
                try{
                  setIsLoading(true);
                  await evidenceService.upload(uploadForm);
                  setShowUploadModal(false);
                  setUploadForm({ file:null, cycle_id:'', criteria_id:''});
                  await loadEvidence();
                  showToast('Eviden berhasil diunggah', 'success');
                }catch(err){
                  showToast(err.message||'Upload gagal', 'error');
                }finally{
                  setIsLoading(false);
                }
              }} className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceManagement;
