import React, { useState, useEffect } from "react";
import {
  FiBarChart,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiTarget,
  FiAlertTriangle,
  FiCheckCircle,
  FiUsers,
  FiBookOpen
} from "react-icons/fi";
import Card from "components/card";

const QualityAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("semester");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    // Load analytics data without animations
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    const dummyData = [
      {
        prodi: "Teknik Informatika",
        faculty: "Teknik",
        currentScore: 3.6,
        targetScore: 4.0,
        trend: "up",
        trendValue: 0.2,
        studentsCount: 245,
        lecturersCount: 15,
        completionRate: 85,
        documentsUploaded: 42,
        lastUpdated: "2024-12-20",
        criteriaScores: [
          { criteria: "1", name: "Visi Misi", score: 3.8, status: "good" },
          { criteria: "2", name: "Tata Pamong", score: 3.5, status: "fair" },
          { criteria: "3", name: "Mahasiswa", score: 3.6, status: "good" },
          { criteria: "4", name: "SDM", score: 3.2, status: "warning" },
          { criteria: "5", name: "Keuangan", score: 3.4, status: "fair" },
          { criteria: "6", name: "Penelitian", score: 3.9, status: "good" },
          { criteria: "7", name: "Pengabdian", score: 3.7, status: "good" },
          { criteria: "8", name: "Luaran", score: 3.8, status: "good" },
          { criteria: "9", name: "Output", score: 3.5, status: "fair" }
        ],
        issues: [
          "Rasio tenaga pengajar S3 masih 20% (target 30%)",
          "Kerjasama industri perlu ditingkatkan",
          "Publikasi internasional masih kurang"
        ]
      },
      {
        prodi: "Sistem Informasi",
        faculty: "Teknik",
        currentScore: 3.4,
        targetScore: 4.0,
        trend: "up",
        trendValue: 0.1,
        studentsCount: 189,
        lecturersCount: 12,
        completionRate: 78,
        documentsUploaded: 35,
        lastUpdated: "2024-12-19",
        criteriaScores: [
          { criteria: "1", name: "Visi Misi", score: 3.6, status: "good" },
          { criteria: "2", name: "Tata Pamong", score: 3.3, status: "fair" },
          { criteria: "3", name: "Mahasiswa", score: 3.4, status: "fair" },
          { criteria: "4", name: "SDM", score: 3.0, status: "warning" },
          { criteria: "5", name: "Keuangan", score: 3.2, status: "fair" },
          { criteria: "6", name: "Penelitian", score: 3.7, status: "good" },
          { criteria: "7", name: "Pengabdian", score: 3.5, status: "fair" },
          { criteria: "8", name: "Luaran", score: 3.6, status: "good" },
          { criteria: "9", name: "Output", score: 3.3, status: "fair" }
        ],
        issues: [
          "Kelengkapan dokumen LED masih 78%",
          "Sistem informasi akademik perlu update",
          "Tracer study alumni belum optimal"
        ]
      },
      {
        prodi: "Teknik Elektro",
        faculty: "Teknik",
        currentScore: 3.8,
        targetScore: 4.0,
        trend: "stable",
        trendValue: 0.0,
        studentsCount: 156,
        lecturersCount: 18,
        completionRate: 92,
        documentsUploaded: 48,
        lastUpdated: "2024-12-20",
        criteriaScores: [
          { criteria: "1", name: "Visi Misi", score: 4.0, status: "excellent" },
          { criteria: "2", name: "Tata Pamong", score: 3.8, status: "good" },
          { criteria: "3", name: "Mahasiswa", score: 3.9, status: "good" },
          { criteria: "4", name: "SDM", score: 3.6, status: "good" },
          { criteria: "5", name: "Keuangan", score: 3.7, status: "good" },
          { criteria: "6", name: "Penelitian", score: 4.0, status: "excellent" },
          { criteria: "7", name: "Pengabdian", score: 3.8, status: "good" },
          { criteria: "8", name: "Luaran", score: 3.9, status: "good" },
          { criteria: "9", name: "Output", score: 3.5, status: "fair" }
        ],
        issues: [
          "Fasilitas laboratorium perlu upgrade",
          "Program magang industri bisa diperluas"
        ]
      },
      {
        prodi: "Manajemen",
        faculty: "Ekonomi",
        currentScore: 3.3,
        targetScore: 4.0,
        trend: "down",
        trendValue: -0.1,
        studentsCount: 312,
        lecturersCount: 14,
        completionRate: 72,
        documentsUploaded: 28,
        lastUpdated: "2024-12-18",
        criteriaScores: [
          { criteria: "1", name: "Visi Misi", score: 3.5, status: "fair" },
          { criteria: "2", name: "Tata Pamong", score: 3.2, status: "fair" },
          { criteria: "3", name: "Mahasiswa", score: 3.3, status: "fair" },
          { criteria: "4", name: "SDM", score: 2.9, status: "warning" },
          { criteria: "5", name: "Keuangan", score: 3.1, status: "fair" },
          { criteria: "6", name: "Penelitian", score: 3.4, status: "fair" },
          { criteria: "7", name: "Pengabdian", score: 3.6, status: "good" },
          { criteria: "8", name: "Luaran", score: 3.2, status: "fair" },
          { criteria: "9", name: "Output", score: 3.5, status: "fair" }
        ],
        issues: [
          "Perlu penambahan tenaga pengajar berkualifikasi S3",
          "Penelitian dan publikasi perlu ditingkatkan",
          "Kerjasama dengan dunia usaha masih terbatas",
          "Sistem tracking alumni belum efektif"
        ]
      }
    ];
    setAnalyticsData(dummyData);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "bg-green-600";
      case "good":
        return "bg-blue-600";
      case "fair":
        return "bg-amber-600";
      case "warning":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <FiTrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <FiTrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <FiActivity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredData = selectedProdi === "all" 
    ? analyticsData 
    : analyticsData.filter(item => item.prodi === selectedProdi);

  const totalStudents = analyticsData.reduce((sum, prodi) => sum + prodi.studentsCount, 0);
  const totalLecturers = analyticsData.reduce((sum, prodi) => sum + prodi.lecturersCount, 0);
  const avgScore = analyticsData.reduce((sum, prodi) => sum + prodi.currentScore, 0) / analyticsData.length;
  const avgCompletion = analyticsData.reduce((sum, prodi) => sum + prodi.completionRate, 0) / analyticsData.length;

  const prodiOptions = [
    { value: "all", label: "Semua Program Studi" },
    ...analyticsData.map(prodi => ({ value: prodi.prodi, label: prodi.prodi }))
  ];

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      {/* Header */}
  <Card extra="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Analitik Mutu Institusi
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Analisis komprehensif kualitas akademik seluruh program studi di universitas
            </p>
          </div>
          
          <div className="flex space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="semester">Semester Ini</option>
              <option value="year">Tahun Ini</option>
              <option value="all">Semua Periode</option>
            </select>
            
            <select
              value={selectedProdi}
              onChange={(e) => setSelectedProdi(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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

      {/* Overall Statistics */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{analyticsData.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Program Studi</div>
        </Card>
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-green-600">{totalStudents}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Mahasiswa</div>
        </Card>
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">{totalLecturers}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Tenaga Pengajar</div>
        </Card>
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-orange-600">{avgScore.toFixed(2)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Rata-rata Skor</div>
        </Card>
      </div>

      {/* Quality Heatmap */}
  <Card extra="p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
          Heatmap Kualitas per Kriteria
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Program Studi
                </th>
                {[1,2,3,4,5,6,7,8,9].map(criteria => (
                  <th key={criteria} className="text-center p-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                    K{criteria}
                  </th>
                ))}
                <th className="text-center p-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Rata-rata
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((prodi) => (
                <tr key={prodi.prodi} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-3 text-sm font-medium text-gray-800 dark:text-white">
                    {prodi.prodi}
                  </td>
                  {prodi.criteriaScores.map((criteria) => (
                    <td key={criteria.criteria} className="p-3 text-center">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded text-white text-xs font-bold ${getStatusColor(criteria.status)}`}>
                        {criteria.score}
                      </div>
                    </td>
                  ))}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm font-semibold text-gray-800 dark:text-white">
                        {prodi.currentScore}
                      </span>
                      {getTrendIcon(prodi.trend)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Sangat Baik (≥3.7)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Baik (3.3-3.6)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Cukup (3.0-3.2)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Perlu Perhatian (&lt;3.0)</span>
          </div>
        </div>
      </Card>

      {/* Detailed Program Studies */}
  <div className="space-y-6">
        {filteredData.map((prodi) => (
          <Card key={prodi.prodi} extra="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {prodi.prodi}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Fakultas {prodi.faculty} • Update terakhir: {prodi.lastUpdated}
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{prodi.currentScore}</div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(prodi.trend)}
                  <span className={`text-sm ${getTrendColor(prodi.trend)}`}>
                    {prodi.trendValue > 0 ? '+' : ''}{prodi.trendValue}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FiUsers className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-lg font-semibold text-gray-800 dark:text-white">{prodi.studentsCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Mahasiswa</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FiBookOpen className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-semibold text-gray-800 dark:text-white">{prodi.lecturersCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Tenaga Pengajar</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FiTarget className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-lg font-semibold text-gray-800 dark:text-white">{prodi.completionRate}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Kelengkapan</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FiBarChart className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-lg font-semibold text-gray-800 dark:text-white">{prodi.documentsUploaded}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Dokumen</div>
              </div>
            </div>

            {/* Issues & Recommendations */}
            {prodi.issues.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                  <FiAlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                  Area yang Perlu Perhatian
                </h4>
                <ul className="space-y-2">
                  {prodi.issues.map((issue, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-2"></span>
                      <span className="text-gray-600 dark:text-gray-400">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QualityAnalytics;
