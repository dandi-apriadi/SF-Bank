import React, { useState } from "react";
import Card from "components/card";
import { FiTarget, FiCheckCircle, FiClock, FiAlertCircle, FiUser, FiCalendar } from "react-icons/fi";

const TindakLanjut = () => {
  const [activeTab, setActiveTab] = useState("pending");

  // Dummy data untuk tindak lanjut
  const followUpActions = {
    pending: [
      {
        id: 1,
        title: "Perbaikan Kurikulum Program Studi Informatika",
        description: "Melakukan revisi kurikulum berdasarkan rekomendasi visitasi akreditasi",
        assignedTo: "Dr. Ahmad Fauzi",
        dueDate: "2025-08-30",
        priority: "high",
        status: "in_progress",
        studyProgram: "Informatika"
      },
      {
        id: 2,
        title: "Peningkatan Sarana Laboratorium",
        description: "Menambah peralatan laboratorium komputer sesuai standar",
        assignedTo: "Ir. Siti Nurhaliza",
        dueDate: "2025-09-15",
        priority: "medium",
        status: "pending",
        studyProgram: "Teknik Elektro"
      },
      {
        id: 3,
        title: "Pembaruan Sistem Informasi Akademik",
        description: "Upgrade sistem akademik untuk mendukung proses akreditasi",
        assignedTo: "Muhammad Rizki",
        dueDate: "2025-08-25",
        priority: "high",
        status: "pending",
        studyProgram: "Sistem Informasi"
      }
    ],
    completed: [
      {
        id: 4,
        title: "Penyusunan Dokumen Borang Akreditasi",
        description: "Melengkapi semua dokumen borang untuk program studi",
        assignedTo: "Prof. Dr. Indira Sari",
        completedDate: "2025-08-05",
        priority: "high",
        status: "completed",
        studyProgram: "Manajemen"
      }
    ],
    overdue: [
  // Dosen training action removed
    ]
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-amber-600 bg-amber-100";
      case "low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <FiCheckCircle className="text-green-600" />;
      case "in_progress": return <FiClock className="text-blue-600" />;
      case "overdue": return <FiAlertCircle className="text-red-600" />;
      default: return <FiClock className="text-gray-600" />;
    }
  };

  const renderActionCard = (action) => (
    <Card key={action.id} extra="p-6 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getStatusIcon(action.status)}
            <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
              {action.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
              {action.priority === "high" ? "Tinggi" : action.priority === "medium" ? "Sedang" : "Rendah"}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            {action.description}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FiUser className="w-4 h-4" />
              <span>{action.assignedTo}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              <span>
                {action.status === "completed" 
                  ? `Selesai: ${action.completedDate}` 
                  : `Target: ${action.dueDate}`
                }
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiTarget className="w-4 h-4" />
              <span>{action.studyProgram}</span>
            </div>
          </div>
        </div>
        
        <div className="ml-4">
          {action.status !== "completed" && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Update Status
            </button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="mt-3">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white mb-2">
          Manajemen Tindak Lanjut
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Kelola dan pantau tindak lanjut dari rekomendasi visitasi akreditasi
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Tindak Lanjut</p>
              <p className="text-2xl font-bold text-navy-700 dark:text-white">
                {followUpActions.pending.length + followUpActions.completed.length + followUpActions.overdue.length}
              </p>
            </div>
            <FiTarget className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Dalam Progress</p>
              <p className="text-2xl font-bold text-blue-600">{followUpActions.pending.length}</p>
            </div>
            <FiClock className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Selesai</p>
              <p className="text-2xl font-bold text-green-600">{followUpActions.completed.length}</p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Terlambat</p>
              <p className="text-2xl font-bold text-red-600">{followUpActions.overdue.length}</p>
            </div>
            <FiAlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card extra="p-6">
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: "pending", label: "Dalam Progress", count: followUpActions.pending.length },
              { key: "completed", label: "Selesai", count: followUpActions.completed.length },
              { key: "overdue", label: "Terlambat", count: followUpActions.overdue.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div>
          {followUpActions[activeTab].length === 0 ? (
            <div className="text-center py-8">
              <FiTarget className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Tidak ada tindak lanjut dalam kategori ini
              </p>
            </div>
          ) : (
            followUpActions[activeTab].map(renderActionCard)
          )}
        </div>
      </Card>

      {/* Add New Action Button */}
      <div className="mt-6">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <FiTarget className="w-5 h-5" />
          Tambah Tindak Lanjut Baru
        </button>
      </div>
    </div>
  );
};

export default TindakLanjut;
