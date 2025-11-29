import React, { useState } from "react";
import Card from "components/card";
import { FiSettings, FiDatabase, FiMail, FiShield, FiClock, FiMonitor, FiSave, FiRefreshCw } from "react-icons/fi";

const PengaturanSistem = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      siteName: "PRIMA - Platform Integrasi Manajemen Mutu Akademik",
      siteDescription: "Sistem Manajemen Mutu Akademik Terintegrasi",
      timezone: "Asia/Jakarta",
      language: "id",
      maintenanceMode: false
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      taskReminders: true,
      systemAlerts: true,
      weeklyReports: true
    },
    security: {
      sessionTimeout: 60,
      passwordExpiry: 90,
      twoFactorAuth: false,
      loginAttempts: 5,
      ipWhitelist: ""
    },
    backup: {
      autoBackup: true,
      backupFrequency: "daily",
      retentionDays: 30,
      lastBackup: "2025-08-09 02:00:00"
    }
  });

  const tabs = [
    { key: "general", label: "Umum", icon: FiSettings },
    { key: "notifications", label: "Notifikasi", icon: FiMail },
    { key: "security", label: "Keamanan", icon: FiShield },
    { key: "backup", label: "Backup", icon: FiDatabase },
    { key: "monitoring", label: "Monitoring", icon: FiMonitor }
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nama Sistem
        </label>
        <input
          type="text"
          value={settings.general.siteName}
          onChange={(e) => handleSettingChange("general", "siteName", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Deskripsi Sistem
        </label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleSettingChange("general", "siteDescription", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Zona Waktu
        </label>
        <select
          value={settings.general.timezone}
          onChange={(e) => handleSettingChange("general", "timezone", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
          <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
          <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bahasa
        </label>
        <select
          value={settings.general.language}
          onChange={(e) => handleSettingChange("general", "language", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="id">Bahasa Indonesia</option>
          <option value="en">English</option>
        </select>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="maintenanceMode"
          checked={settings.general.maintenanceMode}
          onChange={(e) => handleSettingChange("general", "maintenanceMode", e.target.checked)}
          className="mr-3"
        />
        <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Mode Maintenance
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Email Notifications</h4>
          <p className="text-sm text-gray-500">Kirim notifikasi melalui email</p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.emailNotifications}
          onChange={(e) => handleSettingChange("notifications", "emailNotifications", e.target.checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Push Notifications</h4>
          <p className="text-sm text-gray-500">Notifikasi langsung di browser</p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.pushNotifications}
          onChange={(e) => handleSettingChange("notifications", "pushNotifications", e.target.checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Task Reminders</h4>
          <p className="text-sm text-gray-500">Pengingat tugas dan deadline</p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.taskReminders}
          onChange={(e) => handleSettingChange("notifications", "taskReminders", e.target.checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">System Alerts</h4>
          <p className="text-sm text-gray-500">Peringatan sistem dan error</p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.systemAlerts}
          onChange={(e) => handleSettingChange("notifications", "systemAlerts", e.target.checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Weekly Reports</h4>
          <p className="text-sm text-gray-500">Laporan mingguan otomatis</p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.weeklyReports}
          onChange={(e) => handleSettingChange("notifications", "weeklyReports", e.target.checked)}
        />
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Session Timeout (menit)
        </label>
        <input
          type="number"
          value={settings.security.sessionTimeout}
          onChange={(e) => handleSettingChange("security", "sessionTimeout", parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password Expiry (hari)
        </label>
        <input
          type="number"
          value={settings.security.passwordExpiry}
          onChange={(e) => handleSettingChange("security", "passwordExpiry", parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Max Login Attempts
        </label>
        <input
          type="number"
          value={settings.security.loginAttempts}
          onChange={(e) => handleSettingChange("security", "loginAttempts", parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-500">Aktifkan 2FA untuk semua pengguna</p>
        </div>
        <input
          type="checkbox"
          checked={settings.security.twoFactorAuth}
          onChange={(e) => handleSettingChange("security", "twoFactorAuth", e.target.checked)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          IP Whitelist (opsional)
        </label>
        <textarea
          value={settings.security.ipWhitelist}
          onChange={(e) => handleSettingChange("security", "ipWhitelist", e.target.value)}
          placeholder="192.168.1.0/24, 10.0.0.0/8"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Auto Backup</h4>
          <p className="text-sm text-gray-500">Backup otomatis database dan file</p>
        </div>
        <input
          type="checkbox"
          checked={settings.backup.autoBackup}
          onChange={(e) => handleSettingChange("backup", "autoBackup", e.target.checked)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Frekuensi Backup
        </label>
        <select
          value={settings.backup.backupFrequency}
          onChange={(e) => handleSettingChange("backup", "backupFrequency", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="hourly">Setiap Jam</option>
          <option value="daily">Harian</option>
          <option value="weekly">Mingguan</option>
          <option value="monthly">Bulanan</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Retention Period (hari)
        </label>
        <input
          type="number"
          value={settings.backup.retentionDays}
          onChange={(e) => handleSettingChange("backup", "retentionDays", parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Status Backup</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Backup terakhir: {settings.backup.lastBackup}
        </p>
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <FiRefreshCw className="w-4 h-4" />
          Backup Sekarang
        </button>
      </div>
    </div>
  );

  const renderMonitoringSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card extra="p-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Status Server</h4>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">Online</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Uptime: 99.9%</p>
        </Card>
        
        <Card extra="p-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Database</h4>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">Connected</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Response: 12ms</p>
        </Card>
        
        <Card extra="p-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Storage</h4>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-yellow-600">75% Used</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">750GB / 1TB</p>
        </Card>
        
        <Card extra="p-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Memory</h4>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">45% Used</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">4.5GB / 10GB</p>
        </Card>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">System Logs</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-green-600">[INFO] System backup completed successfully</span>
            <span className="text-gray-500">2025-08-09 02:00:15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-600">[INFO] User login: admin@university.ac.id</span>
            <span className="text-gray-500">2025-08-09 08:30:42</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-600">[WARN] High memory usage detected</span>
            <span className="text-gray-500">2025-08-09 10:15:33</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-3">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white mb-2">
          Pengaturan Sistem
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Konfigurasi sistem, keamanan, backup, dan monitoring PRIMA
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card extra="p-6 lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.key
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Content Area */}
        <Card extra="p-6 lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
              {tabs.find(tab => tab.key === activeTab)?.label}
            </h2>
          </div>

          <div>
            {activeTab === "general" && renderGeneralSettings()}
            {activeTab === "notifications" && renderNotificationSettings()}
            {activeTab === "security" && renderSecuritySettings()}
            {activeTab === "backup" && renderBackupSettings()}
            {activeTab === "monitoring" && renderMonitoringSettings()}
          </div>

          {/* Save Button */}
          {activeTab !== "monitoring" && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <FiSave className="w-5 h-5" />
                Simpan Pengaturan
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PengaturanSistem;
