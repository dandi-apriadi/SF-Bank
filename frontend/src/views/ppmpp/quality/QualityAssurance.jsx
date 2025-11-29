import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  FiCheckCircle, 
  FiBarChart2, 
  FiShield, 
  FiTrendingUp, 
  FiTrendingDown,
  FiAlertTriangle,
  FiAward,
  FiTarget,
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiCalendar,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiEye,
  FiX,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiActivity,
  FiPieChart
} from 'react-icons/fi';
import Button from 'components/button/Button';
import { qualityService } from 'services/qualityService';

const QualityAssurance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2025');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [kpiData, setKpiData] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [overallStats, setOverallStats] = useState({ total:0, good:0, warning:0, critical:0, overallScore:0, highRisks:0, lastUpdated: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Recommendation modal state
  const [showRecModal, setShowRecModal] = useState(false);
  const [recLoading, setRecLoading] = useState(false);
  const [editingRec, setEditingRec] = useState(null);
  const [recForm, setRecForm] = useState({ title: '', description: '', category: '', priority: 'medium', timeline: '', budget: '', expected_impact: '', actions: '' });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [detailType, setDetailType] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  // Additional state for numeric fields
  const [budget_amount, setBudgetAmount] = useState('');
  const [timeline_months, setTimelineMonths] = useState('');
  const [expected_impact_value, setExpectedImpactValue] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const overview = await qualityService.fetchOverview();
      if (overview.stats) {
        setOverallStats({
          total: overview.stats.total,
          good: overview.stats.good,
          warning: overview.stats.warning,
          critical: overview.stats.critical,
          overallScore: overview.stats.overallScore,
          highRisks: overview.stats.highRisks,
          lastUpdated: overview.lastUpdated || null
        });
      }
      setKpiData(overview.kpis || []);
      setRiskAnalysis(overview.risks || []);
      setRecommendations(overview.recommendations || []);
    } catch (e) {
      setError(e.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter KPI data based on category
  const filteredKPI = useMemo(() => {
    return selectedCategory === 'all'
      ? kpiData
      : kpiData.filter(kpi => (kpi.category || '').toLowerCase() === selectedCategory);
  }, [selectedCategory, kpiData]);

  // Calculate overall statistics
  const derivedStats = useMemo(() => ({
    totalKPIs: overallStats.total,
    goodKPIs: overallStats.good,
    warningKPIs: overallStats.warning,
    overallScore: overallStats.overallScore,
    highRisks: overallStats.highRisks
  }), [overallStats]);

  const StatusBadge = ({ status }) => {
    const config = {
  'good': { label: 'Baik', color: 'bg-green-100 text-green-800 border-green-200' },
      'warning': { label: 'Perhatian', color: 'bg-amber-100 text-amber-800 border-amber-200' },
      'critical': { label: 'Kritis', color: 'bg-red-100 text-red-800 border-red-200' }
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${config[status].color}`}>
        {config[status].label}
      </span>
    );
  };

  const SeverityBadge = ({ severity }) => {
    const config = {
      'high': { label: 'Tinggi', color: 'bg-red-600 text-white', icon: FiAlertTriangle },
      'medium': { label: 'Sedang', color: 'bg-amber-500 text-white', icon: FiActivity },
      'low': { label: 'Rendah', color: 'bg-blue-500 text-white', icon: FiCheckCircle }
    };
    
    const Icon = config[severity].icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${config[severity].color}`}>
        <Icon size={12} />
        {config[severity].label}
      </span>
    );
  };

  const TrendIcon = ({ trend, value }) => {
    if (trend === 'up') {
  return <FiTrendingUp className="text-green-500 text-sm" />;
    } else if (trend === 'down') {
      return <FiTrendingDown className="text-red-500 text-sm" />;
    }
    return null;
  };

  const ProgressCircle = ({ percentage, size = 60 }) => {
    const radius = (size - 8) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    const getColor = () => {
  if (percentage >= 90) return '#16a34a'; // green-600
      if (percentage >= 70) return '#3b82f6'; // blue-500
      if (percentage >= 50) return '#f59e0b'; // amber-500
      return '#ef4444'; // red-500
    };

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor()}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 sm:p-6'>
      {/* Header Section */}
      <div className='mb-8'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
          <div className='flex items-start gap-4'>
            <div className='p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg'>
              <FiShield className='text-white text-2xl' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                Sistem Jaminan Mutu
              </h1>
              <p className='text-gray-600 text-base leading-relaxed max-w-3xl'>
                Dashboard komprehensif untuk monitoring, evaluasi, dan peningkatan kualitas akademik secara berkelanjutan
              </p>
            </div>
          </div>
          
            <div className='flex items-center gap-3'>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className='px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value="2025">Tahun 2025</option>
              <option value="2024">Tahun 2024</option>
              <option value="2023">Tahun 2023</option>
            </select>
            <Button
              variant='secondary'
              size='sm'
              outlined
              leftIcon={<FiDownload />}
              onClick={async () => {
                try {
                  const blob = await qualityService.exportCsv('kpis');
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'kpis.csv';
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(url);
                } catch (err) {
                  alert('Export gagal: ' + err.message);
                }
              }}
            >
              Export KPI
            </Button>
            <Button variant='primary' size='sm' leftIcon={<FiRefreshCw />} onClick={loadData}>
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8'>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-blue-50 rounded-lg'>
                <FiTarget className='text-blue-600 text-lg' />
              </div>
              <span className='text-sm font-medium text-gray-600'>Total KPI</span>
            </div>
            <div className='text-2xl font-bold text-gray-900'>{derivedStats.totalKPIs}</div>
            <div className='text-xs text-gray-500 mt-1'>Indikator aktif</div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-green-50 rounded-lg'>
                <FiCheckCircle className='text-green-600 text-lg' />
              </div>
              <span className='text-sm font-medium text-gray-600'>Status Baik</span>
            </div>
            <div className='text-2xl font-bold text-green-600'>{derivedStats.goodKPIs}</div>
            <div className='text-xs text-gray-500 mt-1'>
              {derivedStats.totalKPIs ? Math.round((derivedStats.goodKPIs / derivedStats.totalKPIs) * 100) : 0}% dari total
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-amber-50 rounded-lg'>
                <FiAlertTriangle className='text-amber-600 text-lg' />
              </div>
              <span className='text-sm font-medium text-gray-600'>Perlu Perhatian</span>
            </div>
            <div className='text-2xl font-bold text-amber-600'>{derivedStats.warningKPIs}</div>
            <div className='text-xs text-gray-500 mt-1'>Monitoring ketat</div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-purple-50 rounded-lg'>
                <FiBarChart2 className='text-purple-600 text-lg' />
              </div>
              <span className='text-sm font-medium text-gray-600'>Skor Keseluruhan</span>
            </div>
            <div className='text-2xl font-bold text-purple-600'>{!Number.isNaN(Number(derivedStats.overallScore)) ? Number(derivedStats.overallScore).toFixed(1) : '0.0'}%</div>
            <div className='text-xs text-gray-500 mt-1'>Rata-rata pencapaian</div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-red-50 rounded-lg'>
                <FiAlertTriangle className='text-red-600 text-lg' />
              </div>
              <span className='text-sm font-medium text-gray-600'>Risiko Tinggi</span>
            </div>
            <div className='text-2xl font-bold text-red-600'>{derivedStats.highRisks}</div>
            <div className='text-xs text-gray-500 mt-1'>Perlu tindakan segera</div>
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold text-gray-900'>Key Performance Indicators</h2>
          
          {/* Category Filter */}
          <div className='flex items-center gap-2'>
            <FiFilter className='text-gray-400' />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value="all">Semua Kategori</option>
              <option value="akreditasi">Akreditasi</option>
              <option value="dokumentasi">Dokumentasi</option>
              <option value="pembelajaran">Pembelajaran</option>
              <option value="penelitian">Penelitian</option>
              <option value="lulusan">Lulusan</option>
              <option value="layanan">Layanan</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
          {loading && (
            <div className='col-span-full text-center py-10 text-gray-500 text-sm'>Memuat data...</div>
          )}
          {error && (
            <div className='col-span-full text-center py-10 text-red-600 text-sm'>{error}</div>
          )}
          {!loading && !error && filteredKPI.map(kpi => (
            <div key={kpi.id} className='bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden'>
              <div className='p-6'>
                {/* Header */}
                <div className='flex items-start justify-between mb-4'>
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                        {kpi.code || kpi.kpi_id}
                      </span>
                      <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded'>
                        {kpi.category}
                      </span>
                    </div>
                    <h3 className='font-semibold text-gray-900 text-base'>{kpi.label}</h3>
                    <p className='text-sm text-gray-600 mt-1'>{kpi.description}</p>
                  </div>
                  <StatusBadge status={kpi.status} />
                </div>

                {/* Metrics */}
                <div className='flex items-center justify-between mb-4'>
                  <div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {kpi.current_value}
                      {kpi.current_total && (
                        <span className='text-lg text-gray-500'>/{kpi.current_total}</span>
                      )}
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <span className='font-medium text-blue-600'>
                        {kpi.current_percentage != null && !Number.isNaN(Number(kpi.current_percentage)) ? Number(kpi.current_percentage).toFixed(1) : '--'}%
                      </span>
                      <TrendIcon trend={kpi.trend} />
                      <span className={`text-xs ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.previous_percentage != null && kpi.current_percentage != null && !Number.isNaN(Number(kpi.current_percentage)) && !Number.isNaN(Number(kpi.previous_percentage)) ?
                          `${kpi.trend === 'up' ? '+' : ''}${(Number(kpi.current_percentage) - Number(kpi.previous_percentage)).toFixed(1)}%` : '--'}
                      </span>
                    </div>
                  </div>
                  <ProgressCircle percentage={Number(kpi.current_percentage) || 0} />
                </div>

                {/* Progress Bar */}
                <div className='space-y-2'>
                  <div className='flex justify-between text-xs text-gray-600'>
                    <span>Progress</span>
                    <span>Target: {kpi.target_percentage != null && !Number.isNaN(Number(kpi.target_percentage)) ? Number(kpi.target_percentage).toFixed(1) : '0'}%</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        (kpi.current_percentage || 0) >= (kpi.target_percentage || 101) 
                          ? 'bg-green-500' 
                          : (kpi.current_percentage || 0) >= 70 
                            ? 'bg-blue-500' 
                            : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(kpi.current_percentage || 0, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500'>
                  <span>PIC: {kpi.responsible}</span>
                  <span>Update: {new Date(kpi.last_updated || kpi.created_at || Date.now()).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Analysis and Recommendations */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
        {/* Risk Analysis */}
        <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
          <div className='p-6 border-b border-gray-100'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900'>Analisis Risiko Mutu</h2>
            </div>
          </div>
          
          <div className='divide-y divide-gray-100'>
            {riskAnalysis.slice(0, 4).map(risk => (
              <div key={risk.risk_id} className='p-6 hover:bg-gray-50 transition-colors duration-150'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                        {risk.code}
                      </span>
                      <span className='text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded'>
                        {risk.category}
                      </span>
                    </div>
                    <h3 className='font-semibold text-gray-900 mb-1'>{risk.issue}</h3>
                    <p className='text-sm text-gray-600'>{risk.description}</p>
                  </div>
                  <SeverityBadge severity={risk.severity} />
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-600'>Mitigasi: {risk.mitigation}</span>
                    <span className='font-medium text-gray-700'>Progres: {risk.progress}%</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-1.5'>
                    <div 
                      className='h-1.5 rounded-full bg-blue-500 transition-all duration-300'
                      style={{ width: `${risk.progress}%` }}
                    />
                  </div>
                </div>

                <div className='flex items-center justify-between mt-3 text-xs text-gray-500'>
                  <span>PIC: {risk.owner}</span>
                  <div className='flex items-center gap-2'>
                    <span className='mr-2'>Timeline: {risk.timeline}</span>
                    <Button size='xs' variant='secondary' outlined leftIcon={<FiEye />} onClick={async () => {
                      try {
                        setDetailLoading(true);
                        const fresh = await qualityService.getRisk(risk.risk_id);
                        setDetailItem(fresh);
                        setDetailType('risk');
                        setShowDetailModal(true);
                      } catch (err) {
                        const msg = (err && err.message) ? String(err.message) : String(err);
                        if (msg.toLowerCase().includes('not found')) {
                          try { await loadData(); } catch (e) {}
                          alert('Risiko tidak ditemukan (mungkin sudah dihapus).');
                        } else {
                          alert('Gagal memuat detail risiko: ' + msg);
                        }
                      } finally { setDetailLoading(false); }
                    }}>Detail</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
          <div className='p-6 border-b border-gray-100'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900'>Rekomendasi Peningkatan</h2>
              <Button variant='primary' size='sm' leftIcon={<FiPlus />} onClick={() => {
                setEditingRec(null);
                setRecForm({ title: '', description: '', category: '', priority: 'medium', timeline: '', budget: '', expected_impact: '', actions: '' });
                setShowRecModal(true);
              }}>
                Tambah
              </Button>
            </div>
          </div>
          
          <div className='divide-y divide-gray-100'>
            {recommendations.map(rec => (
              <div key={rec.recommendation_id} className='p-6 hover:bg-gray-50 transition-colors duration-150'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        rec.priority === 'high' 
                          ? 'bg-red-100 text-red-700' 
                          : rec.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}>
                        {rec.priority === 'high' ? 'Prioritas Tinggi' : 
                         rec.priority === 'medium' ? 'Prioritas Sedang' : 'Prioritas Rendah'}
                      </span>
                      <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded'>
                        {rec.category}
                      </span>
                    </div>
                    <h3 className='font-semibold text-gray-900 mb-1'>{rec.title}</h3>
                    <p className='text-sm text-gray-600 mb-3'>{rec.description}</p>
                  </div>
                </div>

                <div className='space-y-2 mb-3'>
                  <span className='text-sm font-medium text-gray-700'>Action Items:</span>
                  <ul className='text-sm text-gray-600 space-y-1'>
                    {Array.isArray(rec.actions) && rec.actions.slice(0, 2).map((action, idx) => (
                      <li key={idx} className='flex items-center gap-2'>
                        <div className='w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0' />
                        {action}
                      </li>
                    ))}
                    {Array.isArray(rec.actions) && rec.actions.length > 2 && (
                      <li className='text-blue-600 cursor-pointer hover:underline'>
                        +{rec.actions.length - 2} item lainnya
                      </li>
                    )}
                  </ul>
                </div>

                <div className='flex items-center justify-between mb-3'>
                  <div className='text-xs text-gray-500'>PIC: {rec.responsible}</div>
                  <div className='flex items-center gap-2'>
                    <Button size='xs' variant='secondary' outlined leftIcon={<FiEye />} onClick={async () => {
                      try {
                        setDetailLoading(true);
                        const fresh = await qualityService.getRecommendation(rec.recommendation_id);
                        setDetailItem(fresh);
                        setDetailType('recommendation');
                        setShowDetailModal(true);
                      } catch (err) {
                        const msg = (err && err.message) ? String(err.message) : String(err);
                        if (msg.toLowerCase().includes('not found')) {
                          try { await loadData(); } catch (e) {}
                          alert('Rekomendasi tidak ditemukan (mungkin sudah dihapus).');
                        } else {
                          alert('Gagal memuat detail: ' + msg);
                        }
                      } finally { setDetailLoading(false); }
                    }}>Detail</Button>
                    <Button size='xs' variant='secondary' outlined leftIcon={<FiEdit2 />} onClick={async () => {
                      // Fetch fresh recommendation from server to avoid editing stale/deleted items
                      try {
                        const fresh = await qualityService.getRecommendation(rec.recommendation_id);
                        setEditingRec(fresh);
                        setRecForm({
                          title: fresh.title || '',
                          description: fresh.description || '',
                          category: fresh.category || '',
                          priority: fresh.priority || 'medium',
                          timeline: fresh.timeline || '',
                          budget: fresh.budget || '',
                          expected_impact: fresh.expected_impact || '',
                          actions: Array.isArray(fresh.actions) ? fresh.actions.join(', ') : (fresh.actions || '')
                        });
                        setShowRecModal(true);
                      } catch (err) {
                        const msg = (err && err.message) ? String(err.message) : String(err);
                        if (msg.toLowerCase().includes('not found')) {
                          try { await loadData(); } catch (e) {}
                          alert('Rekomendasi sudah tidak tersedia (mungkin dihapus). Daftar diperbarui.');
                        } else {
                          alert('Gagal memuat data rekomendasi: ' + msg);
                        }
                      }
                    }}>Edit</Button>
                    <Button size='xs' variant='secondary' outlined leftIcon={<FiTrash2 />} onClick={async () => {
                      if (!window.confirm('Hapus rekomendasi ini?')) return;
                      try {
                        await qualityService.deleteRecommendation(rec.recommendation_id);
                        await loadData();
                      } catch (err) {
                        const msg = (err && err.message) ? String(err.message) : String(err);
                        if (msg.toLowerCase().includes('not found')) {
                          // Item already removed — refresh list
                          try { await loadData(); } catch (e) {}
                          alert('Rekomendasi sudah tidak ada (mungkin sudah dihapus). Daftar diperbarui.');
                        } else {
                          alert('Gagal menghapus: ' + msg);
                        }
                      }
                    }}>Hapus</Button>
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-4 text-xs'>
                  <div>
                    <span className='text-gray-500'>Timeline:</span>
                    <div className='font-medium text-gray-700'>{rec.timeline}</div>
                  </div>
                  <div>
                    <span className='text-gray-500'>Budget:</span>
                    <div className='font-medium text-gray-700'>{rec.budget}</div>
                  </div>
                  <div>
                    <span className='text-gray-500'>Target:</span>
                    <div className='font-medium text-gray-700'>{rec.expected_impact}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Summary */}
      <div className='bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Ringkasan Eksekutif</h3>
            <p className='text-blue-100 text-sm max-w-2xl'>
              Sistem jaminan mutu menunjukkan tren positif dengan {derivedStats.goodKPIs} dari {derivedStats.totalKPIs} KPI dalam status baik. 
              Fokus perbaikan diperlukan pada {derivedStats.highRisks} area berisiko tinggi untuk mencapai target institutional excellence.
            </p>
          </div>
          <div className='text-right'>
            <div className='text-2xl font-bold'>{!Number.isNaN(Number(derivedStats.overallScore)) ? Number(derivedStats.overallScore).toFixed(1) : '0.0'}%</div>
            <div className='text-sm text-blue-100'>Quality Score</div>
            <div className='text-xs text-blue-200 mt-1'>
              Update: {overallStats.lastUpdated ? new Date(overallStats.lastUpdated).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div role="dialog" aria-modal="true" className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FiFileText className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{detailType === 'recommendation' ? 'Detail Rekomendasi' : 'Detail Risiko'}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Informasi lengkap terkait item.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setShowDetailModal(false); setDetailItem(null); setDetailType(null); }} aria-label="Tutup" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
                    <FiX />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto text-sm text-gray-700 flex-1">
                {detailLoading && <div className="text-gray-500">Memuat...</div>}
                {!detailLoading && detailType === 'recommendation' && detailItem && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-lg">{detailItem.title}</h4>
                    <p className="text-gray-700">{detailItem.description}</p>
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                      <div><strong>Kategori:</strong> {detailItem.category}</div>
                      <div><strong>Prioritas:</strong> {detailItem.priority}</div>
                      <div><strong>Timeline:</strong> {detailItem.timeline}</div>
                      <div><strong>Budget:</strong> {detailItem.budget}</div>
                      <div className='col-span-2'>
                        <strong>Expected Impact:</strong> {detailItem.expected_impact}
                      </div>
                    </div>
                    <div>
                      <strong>Action Items:</strong>
                      <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                        {(Array.isArray(detailItem.actions) ? detailItem.actions : (typeof detailItem.actions === 'string' ? (detailItem.actions ? JSON.parse(detailItem.actions) : []) : [])).map((a, i) => (
                          <li key={i}>{String(a)}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-xs text-gray-500">Dibuat: {detailItem.created_at ? new Date(detailItem.created_at).toLocaleString('id-ID') : '-' } • Terakhir diupdate: {detailItem.updated_at ? new Date(detailItem.updated_at).toLocaleString('id-ID') : '-'}</div>
                  </div>
                )}
                {!detailLoading && detailType === 'risk' && detailItem && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-lg">{detailItem.issue}</h4>
                    <p className="text-gray-700">{detailItem.description}</p>
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                      <div><strong>Severity:</strong> {detailItem.severity}</div>
                      <div><strong>Probability:</strong> {detailItem.probability}</div>
                      <div><strong>Impact:</strong> {detailItem.impact}</div>
                      <div><strong>Risk Score:</strong> {detailItem.risk_score}</div>
                    </div>
                    <div className="text-xs text-gray-500">PIC: {detailItem.owner} • Timeline: {detailItem.timeline}</div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t bg-white/90 dark:bg-slate-900/90 flex justify-end gap-3">
                <Button variant='secondary' outlined onClick={() => { setShowDetailModal(false); setDetailItem(null); setDetailType(null); }}>Tutup</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Modal (Add/Edit) */}
      {showRecModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div role="dialog" aria-modal="true" className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <FiEdit2 className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{editingRec ? 'Edit Rekomendasi' : 'Tambah Rekomendasi'}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Isi detail rekomendasi perbaikan institusi dengan jelas.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowRecModal(false)} aria-label="Tutup" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
                    <FiX />
                  </button>
                </div>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  setRecLoading(true);
                  const parseNumberFromString = (s) => {
                    if (s == null) return null;
                    const digits = String(s).replace(/[^0-9]/g, '');
                    if (!digits) return null;
                    return Number(digits);
                  };
                  const parseIntFromString = (s) => {
                    if (s == null) return null;
                    const n = parseInt(String(s).replace(/[^0-9]/g, ''), 10);
                    return !isNaN(n) ? n : null;
                  };

                  const payload = {
                    title: recForm.title,
                    description: recForm.description,
                    category: recForm.category,
                    priority: recForm.priority,
                    timeline: recForm.timeline,
                    timeline_months: parseIntFromString(recForm.timeline),
                    budget: recForm.budget,
                    budget_amount: parseNumberFromString(recForm.budget),
                    expected_impact: recForm.expected_impact,
                    expected_impact_value: parseNumberFromString(recForm.expected_impact),
                    actions: recForm.actions ? recForm.actions.split(',').map(s => s.trim()).filter(Boolean) : []
                  };

                  if (editingRec) {
                    await qualityService.updateRecommendation(editingRec.recommendation_id, payload);
                  } else {
                    await qualityService.createRecommendation(payload);
                  }
                  setShowRecModal(false);
                  await loadData();
                } catch (err) {
                    const msg = (err && err.message) ? String(err.message) : String(err);
                    if (msg.toLowerCase().includes('not found')) {
                      try { await loadData(); } catch (e) {}
                      alert('Rekomendasi yang Anda edit sudah tidak ada. Daftar diperbarui.');
                      setShowRecModal(false);
                    } else {
                      alert('Gagal menyimpan rekomendasi: ' + msg);
                    }
                } finally { setRecLoading(false); }
              }} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-gray-700">
                <div>
                  <label className="font-medium block mb-1">Judul</label>
                  <input value={recForm.title} onChange={(e)=>setRecForm({...recForm, title: e.target.value})} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="font-medium block mb-1">Deskripsi</label>
                  <textarea value={recForm.description} onChange={(e)=>setRecForm({...recForm, description: e.target.value})} className="w-full border rounded px-3 py-2" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium block mb-1">Kategori</label>
                    <input value={recForm.category} onChange={(e)=>setRecForm({...recForm, category: e.target.value})} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="font-medium block mb-1">Prioritas</label>
                    <select value={recForm.priority} onChange={(e)=>setRecForm({...recForm, priority: e.target.value})} className="w-full border rounded px-3 py-2">
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium block mb-1">Timeline</label>
                    <input value={recForm.timeline} onChange={(e)=>setRecForm({...recForm, timeline: e.target.value})} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="font-medium block mb-1">Budget</label>
                    <input value={recForm.budget} onChange={(e)=>setRecForm({...recForm, budget: e.target.value})} className="w-full border rounded px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="font-medium block mb-1">Expected Impact</label>
                  <input value={recForm.expected_impact} onChange={(e)=>setRecForm({...recForm, expected_impact: e.target.value})} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="font-medium block mb-1">Action Items (pisahkan dengan koma)</label>
                  <textarea value={recForm.actions} onChange={(e)=>setRecForm({...recForm, actions: e.target.value})} className="w-full border rounded px-3 py-2" rows={3} />
                </div>

                <div className="h-2" />
                <div className="h-12" />
              </form>

              <div className="p-4 border-t bg-white/90 dark:bg-slate-900/90 flex justify-end gap-2">
                <Button variant='secondary' outlined type="button" onClick={() => setShowRecModal(false)}>Batal</Button>
                <Button variant='primary' form="" type="submit" disabled={recLoading}>{recLoading ? 'Menyimpan...' : 'Simpan'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityAssurance;
