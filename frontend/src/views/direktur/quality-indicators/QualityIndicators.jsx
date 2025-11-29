import React, { useState, useEffect } from 'react';
import { 
  FiTarget, 
  FiAward, 
  FiCheckCircle, 
  FiTrendingUp,
  FiBarChart,
  FiPieChart,
  FiActivity,
  FiAlertTriangle,
  FiEye,
  FiFilter
} from 'react-icons/fi';
import Widget from "components/widget/Widget";

const QualityIndicators = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [qualityData, setQualityData] = useState({
    overall: {
      score: 85.2,
      trend: 2.3,
      status: 'excellent'
    },
    categories: [
      {
        id: 1,
        name: 'Academic Excellence',
        score: 88.5,
        trend: 3.1,
        color: 'blue',
        icon: FiAward,
        description: 'Curriculum quality, teaching effectiveness, learning outcomes',
        details: {
          curriculum: 92,
          teaching: 87,
          outcomes: 86
        }
      },
      {
        id: 2,
        name: 'Research Quality',
        score: 82.3,
        trend: 1.8,
        color: 'purple',
        icon: FiTarget,
        description: 'Research output, publications, innovation metrics',
        details: {
          output: 85,
          publications: 78,
          innovation: 84
        }
      },
      {
        id: 3,
        name: 'Service Excellence',
        score: 84.7,
        trend: 2.5,
        color: 'green',
        icon: FiActivity,
        description: 'Community service, stakeholder satisfaction, partnerships',
        details: {
          community: 87,
          satisfaction: 83,
          partnerships: 84
        }
      },
      {
        id: 4,
        name: 'Infrastructure Quality',
        score: 79.1,
        trend: -0.5,
        color: 'indigo',
        icon: FiCheckCircle,
        description: 'Facilities, technology, learning resources',
        details: {
          facilities: 82,
          technology: 78,
          resources: 77
        }
      }
    ],
    benchmarks: [
      { name: 'National Average', score: 75.5, color: 'gray' },
      { name: 'Regional Best', score: 89.2, color: 'amber' },
      { name: 'International Standard', score: 92.0, color: 'red' }
    ]
  });

  const [studyPrograms, setStudyPrograms] = useState([
    {
      id: 1,
      name: 'Teknik Informatika',
      accreditation: 'A',
      score: 92.5,
      lastReview: '2023-12-15',
      nextReview: '2026-12-15',
      status: 'excellent',
      students: 450
    },
    {
      id: 2,
      name: 'Manajemen Bisnis',
      accreditation: 'B',
      score: 85.3,
      lastReview: '2023-06-20',
      nextReview: '2026-06-20',
      status: 'good',
      students: 380
    },
    {
      id: 3,
      name: 'Psikologi',
      accreditation: 'A',
      score: 89.7,
      lastReview: '2024-01-10',
      nextReview: '2027-01-10',
      status: 'excellent',
      students: 320
    },
    {
      id: 4,
      name: 'Akuntansi',
      accreditation: 'B',
      score: 82.1,
      lastReview: '2023-09-05',
      nextReview: '2026-09-05',
      status: 'good',
      students: 410
    }
  ]);

  const QualityCard = ({ category }) => {
    const Icon = category.icon;
    return (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 bg-${category.color}-100 rounded-lg`}>
            <Icon className={`w-6 h-6 text-${category.color}-600`} />
          </div>
          <div className={`flex items-center text-sm ${
            category.trend > 0 ? 'text-green-600' : category.trend < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            <FiTrendingUp className="w-4 h-4 mr-1" />
            {category.trend > 0 ? '+' : ''}{category.trend}%
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h3>
        <div className="flex items-center mb-3">
          <span className={`text-3xl font-bold text-${category.color}-600`}>{category.score}</span>
          <span className="text-gray-500 ml-2">/100</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{category.description}</p>
        
        {/* Progress bars for sub-metrics */}
        <div className="space-y-2">
          {Object.entries(category.details).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-xs mb-1">
                <span className="capitalize text-gray-600">{key}</span>
                <span className="font-medium">{value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`bg-${category.color}-500 h-1.5 rounded-full transition-all duration-500`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <button className={`mt-4 w-full py-2 px-4 bg-${category.color}-50 text-${category.color}-700 rounded-lg hover:bg-${category.color}-100 transition-colors text-sm font-medium`}>
          View Details
        </button>
      </div>
    );
  };

  const StudyProgramCard = ({ program }) => {
    const getStatusColor = () => {
      switch (program.status) {
        case 'excellent':
          return 'text-green-600 bg-green-100';
        case 'good':
          return 'text-blue-600 bg-blue-100';
        case 'needs-improvement':
          return 'text-amber-600 bg-amber-100';
        default:
          return 'text-gray-600 bg-gray-100';
      }
    };

    const getAccreditationColor = () => {
      switch (program.accreditation) {
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

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{program.name}</h3>
            <p className="text-gray-600 text-sm">{program.students} students</p>
          </div>
          <div className="flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAccreditationColor()}`}>
              Grade {program.accreditation}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {program.status.replace('-', ' ')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Quality Score</span>
              <span className="font-medium">{program.score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${program.score}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div>
            <span className="block font-medium">Last Review</span>
            <span>{new Date(program.lastReview).toLocaleDateString('id-ID')}</span>
          </div>
          <div>
            <span className="block font-medium">Next Review</span>
            <span>{new Date(program.nextReview).toLocaleDateString('id-ID')}</span>
          </div>
        </div>
        
        <button className="w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
          View Program Details
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
  <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quality Indicators</h1>
          <p className="text-gray-600">
            Comprehensive overview of institutional quality metrics and performance indicators
          </p>
        </div>

        {/* Filters */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <FiFilter className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filters:</span>
            </div>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="current">Current Period</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic</option>
              <option value="research">Research</option>
              <option value="service">Service</option>
              <option value="infrastructure">Infrastructure</option>
            </select>
          </div>
        </div>

        {/* Overall Quality Score */}
  <Widget extra="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Overall Quality Score</h2>
            <FiTarget className="w-6 h-6 text-gray-500" />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              {/* Circular progress would go here - simplified as a large score display */}
              <div className="flex items-center justify-center w-full h-full bg-blue-50 rounded-full">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {qualityData.overall.score}
                  </div>
                  <div className="text-gray-600 text-sm">Overall Score</div>
                  <div className={`text-sm mt-1 ${
                    qualityData.overall.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {qualityData.overall.trend > 0 ? '↑' : '↓'} {Math.abs(qualityData.overall.trend)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Benchmarks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {qualityData.benchmarks.map((benchmark, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-lg font-bold text-${benchmark.color}-600`}>
                  {benchmark.score}
                </div>
                <div className="text-sm text-gray-600">{benchmark.name}</div>
              </div>
            ))}
          </div>
        </Widget>

        {/* Quality Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Quality Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {qualityData.categories.map((category) => (
              <QualityCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Study Program Performance */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Study Program Performance</h2>
            <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <FiEye className="w-5 h-5 mr-2" />
              View All Programs
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studyPrograms.map((program) => (
              <StudyProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>

        {/* Quality Trends */}
  <Widget extra="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Quality Trends</h2>
            <FiBarChart className="w-6 h-6 text-gray-500" />
          </div>
          
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <FiBarChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Interactive quality trends chart would be displayed here</p>
              <p className="text-gray-400 text-sm mt-2">Integration with charting library (Chart.js, D3.js, etc.)</p>
            </div>
          </div>
        </Widget>
      </div>
    </div>
  );
};

export default QualityIndicators;


