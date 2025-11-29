import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useLoadDashboardData from 'hooks/useLoadDashboardData';
import { selectCriteria } from 'store/selectors/dashboardSelectors';
import { qualityService } from 'services/qualityService';
import { exportLEDExcel } from 'services/accreditationService';
import diagnosticService from 'services/diagnosticService';
import {
  ChartBarIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UsersIcon,
  TrophyIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  BellIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  
} from '@heroicons/react/24/outline';
import { tokenClasses, colors } from 'styles/designTokens';
import { ppeppService } from 'services/ppeppService';
import ButtonPrimary from 'components/ui/ButtonPrimary';

const KaprodiDashboard = () => {
  const [activeTimeRange, setActiveTimeRange] = useState('month');
  useLoadDashboardData();
  const accreditation = useSelector(state => state.accreditation.data);
  const institution = useSelector(state => state.institution.data);
  const criteriaGlobal = useSelector(selectCriteria);
  const [qualityOverall, setQualityOverall] = useState(0);
  const [exporting, setExporting] = useState(false);

  // Fetch KPI overall stats for performance score
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stats = await qualityService.fetchStats();
        if (!cancelled) setQualityOverall(Number(stats?.overallScore || 0));
      } catch (e) {
        if (!cancelled) setQualityOverall(0);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Run frontend diagnostics in development to help verify backend connectivity
  useEffect(() => {
    if ((process.env.NODE_ENV || 'development') !== 'production') {
      (async () => {
        try {
          await diagnosticService.runFrontendDiagnostics();
        } catch (e) {
          console.error('Diagnostics failed', e);
        }
      })();
    }
  }, []);

  const criteriaCompleted = accreditation?.summary?.criteriaCompleted || 0;
  const totalCriteria = accreditation?.summary?.totalCriteria || (criteriaGlobal?.length || 0);
  const documentsReady = totalCriteria ? Math.round((criteriaCompleted / totalCriteria) * 100) : 0;
  const averageCriteriaProgress = criteriaGlobal?.length ? Math.round(criteriaGlobal.reduce((s,c)=> s + (c.progress||0), 0) / criteriaGlobal.length) : 0;
  const spName = accreditation?.cycle?.study_program?.name || 'Program Studi';
  const accStatus = accreditation?.summary?.grade || '-';
  const accScore = Number(accreditation?.summary?.currentScore || 0);

  // Compose dashboard data from backend-provided slices & services
  const dashboardData = {
    ppepp: {
      currentCycle: accreditation?.cycle?.cycle_label || accreditation?.cycle?.year || 'Siklus Berjalan',
      progress: averageCriteriaProgress,
      nextDeadline: accreditation?.cycle?.deadline || accreditation?.cycle?.next_deadline || null,
      completedPhases: accreditation?.summary?.completedPhases || 0,
      totalPhases: accreditation?.summary?.totalPhases || 0
    },
    accreditation: {
      status: accStatus,
      score: accScore,
      nextVisit: accreditation?.cycle?.next_visit || accreditation?.cycle?.visited_at || null,
      documentsReady,
      criteriaCompleted,
      totalCriteria
    },
    evidence: {
      totalEvidence: institution?.totals?.allDocs || institution?.totals?.allDocs || 0,
      validated: institution?.totals?.validatedDocs || 0,
      pending: Math.max((institution?.totals?.allDocs || 0) - (institution?.totals?.validatedDocs || 0), 0),
      rejected: institution?.totals?.rejectedDocs || 0,
      thisMonth: institution?.totals?.thisMonth || 0
    },
    studyProgram: {
      name: spName,
      students: institution?.totals?.students || institution?.totals?.studyPrograms || 0,
      lecturers: institution?.totals?.lecturers || institution?.totals?.faculty || 0,
      courses: institution?.totals?.courses || 0,
      gpa: accreditation?.summary?.avgGpa || 0
    },
    performance: {
      qualityScore: qualityOverall,
      improvementTrend: accreditation?.summary?.improvementTrend || 0,
      benchmarkPosition: accreditation?.summary?.benchmarkPosition || 0
    }
  };

  // Enhanced statistics cards with more details
  const statsCards = [
    {
      title: 'Progress PPEPP',
      value: `${dashboardData.ppepp.progress}%`,
      subValue: `${dashboardData.ppepp.completedPhases}/${dashboardData.ppepp.totalPhases} Fase`,
      icon: <TrophyIcon className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-blue-500 to-blue-700',
      trend: '+5%',
      trendDirection: 'up',
      description: 'Siklus PPEPP semester ini'
    },
    {
      title: 'Dokumen Bukti',
      value: dashboardData.evidence.totalEvidence,
      subValue: `+${dashboardData.evidence.thisMonth} bulan ini`,
      icon: <DocumentTextIcon className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-slate-500 to-slate-700',
      trend: '+12',
      trendDirection: 'up',
      description: 'Total dokumen evidensi'
    },
    {
      title: 'Skor Akreditasi',
      value: dashboardData.accreditation.score,
      subValue: `Grade ${dashboardData.accreditation.status}`,
      icon: <AcademicCapIcon className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-green-500 to-green-700',
      trend: 'Excellent',
      trendDirection: 'up',
      description: 'Prediksi akreditasi saat ini'
    },
    {
      title: 'Mahasiswa Aktif',
      value: dashboardData.studyProgram.students,
      subValue: `IPK Rata-rata ${dashboardData.studyProgram.gpa}`,
      icon: <UsersIcon className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-amber-500 to-amber-700',
      trend: '+45',
      trendDirection: 'up',
      description: 'Mahasiswa semester ini'
    }
  ];

  const performanceMetrics = [
    {
      label: 'Mutu Akademik',
      value: dashboardData.performance.qualityScore,
      max: 100,
      color: 'bg-blue-500',
      improvement: '+0%'
    },
    {
      label: 'Kelengkapan Dokumen',
      value: dashboardData.accreditation.documentsReady,
      max: 100,
      color: 'bg-green-500',
      improvement: '+0%'
    },
    {
      label: 'Keterlibatan Dosen',
      value: institution?.activities?.activeProjects || 0,
      max: 100,
      color: 'bg-slate-500',
      improvement: '+0%'
    },
    {
      label: 'Validasi Evidensi',
      value: dashboardData.evidence.totalEvidence ? Math.round((dashboardData.evidence.validated / dashboardData.evidence.totalEvidence) * 100) : 0,
      max: 100,
      color: 'bg-amber-500',
      improvement: '+0%'
    }
  ];

  const recentActivities = institution?.activities?.recentActivities || [];

  const [upcomingTasks, setUpcomingTasks] = useState([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await ppeppService.actions.list({ limit: 5, order: 'due_date:ASC', status: 'open' });
        const rows = res?.rows || [];
        const mapped = rows.map(r => ({
          id: r.action_id,
          title: r.title,
          description: r.description || r.phase,
          dueDate: r.due_date || r.created_at,
          priority: r.status === 'open' ? 'high' : (r.status === 'in_progress' ? 'medium' : 'low'),
          progress: r.progress || 0
        }));
        if (!cancelled) setUpcomingTasks(mapped);
      } catch {
        if (!cancelled) setUpcomingTasks([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const accreditationProgress = criteriaGlobal.map(c => ({
    criteria: c.code.replace('K','Kriteria '),
    name: c.name,
    progress: c.progress,
    status: c.status
  }));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return colors.badgeCompleted;
      case 'in-progress':
        return colors.badgeProgress;
      case 'pending':
        return colors.badgePending;
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-amber-500 bg-amber-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const onExportLED = async () => {
    if (!accreditation?.cycle?.cycle_id) return;
    try {
      setExporting(true);
      const response = await exportLEDExcel(accreditation.cycle.cycle_id);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `led-${accreditation?.cycle?.instrument_type || 'instrument'}-${accreditation?.cycle?.year || ''}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Enhanced Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Koordinator Program Studi
            </h1>
            <p className="text-gray-600">
              Program Studi {dashboardData.studyProgram.name} - Monitoring Mutu Akademik
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <CalendarDaysIcon className="h-4 w-4 mr-1" />
              Update terakhir: {new Date().toLocaleDateString('id-ID')}
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <select 
              value={activeTimeRange}
              onChange={(e) => setActiveTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
              <option value="semester">Semester Ini</option>
              <option value="year">Tahun Ini</option>
            </select>
            
            <ButtonPrimary className="flex items-center px-4 py-2" onClick={onExportLED} disabled={exporting}>
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              {exporting ? 'Mengekspor…' : 'Export LED (.xlsx)'}
            </ButtonPrimary>
          </div>
        </div>

        {/* Quick Overview Banner */}
  <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-2">Status Akreditasi</h3>
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-3xl font-bold">{dashboardData.accreditation.status}</span>
                <span className="ml-2 text-sm opacity-90">({dashboardData.accreditation.score}/4.0)</span>
              </div>
              <p className="text-sm opacity-90 mt-1">Target: A (3.6+)</p>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Kriteria Selesai</h3>
              <div className="text-3xl font-bold">
                {dashboardData.accreditation.criteriaCompleted}/{dashboardData.accreditation.totalCriteria}
              </div>
              <p className="text-sm opacity-90 mt-1">
                {Math.round((dashboardData.accreditation.criteriaCompleted/dashboardData.accreditation.totalCriteria) * 100)}% Complete
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <h3 className="text-lg font-semibold mb-2">Visitasi Berikutnya</h3>
              <div className="text-xl font-bold">{new Date(dashboardData.accreditation.nextVisit).toLocaleDateString('id-ID')}</div>
              <p className="text-sm opacity-90 mt-1">
                {Math.ceil((new Date(dashboardData.accreditation.nextVisit) - new Date()) / (1000 * 60 * 60 * 24))} hari lagi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div
            key={index}
    className={`${tokenClasses.card} hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.color} text-white shadow-lg`}>
                {card.icon}
              </div>
              <div className="flex items-center text-sm font-medium">
                <ArrowTrendingUpIcon className={`h-4 w-4 mr-1 ${card.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                <span className={card.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {card.trend}
                </span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {card.value}
            </h3>
            <p className="text-sm text-gray-600 font-medium">{card.title}</p>
            <p className="text-xs text-gray-500 mt-1">{card.subValue}</p>
            <p className="text-xs text-gray-400 mt-2">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Performance Metrics */}
        <div className="xl:col-span-2">
          <div className={tokenClasses.card}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Metrik Kinerja Real-time</h2>
              <div className="flex items-center space-x-3">
                {accreditation?.summary?.grade && (
                  <div className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full" title="Projection">
                    Proyeksi: {accreditation.summary.grade} {accreditation.summary.currentScore}
                  </div>
                )}
                <ChartPieIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">{metric.value}%</span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {metric.improvement}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${metric.color} transition-all duration-1000`}
                      style={{ width: `${(metric.value / metric.max) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Target: {metric.max}%</span>
                    <span>Bulan lalu: {metric.value - parseInt(metric.improvement.replace('+', '').replace('%', ''))}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{dashboardData.performance.qualityScore}%</div>
                  <div className="text-xs text-blue-700">Rata-rata Kinerja</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">+0%</div>
                  <div className="text-xs text-green-700">Peningkatan</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">#-</div>
                  <div className="text-xs text-amber-700">Ranking Fakultas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Notifications & Tasks */}
  <div className={tokenClasses.card}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Peringatan & Task</h2>
            <div className="flex items-center space-x-2">
              <BellIcon className="h-6 w-6 text-amber-600" />
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {upcomingTasks.filter(task => task.priority === 'high').length}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <div key={task.id} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(task.priority)}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority === 'high' ? 'Tinggi' : task.priority === 'medium' ? 'Sedang' : 'Rendah'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3">{task.description}</p>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString('id-ID')}</span>
                  <span className="font-medium">{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 7 ? 'bg-red-100 text-red-700' :
                    Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 14 ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} hari lagi
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors duration-200">
            <PlusIcon className="h-5 w-5 mx-auto mb-1" />
            Tambah Task Baru
          </button>
        </div>
      </div>

      {/* PPEPP Progress Detailed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Enhanced PPEPP Progress */}
  <div className={tokenClasses.card}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Progress PPEPP Detail</h2>
            <TrophyIcon className="h-6 w-6 text-blue-600" />
          </div>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{dashboardData.ppepp.progress}%</div>
              <p className="text-gray-600">Progress Keseluruhan Siklus PPEPP</p>
            </div>
            
            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-1000 relative"
                  style={{ width: `${dashboardData.ppepp.progress}%` }}
                >
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xs font-bold">
                    {dashboardData.ppepp.progress}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-xs text-center">
              <div className="text-green-600 font-medium">Penetapan</div>
              <div className="text-green-600 font-medium">Pelaksanaan</div>
              <div className="text-blue-600 font-bold">Evaluasi</div>
              <div className="text-gray-400">Peningkatan</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-xs font-medium">Penetapan</p>
                <p className="text-xs text-green-600">100% Selesai</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-xs font-medium">Pelaksanaan</p>
                <p className="text-xs text-green-600">100% Selesai</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg border-2 border-blue-300">
                <ClockIcon className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-medium">Evaluasi</p>
                <p className="text-xs text-blue-600">75% Progress</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <CalendarDaysIcon className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs font-medium">Peningkatan</p>
                <p className="text-xs text-gray-500">0% Menunggu</p>
              </div>
            </div>

            {/* PPEPP Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Detail Monitoring</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mata Kuliah Termonitor:</span>
                  <span className="font-medium">{dashboardData.studyProgram.courses}/42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dosen Terlibat:</span>
                  <span className="font-medium">{dashboardData.studyProgram.lecturers}/25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deadline Berikutnya:</span>
                  <span className="font-medium text-amber-600">{new Date(dashboardData.ppepp.nextDeadline).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accreditation Criteria Progress */}
  <div className={tokenClasses.card}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Progress Kriteria Akreditasi</h2>
            <AcademicCapIcon className="h-6 w-6 text-green-600" />
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {accreditationProgress.map((criteria, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{criteria.criteria}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(criteria.status)}`}>
                      {criteria.status === 'completed' ? 'Selesai' : 
                       criteria.status === 'in-progress' ? 'Progress' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{criteria.name}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          criteria.progress >= 80 ? 'bg-green-500' :
                          criteria.progress >= 60 ? 'bg-blue-500' :
                          criteria.progress >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${criteria.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-12">{criteria.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">{accreditationProgress.filter(c => c.status === 'completed').length}</div>
                <div className="text-xs text-green-700">Selesai</div>
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">{accreditationProgress.filter(c => c.status === 'in-progress').length}</div>
                <div className="text-xs text-blue-700">Progress</div>
              </div>
              <div className="p-2 bg-amber-50 rounded">
                <div className="text-lg font-bold text-amber-600">{accreditationProgress.filter(c => c.status === 'pending').length}</div>
                <div className="text-xs text-amber-700">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Enhanced Recent Activities */}
  <div className={`xl:col-span-2 ${tokenClasses.card}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Aktivitas Terkini</h2>
            <div className="flex items-center space-x-2">
              <BellIcon className="h-6 w-6 text-slate-600" />
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {(institution?.alerts || []).filter(a => a.priority === 'high').length}
              </span>
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`flex items-start space-x-4 p-4 rounded-lg border-l-4 ${getPriorityColor(activity.priority)} hover:shadow-sm transition-all duration-200`}>
                <div className="flex-shrink-0 mt-1">
                  <ChartBarIcon className="h-6 w-6 text-slate-600" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">{activity.title}</p>
                      <p className="text-xs text-gray-600 mb-2">{activity.type}</p>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700`}>
                          Aktivitas
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
              Lihat Semua Aktivitas
            </button>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default KaprodiDashboard;

