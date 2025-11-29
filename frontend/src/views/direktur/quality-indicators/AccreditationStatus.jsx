import React, { useState, useEffect } from 'react';
import { 
  FiCheckCircle, 
  FiAward, 
  FiCalendar,
  FiTrendingUp,
  FiAlertTriangle,
  FiClock,
  FiFileText,
  FiEye,
  FiDownload,
  FiTarget,
  FiBarChart
} from 'react-icons/fi';
import Widget from "components/widget/Widget";

const AccreditationStatus = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2024');
  
  const [accreditationData, setAccreditationData] = useState({
    overview: {
      total: 24,
      aGrade: 12,
      bGrade: 8,
      cGrade: 3,
      pending: 1,
      upcomingReviews: 6,
      expiringSoon: 3
    },
    programs: [
      {
        id: 1,
        name: 'Teknik Informatika',
        faculty: 'Fakultas Teknik',
        currentGrade: 'A',
        previousGrade: 'B',
        accreditationDate: '2023-12-15',
        expiryDate: '2026-12-15',
        nextReview: '2026-06-15',
        status: 'active',
        score: 92.5,
        improvements: [
          'Enhanced curriculum alignment with industry standards',
          'Improved faculty qualifications',
          'Better learning facilities'
        ],
        challenges: [
          'Need more industry partnerships',
          'Research output could be increased'
        ]
      },
      {
        id: 2,
        name: 'Manajemen Bisnis',
        faculty: 'Fakultas Ekonomi',
        currentGrade: 'B',
        previousGrade: 'B',
        accreditationDate: '2023-06-20',
        expiryDate: '2026-06-20',
        nextReview: '2026-01-20',
        status: 'renewal-due',
        score: 85.3,
        improvements: [
          'Updated teaching methodologies',
          'Better student assessment methods'
        ],
        challenges: [
          'Faculty development needed',
          'Infrastructure upgrades required'
        ]
      },
      {
        id: 3,
        name: 'Psikologi',
        faculty: 'Fakultas Psikologi',
        currentGrade: 'A',
        previousGrade: 'A',
        accreditationDate: '2024-01-10',
        expiryDate: '2027-01-10',
        nextReview: '2026-10-10',
        status: 'active',
        score: 89.7,
        improvements: [
          'Advanced research facilities',
          'International collaboration programs'
        ],
        challenges: [
          'Limited clinical training sites'
        ]
      },
      {
        id: 4,
        name: 'Sistem Informasi',
        faculty: 'Fakultas Teknik',
        currentGrade: null,
        previousGrade: null,
        accreditationDate: null,
        expiryDate: null,
        nextReview: '2024-12-15',
        status: 'pending',
        score: null,
        improvements: [],
        challenges: [
          'Initial accreditation preparation',
          'Documentation completion'
        ]
      }
    ],
    timeline: [
      {
        id: 1,
        program: 'Teknik Informatika',
        event: 'Accreditation Upgraded',
        date: '2023-12-15',
        type: 'upgrade',
        details: 'Successfully upgraded from B to A grade'
      },
      {
        id: 2,
        program: 'Psikologi',
        event: 'Accreditation Renewed',
        date: '2024-01-10',
        type: 'renewal',
        details: 'A grade accreditation renewed for 3 years'
      },
      {
        id: 3,
        program: 'Sistem Informasi',
        event: 'Review Scheduled',
        date: '2024-12-15',
        type: 'scheduled',
        details: 'Initial accreditation review scheduled'
      }
    ],
    standards: {
      governance: { score: 88, trend: 2.1 },
      curriculum: { score: 85, trend: 1.8 },
      faculty: { score: 87, trend: 2.3 },
      facilities: { score: 82, trend: -0.5 },
      research: { score: 84, trend: 3.2 },
      service: { score: 86, trend: 1.5 },
      outcomes: { score: 89, trend: 2.8 },
      sustainability: { score: 83, trend: 1.1 }
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'renewal-due':
        return 'text-amber-600 bg-amber-100';
      case 'pending':
        return 'text-blue-600 bg-blue-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A':
        return 'text-green-600 bg-green-100';
      case 'B':
        return 'text-blue-600 bg-blue-100';
      case 'C':
        return 'text-amber-600 bg-amber-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const ProgramCard = ({ program }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{program.name}</h3>
          <p className="text-gray-600 text-sm">{program.faculty}</p>
        </div>
        <div className="flex space-x-2">
          {program.currentGrade && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getGradeColor(program.currentGrade)}`}>
              Grade {program.currentGrade}
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
            {program.status.replace('-', ' ')}
          </span>
        </div>
      </div>
      
      {program.score && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Accreditation Score</span>
            <span className="font-medium">{program.score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${program.score}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        {program.accreditationDate && (
          <div>
            <span className="block text-gray-500">Accredited</span>
            <span className="font-medium">{new Date(program.accreditationDate).toLocaleDateString('id-ID')}</span>
          </div>
        )}
        {program.expiryDate && (
          <div>
            <span className="block text-gray-500">Expires</span>
            <span className="font-medium">{new Date(program.expiryDate).toLocaleDateString('id-ID')}</span>
          </div>
        )}
        <div>
          <span className="block text-gray-500">Next Review</span>
          <span className="font-medium">{new Date(program.nextReview).toLocaleDateString('id-ID')}</span>
        </div>
      </div>
      
      {program.improvements.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-green-700 mb-2">Recent Improvements</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {program.improvements.slice(0, 2).map((improvement, index) => (
              <li key={index} className="flex items-start">
                <FiCheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {program.challenges.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-amber-700 mb-2">Areas for Improvement</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {program.challenges.slice(0, 2).map((challenge, index) => (
              <li key={index} className="flex items-start">
                <FiAlertTriangle className="w-3 h-3 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                {challenge}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex space-x-2">
        <button className="flex-1 py-2 px-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
          <FiEye className="w-4 h-4 inline mr-1" />
          View Details
        </button>
        <button className="py-2 px-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm">
          <FiDownload className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const TimelineItem = ({ item }) => {
    const getEventIcon = () => {
      switch (item.type) {
        case 'upgrade':
          return <FiTrendingUp className="w-5 h-5 text-green-600" />;
        case 'renewal':
          return <FiCheckCircle className="w-5 h-5 text-blue-600" />;
        case 'scheduled':
          return <FiCalendar className="w-5 h-5 text-amber-600" />;
        default:
          return <FiClock className="w-5 h-5 text-gray-600" />;
      }
    };

    return (
      <div className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-shrink-0">
          {getEventIcon()}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">{item.event}</h4>
          <p className="text-sm text-gray-600">{item.program}</p>
          <p className="text-xs text-gray-500 mt-1">{item.details}</p>
          <p className="text-xs text-gray-400 mt-2">{new Date(item.date).toLocaleDateString('id-ID')}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
  <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Accreditation Status</h1>
          <p className="text-gray-600">
            Comprehensive overview of program accreditation status and compliance tracking
          </p>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{accreditationData.overview.total}</div>
            <div className="text-xs text-gray-600">Total Programs</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{accreditationData.overview.aGrade}</div>
            <div className="text-xs text-gray-600">Grade A</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{accreditationData.overview.bGrade}</div>
            <div className="text-xs text-gray-600">Grade B</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-amber-600 mb-1">{accreditationData.overview.cGrade}</div>
            <div className="text-xs text-gray-600">Grade C</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{accreditationData.overview.upcomingReviews}</div>
            <div className="text-xs text-gray-600">Upcoming Reviews</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{accreditationData.overview.expiringSoon}</div>
            <div className="text-xs text-gray-600">Expiring Soon</div>
          </div>
        </div>

        {/* Filters */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Filter by:</span>
            </div>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Programs</option>
              <option value="grade-a">Grade A</option>
              <option value="grade-b">Grade B</option>
              <option value="grade-c">Grade C</option>
              <option value="pending">Pending</option>
              <option value="expiring">Expiring Soon</option>
            </select>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="all">All Years</option>
            </select>
            <button className="ml-auto flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FiDownload className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Program Status Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Program Accreditation Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accreditationData.programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Accreditation Standards Performance */}
          <Widget extra="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Standards Performance</h2>
              <FiTarget className="w-6 h-6 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {Object.entries(accreditationData.standards).map(([standard, data]) => (
                <div key={standard} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="capitalize text-sm font-medium text-gray-700">
                      {standard.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{data.score}%</span>
                      <span className={`text-xs ${
                        data.trend > 0 ? 'text-green-600' : data.trend < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {data.trend > 0 ? '↑' : data.trend < 0 ? '↓' : '→'} {Math.abs(data.trend)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Widget>

          {/* Recent Timeline */}
          <Widget extra="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Accreditation Timeline</h2>
              <FiCalendar className="w-6 h-6 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {accreditationData.timeline.map((item) => (
                <TimelineItem key={item.id} item={item} />
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
              View Full Timeline
            </button>
          </Widget>
        </div>

        {/* Accreditation Distribution Chart */}
  <Widget extra="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Accreditation Distribution & Trends</h2>
            <FiBarChart className="w-6 h-6 text-gray-500" />
          </div>
          
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <FiBarChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Accreditation distribution and trends visualization</p>
              <p className="text-gray-400 text-sm mt-2">Interactive charts showing grade distribution over time</p>
            </div>
          </div>
        </Widget>
      </div>
    </div>
  );
};

export default AccreditationStatus;


