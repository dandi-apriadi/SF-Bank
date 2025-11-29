import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccreditation } from 'store/slices/accreditationSlice';
import {
  ChartBarIcon,
  DocumentTextIcon,
  FolderIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import CriteriaList from 'components/ui/CriteriaList';
import ButtonPrimary from 'components/ui/ButtonPrimary';
import { tokenClasses, colors } from 'styles/designTokens';
import { getEvidenceByCriteria, exportLEDExcel } from 'services/accreditationService';
import { apiClient, API_BASE_URL } from 'services/api';

const AccreditationManagement = () => {
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  // UI states for actions
  const [showNarrativeModal, setShowNarrativeModal] = useState(false);
  const [narrativeContent, setNarrativeContent] = useState("");
  const [narrativeId, setNarrativeId] = useState(null);
  const [isSavingNarrative, setIsSavingNarrative] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const dispatch = useDispatch();
  const accreditation = useSelector(state => state.accreditation.data);
  const institution = useSelector(state => state.institution.data);
  const authUser = useSelector(state => state.auth.user);

  useEffect(()=>{ if(!accreditation) dispatch(fetchAccreditation()); },[accreditation, dispatch]);

  // Build criteria from slice data with safe mapping
  const accreditationCriteria = (accreditation?.criteria || []).map(c => ({
    id: c.id || c.criteria_id,
    name: c.name || c.title || c.code,
    status: c.status === 'completed' ? 'completed' : (c.status === 'in-progress' ? 'in-progress' : (c.status || 'pending')),
    progress: c.progress ?? 0,
    documents: c.documents ?? 0,
    lastUpdated: accreditation?.lastUpdated ? new Date(accreditation.lastUpdated).toISOString().split('T')[0] : '',
    description: `Kriteria ${c.code || ''} - ${c.title || c.name || ''}`.trim()
  }));

  // Auto-select the top criteria when data arrives or changes
  useEffect(() => {
    if (accreditationCriteria.length > 0) {
      const exists = selectedCriteria != null && accreditationCriteria.some(c => c.id === selectedCriteria);
      if (!exists) {
        setSelectedCriteria(accreditationCriteria[0].id);
      }
    }
  }, [accreditationCriteria, selectedCriteria]);

  // Evidence state
  const [evidenceData, setEvidenceData] = useState([]);
  const [showAllDocs, setShowAllDocs] = useState(false);

  const openAllDocuments = () => setShowAllDocs(true);
  const closeAllDocuments = () => setShowAllDocs(false);

  const viewEvidence = (ev) => {
    try {
      const path = ev.file_path || ev.filePath || ev.path || ev.file_path_raw;
      if (!path) return console.warn('No file path for evidence', ev);
      const cleaned = path.replace(/^\\+/, '').replace(/\\\\/g, '/');
      const url = `${API_BASE_URL.replace(/\/$/, '')}/${cleaned}`;
      window.open(url, '_blank');
    } catch (e) { console.error('View evidence failed', e); }
  };

  const downloadEvidence = async (ev) => {
    try {
      const path = ev.file_path || ev.filePath || ev.path || ev.file_path_raw;
      if (!path) return console.warn('No file path for evidence', ev);
      const cleaned = path.replace(/^\\+/, '').replace(/\\\\/g, '/');
      const url = `${API_BASE_URL.replace(/\/$/, '')}/${cleaned}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to download');
      const blob = await res.blob();
      const a = document.createElement('a');
      const downloadName = ev.file_name || ev.name || 'download';
      a.href = URL.createObjectURL(blob);
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } catch (e) { console.error('Download evidence failed', e); }
  };

  // Load evidence on selected criteria change
  useEffect(() => {
    const loadEvidence = async () => {
      try {
        if (!accreditation?.cycle || !selectedCriteria) return;
        const list = await getEvidenceByCriteria(accreditation.cycle.cycle_id, selectedCriteria);
        setEvidenceData(list.map(ev => ({
          id: ev.evidence_id || ev.id,
          name: ev.file_name || ev.title || 'Dokumen',
          type: ev.mime_type?.toUpperCase?.() || ev.type || 'FILE',
          size: (ev.file_size || ev.size) ? `${Math.round((((ev.file_size||ev.size)/1024/1024)*10))/10} MB` : '-',
          uploadDate: ev.created_at ? new Date(ev.created_at).toISOString().split('T')[0] : '',
          status: ev.status || 'pending'
        })));
      } catch (e) {
        console.error('Failed to load evidence', e);
        setEvidenceData([]);
      }
    };
    loadEvidence();
  }, [accreditation?.cycle, selectedCriteria]);

  // Handlers: Narrative edit
  const openEditNarrative = async () => {
    if (!accreditation?.cycle || !selectedCriteria) return;
    try {
      // Try get existing narrative by cycle + criteria (latest)
      const query = new URLSearchParams({ cycle_id: accreditation.cycle.cycle_id, criteria_id: selectedCriteria, limit: '1', order: 'updated_at:DESC' }).toString();
      const res = await apiClient.get(`/api/narratives?${query}`);
      const row = res?.rows?.[0];
      setNarrativeId(row?.narrative_id || null);
      setNarrativeContent(row?.content || "");
      setShowNarrativeModal(true);
    } catch (err) {
      console.error('Load narrative failed', err);
      // Open empty editor for new
      setNarrativeId(null);
      setNarrativeContent("");
      setShowNarrativeModal(true);
    }
  };

  // Handler: Upload Evidence Document
  const onClickUpload = () => {
    if (!accreditation?.cycle || !selectedCriteria) return;
    fileInputRef.current?.click();
  };

  const onFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!accreditation?.cycle || !selectedCriteria) return;
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('cycle_id', accreditation.cycle.cycle_id);
      form.append('criteria_id', selectedCriteria);
      const res = await apiClient.request('/api/evidences/upload', {
        method: 'POST',
        body: form,
      });
      // Refresh evidence list after upload
      const list = await getEvidenceByCriteria(accreditation.cycle.cycle_id, selectedCriteria);
      setEvidenceData(list.map(ev => ({
        id: ev.evidence_id || ev.id,
        name: ev.file_name || ev.title || 'Dokumen',
        type: ev.mime_type?.toUpperCase?.() || ev.type || 'FILE',
        size: (ev.file_size || ev.size) ? `${Math.round((((ev.file_size||ev.size)/1024/1024)*10))/10} MB` : '-',
        uploadDate: ev.created_at ? new Date(ev.created_at).toISOString().split('T')[0] : '',
        status: ev.status || 'pending'
      })));
    } catch (err) {
      console.error('Upload evidence failed', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const saveNarrative = async () => {
    if (!accreditation?.cycle || !selectedCriteria) return;
    setIsSavingNarrative(true);
    try {
      const payload = {
        cycle_id: accreditation.cycle.cycle_id,
        criteria_id: selectedCriteria,
        content: narrativeContent,
        status: 'draft',
      };
      let resp;
      if (narrativeId) {
        const userId = authUser?.user_id || authUser?.id || 'system';
        resp = await apiClient.put(`/api/narratives/${encodeURIComponent(narrativeId)}`, { ...payload, updated_by: userId });
      } else {
        // need created_by/updated_by, backend requires; use auth user when available
        const userId = authUser?.user_id || authUser?.id || 'system';
        resp = await apiClient.post('/api/narratives', { ...payload, created_by: userId, updated_by: userId });
      }
      setNarrativeId(resp?.narrative_id || narrativeId);
      setShowNarrativeModal(false);
    } catch (err) {
      console.error('Simpan narasi gagal', err);
    } finally {
      setIsSavingNarrative(false);
    }
  };

  // Handlers: Download LED in right panel
  const downloadLed = async () => {
    if (!accreditation?.cycle) return;
    try {
      const resp = await exportLEDExcel(accreditation.cycle.cycle_id);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `led-${accreditation.cycle.cycle_id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export LED failed', e);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return colors.badgeCompleted;
      case 'in-progress': return colors.badgeProgress;
      case 'pending': return colors.badgePending;
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "in-progress":
        return <ClockIcon className="h-4 w-4" />;
      case "pending":
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  const filteredCriteria = accreditationCriteria.filter(criteria => {
    const matchesSearch = criteria.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || criteria.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const selectedCriteriaData = accreditationCriteria.find(c => c.id === selectedCriteria);

  const overallProgress = accreditationCriteria.length
    ? Math.round(
        accreditationCriteria.reduce((sum, criteria) => sum + (criteria.progress || 0), 0) / accreditationCriteria.length
      )
    : 0;

  const completedCriteria = accreditationCriteria.filter(c => c.status === 'completed').length;
  const totalDocuments = accreditationCriteria.reduce((sum, criteria) => sum + (criteria.documents || 0), 0);

  return (
  <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
  <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Akreditasi</h1>
            <p className="text-gray-600 mt-2">
              Kelola proses akreditasi program studi dan pantau kemajuan setiap kriteria
            </p>
          </div>
          <div className="flex gap-3">
            <ButtonPrimary className="inline-flex items-center px-4 py-2" onClick={async () => {
              if (!accreditation?.cycle) return;
              try {
                const resp = await exportLEDExcel(accreditation.cycle.cycle_id);
                // Force download (.xlsx)
                const blob = await resp.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `led-${accreditation.cycle.cycle_id}.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              } catch (e) {
                console.error('Export LED failed', e);
              }
            }}>
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export LED (Excel)
            </ButtonPrimary>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
              <PlusIcon className="h-5 w-5 mr-2" />
              Tambah Dokumen
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={tokenClasses.card}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress Keseluruhan</p>
                <p className="text-2xl font-bold text-gray-900">{overallProgress}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(overallProgress)}`}
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className={tokenClasses.card}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kriteria Selesai</p>
                <p className="text-2xl font-bold text-gray-900">{completedCriteria}/{accreditationCriteria.length || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {accreditationCriteria.length ? Math.round((completedCriteria / accreditationCriteria.length) * 100) : 0}% kriteria telah diselesaikan
            </p>
          </div>

          <div className={tokenClasses.card}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Dokumen</p>
                <p className="text-2xl font-bold text-gray-900">{totalDocuments}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Dokumen pendukung akreditasi
            </p>
          </div>

          <div className={tokenClasses.card}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tim Akreditasi</p>
                <p className="text-2xl font-bold text-gray-900">{institution?.totals?.faculty || institution?.totals?.facultyCount || '-'}</p>
              </div>
              <div className="p-3 bg-slate-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-slate-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Anggota tim akreditasi aktif
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Criteria List */}
  <div className="lg:col-span-1">
          <div className={tokenClasses.card.replace('p-6','')}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kriteria Akreditasi</h2>
              
              {/* Search and Filter */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Cari kriteria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Status</option>
                  <option value="completed">Selesai</option>
                  <option value="in-progress">Dalam Progress</option>
                  <option value="pending">Belum Dimulai</option>
                </select>
              </div>
            </div>

            <CriteriaList items={filteredCriteria} selectedId={selectedCriteria} onSelect={setSelectedCriteria} />
          </div>
        </div>

        {/* Right Panel - Criteria Details */}
  <div className="lg:col-span-2">
          {selectedCriteriaData && (
            <div className="space-y-6">
              {/* Criteria Header */}
              <div className={tokenClasses.card}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Kriteria {selectedCriteriaData.id}: {selectedCriteriaData.name}
                    </h2>
                    <p className="text-gray-600 mt-2">{selectedCriteriaData.description}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedCriteriaData.status)}`}>
                    {getStatusIcon(selectedCriteriaData.status)}
                    <span className="ml-2">
                      {selectedCriteriaData.status === 'completed' ? 'Selesai' : 
                       selectedCriteriaData.status === 'in-progress' ? 'Dalam Progress' : 'Belum Dimulai'}
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Progress</div>
                    <div className="text-2xl font-bold text-gray-900">{selectedCriteriaData.progress}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(selectedCriteriaData.progress)}`}
                        style={{ width: `${selectedCriteriaData.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Dokumen</div>
                    <div className="text-2xl font-bold text-gray-900">{selectedCriteriaData.documents}</div>
                    <div className="text-sm text-gray-500 mt-1">File pendukung</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Terakhir Update</div>
                    <div className="text-lg font-semibold text-gray-900">{selectedCriteriaData.lastUpdated}</div>
                    <div className="text-sm text-gray-500 mt-1">Tanggal update</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={openEditNarrative} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Narasi
                  </button>
                  <button onClick={() => setShowDetail(true)} className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Lihat Detail
                  </button>
                  <button onClick={downloadLed} className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Download LED
                  </button>
                </div>
              </div>

              {/* Evidence Management */}
              <div className={tokenClasses.card}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Manajemen Bukti</h3>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={onFileSelected} />
                  <button onClick={onClickUpload} disabled={isUploading} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-60">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    {isUploading ? 'Mengunggah...' : 'Upload Dokumen'}
                  </button>
                </div>

                <div className="space-y-3">
                  {evidenceData.slice(0, 3).map((evidence) => (
                    <div key={evidence.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{evidence.name}</h4>
                          <p className="text-sm text-gray-500">{evidence.type} • {evidence.size} • {evidence.uploadDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          evidence.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {evidence.status === 'approved' ? 'Disetujui' : 'Pending'}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <button onClick={openAllDocuments} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Lihat Semua Dokumen ({selectedCriteriaData.documents})
                  </button>
                </div>
              </div>

              {/* Quick Actions removed as requested */}
            </div>
          )}
        </div>
      </div>
      {/* Narrative Modal */}
      {showNarrativeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setShowNarrativeModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Narasi Kriteria {selectedCriteria}</h3>
              <button onClick={() => setShowNarrativeModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <textarea
              className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tulis narasi untuk kriteria ini..."
              value={narrativeContent}
              onChange={(e) => setNarrativeContent(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowNarrativeModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Batal</button>
              <button onClick={saveNarrative} disabled={isSavingNarrative} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
                {isSavingNarrative ? 'Menyimpan...' : 'Simpan' }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {showDetail && selectedCriteriaData && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setShowDetail(false)}></div>
          <div className="absolute top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Detail Kriteria {selectedCriteriaData.id}</h3>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Nama Kriteria</div>
                <div className="text-gray-900 font-medium">{selectedCriteriaData.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Deskripsi</div>
                <div className="text-gray-900">{selectedCriteriaData.description}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Progress</div>
                <div className="text-gray-900 font-medium">{selectedCriteriaData.progress}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Dokumen Terhubung</div>
                <ul className="mt-2 space-y-2">
                  {evidenceData.slice(0, 8).map(ev => (
                    <li key={ev.id} className="flex items-center justify-between text-sm">
                      <span className="truncate mr-2">{ev.name}</span>
                      <span className="text-gray-500">{ev.uploadDate}</span>
                    </li>
                  ))}
                  {evidenceData.length === 0 && <li className="text-gray-500 text-sm">Belum ada dokumen</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* All Documents Modal */}
      {showAllDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={closeAllDocuments}></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 z-10 overflow-y-auto max-h-[80vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Semua Dokumen Kriteria {selectedCriteria}</h3>
              <button onClick={closeAllDocuments} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3">
              {evidenceData.length === 0 && <div className="text-gray-500">Belum ada dokumen</div>}
              {evidenceData.map(ev => (
                <div key={ev.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{ev.name}</div>
                      <div className="text-xs text-gray-500">{ev.type} • {ev.size} • {ev.uploadDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => viewEvidence(ev)} className="px-3 py-1 border rounded text-sm">Lihat</button>
                    <button onClick={() => downloadEvidence(ev)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Download</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <button onClick={closeAllDocuments} className="px-4 py-2 rounded-lg border">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccreditationManagement;

