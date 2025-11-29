import React, { useState, useEffect } from 'react';
import {
  FiAward,
  FiTarget,
  FiBarChart,
  FiCheckCircle,
  FiEdit,
  FiDownload,
  FiUpload,
  FiPlus,
  FiSearch,
  FiFilter,
  FiSettings,
  FiEye,
  FiClock,
  FiUsers,
  FiFileText,
  FiTool
} from 'react-icons/fi';
import Card from 'components/card';
import { accreditationInstrumentsService } from 'services/accreditationInstrumentsService';
import { apiClient } from 'services/api';

const AccreditationInstruments = () => {
  const [activeTab, setActiveTab] = useState('instruments');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [instruments, setInstruments] = useState([]);
  const [instrumentStats, setInstrumentStats] = useState({ total: 0, totalUsage: 0, avgCriteria: 0 });
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [form, setForm] = useState({
    instrument_type: 'BAN-PT',
    code: '',
    title: '',
    weight: '',
    order_no: ''
  });

  useEffect(() => {
    // Debug log to check if component is mounting
    console.log('AccreditationInstruments component mounted');
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [list, stats] = await Promise.all([
          accreditationInstrumentsService.list(),
          accreditationInstrumentsService.stats()
        ]);

        // Normalize to UI shape
        const mapped = list.map((it, idx) => ({
          id: `${it.instrument_type}-${idx}`,
          name: it.name || `Instrumen Akreditasi ${it.instrument_type}`,
          type: it.instrument_type,
          version: it.version || '-',
          criteria: it.criteria_count ?? 0,
          standards: it.standards_count ?? 0,
          lastUpdated: it.last_updated || null,
          status: 'active',
          usage: it.usage_count ?? 0,
          description: it.description || '',
          accreditor: it.instrument_type
        }));

        setInstruments(mapped);
        setInstrumentStats({
          total: stats.total ?? mapped.length,
          totalUsage: stats.totalUsage ?? mapped.reduce((s,i)=>s+(i.usage||0),0),
          avgCriteria: stats.avgCriteria ?? 0
        });
      } catch (e) {
        console.error(e);
        setError(e.message || 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refresh = async () => {
    try {
      setError('');
      const [list, stats] = await Promise.all([
        accreditationInstrumentsService.list(),
        accreditationInstrumentsService.stats()
      ]);
      const mapped = list.map((it, idx) => ({
        id: `${it.instrument_type}-${idx}`,
        name: it.name || `Instrumen Akreditasi ${it.instrument_type}`,
        type: it.instrument_type,
        version: it.version || '-',
        criteria: it.criteria_count ?? 0,
        standards: it.standards_count ?? 0,
        lastUpdated: it.last_updated || null,
        status: 'active',
        usage: it.usage_count ?? 0,
        description: it.description || '',
        accreditor: it.instrument_type
      }));
      setInstruments(mapped);
      setInstrumentStats({
        total: stats.total ?? mapped.length,
        totalUsage: stats.totalUsage ?? mapped.reduce((s,i)=>s+(i.usage||0),0),
        avgCriteria: stats.avgCriteria ?? 0
      });
    } catch (e) {
      setError(e.message || 'Gagal memuat data');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      if (!form.code || !form.title) {
        throw new Error('Code dan Title wajib diisi');
      }
      const payload = {
        instrument_type: form.instrument_type,
        code: form.code,
        title: form.title,
        weight: form.weight ? Number(form.weight) : null,
        order_no: form.order_no ? Number(form.order_no) : null,
        is_active: true
      };
      await apiClient.post('/api/accreditation-criteria', payload);
      setSaveSuccess('Berhasil menambah kriteria');
      await refresh();
      setForm({ instrument_type: form.instrument_type, code: '', title: '', weight: '', order_no: '' });
      setShowAdd(false);
    } catch (err) {
      setSaveError(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const [criteriaMapping] = useState([]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-amber-100 text-amber-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <FiCheckCircle className="h-4 w-4" />;
      case 'draft': return <FiEdit className="h-4 w-4" />;
      case 'review': return <FiEye className="h-4 w-4" />;
      case 'archived': return <FiClock className="h-4 w-4" />;
      default: return <FiFileText className="h-4 w-4" />;
    }
  };

  const filteredInstruments = instruments.filter(instrument =>
    instrument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instrument.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instrument.accreditor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      
      {/* Header */}
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Accreditation Instruments</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage and customize accreditation instruments for different programs</p>
        </div>
      </div>

      {/* Test Card removed */}

      {/* Instrument Statistics */}
      <Card extra="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-bold text-gray-800 dark:text-white">Instrument Statistics</h4>
          <FiBarChart className="h-5 w-5 text-gray-600" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 text-center">
            <FiAward className="mx-auto h-8 w-8 text-blue-600" />
            <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-300">{instrumentStats.total}</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">Total Instruments</p>
          </div>
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-center">
            <FiCheckCircle className="mx-auto h-8 w-8 text-green-600" />
            <p className="mt-2 text-2xl font-bold text-green-700 dark:text-green-300">{instrumentStats.total}</p>
            <p className="text-sm text-green-600 dark:text-green-400">Types</p>
          </div>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4 text-center">
            <FiEdit className="mx-auto h-8 w-8 text-amber-600" />
            <p className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-300">-</p>
            <p className="text-sm text-amber-600 dark:text-amber-400">-</p>
          </div>
          <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-4 text-center">
            <FiEye className="mx-auto h-8 w-8 text-purple-600" />
            <p className="mt-2 text-2xl font-bold text-purple-700 dark:text-purple-300">-</p>
            <p className="text-sm text-purple-600 dark:text-purple-400">-</p>
          </div>
          <div className="rounded-lg bg-teal-50 dark:bg-teal-900/20 p-4 text-center">
            <FiUsers className="mx-auto h-8 w-8 text-teal-600" />
            <p className="mt-2 text-2xl font-bold text-teal-700 dark:text-teal-300">{instrumentStats.totalUsage}</p>
            <p className="text-sm text-teal-600 dark:text-teal-400">Total Usage</p>
          </div>
          <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-4 text-center">
            <FiTarget className="mx-auto h-8 w-8 text-indigo-600" />
            <p className="mt-2 text-2xl font-bold text-indigo-700 dark:text-indigo-300">{instrumentStats.avgCriteria}</p>
            <p className="text-sm text-indigo-600 dark:text-indigo-400">Avg Criteria</p>
          </div>
        </div>
      </Card>

      {/* Simple Instruments List */}
      <Card extra="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-bold text-gray-800 dark:text-white">Available Instruments</h4>
          <button onClick={() => setShowAdd(true)} className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <FiPlus className="h-4 w-4" />
            <span>Add New</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search instruments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Instruments List */}
        {loading && (
          <div className="text-center py-12">
            <FiTool className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading instruments...</p>
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        <div className="space-y-4">
          {filteredInstruments.map((instrument) => (
            <div
              key={instrument.id}
              className="cursor-pointer rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:hover:border-blue-500"
              onClick={() => setSelectedInstrument(instrument)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(instrument.status)}
                    <h5 className="font-semibold text-gray-800 dark:text-white">{instrument.name}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('active')}`}>
                      active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{instrument.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-1 font-medium text-gray-800 dark:text-white">{instrument.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Version:</span>
                      <span className="ml-1 font-medium text-gray-800 dark:text-white">{instrument.version}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Criteria:</span>
                      <span className="ml-1 font-medium text-gray-800 dark:text-white">{instrument.criteria}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Usage:</span>
                      <span className="ml-1 font-medium text-gray-800 dark:text-white">{instrument.usage} programs</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/40">
                    <FiEye className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg bg-green-100 p-2 text-green-600 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40">
                    <FiEdit className="h-4 w-4" />
                  </button>
                  <a
                    href={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/accreditation-instruments/${encodeURIComponent(instrument.type)}/export`}
                    className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={(e) => e.stopPropagation()}
                    download
                  >
                    <FiDownload className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInstruments.length === 0 && (
          <div className="text-center py-12">
            <FiAward className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">No instruments found</p>
          </div>
        )}

        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-bold text-gray-800 dark:text-white">Tambah Kriteria Instrumen</h4>
                <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              {saveError && (
                <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-red-700">{saveError}</div>
              )}
              {saveSuccess && (
                <div className="mb-3 rounded border border-green-200 bg-green-50 p-2 text-green-700">{saveSuccess}</div>
              )}
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300">Instrument Type</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={form.instrument_type}
                    onChange={(e)=> setForm(f=>({...f, instrument_type: e.target.value}))}
                  >
                    <option value="BAN-PT">BAN-PT</option>
                    <option value="LAM-TEKNIK">LAM-TEKNIK</option>
                    <option value="LAM-PTKes">LAM-PTKes</option>
                    <option value="LAM">LAM</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-300">Code</label>
                    <input
                      className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={form.code}
                      onChange={(e)=> setForm(f=>({...f, code: e.target.value}))}
                      placeholder="C1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-300">Order No</label>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={form.order_no}
                      onChange={(e)=> setForm(f=>({...f, order_no: e.target.value}))}
                      placeholder="1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300">Title</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={form.title}
                    onChange={(e)=> setForm(f=>({...f, title: e.target.value}))}
                    placeholder="Judul Kriteria"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300">Weight</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={form.weight}
                    onChange={(e)=> setForm(f=>({...f, weight: e.target.value}))}
                    placeholder="12.5"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={()=> setShowAdd(false)} className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">Batal</button>
                  <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Card>

      {/* Selected Instrument Details */}
      {selectedInstrument && (
        <Card extra="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-bold text-gray-800 dark:text-white">Instrument Details</h4>
            <button 
              onClick={() => setSelectedInstrument(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-gray-800 dark:text-white">{selectedInstrument.name}</h5>
              <p className="text-gray-600 dark:text-gray-400">{selectedInstrument.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-500">Type:</label>
                <p className="font-medium text-gray-800 dark:text-white">{selectedInstrument.type}</p>
              </div>
              <div>
                <label className="text-gray-500">Version:</label>
                <p className="font-medium text-gray-800 dark:text-white">{selectedInstrument.version}</p>
              </div>
              <div>
                <label className="text-gray-500">Criteria:</label>
                <p className="font-medium text-gray-800 dark:text-white">{selectedInstrument.criteria}</p>
              </div>
              <div>
                <label className="text-gray-500">Standards:</label>
                <p className="font-medium text-gray-800 dark:text-white">{selectedInstrument.standards}</p>
              </div>
              <div>
                <label className="text-gray-500">Usage:</label>
                <p className="font-medium text-gray-800 dark:text-white">{selectedInstrument.usage} Programs</p>
              </div>
              <div>
                <label className="text-gray-500">Accreditor:</label>
                <p className="font-medium text-gray-800 dark:text-white">{selectedInstrument.accreditor}</p>
              </div>
            </div>

            {selectedInstrument.lastUpdated && (
              <div>
                <label className="text-gray-500">Last Updated:</label>
                <p className="font-medium text-gray-800 dark:text-white">{new Date(selectedInstrument.lastUpdated).toLocaleDateString('id-ID')}</p>
              </div>
            )}

            <div className="space-y-2">
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                View Details
              </button>
              <button className="w-full rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                Customize
              </button>
              <a
                href={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/accreditation-instruments/${encodeURIComponent(selectedInstrument.type)}/export`}
                className="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                download
              >
                Download
              </a>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AccreditationInstruments;

