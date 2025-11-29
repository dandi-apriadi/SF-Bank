import React, { useState, useEffect } from "react";
import {
  FiClock,
  FiEdit,
  FiUser,
  FiFileText,
  FiEye,
  FiDownload,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiArrowRight,
  FiRefreshCw
} from "react-icons/fi";
import Card from "components/card";

const RevisionHistory = () => {
  const [revisions, setRevisions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterProdi, setFilterProdi] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    // Load data without animations
    loadRevisionData();
  }, []);

  const loadRevisionData = () => {
    const dummyRevisions = [
      {
        id: 1,
        documentTitle: "LED Kriteria 1 - Visi Misi Program Studi",
        documentType: "led",
        prodi: "Teknik Informatika",
        version: "v2.3",
        previousVersion: "v2.2",
        editor: "Dr. Ahmad Suharto",
        editorRole: "Koordinator Prodi",
        timestamp: "2024-12-20T14:30:00Z",
        action: "edit",
        changes: [
          "Updated visi program studi sesuai dengan arah pengembangan terbaru",
          "Menambahkan indikator pencapaian untuk misi nomor 3",
          "Revisi target lulusan berdasarkan feedback stakeholder"
        ],
        changesSummary: "3 perubahan pada bagian visi dan misi",
        status: "approved",
        approvedBy: "Unit PPMPP",
        size: "245 KB"
      },
      {
        id: 2,
        documentTitle: "Form Evaluasi Diri Semester Ganjil 2024",
        documentType: "evaluation",
        prodi: "Sistem Informasi",
        version: "v1.5",
        previousVersion: "v1.4",
        editor: "Prof. Siti Nurhaliza",
  editorRole: "Koordinator Prodi",
        timestamp: "2024-12-19T16:45:00Z",
        action: "edit",
        changes: [
          "Update data mahasiswa semester ganjil 2024",
          "Perbaikan pada tabel prestasi mahasiswa",
          "Tambah keterangan untuk mata kuliah baru"
        ],
        changesSummary: "Pembaruan data dan perbaikan format tabel",
        status: "pending",
        approvedBy: null,
        size: "189 KB"
      },
      {
        id: 3,
        documentTitle: "Kurikulum Program Studi Teknik Elektro 2024",
        documentType: "curriculum",
        prodi: "Teknik Elektro",
        version: "v3.1",
        previousVersion: "v3.0",
        editor: "Dr. Maya Sari",
        editorRole: "Koordinator Prodi",
        timestamp: "2024-12-18T09:15:00Z",
        action: "major_edit",
        changes: [
          "Restructure mata kuliah semester 6 dan 7",
          "Menambahkan 3 mata kuliah pilihan baru",
          "Update prerequisite untuk seluruh mata kuliah",
          "Revisi total SKS dari 144 menjadi 146 SKS",
          "Integrasi mata kuliah dengan industri 4.0"
        ],
        changesSummary: "Major revision pada struktur kurikulum",
        status: "revision",
        approvedBy: null,
        size: "567 KB"
      },
      {
        id: 4,
  documentTitle: "Data Profil Tenaga Pengajar Program Studi Manajemen",
        documentType: "profile",
        prodi: "Manajemen",
        version: "v1.2",
        previousVersion: "v1.1",
        editor: "Budi Santoso",
        editorRole: "Staff PPMPP",
        timestamp: "2024-12-17T11:20:00Z",
        action: "add",
        changes: [
          "Menambahkan profil 2 tenaga pengajar baru",
          "Update kualifikasi tenaga pengajar yang baru lulus S3",
          "Tambah data penelitian dan publikasi terbaru"
        ],
  changesSummary: "Penambahan profil pengajar dan update kualifikasi",
        status: "approved",
        approvedBy: "Unit PPMPP",
        size: "423 KB"
      },
      {
        id: 5,
        documentTitle: "LED Kriteria 4 - Sumber Daya Manusia",
        documentType: "led",
        prodi: "Teknik Informatika",
        version: "v1.8",
        previousVersion: "v1.7",
        editor: "Dr. Rudi Hartono",
  editorRole: "Koordinator Prodi",
        timestamp: "2024-12-16T13:45:00Z",
        action: "edit",
        changes: [
          "Update data beban kerja pengajar per semester",
          "Revisi tabel distribusi mata kuliah",
          "Perbaikan format lampiran sertifikat pengajar"
        ],
        changesSummary: "Update data SDM dan perbaikan format",
        status: "approved",
        approvedBy: "Koordinator Prodi",
        size: "334 KB"
      },
      {
        id: 6,
        documentTitle: "Instrumen Akreditasi BAN-PT 2024",
        documentType: "instrument",
        prodi: "All",
        version: "v4.0",
        previousVersion: "v3.9",
        editor: "Lisa Permata",
        editorRole: "Staff PPMPP",
        timestamp: "2024-12-15T08:30:00Z",
        action: "major_edit",
        changes: [
          "Update sesuai panduan BAN-PT terbaru",
          "Revisi bobot penilaian kriteria 6 dan 7",
          "Tambah sub-kriteria baru untuk penelitian",
          "Update template formulir evaluasi diri",
          "Integrasi dengan sistem PDDIKTI"
        ],
        changesSummary: "Major update mengikuti panduan BAN-PT terbaru",
        status: "approved",
        approvedBy: "Pimpinan Institusi",
        size: "1.2 MB"
      }
    ];
    setRevisions(dummyRevisions);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "edit":
        return <FiEdit className="h-4 w-4 text-blue-600" />;
      case "major_edit":
        return <FiRefreshCw className="h-4 w-4 text-purple-600" />;
      case "add":
        return <FiFileText className="h-4 w-4 text-green-600" />;
      default:
        return <FiClock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case "edit":
        return "Edit";
      case "major_edit":
        return "Major Edit";
      case "add":
        return "Tambah";
      default:
        return "Update";
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "edit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "major_edit":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "add":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "revision":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Disetujui";
      case "pending":
        return "Menunggu";
      case "revision":
        return "Revisi";
      default:
        return "Draft";
    }
  };

  const getDocumentTypeColor = (type) => {
    switch (type) {
      case "led":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200";
      case "evaluation":
        return "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200";
      case "curriculum":
        return "bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-200";
      case "profile":
        return "bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-200";
      case "instrument":
        return "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getDocumentTypeText = (type) => {
    switch (type) {
      case "led":
        return "LED";
      case "evaluation":
        return "Evaluasi";
      case "curriculum":
        return "Kurikulum";
      case "profile":
        return "Profil";
      case "instrument":
        return "Instrumen";
      default:
        return "Dokumen";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredRevisions = revisions.filter(revision => {
    const matchesSearch = revision.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      revision.editor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      revision.prodi.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || revision.documentType === filterType;
    const matchesProdi = filterProdi === "all" || revision.prodi === filterProdi;

    return matchesSearch && matchesType && matchesProdi;
  });

  const prodiOptions = [
    { value: "all", label: "Semua Program Studi" },
    ...Array.from(new Set(revisions.map(r => r.prodi))).map(prodi => ({ value: prodi, label: prodi }))
  ];

  const typeOptions = [
    { value: "all", label: "Semua Jenis" },
    { value: "led", label: "LED" },
    { value: "evaluation", label: "Evaluasi" },
    { value: "curriculum", label: "Kurikulum" },
    { value: "profile", label: "Profil" },
    { value: "instrument", label: "Instrumen" }
  ];

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      {/* Header */}
  <Card extra="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Riwayat Revisi Dokumen
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Tracking lengkap semua perubahan dan revisi dokumen akreditasi
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <FiClock className="h-4 w-4" />
            <span>Update terakhir: {formatTimestamp(revisions[0]?.timestamp || new Date().toISOString())}</span>
          </div>
        </div>
      </Card>

      {/* Statistics */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{revisions.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Revisi</div>
        </Card>
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-green-600">
            {revisions.filter(r => r.status === "approved").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Disetujui</div>
        </Card>
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-amber-600">
            {revisions.filter(r => r.status === "pending").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Menunggu Review</div>
        </Card>
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-red-600">
            {revisions.filter(r => r.status === "revision").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Perlu Revisi</div>
        </Card>
      </div>

      {/* Filters */}
  <Card extra="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan judul, editor, atau program studi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterProdi}
              onChange={(e) => setFilterProdi(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {prodiOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Revisions Timeline */}
  <div className="space-y-4">
        {filteredRevisions.length === 0 ? (
          <Card extra="p-8 text-center">
            <FiClock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
              Tidak ada riwayat revisi
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              {searchTerm ? "Tidak ditemukan revisi yang sesuai dengan pencarian." : "Belum ada riwayat revisi dokumen."}
            </p>
          </Card>
        ) : (
          filteredRevisions.map((revision) => (
            <Card key={revision.id} extra="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                {/* Timeline marker */}
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    {getActionIcon(revision.action)}
                  </div>
                  <div className="mt-2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {revision.documentTitle}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentTypeColor(revision.documentType)}`}>
                          {getDocumentTypeText(revision.documentType)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(revision.action)}`}>
                          {getActionText(revision.action)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(revision.status)}`}>
                          {getStatusText(revision.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatTimestamp(revision.timestamp)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {revision.size}
                      </div>
                    </div>
                  </div>

                  {/* Editor info */}
                  <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <FiUser className="h-4 w-4" />
                      <span>{revision.editor}</span>
                      <span className="text-gray-400">•</span>
                      <span>{revision.editorRole}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>{revision.prodi}</span>
                    </div>
                  </div>

                  {/* Version info */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {revision.previousVersion}
                    </span>
                    <FiArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-blue-600">
                      {revision.version}
                    </span>
                  </div>

                  {/* Changes summary */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {revision.changesSummary}
                    </p>
                    <ul className="space-y-1">
                      {revision.changes.slice(0, 3).map((change, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                          <span>{change}</span>
                        </li>
                      ))}
                      {revision.changes.length > 3 && (
                        <li className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                          +{revision.changes.length - 3} perubahan lainnya
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Approval info */}
                  {revision.status === "approved" && revision.approvedBy && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Disetujui oleh: {revision.approvedBy}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-4 mt-4">
                    <button className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors">
                      <FiEye className="mr-1 h-4 w-4" />
                      Lihat Detail
                    </button>
                    <button className="inline-flex items-center text-sm text-green-600 hover:text-green-700 transition-colors">
                      <FiDownload className="mr-1 h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RevisionHistory;
