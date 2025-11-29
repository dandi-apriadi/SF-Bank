import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstitutionMetrics } from 'store/slices/institutionSlice';
import {
  FiTrendingUp,
  FiCheckCircle,
  FiFileText,
  FiUsers,
  FiClock,
  FiBarChart,
  FiAlertTriangle,
  FiBell,
  FiEye,
  FiEdit,
  FiDownload,
  FiFilter,
  FiCalendar,
  FiTarget,
  FiActivity
} from 'react-icons/fi';
import Card from 'components/card';

const UnitDashboard = () => {
  const dispatch = useDispatch();
  const institution = useSelector(state => state.institution.data);
  const evidence = useSelector(state => state.evidence.data);
  const progress = useSelector(state => state.progress.data);
  const stats = {
    totalPrograms: institution?.totals.studyPrograms || 0,
    validatedDocs: evidence?.totals?.validated || 0,
    pendingValidation: (evidence?.totals?.all || 0) - (evidence?.totals?.validated || 0),
    activeActions: institution?.activities.activeProjects || 0,
    complianceRate: institution?.quality.complianceRate || 0,
    qualityScore: institution?.quality.qualityScore || 0
  };

  const alerts = institution?.alerts || [];
  const recentActivities = institution?.activities?.recentActivities || [];

  useEffect(()=>{ if(!institution) dispatch(fetchInstitutionMetrics()); }, [institution, dispatch]);

  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      
      {/* Statistics Overview */}
      <div className="col-span-1 h-fit w-full xl:col-span-2 2xl:col-span-3">
  <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-700">University-wide Quality Management</h2>
          <p className="text-slate-600">Monitor and manage academic quality across all study programs</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {/* Total Programs */}
          <Card extra="!flex-row flex-grow items-center rounded-lg">
            <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
              <div className="rounded-full bg-blue-100 p-3">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                <p className="font-dm text-sm font-medium text-slate-600">Program Studi</p>
                <h4 className="text-xl font-bold text-slate-700">{stats.totalPrograms}</h4>
              </div>
            </div>
          </Card>

          {/* Validated Documents */}
          <Card extra="!flex-row flex-grow items-center rounded-lg">
            <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
              <div className="rounded-full bg-green-100 p-3">
                <FiCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                <p className="font-dm text-sm font-medium text-slate-600">Dokumen Tervalidasi</p>
                <h4 className="text-xl font-bold text-slate-700">{stats.validatedDocs}</h4>
              </div>
            </div>
          </Card>

          {/* Pending Validation */}
          <Card extra="!flex-row flex-grow items-center rounded-lg">
            <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
              <div className="rounded-full bg-amber-100 p-3">
                <FiClock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                <p className="font-dm text-sm font-medium text-slate-600">Menunggu Validasi</p>
                <h4 className="text-xl font-bold text-slate-700">{stats.pendingValidation}</h4>
              </div>
            </div>
          </Card>

          {/* Active Actions */}
          <Card extra="!flex-row flex-grow items-center rounded-lg">
            <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
              <div className="rounded-full bg-purple-100 p-3">
                <FiActivity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                <p className="font-dm text-sm font-medium text-slate-600">Tindak Lanjut Aktif</p>
                <h4 className="text-xl font-bold text-slate-700">{stats.activeActions}</h4>
              </div>
            </div>
          </Card>

          {/* Compliance Rate */}
          <Card extra="!flex-row flex-grow items-center rounded-lg">
            <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
              <div className="rounded-full bg-blue-100 p-3">
                <FiTarget className="h-6 w-6 text-blue-600" />
              </div>
              <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                <p className="font-dm text-sm font-medium text-slate-600">Tingkat Kepatuhan</p>
                <h4 className="text-xl font-bold text-slate-700">{stats.complianceRate}%</h4>
              </div>
            </div>
          </Card>

          {/* Quality Score */}
          <Card extra="!flex-row flex-grow items-center rounded-lg">
            <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
              <div className="rounded-full bg-green-100 p-3">
                <FiTrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                <p className="font-dm text-sm font-medium text-slate-600">Skor Kualitas</p>
                <h4 className="text-xl font-bold text-slate-700">{stats.qualityScore}/100</h4>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Alerts & Notifications */}
  <Card extra="pb-7 p-[20px]">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-slate-700">Alerts & Notifications</h4>
          <FiBell className="h-5 w-5 text-slate-600" />
        </div>
        <div className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start space-x-3 rounded-lg border border-slate-200 p-3">
              <div className={`rounded-full p-1 ${
                alert.priority === 'high' ? 'bg-red-100' : 
                alert.priority === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
              }`}>
                <FiAlertTriangle className={`h-4 w-4 ${
                  alert.priority === 'high' ? 'text-red-600' : 
                  alert.priority === 'medium' ? 'text-amber-600' : 'text-blue-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{alert.message}</p>
                {alert.dueDate && (
                  <p className="text-xs text-slate-500">Due: {new Date(alert.dueDate).toLocaleDateString('id-ID')}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activities */}
  <Card extra="pb-7 p-[20px] xl:col-span-1 2xl:col-span-2">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-slate-700">Recent Activities</h4>
          <div className="flex items-center space-x-2">
            <FiFilter className="h-4 w-4 text-slate-600" />
            <FiEye className="h-4 w-4 text-slate-600" />
          </div>
        </div>
        <div className="mt-4 space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={activity.id} className="flex items-start space-x-3 border-l-2 border-slate-200 pl-4">
              <div className={`rounded-full p-2 ${
                activity.type === 'validation' ? 'bg-green-100' :
                activity.type === 'action' ? 'bg-blue-100' :
                activity.type === 'report' ? 'bg-purple-100' : 'bg-amber-100'
              }`}>
                {activity.type === 'validation' ? <FiCheckCircle className="h-4 w-4 text-green-600" /> :
                 activity.type === 'action' ? <FiActivity className="h-4 w-4 text-blue-600" /> :
                 activity.type === 'report' ? <FiFileText className="h-4 w-4 text-purple-600" /> :
                 <FiBell className="h-4 w-4 text-amber-600" />}
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-slate-700">{activity.title}</h5>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm text-slate-500">{activity.user}</span>
                  <span className="text-xs text-slate-400">{activity.timestamp}</span>
                </div>
                <span className={`mt-1 inline-block rounded-full px-2 py-1 text-xs ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                  activity.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {activity.status === 'completed' ? 'Selesai' :
                   activity.status === 'in-progress' ? 'Berlangsung' : 'Peringatan'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default UnitDashboard;

