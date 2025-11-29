import React, { useState, useEffect } from "react";
import {
  FiSettings,
  FiDatabase,
  FiShield,
  FiUsers,
  FiServer,
  FiHardDrive,
  FiWifi,
  FiCpu,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo
} from "react-icons/fi";
import Card from "components/card";

const SystemAdmin = () => {
  const [systemStatus, setSystemStatus] = useState({});
  const [backupStatus, setBackupStatus] = useState({});
  const [userStats, setUserStats] = useState({});
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    // Load system data without animations
    loadSystemData();
  }, []);

  const loadSystemData = () => {
    // Dummy system status
    setSystemStatus({
      server: {
        status: "online",
        uptime: "15 hari 8 jam",
        cpu: 24,
        memory: 68,
        disk: 45,
        network: "stable"
      },
      database: {
        status: "online",
        connections: 12,
        size: "2.4 GB",
        lastBackup: "2024-12-20 02:00:00"
      },
      application: {
        status: "online",
        version: "v2.1.3",
        users: 147,
        activeUsers: 23
      }
    });

    setBackupStatus({
      lastBackup: "2024-12-20 02:00:00",
      backupSize: "2.4 GB",
      backupLocation: "/backups/prima_backup_20241220.sql",
      autoBackup: true,
      retentionDays: 30,
      backupHistory: [
        { date: "2024-12-20", size: "2.4 GB", status: "success" },
        { date: "2024-12-19", size: "2.3 GB", status: "success" },
        { date: "2024-12-18", size: "2.3 GB", status: "success" },
        { date: "2024-12-17", size: "2.2 GB", status: "success" },
        { date: "2024-12-16", size: "2.2 GB", status: "failed" }
      ]
    });

    setUserStats({
      totalUsers: 147,
      activeUsers: 23,
      usersByRole: {
        koordinator: 8,
        ppmpp: 3,
        pimpinan: 2,
        admin: 1
      },
      recentLogins: [
  { user: "Dr. Ahmad Suharto", role: "Koordinator", time: "2024-12-20 14:30", ip: "192.168.1.101" },
        { user: "Prof. Siti Nurhaliza", role: "Koordinator", time: "2024-12-20 14:15", ip: "192.168.1.102" },
        { user: "Maya Sari", role: "PPMPP", time: "2024-12-20 13:45", ip: "192.168.1.103" },
  { user: "Budi Santoso", role: "Koordinator", time: "2024-12-20 13:30", ip: "192.168.1.104" }
      ]
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
      case "success":
        return "text-green-600";
      case "warning":
        return "text-amber-600";
      case "offline":
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "online":
      case "success":
        return <FiCheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <FiAlertTriangle className="h-5 w-5 text-amber-600" />;
      case "offline":
      case "failed":
        return <FiXCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FiInfo className="h-5 w-5 text-gray-600" />;
    }
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 80) return "bg-red-500";
    if (percentage >= 60) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      {/* Header */}
  <Card extra="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Administrasi Sistem
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Monitor dan kelola infrastruktur sistem PRIMA
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors">
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Refresh Status
            </button>
            <button className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors">
              <FiDownload className="mr-2 h-4 w-4" />
              Backup Manual
            </button>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
  <Card extra="p-6">
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              selectedTab === "overview"
                ? "bg-white text-blue-600 shadow dark:bg-gray-600 dark:text-white"
                : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <FiServer className="mr-2 inline h-4 w-4" />
            Overview
          </button>
          <button
            onClick={() => setSelectedTab("backup")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              selectedTab === "backup"
                ? "bg-white text-blue-600 shadow dark:bg-gray-600 dark:text-white"
                : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <FiDatabase className="mr-2 inline h-4 w-4" />
            Backup & Recovery
          </button>
          <button
            onClick={() => setSelectedTab("users")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              selectedTab === "users"
                ? "bg-white text-blue-600 shadow dark:bg-gray-600 dark:text-white"
                : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <FiUsers className="mr-2 inline h-4 w-4" />
            User Management
          </button>
          <button
            onClick={() => setSelectedTab("security")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              selectedTab === "security"
                ? "bg-white text-blue-600 shadow dark:bg-gray-600 dark:text-white"
                : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <FiShield className="mr-2 inline h-4 w-4" />
            Security
          </button>
        </div>
      </Card>

      {/* System Overview Tab */}
      {selectedTab === "overview" && (
        <>
          {/* System Status Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card extra="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Server Status</h3>
                {getStatusIcon(systemStatus.server?.status)}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                  <span className="font-medium">{systemStatus.server?.uptime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Network</span>
                  <span className={`font-medium ${getStatusColor(systemStatus.server?.network)}`}>
                    {systemStatus.server?.network}
                  </span>
                </div>
              </div>
            </Card>

            <Card extra="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Database</h3>
                {getStatusIcon(systemStatus.database?.status)}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Size</span>
                  <span className="font-medium">{systemStatus.database?.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Connections</span>
                  <span className="font-medium">{systemStatus.database?.connections}</span>
                </div>
              </div>
            </Card>

            <Card extra="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Application</h3>
                {getStatusIcon(systemStatus.application?.status)}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Version</span>
                  <span className="font-medium">{systemStatus.application?.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Active Users</span>
                  <span className="font-medium">{systemStatus.application?.activeUsers}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Resource Usage */}
          <Card extra="p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-6">Resource Usage</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex items-center space-x-4">
                <FiCpu className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">CPU</span>
                    <span className="font-medium">{systemStatus.server?.cpu}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(systemStatus.server?.cpu)}`}
                      style={{ width: `${systemStatus.server?.cpu}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <FiServer className="h-8 w-8 text-green-600" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Memory</span>
                    <span className="font-medium">{systemStatus.server?.memory}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(systemStatus.server?.memory)}`}
                      style={{ width: `${systemStatus.server?.memory}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <FiHardDrive className="h-8 w-8 text-purple-600" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Disk</span>
                    <span className="font-medium">{systemStatus.server?.disk}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(systemStatus.server?.disk)}`}
                      style={{ width: `${systemStatus.server?.disk}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Backup & Recovery Tab */}
      {selectedTab === "backup" && (
        <>
          {/* Backup Status */}
          <Card extra="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Backup Configuration</h3>
              <button className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors">
                <FiSettings className="mr-2 h-4 w-4" />
                Configure
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Backup</span>
                  <span className="font-medium">{backupStatus.lastBackup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Backup Size</span>
                  <span className="font-medium">{backupStatus.backupSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Auto Backup</span>
                  <span className={`font-medium ${backupStatus.autoBackup ? 'text-green-600' : 'text-red-600'}`}>
                    {backupStatus.autoBackup ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Retention Period</span>
                  <span className="font-medium">{backupStatus.retentionDays} days</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-800 dark:text-white">Backup Actions</h4>
                <div className="space-y-2">
                  <button className="w-full inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors">
                    <FiDownload className="mr-2 h-4 w-4" />
                    Create Backup Now
                  </button>
                  <button className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors">
                    <FiUpload className="mr-2 h-4 w-4" />
                    Restore from Backup
                  </button>
                  <button className="w-full inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition-colors">
                    <FiSettings className="mr-2 h-4 w-4" />
                    Schedule Settings
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Backup History */}
          <Card extra="p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-6">Backup History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Size</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {backupStatus.backupHistory?.map((backup, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-sm text-gray-800 dark:text-white">{backup.date}</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{backup.size}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          backup.status === "success" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}>
                          {getStatusIcon(backup.status)}
                          <span className="ml-1">{backup.status}</span>
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 text-sm">Download</button>
                          <button className="text-green-600 hover:text-green-700 text-sm">Restore</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* User Management Tab */}
      {selectedTab === "users" && (
        <>
          {/* User Statistics */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card extra="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.totalUsers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </Card>
            <Card extra="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.usersByRole?.koordinator}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Koordinator</div>
            </Card>
            <Card extra="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">{userStats.usersByRole?.ppmpp}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">PPMPP</div>
            </Card>
            <Card extra="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">{userStats.activeUsers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Now</div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card extra="p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-6">Recent Login Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">User</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Role</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Login Time</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {userStats.recentLogins?.map((login, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-sm text-gray-800 dark:text-white">{login.user}</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{login.role}</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{login.time}</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{login.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Security Tab */}
      {selectedTab === "security" && (
  <Card extra="p-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-6">Security Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white">SSL Certificate</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Valid until March 2025</p>
              </div>
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white">Firewall Status</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">All ports secured</p>
              </div>
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white">Backup Encryption</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">AES-256 enabled</p>
              </div>
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SystemAdmin;
