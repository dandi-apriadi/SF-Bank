import React, { useState } from "react";
import Card from "components/card";
import { FiFileText, FiDownload, FiCalendar, FiFilter, FiSearch, FiPrinter, FiShare2 } from "react-icons/fi";

const LaporanMutu = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("semester");
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy data untuk laporan
  const reports = [
    {
      id: 1,
      title: "Laporan Evaluasi Diri Institusi 2024",
      type: "institutional",
      period: "2024",
      status: "completed",
      createdDate: "2024-12-15",
      fileSize: "2.5 MB",
      format: "PDF",
      description: "Laporan komprehensif evaluasi diri tingkat institusi untuk periode 2024"
    },
    {
      id: 2,
      title: "Laporan Mutu Program Studi Informatika",
      type: "study_program",
      period: "Semester Genap 2024",
      status: "completed",
      createdDate: "2024-08-20",
      fileSize: "1.8 MB",
      format: "PDF",
      description: "Laporan mutu akademik Program Studi Informatika semester genap 2024"
    },
    {
      id: 3,
      title: "Analisis Gap Akreditasi Institusi",
      type: "accreditation",
      period: "2024",
      status: "in_progress",
      createdDate: "2024-08-01",
      fileSize: "3.2 MB",
      format: "Excel",
      description: "Analisis kesenjangan untuk persiapan akreditasi institusi"
    },
    {
      id: 4,
      title: "Laporan PDDIKTI Semester Genap 2024",
      type: "pddikti",
      period: "Semester Genap 2024",
      status: "completed",
      createdDate: "2024-07-30",
      fileSize: "4.1 MB",
      format: "Excel",
      description: "Laporan data PDDIKTI untuk semester genap tahun akademik 2023/2024"
    },
    {
      id: 5,
      title: "Monitoring PKEPP Semua Program Studi",
      type: "quality_monitoring",
      period: "Juli 2024",
      status: "draft",
      createdDate: "2024-07-15",
      fileSize: "1.2 MB",
      format: "Word",
      description: "Laporan monitoring implementasi PKEPP di seluruh program studi"
    }
  ];

  const reportTypes = [
    { value: "all", label: "Semua Jenis" },
    { value: "institutional", label: "Laporan Institusi" },
    { value: "study_program", label: "Laporan Program Studi" },
    { value: "accreditation", label: "Laporan Akreditasi" },
    { value: "pddikti", label: "Laporan PDDIKTI" },
    { value: "quality_monitoring", label: "Monitoring Mutu" }
  ];

  const periods = [
    { value: "semester", label: "Semester Ini" },
    { value: "tahun", label: "Tahun Ini" },
    { value: "all", label: "Semua Periode" }
  ];

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || report.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed": return "Selesai";
      case "in_progress": return "Dalam Progress";
      case "draft": return "Draft";
      default: return status;
    }
  };

  const getTypeLabel = (type) => {
    const typeMap = {
      "institutional": "Institusi",
      "study_program": "Program Studi",
      "accreditation": "Akreditasi",
      "pddikti": "PDDIKTI",
      "quality_monitoring": "Monitoring Mutu"
    };
    return typeMap[type] || type;
  };

  const getFormatColor = (format) => {
    switch (format.toLowerCase()) {
      case "pdf": return "bg-red-100 text-red-800";
      case "excel": return "bg-green-100 text-green-800";
      case "word": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const reportStats = {
    total: reports.length,
    completed: reports.filter(r => r.status === "completed").length,
    inProgress: reports.filter(r => r.status === "in_progress").length,
    draft: reports.filter(r => r.status === "draft").length
  };

  return (
    <div className="mt-3">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white mb-2">
          Laporan Mutu
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Kelola dan unduh laporan mutu institusi, program studi, dan akreditasi
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Laporan</p>
              <p className="text-2xl font-bold text-navy-700 dark:text-white">{reportStats.total}</p>
            </div>
            <FiFileText className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Selesai</p>
              <p className="text-2xl font-bold text-green-600">{reportStats.completed}</p>
            </div>
            <FiDownload className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Dalam Progress</p>
              <p className="text-2xl font-bold text-blue-600">{reportStats.inProgress}</p>
            </div>
            <FiCalendar className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Draft</p>
              <p className="text-2xl font-bold text-gray-600">{reportStats.draft}</p>
            </div>
            <FiFileText className="w-8 h-8 text-gray-600" />
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card extra="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari laporan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            
            {/* Period Filter */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
          </div>
          
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <FiFileText className="w-4 h-4" />
            Buat Laporan Baru
          </button>
        </div>
      </Card>

      {/* Reports List */}
      <Card extra="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
            Daftar Laporan ({filteredReports.length})
          </h3>
        </div>
        
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FiFileText className="w-5 h-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-navy-700 dark:text-white">
                      {report.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {getStatusLabel(report.status)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {report.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiFilter className="w-4 h-4" />
                      <span>{getTypeLabel(report.type)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      <span>{report.period}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Dibuat: {report.createdDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`px-1 py-0.5 rounded text-xs ${getFormatColor(report.format)}`}>
                        {report.format}
                      </span>
                      <span>({report.fileSize})</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 flex gap-2">
                  {report.status === "completed" && (
                    <>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Unduh">
                        <FiDownload className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Cetak">
                        <FiPrinter className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Bagikan">
                        <FiShare2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {report.status !== "completed" && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Lanjutkan
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredReports.length === 0 && (
          <div className="text-center py-8">
            <FiFileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Tidak ada laporan yang sesuai dengan filter
            </p>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="mt-6">
        <Card extra="p-6">
          <h3 className="text-lg font-semibold text-navy-700 dark:text-white mb-4">
            Aksi Cepat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
              <FiFileText className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-semibold text-navy-700 dark:text-white mb-1">
                Laporan Evaluasi Diri
              </h4>
              <p className="text-sm text-gray-600">
                Generate laporan evaluasi diri institusi
              </p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
              <FiDownload className="w-8 h-8 text-green-600 mb-2" />
              <h4 className="font-semibold text-navy-700 dark:text-white mb-1">
                Export Data PDDIKTI
              </h4>
              <p className="text-sm text-gray-600">
                Export data untuk upload ke PDDIKTI
              </p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left">
              <FiCalendar className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-semibold text-navy-700 dark:text-white mb-1">
                Laporan Berkala
              </h4>
              <p className="text-sm text-gray-600">
                Generate laporan berkala otomatis
              </p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LaporanMutu;
