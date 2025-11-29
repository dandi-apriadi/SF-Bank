import React, { useState, useEffect } from 'react';
import { 
  FiClock, 
  FiPlay, 
  FiPause,
  FiCalendar,
  FiRepeat,
  FiMail,
  FiUsers,
  FiSettings,
  FiFileText,
  FiEdit,
  FiTrash2,
  FiPlusCircle,
  FiCopy,
  FiEye,
  FiDownload
} from 'react-icons/fi';
import Widget from "components/widget/Widget";

const AutomatedReports = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  const [automatedReports, setAutomatedReports] = useState([
    {
      id: 1,
      name: 'Daily Operations Summary',
      description: 'Daily overview of key operational metrics and activities',
      frequency: 'daily',
      time: '08:00',
      status: 'active',
      nextRun: '2024-08-09 08:00',
      lastRun: '2024-08-08 08:00',
      lastStatus: 'success',
      recipients: ['director@university.edu', 'operations@university.edu'],
      template: 'operations_summary',
      format: 'pdf',
      sections: ['Key Metrics', 'Daily Activities', 'Alerts', 'Next Day Priorities'],
      generationTime: '1.2s',
      reportSize: '850 KB',
      views: 156
    },
    {
      id: 2,
      name: 'Weekly Performance Dashboard',
      description: 'Comprehensive weekly performance analysis across all departments',
      frequency: 'weekly',
      time: '09:00',
      dayOfWeek: 'monday',
      status: 'active',
      nextRun: '2024-08-12 09:00',
      lastRun: '2024-08-05 09:00',
      lastStatus: 'success',
      recipients: ['director@university.edu', 'vp-academic@university.edu', 'deans@university.edu'],
      template: 'performance_dashboard',
      format: 'pdf',
      sections: ['Executive Summary', 'Department Performance', 'Quality Metrics', 'Financial Overview'],
      generationTime: '3.8s',
      reportSize: '2.1 MB',
      views: 89
    },
    {
      id: 3,
      name: 'Monthly Quality Report',
      description: 'Detailed monthly analysis of quality indicators and compliance status',
      frequency: 'monthly',
      time: '10:00',
      dayOfMonth: 1,
      status: 'active',
      nextRun: '2024-09-01 10:00',
      lastRun: '2024-08-01 10:00',
      lastStatus: 'success',
      recipients: ['director@university.edu', 'quality@university.edu', 'accreditation@university.edu'],
      template: 'quality_comprehensive',
      format: 'pdf',
      sections: ['Quality Overview', 'Accreditation Status', 'Compliance Tracking', 'Improvement Plans'],
      generationTime: '5.2s',
      reportSize: '4.3 MB',
      views: 234
    },
    {
      id: 4,
      name: 'Quarterly Executive Summary',
      description: 'High-level quarterly review for executive leadership and board',
      frequency: 'quarterly',
      time: '14:00',
      status: 'active',
      nextRun: '2024-10-01 14:00',
      lastRun: '2024-07-01 14:00',
      lastStatus: 'success',
      recipients: ['board@university.edu', 'director@university.edu', 'senior-team@university.edu'],
      template: 'executive_quarterly',
      format: 'pdf',
      sections: ['Strategic Overview', 'Financial Performance', 'Academic Excellence', 'Future Outlook'],
      generationTime: '12.5s',
      reportSize: '8.7 MB',
      views: 67
    },
    {
      id: 5,
      name: 'Research Output Tracker',
      description: 'Weekly tracking of research publications and grant activities',
      frequency: 'weekly',
      time: '16:00',
      dayOfWeek: 'friday',
      status: 'paused',
      nextRun: null,
      lastRun: '2024-07-26 16:00',
      lastStatus: 'failed',
      recipients: ['research@university.edu', 'vp-research@university.edu'],
      template: 'research_tracker',
      format: 'excel',
      sections: ['Publications Summary', 'Grant Status', 'Collaboration Updates', 'Metrics Dashboard'],
      generationTime: '2.8s',
      reportSize: '1.5 MB',
      views: 45
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'paused':
        return 'text-amber-600 bg-amber-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getLastStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'warning':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  const getFrequencyIcon = (frequency) => {
    switch (frequency) {
      case 'daily':
        return <FiClock className="w-4 h-4 text-blue-600" />;
      case 'weekly':
        return <FiCalendar className="w-4 h-4 text-purple-600" />;
      case 'monthly':
        return <FiRepeat className="w-4 h-4 text-green-600" />;
      case 'quarterly':
        return <FiRepeat className="w-4 h-4 text-indigo-600" />;
      default:
        return <FiClock className="w-4 h-4 text-gray-600" />;
    }
  };

  const AutomatedReportCard = ({ report }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          {getFrequencyIcon(report.frequency)}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{report.name}</h3>
            <p className="text-gray-600 text-sm">{report.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
            {report.status}
          </span>
          {report.status === 'active' && (
            <button className="p-1 text-amber-600 hover:bg-amber-100 rounded">
              <FiPause className="w-4 h-4" />
            </button>
          )}
          {report.status === 'paused' && (
            <button className="p-1 text-green-600 hover:bg-green-100 rounded">
              <FiPlay className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="block text-gray-500">Frequency</span>
          <span className="font-medium capitalize">{report.frequency} at {report.time}</span>
        </div>
        <div>
          <span className="block text-gray-500">Recipients</span>
          <span className="font-medium">{report.recipients.length} recipients</span>
        </div>
        <div>
          <span className="block text-gray-500">Next Run</span>
          <span className="font-medium">
            {report.nextRun ? new Date(report.nextRun).toLocaleString('id-ID') : 'Paused'}
          </span>
        </div>
        <div>
          <span className="block text-gray-500">Last Status</span>
          <span className={`font-medium capitalize ${getLastStatusColor(report.lastStatus)}`}>
            {report.lastStatus}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-center">
        <div>
          <div className="font-bold text-blue-600">{report.generationTime}</div>
          <div className="text-gray-600 text-xs">Gen Time</div>
        </div>
        <div>
          <div className="font-bold text-purple-600">{report.reportSize}</div>
          <div className="text-gray-600 text-xs">File Size</div>
        </div>
        <div>
          <div className="font-bold text-green-600">{report.views}</div>
          <div className="text-gray-600 text-xs">Views</div>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Report Sections</h4>
        <div className="flex flex-wrap gap-1">
          {report.sections.map((section, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              {section}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button 
          className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
          onClick={() => setSelectedReport(report)}
        >
          <FiEye className="w-4 h-4 mr-1" />
          Preview
        </button>
        <button className="flex items-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
          <FiDownload className="w-4 h-4 mr-1" />
          Latest
        </button>
        <button className="flex items-center px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm">
          <FiEdit className="w-4 h-4 mr-1" />
          Edit
        </button>
        <button className="flex items-center px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm">
          <FiCopy className="w-4 h-4 mr-1" />
          Clone
        </button>
      </div>
    </div>
  );

  const CreateReportForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Create Automated Report</h3>
          <button 
            onClick={() => setShowCreateForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter report name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
              placeholder="Describe the report purpose and content"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input 
                type="time" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
            <textarea 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
              placeholder="Enter email addresses separated by commas"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="executive_summary">Executive Summary</option>
                <option value="performance_dashboard">Performance Dashboard</option>
                <option value="quality_report">Quality Report</option>
                <option value="financial_overview">Financial Overview</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="word">Word</option>
                <option value="html">HTML</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button 
              type="submit" 
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Report
            </button>
            <button 
              type="button" 
              onClick={() => setShowCreateForm(false)}
              className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
  <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Automated Reports</h1>
              <p className="text-gray-600">
                Manage and monitor scheduled report generation and distribution
              </p>
            </div>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlusCircle className="w-5 h-5 mr-2" />
              Create Automated Report
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{automatedReports.length}</div>
            <div className="text-sm text-gray-600">Total Reports</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {automatedReports.filter(r => r.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-amber-600 mb-1">
              {automatedReports.filter(r => r.status === 'paused').length}
            </div>
            <div className="text-sm text-gray-600">Paused</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {automatedReports.filter(r => r.lastStatus === 'success').length}
            </div>
            <div className="text-sm text-gray-600">Successful</div>
          </div>
        </div>

        {/* Automated Reports List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {automatedReports.map((report) => (
            <AutomatedReportCard key={report.id} report={report} />
          ))}
        </div>

        {/* Execution Schedule */}
  <Widget extra="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Execution Schedule</h2>
            <FiCalendar className="w-6 h-6 text-gray-500" />
          </div>
          
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Interactive schedule calendar</p>
              <p className="text-gray-400 text-sm mt-2">Visual timeline of report generation schedule</p>
            </div>
          </div>
        </Widget>

        {/* Create Report Form Modal */}
        {showCreateForm && <CreateReportForm />}
      </div>
    </div>
  );
};

export default AutomatedReports;


