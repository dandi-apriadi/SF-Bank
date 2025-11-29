import React, { useState } from "react";
import Card from "components/card";
import { FiBarChart, FiTrendingUp, FiUsers, FiAward, FiTarget, FiActivity } from "react-icons/fi";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const AnalitikInstitusi = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("semester");

  // Dummy data untuk analytics
  const accreditationTrends = [
    { period: "2020", unggul: 2, baikSekali: 8, baik: 12, c: 3 },
    { period: "2021", unggul: 3, baikSekali: 10, baik: 10, c: 2 },
    { period: "2022", unggul: 4, baikSekali: 12, baik: 8, c: 1 },
    { period: "2023", unggul: 5, baikSekali: 14, baik: 6, c: 0 },
    { period: "2024", unggul: 6, baikSekali: 16, baik: 3, c: 0 }
  ];

  const qualityMetrics = [
    { bulan: "Jan", skor: 78, target: 75 },
    { bulan: "Feb", skor: 82, target: 75 },
    { bulan: "Mar", skor: 79, target: 75 },
    { bulan: "Apr", skor: 85, target: 75 },
    { bulan: "Mei", skor: 88, target: 75 },
    { bulan: "Jun", skor: 91, target: 75 },
    { bulan: "Jul", skor: 89, target: 75 },
    { bulan: "Ags", skor: 93, target: 75 }
  ];

  const studyProgramDistribution = [
    { name: "Unggul", value: 6, color: "#10B981" },
    { name: "Baik Sekali", value: 16, color: "#3B82F6" },
    { name: "Baik", value: 3, color: "#F59E0B" },
    { name: "C", value: 0, color: "#EF4444" }
  ];

  const performanceByFaculty = [
    { fakultas: "Teknik", skor: 89, prodi: 8, akreditasi: "A" },
    { fakultas: "MIPA", skor: 85, prodi: 6, akreditasi: "A" },
    { fakultas: "Ekonomi", skor: 82, prodi: 4, akreditasi: "B" },
    { fakultas: "Hukum", skor: 78, prodi: 3, akreditasi: "B" },
    { fakultas: "Pertanian", skor: 75, prodi: 5, akreditasi: "B" }
  ];

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  return (
    <div className="mt-3">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white mb-2">
          Analitik Institusi
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Dashboard analitik komprehensif untuk monitoring kualitas institusi
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Program Studi</p>
              <p className="text-2xl font-bold text-navy-700 dark:text-white">25</p>
              <p className="text-xs text-green-600">+2 dari tahun lalu</p>
            </div>
            <FiUsers className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Rata-rata Skor Mutu</p>
              <p className="text-2xl font-bold text-green-600">87.5</p>
              <p className="text-xs text-green-600">+5.2% dari bulan lalu</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Akreditasi Unggul</p>
              <p className="text-2xl font-bold text-blue-600">6</p>
              <p className="text-xs text-blue-600">24% dari total prodi</p>
            </div>
            <FiAward className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Target Tercapai</p>
              <p className="text-2xl font-bold text-purple-600">92%</p>
              <p className="text-xs text-green-600">+8% dari target</p>
            </div>
            <FiTarget className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Trend Akreditasi */}
        <Card extra="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-navy-700 dark:text-white mb-2">
              Tren Akreditasi Program Studi
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Perkembangan peringkat akreditasi selama 5 tahun terakhir
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={accreditationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="unggul" stackId="1" stroke="#10B981" fill="#10B981" />
              <Area type="monotone" dataKey="baikSekali" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
              <Area type="monotone" dataKey="baik" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
              <Area type="monotone" dataKey="c" stackId="1" stroke="#EF4444" fill="#EF4444" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Distribusi Akreditasi */}
        <Card extra="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-navy-700 dark:text-white mb-2">
              Distribusi Peringkat Akreditasi
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Komposisi peringkat akreditasi saat ini
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={studyProgramDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {studyProgramDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tren Kualitas */}
        <Card extra="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-navy-700 dark:text-white mb-2">
              Tren Skor Kualitas Institusi
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Perbandingan skor aktual dengan target bulanan
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={qualityMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="skor" stroke="#10B981" strokeWidth={3} name="Skor Aktual" />
              <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Performance by Faculty */}
        <Card extra="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-navy-700 dark:text-white mb-2">
              Performa per Fakultas
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Skor kualitas rata-rata setiap fakultas
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceByFaculty}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fakultas" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="skor" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance Table */}
      <Card extra="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-navy-700 dark:text-white mb-2">
            Detail Performa Fakultas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Ringkasan lengkap performa setiap fakultas
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Fakultas</th>
                <th className="px-6 py-3">Skor Kualitas</th>
                <th className="px-6 py-3">Jumlah Prodi</th>
                <th className="px-6 py-3">Akreditasi Tertinggi</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {performanceByFaculty.map((faculty, index) => (
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {faculty.fakultas}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${
                      faculty.skor >= 85 ? 'text-green-600' : 
                      faculty.skor >= 75 ? 'text-blue-600' : 'text-amber-600'
                    }`}>
                      {faculty.skor}
                    </span>
                  </td>
                  <td className="px-6 py-4">{faculty.prodi}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      faculty.akreditasi === 'A' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {faculty.akreditasi}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      faculty.skor >= 85 ? 'bg-green-100 text-green-800' : 
                      faculty.skor >= 75 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {faculty.skor >= 85 ? 'Sangat Baik' : faculty.skor >= 75 ? 'Baik' : 'Perlu Perbaikan'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export Actions */}
      <div className="mt-6 flex gap-4">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <FiBarChart className="w-5 h-5" />
          Export Analitik
        </button>
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
          <FiActivity className="w-5 h-5" />
          Generate Laporan
        </button>
      </div>
    </div>
  );
};

export default AnalitikInstitusi;
