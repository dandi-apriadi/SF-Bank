import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstitutionMetrics } from 'store/slices/institutionSlice';
import { qualityService } from 'services/qualityService';
import { 
  FiUsers, 
  FiAward, 
  FiTarget,
  FiCheckCircle,
  FiAlertTriangle,
  FiActivity,
  FiDownload,
  FiRefreshCw,
  FiArrowUpRight,
  FiArrowDownRight,
  FiBook
} from 'react-icons/fi';

const DirectorDashboard = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(state => state.institution);
  // Map backend-provided dashboard payload into UI-friendly shape
  const dashboardData = data ? {
    totalStudyPrograms: Number(data?.totals?.studyPrograms ?? 0),
    accreditedPrograms: Number(data?.totals?.accreditedPrograms ?? 0),
    qualityScore: Number(data?.quality?.qualityScore ?? 0),
    complianceRate: Number(data?.quality?.complianceRate ?? 0),
    activeProjects: Number(data?.activities?.activeProjects ?? 0),
    pendingActions: Number(data?.activities?.pendingActions ?? 0),
    totalDocuments: Number(data?.totals?.allDocs ?? 0),
    validatedDocuments: Number(data?.totals?.validatedDocs ?? 0),
    totalFaculty: Number(data?.totals?.faculty ?? 0)
  } : null;
  const studyProgramPerformance = data?.programPerformance || [];
  const alerts = data?.alerts || [];

  // Simple Stat Card Component
  const StatCard = ({ title, value, icon: Icon, color = "blue" }) => (
    <div className="bg-white p-4 border border-gray-200 rounded">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <Icon className={`w-8 h-8 text-${color}-600`} />
      </div>
    </div>
  );

  // Simple Alert Component
  const AlertItem = ({ alert }) => (
    <div className={`p-3 border-l-4 ${
      alert.type === 'urgent' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
    }`}>
      <h4 className="font-medium text-gray-800">{alert.title}</h4>
      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
      <p className="text-xs text-gray-500 mt-1">{alert.department}</p>
    </div>
  );

  useEffect(()=>{ if(!data && !isLoading) dispatch(fetchInstitutionMetrics()); }, [data, isLoading, dispatch]);

  const onRefresh = () => {
    dispatch(fetchInstitutionMetrics());
  };

  const onExport = async () => {
    try {
      const blob = await qualityService.exportExcel('kpis');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kpis.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (_e) {
      // noop; optionally show toast
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Simple Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dashboard PRIMA
          </h1>
          <p className="text-gray-600">
            Platform Integrasi Manajemen Mutu Akademik
          </p>
          <div className="mt-4 flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={onExport}>
              <FiDownload className="w-4 h-4 inline mr-2" />
              Export
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded" onClick={onRefresh}>
              <FiRefreshCw className="w-4 h-4 inline mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Simple Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {!dashboardData && (
            <div className="col-span-4 text-sm text-gray-500">Memuat data institusi...</div>
          )}
          <StatCard
            title="Study Programs"
            value={dashboardData ? dashboardData.totalStudyPrograms.toLocaleString() : '-'}
            icon={FiBook}
            color="purple"
          />
          <StatCard
            title="Documents"
            value={dashboardData ? dashboardData.totalDocuments.toLocaleString() : '-'}
            icon={FiDownload}
            color="blue"
          />
          <StatCard
            title="Validated Documents"
            value={dashboardData ? dashboardData.validatedDocuments.toLocaleString() : '-'}
            icon={FiCheckCircle}
            color="green"
          />
          <StatCard
            title="Quality Score"
            value={dashboardData ? `${dashboardData.qualityScore}%` : '-'}
            icon={FiTarget}
            color="indigo"
          />
          <StatCard
            title="Study Programs"
            value={dashboardData ? dashboardData.totalStudyPrograms : '-'}
            icon={FiBook}
            color="purple"
          />
          <StatCard
            title="Quality Score"
            value={dashboardData ? `${dashboardData.qualityScore}%` : '-'}
            icon={FiTarget}
            color="indigo"
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Accreditation Rate"
            value={dashboardData ? (dashboardData.totalStudyPrograms > 0 && data?.totals?.accreditedPrograms !== undefined ? `${Math.round((data.totals.accreditedPrograms / dashboardData.totalStudyPrograms) * 100)}%` : '-') : '-'}
            icon={FiAward}
            color="green"
          />
          <StatCard
            title="Compliance Rate"
            value={dashboardData ? `${dashboardData.complianceRate}%` : '-'}
            icon={FiCheckCircle}
            color="blue"
          />
          <StatCard
            title="Active Projects"
            value={dashboardData ? dashboardData.activeProjects : '-'}
            icon={FiActivity}
            color="purple"
          />
          <StatCard
            title="Pending Actions"
            value={dashboardData ? dashboardData.pendingActions : '-'}
            icon={FiAlertTriangle}
            color="red"
          />
        </div>

        {/* Study Programs Table */}
        <div className="bg-white border border-gray-200 rounded mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Study Programs Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Program</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Accreditation</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Score</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Students</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Faculty</th>
                </tr>
              </thead>
              <tbody>
                {studyProgramPerformance.map((program, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-800">{program.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        program.accreditation === 'A' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {program.accreditation}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-800">{program.score !== '-' ? `${program.score}%` : '-'}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{program.students ?? '-'}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{program.faculty ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simple Alerts */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Alerts & Notifications</h2>
          </div>
          <div className="p-4 space-y-3">
            {alerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DirectorDashboard;


