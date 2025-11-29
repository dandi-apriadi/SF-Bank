import React, { useState, useEffect } from 'react';
import { 
  FiAward, 
  FiTrendingUp, 
  FiBookOpen,
  FiUsers,
  FiTarget,
  FiBarChart,
  FiCheckCircle,
  FiCalendar,
  FiEye,
  FiDownload
} from 'react-icons/fi';
import Widget from "components/widget/Widget";

const AcademicQuality = () => {
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('overall');
  
  const [academicData, setAcademicData] = useState({
    overview: {
      totalPrograms: 24,
      aAccredited: 12,
      bAccredited: 8,
      cAccredited: 4,
      avgQualityScore: 85.2,
      studentSatisfaction: 88.5
    },
    qualityMetrics: [
      {
        id: 1,
        name: 'Curriculum Quality',
        score: 87.5,
        trend: 2.1,
        description: 'Relevance, structure, and alignment with industry needs',
        subMetrics: {
          relevance: 89,
          structure: 86,
          industryAlignment: 88
        }
      },
      {
        id: 2,
        name: 'Teaching Excellence',
        score: 84.3,
        trend: 1.8,
        description: 'Instructor quality, teaching methods, student engagement',
        subMetrics: {
          instructorQuality: 87,
          teachingMethods: 82,
          engagement: 84
        }
      },
      {
        id: 3,
        name: 'Learning Outcomes',
        score: 86.7,
        trend: 2.5,
        description: 'Achievement of learning objectives and competencies',
        subMetrics: {
          competencyAchievement: 88,
          skillDevelopment: 85,
          knowledgeRetention: 87
        }
      },
      {
        id: 4,
        name: 'Assessment Quality',
        score: 82.1,
        trend: 1.2,
        description: 'Fairness, validity, and reliability of assessments',
        subMetrics: {
          fairness: 84,
          validity: 81,
          reliability: 81
        }
      }
    ],
    facultyPerformance: [
      {
        id: 1,
        name: 'Fakultas Teknik',
        programs: 6,
        avgScore: 88.2,
        trend: 3.1,
        accreditationDistribution: { A: 4, B: 2, C: 0 }
      },
      {
        id: 2,
        name: 'Fakultas Ekonomi',
        programs: 5,
        avgScore: 84.5,
        trend: 2.3,
        accreditationDistribution: { A: 3, B: 2, C: 0 }
      },
      {
        id: 3,
        name: 'Fakultas Psikologi',
        programs: 4,
        avgScore: 86.8,
        trend: 1.9,
        accreditationDistribution: { A: 2, B: 1, C: 1 }
      },
      {
        id: 4,
        name: 'Fakultas MIPA',
        programs: 5,
        avgScore: 82.7,
        trend: 1.5,
        accreditationDistribution: { A: 2, B: 2, C: 1 }
      },
      {
        id: 5,
        name: 'Fakultas Sosial',
        programs: 4,
        avgScore: 81.3,
        trend: 2.8,
        accreditationDistribution: { A: 1, B: 1, C: 2 }
      }
    ],
    recentActivities: [
      {
        id: 1,
        type: 'assessment',
        title: 'Curriculum Review Completed',
        faculty: 'Fakultas Teknik',
        date: '2024-08-05',
        impact: 'high'
      },
      {
        id: 2,
        type: 'accreditation',
        title: 'Accreditation Upgrade',
        faculty: 'Fakultas Ekonomi',
        date: '2024-08-03',
        impact: 'high'
      },
      {
        id: 3,
        type: 'improvement',
        title: 'Teaching Method Enhancement',
        faculty: 'Fakultas Psikologi',
        date: '2024-08-01',
        impact: 'medium'
      }
    ]
  });

  const MetricCard = ({ metric }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{metric.name}</h3>
        <div className={`flex items-center text-sm ${
          metric.trend > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          <FiTrendingUp className="w-4 h-4 mr-1" />
          {metric.trend > 0 ? '+' : ''}{metric.trend}%
        </div>
      </div>
      
      <div className="flex items-center mb-3">
        <span className="text-3xl font-bold text-blue-600">{metric.score}</span>
        <span className="text-gray-500 ml-2">/100</span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{metric.description}</p>
      
      {/* Sub-metrics */}
      <div className="space-y-2">
        {Object.entries(metric.subMetrics).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-xs mb-1">
              <span className="capitalize text-gray-600">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="font-medium">{value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
        Analyze Details
      </button>
    </div>
  );

  const FacultyCard = ({ faculty }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{faculty.name}</h3>
          <p className="text-gray-600 text-sm">{faculty.programs} study programs</p>
        </div>
        <div className={`flex items-center text-sm ${
          faculty.trend > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          <FiTrendingUp className="w-4 h-4 mr-1" />
          {faculty.trend > 0 ? '+' : ''}{faculty.trend}%
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Average Quality Score</span>
          <span className="font-medium">{faculty.avgScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${faculty.avgScore}%` }}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Accreditation Distribution</h4>
        <div className="flex space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">A: {faculty.accreditationDistribution.A}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">B: {faculty.accreditationDistribution.B}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">C: {faculty.accreditationDistribution.C}</span>
          </div>
        </div>
      </div>
      
      <button className="w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
        View Faculty Details
      </button>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = () => {
      switch (activity.type) {
        case 'assessment':
          return <FiCheckCircle className="w-5 h-5 text-blue-600" />;
        case 'accreditation':
          return <FiAward className="w-5 h-5 text-green-600" />;
        case 'improvement':
          return <FiTrendingUp className="w-5 h-5 text-purple-600" />;
        default:
          return <FiCalendar className="w-5 h-5 text-gray-600" />;
      }
    };

    const getImpactColor = () => {
      switch (activity.impact) {
        case 'high':
          return 'bg-red-100 text-red-600';
        case 'medium':
          return 'bg-amber-100 text-amber-600';
        case 'low':
          return 'bg-green-100 text-green-600';
        default:
          return 'bg-gray-100 text-gray-600';
      }
    };

    return (
      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
        {getActivityIcon()}
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">{activity.title}</h4>
          <p className="text-sm text-gray-600">{activity.faculty}</p>
          <p className="text-xs text-gray-500 mt-1">{new Date(activity.date).toLocaleDateString('id-ID')}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor()}`}>
          {activity.impact} impact
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
  <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Academic Quality</h1>
          <p className="text-gray-600">
            Comprehensive analysis of curriculum quality, teaching excellence, and learning outcomes
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <FiBookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{academicData.overview.totalPrograms}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-700">Total Programs</h3>
            <p className="text-xs text-gray-500 mt-1">Across all faculties</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <FiAward className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{academicData.overview.aAccredited}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-700">Grade A Programs</h3>
            <p className="text-xs text-gray-500 mt-1">Excellent accreditation</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <FiTarget className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{academicData.overview.avgQualityScore}%</span>
            </div>
            <h3 className="text-sm font-medium text-gray-700">Avg Quality Score</h3>
            <p className="text-xs text-gray-500 mt-1">Institution-wide</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <FiUsers className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold text-indigo-600">{academicData.overview.studentSatisfaction}%</span>
            </div>
            <h3 className="text-sm font-medium text-gray-700">Student Satisfaction</h3>
            <p className="text-xs text-gray-500 mt-1">Latest survey results</p>
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Quality Metrics</h2>
            <div className="flex space-x-4">
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
              >
                <option value="overall">Overall View</option>
                <option value="curriculum">Curriculum Focus</option>
                <option value="teaching">Teaching Focus</option>
                <option value="outcomes">Outcomes Focus</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FiDownload className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academicData.qualityMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </div>

        {/* Faculty Performance */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Faculty Performance</h2>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              <option value="all">All Faculties</option>
              <option value="teknik">Fakultas Teknik</option>
              <option value="ekonomi">Fakultas Ekonomi</option>
              <option value="psikologi">Fakultas Psikologi</option>
              <option value="mipa">Fakultas MIPA</option>
              <option value="sosial">Fakultas Sosial</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academicData.facultyPerformance.map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Academic Trends */}
          <Widget extra="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Academic Quality Trends</h2>
              <FiBarChart className="w-6 h-6 text-gray-500" />
            </div>
            
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <FiBarChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Academic quality trends chart</p>
                <p className="text-gray-400 text-sm mt-2">Time series analysis of quality metrics</p>
              </div>
            </div>
          </Widget>

          {/* Recent Activities */}
          <Widget extra="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {academicData.recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
              View Activity Timeline
            </button>
          </Widget>
        </div>
      </div>
    </div>
  );
};

export default AcademicQuality;


