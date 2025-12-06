import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiFilter, FiDownload, FiEye, FiX } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const displayTargetType = (type) => {
  if (type === 'resource') return 'Resource (RSS)';
  if (type === 'alliance') return 'Alliance';
  if (type === 'bank') return 'Bank';
  if (type === 'user') return 'User';
  return type || 'Unknown';
};

export default function AuditLogs() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [stats, setStats] = useState({ totalLogs: 0, creates: 0, updates: 0, deletes: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1, limit: 200 });

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [targetTypeFilter, setTargetTypeFilter] = useState("All");
  const [userFilter, setUserFilter] = useState("All");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: 1,
        limit: 500,
      };

      if (searchQuery) params.search = searchQuery;
      if (actionFilter !== "All") params.action = actionFilter;
      if (targetTypeFilter !== "All") params.targetType = targetTypeFilter;
      if (userFilter !== "All") params.userId = userFilter;
      if (dateFromFilter) params.dateFrom = dateFromFilter;
      if (dateToFilter) params.dateTo = dateToFilter;

      const res = await axios.get(`${API_BASE_URL}/api/v1/audit-logs`, {
        params,
        withCredentials: true,
      });

      const logs = (res.data.logs || []).map((log) => ({
        ...log,
        target_name: log.target_name || `${log.target_type || 'target'} #${log.target_id || ''}`,
      }));

      setAuditLogs(logs);
      setPagination({
        page: res.data.page || 1,
        total: res.data.total || logs.length,
        totalPages: res.data.totalPages || 1,
        limit: res.data.limit || params.limit,
      });
    } catch (err) {
      console.error('Fetch audit logs error:', err);
      setError(err.response?.data?.msg || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/audit-logs/statistics`, {
        withCredentials: true,
      });
      setStats({
        totalLogs: res.data.total || 0,
        creates: res.data.creates || 0,
        updates: res.data.updates || 0,
        deletes: res.data.deletes || 0,
      });
    } catch (err) {
      console.error('Fetch audit statistics error:', err);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [actionFilter, targetTypeFilter, userFilter, dateFromFilter, dateToFilter, searchQuery]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Data already filtered by backend
  const filteredLogs = auditLogs;

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  // Detail modal state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const openDetail = (log) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const closeDetail = () => {
    setShowDetailModal(false);
    setSelectedLog(null);
  };

  // Get unique users
  const uniqueUsers = [...new Set(auditLogs.map(log => log.user_id))].map(id => {
    const log = auditLogs.find(l => l.user_id === id);
    return { id, name: log.user_name, email: log.user_email };
  });

  // Format timestamp
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Format time relative
  const formatTimeRelative = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDateTime(dateStr);
  };

  // Get action badge color
  const getActionBadgeColor = (action) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300";
      case "UPDATE":
        return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
      case "DELETE":
        return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300";
    }
  };

  // Get target type icon
  const getTargetTypeIcon = (type) => {
    switch (type) {
      case "user":
        return "👤";
      case "alliance":
        return "🏛️";
      case "bank":
        return "🏦";
      case "resource":
        return "📦";
      default:
        return "📋";
    }
  };

  // Export to CSV (backend)
  const exportToCSV = async () => {
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (actionFilter !== "All") params.action = actionFilter;
      if (targetTypeFilter !== "All") params.targetType = targetTypeFilter;
      if (userFilter !== "All") params.userId = userFilter;
      if (dateFromFilter) params.dateFrom = dateFromFilter;
      if (dateToFilter) params.dateTo = dateToFilter;

      const res = await axios.get(`${API_BASE_URL}/api/v1/audit-logs/export/csv`, {
        params,
        withCredentials: true,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Export CSV error:', err);
      alert(err.response?.data?.msg || 'Failed to export audit logs');
    }
  };

  return (
    <div key={`audit-logs-${isDarkMode}`} className="w-full min-h-full flex flex-col bg-slate-50 transition-colors duration-300" style={{backgroundColor: isDarkMode ? '#111c44' : '#f8fafc'}}>
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Audit Logs</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Track all user activities - insert, edit, and delete operations</p>
        </header>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div data-aos="fade-up" className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-900/40 p-4 border border-gray-100 dark:border-slate-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Logs</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalLogs}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">All recorded activities</div>
          </div>

          <div data-aos="fade-up" data-aos-delay="40" className="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-lg dark:shadow-slate-900/40 p-4 border border-green-200 dark:border-green-800">
            <div className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wider font-semibold">Creates</div>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">{stats.creates}</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">New records added</div>
          </div>

          <div data-aos="fade-up" data-aos-delay="80" className="bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-lg dark:shadow-slate-900/40 p-4 border border-blue-200 dark:border-blue-800">
            <div className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider font-semibold">Updates</div>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">{stats.updates}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Records modified</div>
          </div>

          <div data-aos="fade-up" data-aos-delay="120" className="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-lg dark:shadow-slate-900/40 p-4 border border-red-200 dark:border-red-800">
            <div className="text-xs text-red-600 dark:text-red-400 uppercase tracking-wider font-semibold">Deletes</div>
            <div className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">{stats.deletes}</div>
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">Records removed</div>
          </div>

          <div data-aos="fade-up" data-aos-delay="160" className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl shadow-lg dark:shadow-slate-900/40 p-4 border border-indigo-200 dark:border-indigo-800">
            <div className="text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-semibold">Active Users</div>
            <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mt-2">{uniqueUsers.length}</div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">Performed actions</div>
          </div>
        </section>

        {/* Filters */}
        <section data-aos="fade-up" className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-900/40 p-4 sm:p-6 border border-gray-100 dark:border-slate-700 mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FiFilter className="text-indigo-600 dark:text-indigo-400" />
              Filters & Search
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Search</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="User, target, details..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Action</label>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
              </select>
            </div>

            {/* Target Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Type</label>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">Entity being changed (User, Alliance, Bank, Resource/RSS).</p>
              <select
                value={targetTypeFilter}
                onChange={(e) => {
                  setTargetTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Types</option>
                <option value="user">User</option>
                <option value="alliance">Alliance</option>
                <option value="bank">Bank</option>
                <option value="resource">Resource (RSS)</option>
              </select>
            </div>

            {/* User Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">User</label>
              <select
                value={userFilter}
                onChange={(e) => {
                  setUserFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Users</option>
                {uniqueUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">From Date</label>
              <input
                type="date"
                value={dateFromFilter}
                onChange={(e) => {
                  setDateFromFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">To Date</label>
              <input
                type="date"
                value={dateToFilter}
                onChange={(e) => {
                  setDateToFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredLogs.length} of {auditLogs.length} logs
          </div>
        </section>

        {/* Logs Table */}
        <section data-aos="fade-up" className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-900/40 border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-slate-700/60 sticky top-0">
                <tr className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-center">Action</th>
                  <th className="px-4 py-3 text-left">Target</th>
                  <th className="px-4 py-3 text-left">Details</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">{formatTimeRelative(log.timestamp)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatDateTime(log.timestamp)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">{log.user_name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{log.user_email}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTargetTypeIcon(log.target_type)}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{log.target_name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{displayTargetType(log.target_type)} · ID #{log.target_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-400 max-w-xs truncate">{log.details}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openDetail(log)}
                        className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
                        title="View details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3 p-4">
            {paginatedLogs.map((log) => (
              <div key={log.id} className="bg-gray-50 dark:bg-slate-700/60 rounded-lg p-4 border border-gray-100 dark:border-slate-600">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{log.user_name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{log.user_email}</div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getActionBadgeColor(log.action)}`}>
                    {log.action}
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTargetTypeIcon(log.target_type)}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-400">{log.target_name}</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{displayTargetType(log.target_type)} · ID #{log.target_id}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{log.details}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">{formatDateTime(log.timestamp)}</div>
                </div>
                <button
                  onClick={() => openDetail(log)}
                  className="w-full px-3 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors text-xs font-medium flex items-center justify-center gap-2"
                >
                  <FiEye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages} ({filteredLogs.length} logs)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Prev
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const page = Math.max(1, currentPage - 2) + i;
                    if (page > totalPages) return null;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={closeDetail}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-slate-900/60 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-slate-700">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-700 text-white p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Audit Log Details</h3>
                  <p className="text-indigo-100 text-sm mt-1">Complete activity information</p>
                </div>
                <button
                  onClick={closeDetail}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">User</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{selectedLog.user_name}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">{selectedLog.user_email}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">User ID: {selectedLog.user_id}</div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Timestamp</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{formatDateTime(selectedLog.timestamp)}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">{formatTimeRelative(selectedLog.timestamp)}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">IP: {selectedLog.ip_address}</div>
                  </div>
                </div>

                {/* Action Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Action</div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getActionBadgeColor(selectedLog.action)}`}>
                      {selectedLog.action}
                    </span>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Target Type</div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTargetTypeIcon(selectedLog.target_type)}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{displayTargetType(selectedLog.target_type)}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Target ID</div>
                    <div className="font-semibold text-gray-900 dark:text-white font-mono">{selectedLog.target_id}</div>
                  </div>
                </div>

                {/* Target Info */}
                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Target Name</div>
                  <div className="font-semibold text-gray-900 dark:text-white text-lg">{selectedLog.target_name}</div>
                </div>

                {/* Details */}
                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Details</div>
                  <div className="text-gray-900 dark:text-white">{selectedLog.details}</div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Log ID</div>
                    <div className="font-mono text-gray-900 dark:text-white">{selectedLog.id}</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-900">
                <button
                  onClick={closeDetail}
                  className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
