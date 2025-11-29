import React, { useEffect, useState } from 'react';
import { 
  FiFileText, 
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiBarChart,
  FiPieChart,
  FiActivity,
  FiEye
} from 'react-icons/fi';
import Widget from "components/widget/Widget";
import Button from 'components/button/Button';
import { reportsService } from 'services/reportsService';
import { API_BASE_URL } from 'services/api';

const ExecutiveReports = () => {
  const [summaryMetrics, setSummaryMetrics] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [reportTemplates, setReportTemplates] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [kpiStats, setKpiStats] = useState(null);


  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        
        const [ov, rec, templates, schedules] = await Promise.all([
          reportsService.fetchOverview(),
          reportsService.fetchRecent(),
          reportsService.fetchTemplates(),
          reportsService.fetchSchedules()
        ]);
        if (!mounted) return;
        setSummaryMetrics(ov?.summaryMetrics || null);
        setKpiStats(ov?.kpiStats || null);
        setRecentReports(rec?.recentReports || []);
        setReportTemplates(templates?.reportTemplates || []);
        setScheduledReports(schedules?.scheduledReports || []);
      } catch (_e) {
        if (!mounted) return;
        setSummaryMetrics(null);
        setRecentReports([]);
      } finally {
        // no-op
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'text-green-600 bg-green-100';
      case 'generating':
        return 'text-blue-600 bg-blue-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'scheduled':
        return 'text-amber-600 bg-amber-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'quality':
        return <FiTrendingUp className="w-5 h-5 text-blue-600" />;
      case 'performance':
        return <FiBarChart className="w-5 h-5 text-purple-600" />;
      case 'accreditation':
        return <FiActivity className="w-5 h-5 text-green-600" />;
      case 'finance':
        return <FiPieChart className="w-5 h-5 text-indigo-600" />;
      case 'research':
        return <FiFileText className="w-5 h-5 text-amber-600" />;
      default:
        return <FiFileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const ReportCard = ({ report }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
              {getCategoryIcon(report.category)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
            <p className="text-gray-600 font-medium">{report.period}</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <FiCalendar className="w-4 h-4 mr-1" />
              Generated: {new Date(report.generatedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(report.status)}`}>
          {report.status}
        </span>
      </div>
      
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {report.size && report.size !== '-' && (
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">{report.size}</div>
            <div className="text-sm text-gray-600 font-medium">File Size</div>
          </div>
        )}
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-gray-900">{report.views}</div>
          <div className="text-sm text-gray-600 font-medium">Views</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-gray-900">{report.recipients.length}</div>
          <div className="text-sm text-gray-600 font-medium">Recipients</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-blue-600 capitalize">{report.type}</div>
          <div className="text-sm text-gray-600 font-medium">Type</div>
        </div>
      </div>
      
      {report.keyInsights && report.keyInsights.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Key Insights</h4>
          <div className="space-y-3">
            {report.keyInsights.slice(0, 3).map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 font-medium">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        {report.file_url && (
          <button
            onClick={async () => {
              try {
                const fullUrl = (report.file_url || '').startsWith('/api') ? `${API_BASE_URL}${report.file_url}` : report.file_url;
                const resp = await fetch(fullUrl, { credentials: 'include' });
                if (!resp.ok) throw new Error(`Download failed: ${resp.status}`);
                const disposition = resp.headers.get('content-disposition') || '';
                let filename = 'report-download';
                const match = /filename\*=UTF-8''([^;\\n]+)/i.exec(disposition) || /filename="?([^";\\n]+)"?/i.exec(disposition);
                if (match && match[1]) filename = decodeURIComponent(match[1]);
                const blob = await resp.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } catch (err) {
                console.error('Download error', err);
                // fallback: open in new tab
                const fullUrl = (report.file_url || '').startsWith('/api') ? `${API_BASE_URL}${report.file_url}` : report.file_url;
                window.open(fullUrl, '_blank');
              }
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold"
          >
            <FiFileText className="w-4 h-4 mr-2" />
            Download
          </button>
        )}

        <div className="flex items-center text-sm text-gray-600 ml-2">
          <FiClock className="w-4 h-4 mr-1" />
          {report.generatedDate ? new Date(report.generatedDate).toLocaleString('id-ID') : '-'}
        </div>

        <div className="flex items-center text-sm text-gray-600 ml-2">
          <FiEye className="w-4 h-4 mr-1" />
          {report.views}
        </div>

        {report.status === 'generating' && (
          <div className="flex items-center justify-center px-6 py-3 bg-blue-100 text-blue-700 rounded-xl font-semibold">
            <div className="w-5 h-5 bg-blue-600 rounded-full mr-2"></div>
            Generating Report...
          </div>
        )}
      </div>
    </div>
  );

  

  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Modern Header with Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Executive Reports</h1>
              <p className="text-gray-600 text-lg">
                Comprehensive reporting dashboard for institutional insights and decision support
              </p>
              <div className="flex items-center mt-3 text-sm text-gray-500">
                <FiCalendar className="w-4 h-4 mr-2" />
                Updated: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" size="md">
                  <FiFileText className="w-5 h-5" />
                  <span>Create Report</span>
                </Button>
                <Button variant="success" size="md">
                  <FiClock className="w-5 h-5" />
                  <span>Schedule</span>
                </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Summary Metrics */}
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <FiFileText className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{summaryMetrics ? summaryMetrics.totalReports : '-'}</div>
            <div className="text-sm font-medium text-gray-600">Total Reports</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <FiActivity className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{summaryMetrics ? summaryMetrics.automatedReports : '-'}</div>
            <div className="text-sm font-medium text-gray-600">Automated</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <FiPieChart className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{summaryMetrics ? summaryMetrics.customReports : '-'}</div>
            <div className="text-sm font-medium text-gray-600">Custom</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-amber-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <FiClock className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{summaryMetrics ? summaryMetrics.scheduledReports : '-'}</div>
            <div className="text-sm font-medium text-gray-600">Scheduled</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <FiEye className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{summaryMetrics ? summaryMetrics.recentViews : '-'}</div>
            <div className="text-sm font-medium text-gray-600">Views (30d)</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-teal-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{summaryMetrics ? summaryMetrics.avgGenerationTime : '-'}</div>
            <div className="text-sm font-medium text-gray-600">Avg Gen Time</div>
          </div>
        </div>
        
        {kpiStats && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">KPI Summary</h3>
            <div className="flex flex-wrap gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{kpiStats.total}</div>
                <div className="text-sm text-gray-600">Total KPIs</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold">{kpiStats.good}</div>
                <div className="text-sm text-gray-600">Good</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold">{kpiStats.warning}</div>
                <div className="text-sm text-gray-600">Warning</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold">{kpiStats.critical}</div>
                <div className="text-sm text-gray-600">Critical</div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold">{kpiStats.overallScore}</div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4">Report Templates</h3>
            {reportTemplates.length === 0 ? (
              <p className="text-gray-600">No templates available.</p>
            ) : (
              <ul className="space-y-3">
                {reportTemplates.map(t => (
                  <li key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.type} • v{t.version_no}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Use</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4">Scheduled Reports</h3>
            {scheduledReports.length === 0 ? (
              <p className="text-gray-600">No scheduled reports.</p>
            ) : (
              <ul className="space-y-3">
                {scheduledReports.map(s => (
                  <li key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold">{s.type}</div>
                      <div className="text-sm text-gray-500">{s.status} • {s.created_at ? new Date(s.created_at).toLocaleString('id-ID') : '-'}</div>
                    </div>
                    <div className="text-sm text-gray-600">{s.summary || '-'}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        

        {/* Recent Reports Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Recent Reports</h2>
              <p className="text-gray-600 text-lg">Latest generated reports and insights</p>
            </div>
            {/* Header action removed per requirement */}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {recentReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>

        

        
      </div>
    </div>
  );
};

export default ExecutiveReports;