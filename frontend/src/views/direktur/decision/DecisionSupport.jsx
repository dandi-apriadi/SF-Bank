import React, { useState, useEffect } from "react";
import {
  FiTarget,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiUsers,
  FiBookOpen,
  FiAward,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiBarChart,
  FiPieChart
} from "react-icons/fi";
import Card from "components/card";
import { qualityService } from "../../../services/qualityService";

const DecisionSupport = () => {
  const [selectedScenario, setSelectedScenario] = useState("investment");
  const [timeHorizon, setTimeHorizon] = useState("1year");
  const [strategicAnalysis, setStrategicAnalysis] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [overviewStats, setOverviewStats] = useState({});

  useEffect(() => {
    // Load strategic analysis and recommendations from backend
    async function fetchData() {
      try {
        const overview = await qualityService.fetchOverview();
        const rawKpis = overview.kpis || [];
        const rawRecs = overview.recommendations || [];

        // Map backend recommendation fields to frontend-friendly names
        const mappedRecs = rawRecs.map(r => ({
          id: r.recommendation_id || r.id || r.recommendationId,
          category: r.category,
          priority: r.priority,
          title: r.title,
          recommendation: r.description || r.expected_impact || r.recommendation || '',
          actions: r.actions || r.actionItems || [],
          timeline: r.timeline || '',
          timeline_months: r.timeline_months || r.timelineMonths || null,
          budget: r.budget || r.estimated_budget || null,
          budget_amount: (typeof r.budget_amount !== 'undefined' && r.budget_amount !== null) ? Number(r.budget_amount) : null,
          expected_impact: r.expected_impact || null,
          expected_impact_value: (typeof r.expected_impact_value !== 'undefined' && r.expected_impact_value !== null) ? Number(r.expected_impact_value) : null,
          urgency: r.urgency || 'moderate',
          impact: r.impact || (r.expected_impact ? 'significant' : 'moderate')
        }));

        // Transform KPIs into the shape the component expects
        const mappedKpis = rawKpis.map(kpi => {
          const kpiId = kpi.kpi_id || kpi.id || kpi.kpiId;
          const relatedRecs = mappedRecs.filter(rr => rr.category === kpi.category);
          // Sum budgets (attempt to parse numeric values)
          const sumBudget = relatedRecs.reduce((s, r) => {
            if (r && (typeof r.budget_amount !== 'undefined') && r.budget_amount !== null) {
              const val = Number(r.budget_amount) || 0;
              return s + val;
            }
            if (!r || !r.budget) return s;
            const num = Number(String(r.budget).replace(/[^0-9.-]+/g, ''));
            return s + (Number.isFinite(num) ? num : 0);
          }, 0);
          // Average timeline (in months) from related recommendations if available
          const timelines = relatedRecs.map(r => {
            if (r && (typeof r.timeline_months !== 'undefined') && r.timeline_months !== null) {
              const tm = Number(r.timeline_months);
              return Number.isFinite(tm) ? tm : null;
            }
            return parseInt(String(r.timeline || '').replace(/[^0-9]+/g, ''), 10);
          }).filter(n => !isNaN(n) && n > 0);
          const avgTimeline = timelines.length ? Math.round(timelines.reduce((a,b)=>a+b,0) / timelines.length) : null;

          const currentPct = kpi.current_percentage != null ? Number(kpi.current_percentage) : null;
          const targetPct = kpi.target_percentage != null ? Number(kpi.target_percentage) : null;

          return {
            id: kpiId,
            title: kpi.label || kpi.name || '',
            description: kpi.description || '',
            category: kpi.category || '',
            priority: kpi.status === 'critical' ? 'high' : kpi.status === 'warning' ? 'medium' : 'low',
            impact: kpi.status === 'good' ? 'transformational' : 'significant',
            investmentRequired: sumBudget || 0,
            expectedROI: (currentPct != null && targetPct != null) ? `${Math.round((targetPct - currentPct))}%` : (kpi.expected_roi || ''),
            timeToImplement: avgTimeline ? `${avgTimeline}` : (kpi.time_to_implement || ''),
            riskLevel: kpi.status === 'critical' ? 'high' : kpi.status === 'warning' ? 'medium' : 'low',
            metrics: {
              current: { score: currentPct },
              projected: { score: targetPct }
            },
            pros: kpi.pros || [],
            cons: kpi.cons || []
          };
        });

        setStrategicAnalysis(mappedKpis);
        setRecommendations(mappedRecs);
        setOverviewStats(overview.stats || {});
      } catch (err) {
        // fallback: show empty or error
        setStrategicAnalysis([]);
        setRecommendations([]);
      }
    }
    fetchData();
  }, []);

  // local stats from overview

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "high":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-amber-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case "immediate":
        return <FiAlertTriangle className="h-5 w-5 text-red-600" />;
      case "important":
        return <FiInfo className="h-5 w-5 text-amber-600" />;
      case "moderate":
        return <FiCheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <FiInfo className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Human Capital":
        return <FiUsers className="h-5 w-5 text-blue-600" />;
      case "Technology":
        return <FiBarChart className="h-5 w-5 text-green-600" />;
      case "Academic Development":
        return <FiBookOpen className="h-5 w-5 text-purple-600" />;
      case "Research Excellence":
        return <FiAward className="h-5 w-5 text-orange-600" />;
      default:
        return <FiTarget className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      {/* Header */}
      <Card extra="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Dukungan Keputusan Strategis
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Analisis dan rekomendasi untuk pengambilan keputusan strategis institusi
            </p>
          </div>
          
          <div className="flex space-x-4">
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="investment">Skenario Investasi</option>
              <option value="growth">Skenario Pertumbuhan</option>
              <option value="efficiency">Skenario Efisiensi</option>
            </select>
            
            <select
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="1year">1 Tahun</option>
              <option value="3years">3 Tahun</option>
              <option value="5years">5 Tahun</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Executive Summary */}
      {(() => {
        // Compute executive summary values from fetched data
        const totalInvestment = (Array.isArray(recommendations) ? recommendations : []).reduce((s, r) => {
          if (!r) return s;
          if ((typeof r.budget_amount !== 'undefined') && r.budget_amount !== null) {
            const val = Number(r.budget_amount) || 0;
            return s + val;
          }
          if (!r.budget) return s;
          const num = Number(String(r.budget).replace(/[^0-9.-]+/g, ''));
          return s + (Number.isFinite(num) ? num : 0);
        }, 0);

        // Average expected ROI: prefer overviewStats.overallScore, else compute from rec.expected_impact
        let avgExpectedROI = null;
        if (overviewStats && typeof overviewStats.overallScore !== 'undefined') {
          avgExpectedROI = `${overviewStats.overallScore}%`;
        } else {
          const vals = (Array.isArray(recommendations) ? recommendations : []).map(r => {
            if (!r) return null;
            if ((typeof r.expected_impact_value !== 'undefined') && r.expected_impact_value !== null) {
              const ev = Number(r.expected_impact_value);
              return Number.isFinite(ev) ? ev : null;
            }
            if (!r.expected_impact) return null;
            const n = Number(String(r.expected_impact).replace(/[^0-9.-]+/g, ''));
            return Number.isFinite(n) ? n : null;
          }).filter(v => v != null);
          if (vals.length) avgExpectedROI = `${Math.round(vals.reduce((a,b)=>a+b,0)/vals.length)}%`;
        }

        // Average months to implement across strategicAnalysis
        const months = (Array.isArray(strategicAnalysis) ? strategicAnalysis : []).map(a => parseInt(String(a.timeToImplement || '').replace(/[^0-9]+/g, ''), 10)).filter(n => !isNaN(n) && n > 0);
        const avgMonths = months.length ? Math.round(months.reduce((a,b)=>a+b,0)/months.length) : null;

        const highPriorityCount = (Array.isArray(recommendations) ? recommendations : []).filter(r => r.priority === 'high').length;

        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card extra="p-6 text-center">
              <FiDollarSign className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{totalInvestment ? formatCurrency(totalInvestment) : '-'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Investment Required</div>
            </Card>
            <Card extra="p-6 text-center">
              <FiTrendingUp className="mx-auto h-8 w-8 text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{avgExpectedROI || '-'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Expected ROI</div>
            </Card>
            <Card extra="p-6 text-center">
              <FiTarget className="mx-auto h-8 w-8 text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{avgMonths != null ? avgMonths : '-'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Months Average Implementation</div>
            </Card>
            <Card extra="p-6 text-center">
              <FiAward className="mx-auto h-8 w-8 text-orange-600 mb-2" />
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{highPriorityCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">High Priority Initiatives</div>
            </Card>
          </div>
        );
      })()}

      {/* Strategic Recommendations */}
  <Card extra="p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
          Rekomendasi Strategis Prioritas
        </h3>
        
        <div className="space-y-6">
          {(Array.isArray(recommendations) ? recommendations : []).map((rec, recIdx) => (
            <div key={rec.id || recIdx} className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-r-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getUrgencyIcon(rec.urgency)}
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {rec.title}
                  </h4>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rec.urgency === "immediate" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                    rec.urgency === "important" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" :
                    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}>
                    {rec.urgency}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rec.impact === "transformational" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" :
                    rec.impact === "significant" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }`}>
                    {rec.impact}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {rec.recommendation}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-800 dark:text-white mb-3">Action Items</h5>
                  <ul className="space-y-2">
                    {(Array.isArray(rec.actions) ? rec.actions : Array.isArray(rec.actionItems) ? rec.actionItems : []).map((item, index) => (
                      <li key={typeof item === 'object' && item.id ? item.id : `${item}-${index}`} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-gray-800 dark:text-white mb-3">KPI Targets</h5>
                  <ul className="space-y-2">
                    {(
                      Array.isArray(rec.kpiTargets) ? rec.kpiTargets : (
                        Array.isArray(rec.expected_impact) ? rec.expected_impact : (rec.expected_impact ? [rec.expected_impact] : [])
                      )
                    ).map((target, index) => (
                      <li key={typeof target === 'object' && target.id ? target.id : `${target}-${index}`} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiTarget className="flex-shrink-0 w-4 h-4 text-green-500 mt-0.5" />
                        <span>{target}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Strategic Analysis Details */}
  <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Analisis Inisiatif Strategis
        </h3>
        
        {(Array.isArray(strategicAnalysis) ? strategicAnalysis : []).map((analysis, anaIdx) => (
          <Card key={analysis.id || anaIdx} extra="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                {getCategoryIcon(analysis.category)}
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {analysis.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {analysis.description}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(analysis.priority)}`}>
                  {analysis.priority} priority
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(analysis.impact)}`}>
                  {analysis.impact} impact
                </span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FiDollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                  {formatCurrency(analysis.investmentRequired)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Investment Required</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FiTrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                  {analysis.expectedROI}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Expected ROI</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FiTarget className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                  {analysis.timeToImplement}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Implementation Time</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FiAlertTriangle className={`h-6 w-6 mx-auto mb-2 ${getRiskColor(analysis.riskLevel)}`} />
                <div className={`text-lg font-semibold ${getRiskColor(analysis.riskLevel)}`}>
                  {analysis.riskLevel}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Risk Level</div>
              </div>
            </div>

            {/* Current vs Projected Metrics */}
            <div className="mb-6">
              <h5 className="font-medium text-gray-800 dark:text-white mb-4">Expected Impact</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(analysis.metrics && analysis.metrics.current && analysis.metrics.projected)
                  ? Object.keys(analysis.metrics.current).map((metric) => (
                      <div key={metric} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize">
                          {metric.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-500">Current</div>
                            <div className="font-semibold text-gray-800 dark:text-white">
                              {analysis.metrics.current[metric]}
                            </div>
                          </div>
                          <FiTrendingUp className="h-4 w-4 text-green-600" />
                          <div>
                            <div className="text-sm text-gray-500">Projected</div>
                            <div className="font-semibold text-green-600">
                              {analysis.metrics.projected[metric]}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                  <FiCheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Keuntungan
                </h5>
                <ul className="space-y-2">
                  {(Array.isArray(analysis.pros) ? analysis.pros : []).map((pro, index) => (
                    <li key={typeof pro === 'object' && pro.id ? pro.id : `${pro}-${index}`} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                  <FiAlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                  Risiko & Tantangan
                </h5>
                <ul className="space-y-2">
                  {(Array.isArray(analysis.cons) ? analysis.cons : []).map((con, index) => (
                    <li key={typeof con === 'object' && con.id ? con.id : `${con}-${index}`} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DecisionSupport;
