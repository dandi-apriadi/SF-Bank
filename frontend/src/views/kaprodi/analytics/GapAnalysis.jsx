import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchGapAnalysis } from 'store/slices/gapSlice';
import {
  FiBarChart,
  FiTrendingUp,
  FiTrendingDown,
  FiTarget,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiInfo
} from "react-icons/fi";
import Card from "components/card";
import { colors, tokenClasses } from 'styles/designTokens';

const GapAnalysis = () => {
  const [selectedCriteria, setSelectedCriteria] = useState("all");
  const gapState = useSelector(state => state.gaps.data);
  const dispatch = useDispatch();
  const [analysisData, setAnalysisData] = useState([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    if(!gapState) {
      dispatch(fetchGapAnalysis());
    }
  }, [gapState, dispatch]);

  useEffect(()=>{
    if(gapState?.criteria) {
      setAnalysisData(gapState.criteria.map(c => ({
        criteria: String(c.id),
        title: c.title,
        currentScore: c.current,
        targetScore: c.target,
        maxScore: 4.0,
        completeness: c.completeness,
        status: c.status,
        subCriteria: [
          { code: c.id + '.1', name: 'Sub 1', score: c.current - 0.1, target: c.target, status: c.status },
          { code: c.id + '.2', name: 'Sub 2', score: c.current, target: c.target, status: c.status }
        ],
        gaps: [ 'Dummy gap untuk ' + c.title ],
        recommendations: [ 'Rekomendasi perbaikan untuk ' + c.title ]
      })));
      const totalScore = gapState.criteria.reduce((s,c)=>s+c.current,0);
      setOverallScore(totalScore / gapState.criteria.length);
    } else if(!gapState) {
      loadAnalysisData();
    }
  }, [gapState]);

  // Fallback local dummy data (used only if slice not loaded yet)
  const loadAnalysisData = () => {
    const dummyAnalysis = [
      {
        criteria: "1",
        title: "Visi, Misi, Tujuan dan Sasaran",
        currentScore: 3.8,
        targetScore: 4.0,
        maxScore: 4.0,
        completeness: 95,
        status: "good",
        subCriteria: [
          { code: "1.1", name: "Visi Misi", score: 4.0, target: 4.0, status: "excellent" },
          { code: "1.2", name: "Tujuan", score: 3.7, target: 4.0, status: "good" },
          { code: "1.3", name: "Sasaran", score: 3.6, target: 4.0, status: "fair" }
        ],
        gaps: [
          "Perlu perbaikan dokumentasi sasaran strategis",
          "Sosialisasi visi misi kepada stakeholder perlu ditingkatkan"
        ],
        recommendations: [
          "Update dokumen sasaran strategis dengan indikator yang terukur",
          "Laksanakan workshop sosialisasi visi misi ke seluruh civitas akademika"
        ]
      },
      {
        criteria: "2",
        title: "Tata Pamong, Tata Kelola dan Kerjasama",
        currentScore: 3.5,
        targetScore: 4.0,
        maxScore: 4.0,
        completeness: 87,
        status: "fair",
        subCriteria: [
          { code: "2.1", name: "Tata Pamong", score: 3.8, target: 4.0, status: "good" },
          { code: "2.2", name: "Kepemimpinan", score: 3.4, target: 4.0, status: "fair" },
          { code: "2.3", name: "Kerjasama", score: 3.3, target: 4.0, status: "fair" }
        ],
        gaps: [
          "Dokumentasi SOP tata kelola belum lengkap",
          "Kerjasama dengan industri masih terbatas",
          "Sistem monitoring kinerja perlu diperkuat"
        ],
        recommendations: [
          "Lengkapi dan update seluruh SOP tata kelola",
          "Tingkatkan kerjasama dengan industri minimal 5 partner baru",
          "Implementasikan sistem monitoring kinerja berbasis IT"
        ]
      },
      {
        criteria: "3",
        title: "Mahasiswa",
        currentScore: 3.6,
        targetScore: 4.0,
        maxScore: 4.0,
        completeness: 90,
        status: "good",
        subCriteria: [
          { code: "3.1", name: "Penerimaan", score: 3.9, target: 4.0, status: "good" },
          { code: "3.2", name: "Layanan", score: 3.5, target: 4.0, status: "fair" },
          { code: "3.3", name: "Prestasi", score: 3.4, target: 4.0, status: "fair" }
        ],
        gaps: [
          "Layanan konseling akademik perlu ditingkatkan",
          "Program pengembangan soft skill masih kurang",
          "Tracking alumni belum optimal"
        ],
        recommendations: [
          "Tingkatkan rasio dosen pembimbing akademik",
          "Develop program pelatihan soft skill terintegrasi",
          "Implementasikan sistem tracking alumni berbasis digital"
        ]
      },
      {
        criteria: "4",
        title: "Sumber Daya Manusia",
        currentScore: 3.2,
        targetScore: 4.0,
        maxScore: 4.0,
        completeness: 80,
        status: "warning",
        subCriteria: [
          { code: "4.1", name: "Profil Dosen", score: 3.4, target: 4.0, status: "fair" },
          { code: "4.2", name: "Kualifikasi", score: 3.0, target: 4.0, status: "warning" },
          { code: "4.3", name: "Kinerja", score: 3.2, target: 4.0, status: "fair" }
        ],
        gaps: [
          "Rasio dosen bergelar S3 masih di bawah standar",
          "Beban kerja dosen tidak merata",
          "Program pengembangan SDM perlu sistematis"
        ],
        recommendations: [
          "Fasilitasi 3 dosen untuk melanjutkan studi S3",
          "Redistribusi beban kerja dosen secara proporsional",
          "Susun roadmap pengembangan SDM 5 tahun ke depan"
        ]
      },
      {
        criteria: "5",
        title: "Keuangan, Sarana dan Prasarana",
        currentScore: 3.4,
        targetScore: 4.0,
        maxScore: 4.0,
        completeness: 85,
        status: "fair",
        subCriteria: [
          { code: "5.1", name: "Keuangan", score: 3.6, target: 4.0, status: "good" },
          { code: "5.2", name: "Sarana", score: 3.3, target: 4.0, status: "fair" },
          { code: "5.3", name: "Prasarana", score: 3.3, target: 4.0, status: "fair" }
        ],
        gaps: [
          "Laboratorium perlu update peralatan",
          "Sistem informasi akademik perlu upgrade",
          "Fasilitas perpustakaan digital masih terbatas"
        ],
        recommendations: [
          "Procure peralatan lab senilai 500 juta",
          "Upgrade sistem informasi akademik ke versi terbaru",
          "Berlangganan database jurnal internasional tambahan"
        ]
      }
    ];
    
    setAnalysisData(dummyAnalysis);
    
    // Calculate overall score
    const totalScore = dummyAnalysis.reduce((sum, item) => sum + item.currentScore, 0);
    const avgScore = totalScore / dummyAnalysis.length;
    setOverallScore(avgScore);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return colors.badgeCompleted;
      case 'good': return colors.badgeProgress;
      case 'fair': return colors.badgePending;
      case 'warning': return colors.badgeError;
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "excellent":
        return <FiCheckCircle className="h-5 w-5 text-green-600" />;
      case "good":
        return <FiTrendingUp className="h-5 w-5 text-blue-600" />;
      case "fair":
        return <FiClock className="h-5 w-5 text-amber-600" />;
      case "warning":
        return <FiAlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <FiInfo className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredData = selectedCriteria === "all" 
    ? analysisData 
    : analysisData.filter(item => item.criteria === selectedCriteria);

  const getOverallStatus = (score) => {
    if (score >= 3.5) return "good";
    if (score >= 3.0) return "fair";
    return "warning";
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      {/* Header */}
  <Card extra="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Analisis Gap Akreditasi
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Analisis kesenjangan antara kondisi saat ini dengan target akreditasi
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{overallScore.toFixed(2)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Skor Rata-rata</div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getOverallStatus(overallScore))}`}>
              {getOverallStatus(overallScore) === "good" ? "Baik" : 
               getOverallStatus(overallScore) === "fair" ? "Cukup" : "Perlu Perhatian"}
            </span>
          </div>
        </div>
      </Card>

    {/* Filter */}
  <Card extra="p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter Kriteria:
          </label>
          <select
            value={selectedCriteria}
            onChange={(e) => setSelectedCriteria(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Semua Kriteria</option>
            <option value="1">Kriteria 1 - Visi Misi</option>
            <option value="2">Kriteria 2 - Tata Pamong</option>
            <option value="3">Kriteria 3 - Mahasiswa</option>
            <option value="4">Kriteria 4 - SDM</option>
            <option value="5">Kriteria 5 - Keuangan & Sarana</option>
          </select>
        </div>
      </Card>

  {/* Summary Cards */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
  <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-green-600">
            {analysisData.filter(item => item.status === "good" || item.status === "excellent").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Kriteria Baik</div>
        </Card>
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-amber-600">
            {analysisData.filter(item => item.status === "fair").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Perlu Perbaikan</div>
        </Card>
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-red-600">
            {analysisData.filter(item => item.status === "warning").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Perlu Perhatian</div>
        </Card>
        <Card extra="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(analysisData.reduce((sum, item) => sum + item.completeness, 0) / analysisData.length)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Kelengkapan Rata-rata</div>
        </Card>
      </div>

  {/* Detailed Analysis */}
  <div className="space-y-6">
        {filteredData.map((criteria) => (
          <Card key={criteria.criteria} extra="p-6 hover:shadow-md transition-shadow">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(criteria.status)}
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Kriteria {criteria.criteria}: {criteria.title}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(criteria.status)}`}>
                  {criteria.status === "excellent" ? "Sangat Baik" :
                   criteria.status === "good" ? "Baik" :
                   criteria.status === "fair" ? "Cukup" : "Perlu Perhatian"}
                </span>
              </div>

              {/* Score Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{criteria.currentScore}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Skor Saat Ini</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{criteria.targetScore}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Target Skor</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{criteria.completeness}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Kelengkapan</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {(criteria.targetScore - criteria.currentScore).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Gap Score</div>
                </div>
              </div>

              {/* Sub Criteria */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                  Sub Kriteria
                </h4>
                <div className="space-y-3">
                  {criteria.subCriteria.map((sub, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(sub.status)}
                        <span className="font-medium text-gray-800 dark:text-white">
                          {sub.code} - {sub.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {sub.score} / {sub.target}
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(sub.score / sub.target) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gaps and Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                    <FiAlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                    Gap yang Teridentifikasi
                  </h4>
                  <ul className="space-y-2">
                    {criteria.gaps.map((gap, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                        <span className="text-gray-600 dark:text-gray-400">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                    <FiTarget className="mr-2 h-5 w-5 text-green-500" />
                    Rekomendasi Perbaikan
                  </h4>
                  <ul className="space-y-2">
                    {criteria.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                        <span className="text-gray-600 dark:text-gray-400">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GapAnalysis;
