import React, { useEffect, useState } from 'react';
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEye,
  FiEdit,
  FiDownload,
  FiFilter,
  FiSearch,
  FiFileText,
  FiUser,
  FiCalendar,
  FiAlertTriangle,
  FiUpload,
  FiMessageSquare,
  FiSend
} from 'react-icons/fi';
import Card from 'components/card';
import { documentsService } from 'services/documentsService';

const DocumentValidation = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');

  const [validationStats, setValidationStats] = useState({
    pending: 0,
    inReview: 0,
    validated: 0,
    rejected: 0,
    total: 0
  });

  const mapApiDoc = (row) => ({
    id: row.document_id,
    title: row.title,
    type: row.type || (row.template?.type ?? '-'),
    faculty: row.study_program?.name || '-',
    submittedBy: row.owner?.full_name || '-',
    submittedDate: row.created_at,
    status: row.status === 'review' ? 'in-review' : (row.status === 'approved' ? 'validated' : (row.status === 'draft' ? 'pending' : row.status)),
    priority: 'medium',
    deadline: row.deadline || row.updated_at,
    description: row.description || '',
    fileSize: row.file_size || '-',
    version: row.version_no || 1,
  });

  const refresh = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await documentsService.listDocuments({ limit: 100, order: 'created_at:DESC' });
      // res is { total, rows } from backend CRUD
      const items = (res.rows || []).map(mapApiDoc);
      setDocuments(items);
      const stats = {
        pending: items.filter(d => d.status === 'pending').length,
        inReview: items.filter(d => d.status === 'in-review').length,
        validated: items.filter(d => d.status === 'validated').length,
        rejected: items.filter(d => d.status === 'rejected').length,
        total: items.length
      };
      setValidationStats(stats);
    } catch (e) {
      setError(e.message || 'Gagal memuat dokumen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load data immediately without animations
    refresh();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'in-review': return 'bg-blue-100 text-blue-800';
      case 'validated': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FiClock className="h-4 w-4" />;
      case 'in-review': return <FiEye className="h-4 w-4" />;
      case 'validated': return <FiCheckCircle className="h-4 w-4" />;
      case 'rejected': return <FiXCircle className="h-4 w-4" />;
      default: return <FiFileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-amber-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-slate-500';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && doc.status === 'pending') ||
                      (activeTab === 'in-review' && doc.status === 'in-review') ||
                      (activeTab === 'validated' && doc.status === 'validated') ||
                      (activeTab === 'rejected' && doc.status === 'rejected');
    
    return matchesSearch && matchesFilter && matchesTab;
  });

  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-3">
      
      {/* Header */}
      <div className="col-span-1 h-fit w-full xl:col-span-3">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-700">Document Validation</h2>
          <p className="text-slate-600">Review and validate documents from study programs</p>
        </div>
      </div>

      {/* Validation Statistics */}
      <Card extra="pb-7 p-[20px] xl:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-bold text-slate-700">Validation Statistics</h4>
          <FiFileText className="h-5 w-5 text-slate-600" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded-lg bg-amber-50 p-4 text-center">
            <FiClock className="mx-auto h-8 w-8 text-amber-600" />
            <p className="mt-2 text-2xl font-bold text-amber-700">{validationStats.pending}</p>
            <p className="text-sm text-amber-600">Pending</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <FiEye className="mx-auto h-8 w-8 text-blue-600" />
            <p className="mt-2 text-2xl font-bold text-blue-700">{validationStats.inReview}</p>
            <p className="text-sm text-blue-600">In Review</p>
          </div>
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <FiCheckCircle className="mx-auto h-8 w-8 text-green-600" />
            <p className="mt-2 text-2xl font-bold text-green-700">{validationStats.validated}</p>
            <p className="text-sm text-green-600">Validated</p>
          </div>
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <FiXCircle className="mx-auto h-8 w-8 text-red-600" />
            <p className="mt-2 text-2xl font-bold text-red-700">{validationStats.rejected}</p>
            <p className="text-sm text-red-600">Rejected</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 text-center">
            <FiFileText className="mx-auto h-8 w-8 text-slate-600" />
            <p className="mt-2 text-2xl font-bold text-slate-700">{validationStats.total}</p>
            <p className="text-sm text-slate-600">Total</p>
          </div>
        </div>
      </Card>

      {/* Filters and Search */}
      <div className="col-span-1 xl:col-span-3">
        <Card extra="pb-7 p-[20px]">
          <div className="mb-4 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-review">In Review</option>
                <option value="validated">Validated</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                <FiUpload className="h-4 w-4" />
                <span>Bulk Upload</span>
              </button>
              <button className="flex items-center space-x-1 rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50">
                <FiDownload className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-4 border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'pending', label: 'Pending', count: validationStats.pending },
                { key: 'in-review', label: 'In Review', count: validationStats.inReview },
                { key: 'validated', label: 'Validated', count: validationStats.validated },
                { key: 'rejected', label: 'Rejected', count: validationStats.rejected }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 border-b-2 py-2 px-1 text-sm font-medium ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Document List */}
          <div className="space-y-4">
            {loading && (
              <div className="py-12 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                <p className="mt-4 text-slate-500">Loading documents...</p>
              </div>
            )}
            {error && !loading && (
              <div className="py-6 text-center text-red-600">{error}</div>
            )}
            {filteredDocuments.map((document, index) => (
              <div 
                key={document.id} 
                className={`cursor-pointer rounded-lg border-l-4 border border-slate-200 p-4 transition-shadow hover:shadow-md ${getPriorityColor(document.priority)}`}
                onClick={() => setSelectedDocument(document)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className="font-semibold text-slate-700">{document.title}</h5>
                      <span className={`inline-flex items-center space-x-1 rounded-full px-2 py-1 text-xs ${getStatusColor(document.status)}`}>
                        {getStatusIcon(document.status)}
                        <span className="capitalize">{document.status}</span>
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{document.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <FiUser className="h-4 w-4" />
                        <span>{document.submittedBy}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="h-4 w-4" />
                        <span>{new Date(document.submittedDate).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiFileText className="h-4 w-4" />
                        <span>{document.type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>v{document.version}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{document.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex space-x-2">
                    <button className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200">
                      <FiEye className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg bg-green-100 p-2 text-green-600 hover:bg-green-200">
                      <FiEdit className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
                      <FiDownload className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {document.priority === 'high' && (
                  <div className="mt-3 flex items-center space-x-2 rounded-lg bg-red-50 p-2">
                    <FiAlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">High Priority - Deadline: {new Date(document.deadline).toLocaleDateString('id-ID')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="py-12 text-center">
              <FiFileText className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-slate-500">No documents found</p>
            </div>
          )}
        </Card>
      </div>

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card extra="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-700">{selectedDocument.title}</h3>
              <button
                onClick={() => setSelectedDocument(null)}
                className="rounded-lg p-1 hover:bg-slate-100"
              >
                <FiXCircle className="h-5 w-5 text-slate-600" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-slate-500">Type:</label>
                  <p className="font-medium text-slate-700">{selectedDocument.type}</p>
                </div>
                <div>
                  <label className="text-slate-500">Faculty:</label>
                  <p className="font-medium text-slate-700">{selectedDocument.faculty}</p>
                </div>
                <div>
                  <label className="text-slate-500">Submitted By:</label>
                  <p className="font-medium text-slate-700">{selectedDocument.submittedBy}</p>
                </div>
                <div>
                  <label className="text-slate-500">Version:</label>
                  <p className="font-medium text-slate-700">v{selectedDocument.version}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="text-slate-500">Description:</label>
                <p className="mt-1 text-slate-700">{selectedDocument.description}</p>
              </div>

              <div className="mb-6">
                <label className="text-slate-500">Validation Notes:</label>
                <textarea
                  placeholder="Add validation notes or feedback..."
                  className="mt-2 w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
                  rows="4"
                  value={note}
                  onChange={(e)=> setNote(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={async ()=> { await documentsService.updateDocument(selectedDocument.id, { status: 'approved', change_note: note }); setSelectedDocument(null); setNote(''); await refresh(); }}
                    className="flex items-center space-x-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                    <FiCheckCircle className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={async ()=> { await documentsService.updateDocument(selectedDocument.id, { status: 'rejected', change_note: note }); setSelectedDocument(null); setNote(''); await refresh(); }}
                    className="flex items-center space-x-1 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                    <FiXCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={async ()=> { await documentsService.updateDocument(selectedDocument.id, { status: 'review', change_note: note }); setSelectedDocument(null); setNote(''); await refresh(); }}
                    className="flex items-center space-x-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    <FiMessageSquare className="h-4 w-4" />
                    <span>Request Changes</span>
                  </button>
                </div>
                <button className="flex items-center space-x-1 rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50">
                  <FiDownload className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DocumentValidation;

