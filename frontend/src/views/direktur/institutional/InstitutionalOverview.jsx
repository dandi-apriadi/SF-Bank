import React, { useEffect, useState } from 'react';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiAward, 
  FiBarChart,
  FiTarget,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiBookOpen,
  FiGlobe,
  FiPieChart,
  FiActivity,
  FiArrowRight,
  FiExternalLink,
  FiStar,
  FiShield,
  FiHeart,
  FiZap,
  FiTrendingDown,
  FiClock,
  FiEye,
  FiDownload
} from 'react-icons/fi';
import Widget from "components/widget/Widget";
import { apiClient } from '../../../services/api';

const InstitutionalOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const resp = await apiClient.get('/api/institution/overview');
        if (!mounted) return;
        setData(resp);
      } catch (err) {
        console.error('Failed to load institution overview', err);
        setError(err.message || 'Failed to load data');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const getColorClasses = (color) => {
    const colorMap = {
      blue: { 
        text: 'text-blue-600', 
        bg: 'bg-blue-100', 
        gradient: 'from-blue-500 to-blue-600',
        border: 'border-blue-200',
        shadow: 'shadow-blue-100'
      },
      purple: { 
        text: 'text-purple-600', 
        bg: 'bg-purple-100', 
        gradient: 'from-purple-500 to-purple-600',
        border: 'border-purple-200',
        shadow: 'shadow-purple-100'
      },
      green: { 
        text: 'text-green-600', 
        bg: 'bg-green-100', 
        gradient: 'from-green-500 to-green-600',
        border: 'border-green-200',
        shadow: 'shadow-green-100'
      },
      indigo: { 
        text: 'text-indigo-600', 
        bg: 'bg-indigo-100', 
        gradient: 'from-indigo-500 to-indigo-600',
        border: 'border-indigo-200',
        shadow: 'shadow-indigo-100'
      },
      teal: { 
        text: 'text-teal-600', 
        bg: 'bg-teal-100', 
        gradient: 'from-teal-500 to-teal-600',
        border: 'border-teal-200',
        shadow: 'shadow-teal-100'
      },
      amber: { 
        text: 'text-amber-600', 
        bg: 'bg-amber-100', 
        gradient: 'from-amber-500 to-amber-600',
        border: 'border-amber-200',
        shadow: 'shadow-amber-100'
      },
      red: { 
        text: 'text-red-600', 
        bg: 'bg-red-100', 
        gradient: 'from-red-500 to-red-600',
        border: 'border-red-200',
        shadow: 'shadow-red-100'
      },
      gray: { 
        text: 'text-gray-600', 
        bg: 'bg-gray-100', 
        gradient: 'from-gray-500 to-gray-600',
        border: 'border-gray-200',
        shadow: 'shadow-gray-100'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const StatCard = ({ title, value, icon: Icon, color = "blue", subtitle, trend }) => {
    const colorClasses = getColorClasses(color);
    return (
      <div className={`bg-white rounded-xl shadow-lg border ${colorClasses.border} p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-medium">{title}</p>
              {trend && (
                <div className={`flex items-center text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend > 0 ? <FiTrendingUp className="w-3 h-3 mr-1" /> : <FiTrendingDown className="w-3 h-3 mr-1" />}
                  {Math.abs(trend)}%
                </div>
              )}
            </div>
            <h3 className={`text-3xl font-bold ${colorClasses.text} mb-1 group-hover:scale-105 transition-transform duration-200`}>
              {value}
            </h3>
            {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
          </div>
          <div className={`p-4 bg-gradient-to-br ${colorClasses.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const ProgressBar = ({ progress, color = "blue", animated = true }) => {
    const getProgressColor = (color) => {
      const colorMap = {
        blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
        green: 'bg-gradient-to-r from-green-500 to-green-600',
        purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
        amber: 'bg-gradient-to-r from-amber-500 to-amber-600',
        red: 'bg-gradient-to-r from-red-500 to-red-600',
        gray: 'bg-gradient-to-r from-gray-500 to-gray-600',
        teal: 'bg-gradient-to-r from-teal-500 to-teal-600'
      };
      return colorMap[color] || colorMap.blue;
    };

    return (
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div 
          className={`${getProgressColor(color)} h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${animated ? 'animate-pulse' : ''}`} 
          style={{ width: `${progress}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          )}
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return { bg: 'bg-green-100', text: 'text-green-600', progress: 'green' };
      case 'in-progress': return { bg: 'bg-blue-100', text: 'text-blue-600', progress: 'blue' };
      case 'needs-attention': return { bg: 'bg-amber-100', text: 'text-amber-600', progress: 'amber' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', progress: 'gray' };
    }
  };

  if (loading) return <div className="p-6 text-center">Loading institutional overview…</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
  {/* Header with Enhanced Design */}
  <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg mb-4">
              <FiShield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Institutional Overview
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive overview of institutional profile, performance metrics, and strategic positioning in the higher education landscape
            </p>
          </div>
          
          {/* Quick Stats Banner */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{data?.institution?.target || 'A'}</div>
                <div className="text-sm text-gray-600">Target Accreditation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{(data?.performance?.accreditationScore ?? 0).toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Current Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">{data?.statistics?.totalPrograms ?? 0}</div>
                <div className="text-sm text-gray-600">Study Programs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-1">{(() => {
                  const s = data?.statistics?.totalStudents ?? 0;
                  if (s >= 1000000) return Math.round(s/1000000)+'M+';
                  if (s >= 1000) return Math.round(s/1000)+'K+';
                  return s;
                })()}</div>
                <div className="text-sm text-gray-600">Active Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Institution Profile with Enhanced Design */}
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <FiBookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Institution Profile</h2>
                <p className="text-gray-600">Complete institutional information and contact details</p>
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <span className="text-sm font-medium">View Details</span>
              <FiExternalLink className="ml-2 w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center text-blue-700">
                <FiBookOpen className="w-5 h-5 mr-3" />
                <span className="text-sm font-semibold">Institution Name</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">{data?.institution?.name || '-'}</p>
            </div>
            
            <div className="space-y-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center text-green-700">
                <FiCalendar className="w-5 h-5 mr-3" />
                <span className="text-sm font-semibold">Founded</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">{data?.institution?.founded || '-'}</p>
            </div>
            
            <div className="space-y-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="flex items-center text-purple-700">
                <FiAward className="w-5 h-5 mr-3" />
                <span className="text-sm font-semibold">Accreditation</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">{data?.institution?.accreditation || '-'}</p>
            </div>
            
            <div className="space-y-3 p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
              <div className="flex items-center text-amber-700">
                <FiBookOpen className="w-5 h-5 mr-3" />
                <span className="text-sm font-semibold">Institution Type</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">{data?.institution?.type || '-'}</p>
            </div>
            
            <div className="space-y-3 p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border border-teal-200">
              <div className="flex items-center text-teal-700">
                <FiMapPin className="w-5 h-5 mr-3" />
                <span className="text-sm font-semibold">Address</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">{data?.institution?.address || '-'}</p>
            </div>
            
            <div className="space-y-3 p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
              <div className="flex items-center text-indigo-700">
                <FiGlobe className="w-5 h-5 mr-3" />
                <span className="text-sm font-semibold">Website</span>
              </div>
              <a 
                href={data?.institution?.website ? `https://${data.institution.website}` : '#'} 
                className="text-indigo-600 font-bold text-lg hover:text-indigo-800 transition-colors underline decoration-2"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {data?.institution?.website || '-'}
              </a>
            </div>

            <div className="space-y-3 p-4 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl border border-rose-200">
              <div className="flex items-center text-rose-700">
                <FiUsers className="w-5 h-5 mr-3" />
                <span className="text-sm font-semibold">Phone</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">{data?.institution?.phone || '-'}</p>
            </div>

            <div className="space-y-3 p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl border border-cyan-200">
              <div className="flex items-center text-cyan-700">
                <FiGlobe className="w-5 h-5 mr-3" />
                <span className="text-sm font-semibold">Email</span>
              </div>
              <a 
                href={data?.institution?.email ? `mailto:${data.institution.email}` : '#'} 
                className="text-cyan-600 font-bold text-lg hover:text-cyan-800 transition-colors underline decoration-2"
              >
                {data?.institution?.email || '-'}
              </a>
            </div>

            <div className="space-y-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center text-green-700">
                <FiUsers className="w-5 h-5 mr-3" />
                <span className="text-sm font-semibold">Total Students</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">{(data?.statistics?.totalStudents ?? 0).toLocaleString()} Students</p>
            </div>
          </div>
        </div>

        {/* Enhanced Key Statistics */}
  <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Key Performance Indicators</h2>
            <p className="text-gray-600">Real-time institutional metrics and performance indicators</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard
              title="Total Faculties"
              value={data?.statistics?.totalFaculties ?? 0}
              icon={FiBookOpen}
              color="blue"
              subtitle="Academic divisions"
              trend={5.2}
            />
            <StatCard
              title="Study Programs"
              value={data?.statistics?.totalPrograms ?? 0}
              icon={FiTarget}
              color="purple"
              subtitle="Undergraduate & Graduate"
              trend={8.1}
            />
            <StatCard
              title="Total Students"
              value={(data?.statistics?.totalStudents ?? 0).toLocaleString()}
              icon={FiUsers}
              color="green"
              subtitle="Active enrollment"
              trend={12.3}
            />
            <StatCard
              title="Faculty Members"
              value={data?.statistics?.totalLecturers ?? 0}
              icon={FiUsers}
              color="indigo"
              subtitle="Teaching staff"
              trend={3.7}
            />
            <StatCard
              title="International Partners"
              value={data?.statistics?.internationalPartners ?? 0}
              icon={FiGlobe}
              color="teal"
              subtitle="Global collaborations"
              trend={15.8}
            />
            <StatCard
              title="Research Projects"
              value={data?.statistics?.researchProjects ?? 0}
              icon={FiBarChart}
              color="amber"
              subtitle="Active research"
              trend={22.4}
            />
            <StatCard
              title="Accredited Programs"
              value={`${data?.statistics?.accreditedPrograms ?? 0}/${data?.statistics?.totalPrograms ?? 0}`}
              icon={FiAward}
              color="green"
              subtitle="Quality assurance"
              trend={6.3}
            />
            <StatCard
              title="Employment Rate"
              value={`${data?.statistics?.graduateEmploymentRate ?? 0}%`}
              icon={FiTrendingUp}
              color="blue"
              subtitle="Graduate success"
              trend={4.5}
            />
          </div>
        </div>

        {/* Recent Achievements with Enhanced Design */}
  <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mr-4">
                  <FiStar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Recent Achievements</h3>
                  <p className="text-gray-600">Latest institutional accomplishments and recognitions</p>
                </div>
              </div>
              <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <FiEye className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">View All</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(data?.recentAchievements || []).map((achievement, index) => (
                <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-gray-900 text-lg leading-tight">{achievement.title}</h4>
                    <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm font-medium">
                      {achievement.date}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      achievement.type === 'ranking' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      achievement.type === 'accreditation' ? 'bg-green-100 text-green-700 border border-green-200' :
                      'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                    </span>
                    <FiZap className={`w-4 h-4 ${
                      achievement.type === 'ranking' ? 'text-blue-500' :
                      achievement.type === 'accreditation' ? 'text-green-500' :
                      'text-amber-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          {/* Enhanced Performance Metrics */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <FiPieChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Performance Metrics</h3>
                  <p className="text-gray-600 text-sm">Key performance indicators</p>
                </div>
              </div>
              <FiTrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-blue-900 font-semibold">Accreditation Score</span>
                  <span className="text-blue-700 font-bold text-lg">{(data?.performance?.accreditationScore ?? 0)}%</span>
                </div>
                <ProgressBar progress={(data?.performance?.accreditationScore ?? 0)} color="blue" />
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-green-900 font-semibold">Graduation Rate</span>
                  <span className="text-green-700 font-bold text-lg">{(data?.performance?.graduationRate ?? 0)}%</span>
                </div>
                <ProgressBar progress={(data?.performance?.graduationRate ?? 0)} color="green" />
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-purple-900 font-semibold">Employment Rate</span>
                  <span className="text-purple-700 font-bold text-lg">{(data?.performance?.employmentRate ?? 0)}%</span>
                </div>
                <ProgressBar progress={(data?.performance?.employmentRate ?? 0)} color="purple" />
              </div>
              
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-amber-900 font-semibold">Student Satisfaction</span>
                  <span className="text-amber-700 font-bold text-lg">{(data?.performance?.studentSatisfaction ?? 0)}/5.0</span>
                </div>
                <ProgressBar progress={((data?.performance?.studentSatisfaction ?? 0) / 5) * 100} color="amber" />
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-teal-900 font-semibold">Innovation Index</span>
                  <span className="text-teal-700 font-bold text-lg">{(data?.performance?.innovationIndex ?? 0)}%</span>
                </div>
                <ProgressBar progress={(data?.performance?.innovationIndex ?? 0)} color="teal" />
              </div>
            </div>
          </div>

          {/* Enhanced Strategic Goals */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <FiTarget className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Strategic Goals</h3>
                  <p className="text-gray-600 text-sm">Progress tracking</p>
                </div>
              </div>
              <FiActivity className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-6">
              {(data?.strategicGoals || []).map((goal) => {
                const statusColors = getStatusColor(goal.status);
                return (
                  <div key={goal.id} className="border border-gray-200 rounded-xl p-5 bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-gray-900 text-lg">{goal.title}</h4>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                        {goal.progress}%
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{goal.target}</p>
                    <ProgressBar progress={goal.progress} color={statusColors.progress} />
                    <div className="flex items-center mt-3 pt-3 border-t border-gray-200">
                      <FiZap className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-500 text-xs mr-2 font-medium">Key Initiatives:</span>
                      <span className="text-gray-700 text-xs font-medium">
                        {goal.initiatives.slice(0, 2).join(', ')}
                        {goal.initiatives.length > 2 && ` +${goal.initiatives.length - 2} more`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Campus Facilities */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <FiMapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Campus Facilities</h3>
                  <p className="text-gray-600 text-sm">Infrastructure overview</p>
                </div>
              </div>
              <FiHeart className="w-5 h-5 text-purple-500" />
            </div>
            <div className="space-y-4">
              {(data?.facilities || []).map((facility, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                      facility.status === 'Excellent' ? 'bg-green-100 border border-green-200' : 'bg-blue-100 border border-blue-200'
                    }`}>
                      <FiBookOpen className={`w-5 h-5 ${
                        facility.status === 'Excellent' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{facility.name}</h4>
                      <p className="text-sm text-gray-600">{facility.capacity}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                    facility.status === 'Excellent' 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                    {facility.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default InstitutionalOverview;


