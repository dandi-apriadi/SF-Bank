import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { documentsService } from 'services/documentsService';
import {
  FiEdit,
  FiEye,
  FiDownload,
  FiSettings,
  FiPlus,
  FiSave,
  FiActivity,
  FiBarChart,
  FiFileText,
    FiTarget,
    FiUsers,
    FiTrash,
  FiCalendar
} from 'react-icons/fi';

const LEDTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '', category: 'standar', standard: '1', interactive: false });
  const authUser = useSelector(state => state.auth?.user);

  // Load LED templates from backend
  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await documentsService.listTemplates({ type: 'LED', limit: 100, order: 'updated_at:DESC' });
      const rows = res?.rows || [];
      const mapped = rows.map(t => ({
        id: t.template_id,
        name: t.name,
        description: t.description || '',
        category: 'standar', // assumption until we model categories
        standard: t.structure?.standard || '-',
        version: String(t.version_no || 1),
        status: t.is_active ? 'active' : 'draft',
        lastModified: t.updated_at || t.created_at,
        createdBy: 'System',
        isInteractive: Boolean(t.structure?.interactive),
        components: Array.isArray(t.structure?.components) ? t.structure.components : []
      }));
      setTemplates(mapped);
    } catch (e) {
      console.error('Gagal memuat template LED', e);
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadTemplates(); }, []);

  const createTemplate = async () => {
    setIsSaving(true);
    try {
      const payload = {
        type: 'LED',
        name: createForm.name,
        description: createForm.description,
        version_no: 1,
        is_active: true,
        structure: {
          standard: createForm.standard === 'all' ? 'Semua Standar' : `Standar ${createForm.standard}`,
          interactive: !!createForm.interactive,
          components: []
        }
      };
      await documentsService.createTemplate(payload);
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '', category: 'standar', standard: '1', interactive: false });
      await loadTemplates();
    } catch (e) {
      console.error('Gagal membuat template', e);
    } finally {
      setIsSaving(false);
    }
  };

  const previewTemplate = async (tpl) => {
    try {
      // Refresh single template details
      const full = await documentsService.getTemplate(tpl.id);
      const detailed = {
        ...tpl,
        structure: full?.structure || {},
        components: Array.isArray(full?.structure?.components) ? full.structure.components : tpl.components
      };
      setSelectedTemplate(detailed);
      setShowPreview(true);
    } catch (e) {
      // Fallback to current data
      setSelectedTemplate(tpl);
      setShowPreview(true);
    }
  };

  // Removed "use" action; we provide download-only per request

  const downloadTemplate = async (tpl) => {
    try {
      const data = await documentsService.getTemplate(tpl.id);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tpl.name.replace(/\s+/g,'_').toLowerCase()}_template.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Gagal mengunduh template', e);
    }
  };

  const deleteTemplate = async (tpl) => {
    if (!window.confirm(`Hapus template "${tpl.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await documentsService.deleteTemplate(tpl.id);
      // If current previewed template deleted, close modal
      if (showPreview && selectedTemplate?.id === tpl.id) setShowPreview(false);
      await loadTemplates();
    } catch (e) {
      console.error('Gagal menghapus template', e);
      alert('Gagal menghapus template.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'standar':
        return 'bg-blue-100 text-blue-800';
      case 'komprehensif':
        return 'bg-purple-100 text-purple-800';
      case 'custom':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTemplates = templates.filter(template => {
    if (activeTab === 'available') return template.status === 'active';
    if (activeTab === 'drafts') return template.status === 'draft';
    if (activeTab === 'all') return true;
    return true;
  });

  return (
  <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          LED Templates
        </h1>
        <p className="text-gray-600">
          Kelola template LED (Laporan Evaluasi Diri) interaktif untuk akreditasi program studi
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FiFileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-800">{templates.length}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-900">Total Templates</h3>
        </div>

  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FiActivity className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">
              {templates.filter(t => t.status === 'active').length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-900">Active Templates</h3>
        </div>

  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FiEdit className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-amber-800">
              {templates.filter(t => t.status === 'draft').length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-900">Draft Templates</h3>
        </div>

  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FiTarget className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-800">8</span>
          </div>
          <h3 className="text-sm font-medium text-gray-900">Standards Covered</h3>
        </div>
      </div>

      {/* Tab Navigation and Controls */}
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'available', label: 'Available', count: templates.filter(t => t.status === 'active').length },
              { id: 'drafts', label: 'Drafts', count: templates.filter(t => t.status === 'draft').length },
              { id: 'all', label: 'All Templates', count: templates.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <FiPlus className="h-4 w-4" />
              <span>Create Template</span>
            </button>
            <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <FiSettings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              {/* Template Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FiFileText className="h-6 w-6 text-blue-600" />
                  {template.isInteractive && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" title="Interactive Template"></div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(template.status)}`}>
                    {template.status}
                  </span>
                </div>
              </div>

              {/* Template Info */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>Standard: {template.standard}</span>
                  <span>v{template.version}</span>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Created by: {template.createdBy}</p>
                  <p>Last modified: {new Date(template.lastModified).toLocaleDateString('id-ID')}</p>
                  <p>Components: {template.components.length}</p>
                </div>
              </div>

              {/* Template Components Preview */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Components:</p>
                <div className="space-y-1">
                  {template.components.slice(0, 3).map((component) => (
                    <div key={component.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{component.name}</span>
                      <div className="flex items-center space-x-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          component.required ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {component.type}
                        </span>
                        {component.required && <span className="text-red-500">*</span>}
                      </div>
                    </div>
                  ))}
                  {template.components.length > 3 && (
                    <p className="text-xs text-gray-500">+{template.components.length - 3} more components</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button onClick={() => previewTemplate(template)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors">
                  <FiEye className="h-4 w-4" />
                  <span>Preview</span>
                </button>
                <button onClick={() => downloadTemplate(template)} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors">
                  <FiDownload className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button onClick={() => setShowCreateModal(true)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <FiEdit className="h-4 w-4" />
                </button>
                <button onClick={() => downloadTemplate(template)} className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                  <FiDownload className="h-4 w-4" />
                </button>
                <button onClick={() => deleteTemplate(template)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <FiTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FiFileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Found</h3>
          <p className="text-gray-600 mb-4">Create your first LED template to get started.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
          >
            <FiPlus className="h-5 w-5" />
            <span>Create Template</span>
          </button>
        </div>
      )}

      {/* Quick Actions removed as requested */}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New LED Template</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={e => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter template name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  value={createForm.description}
                  onChange={e => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the template purpose and usage..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select value={createForm.category} onChange={e => setCreateForm(prev => ({ ...prev, category: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="standar">Standar</option>
                    <option value="komprehensif">Komprehensif</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Standard</label>
                  <select value={createForm.standard} onChange={e => setCreateForm(prev => ({ ...prev, standard: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="1">Standar 1 - Visi Misi</option>
                    <option value="2">Standar 2 - Tata Pamong</option>
                    <option value="3">Standar 3 - Kemahasiswaan</option>
                    <option value="all">Semua Standar</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="interactive" className="rounded" checked={createForm.interactive} onChange={e => setCreateForm(prev => ({ ...prev, interactive: e.target.checked }))} />
                <label htmlFor="interactive" className="text-sm text-gray-700">
                  Make this template interactive
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button onClick={createTemplate} disabled={isSaving || !createForm.name} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-60">
                <FiSave className="h-4 w-4" />
                <span>{isSaving ? 'Menyimpan...' : 'Create Template'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedTemplate.name}</h3>
                <p className="text-sm text-gray-600">{selectedTemplate.description || '—'}</p>
              </div>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-6 overflow-y-auto">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedTemplate.category)}`}>{selectedTemplate.category || 'standar'}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedTemplate.status)}`}>{selectedTemplate.status || 'active'}</span>
                {selectedTemplate.isInteractive && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Interactive</span>}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600">Versi</div>
                  <div className="text-sm font-semibold text-gray-900">v{selectedTemplate.version || '1'}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600">Standar</div>
                  <div className="text-sm font-semibold text-gray-900">{selectedTemplate.standard || '-'}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600">Komponen</div>
                  <div className="text-sm font-semibold text-gray-900">{(selectedTemplate.components || []).length}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600">Terakhir Diubah</div>
                  <div className="text-sm font-semibold text-gray-900">{selectedTemplate.lastModified ? new Date(selectedTemplate.lastModified).toLocaleDateString('id-ID') : '-'}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600">Dibuat Oleh</div>
                  <div className="text-sm font-semibold text-gray-900">{selectedTemplate.createdBy || '—'}</div>
                </div>
              </div>

              {/* Components Table */}
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">Komponen Template</h4>
                <span className="text-xs text-gray-500">{(selectedTemplate.components || []).length} item</span>
              </div>
              {(selectedTemplate.components || []).length === 0 ? (
                <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded p-4">Tidak ada komponen dalam template ini.</div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-72 overflow-y-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-100 text-slate-700">
                        <tr>
                          <th className="text-left font-medium px-4 py-2">Nama</th>
                          <th className="text-left font-medium px-4 py-2">Tipe</th>
                          <th className="text-left font-medium px-4 py-2">Wajib</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {(selectedTemplate.components || []).map((c) => (
                          <tr key={c.id || c.name} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-gray-800">{c.name || c.id}</td>
                            <td className="px-4 py-2">
                              <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{c.type || 'field'}</span>
                            </td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-0.5 rounded text-xs ${c.required ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{c.required ? 'Ya' : 'Tidak'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
              <button onClick={() => deleteTemplate(selectedTemplate)} className="inline-flex items-center px-3 py-2 rounded-lg border border-red-600 text-red-700 hover:bg-red-50">
                <FiTrash className="h-4 w-4 mr-2" /> Hapus
              </button>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowPreview(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Tutup</button>
                <button onClick={() => downloadTemplate(selectedTemplate)} className="px-4 py-2 rounded-lg border border-blue-600 text-blue-700 hover:bg-blue-50">Unduh (JSON)</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LEDTemplates;

