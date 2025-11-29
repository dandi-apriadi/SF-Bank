import { Kpi, QualityRisk, QualityRecommendation } from '../../models/index.js';
import { createCrudController, asyncHandler } from '../shared/crudFactory.js';
import { Sequelize } from 'sequelize';
import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';

// Simple in-memory cache (can replace with Redis later)
let cachedOverview = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60 * 1000; // 60s

export const kpiController = {
  ...createCrudController(Kpi, { searchFields: ['code','label','category'] }),
  stats: asyncHandler(async (req, res) => {
    const total = await Kpi.count();
    const good = await Kpi.count({ where: { status: 'good' } });
    const warning = await Kpi.count({ where: { status: 'warning' } });
    const critical = await Kpi.count({ where: { status: 'critical' } });
    const [[{ overallScore = 0 }]] = await Kpi.sequelize.query(`SELECT COALESCE(ROUND(AVG(current_percentage)),0) as overallScore FROM quality_kpis`);
    const highRisks = await QualityRisk.count({ where: { severity: 'high' } });
    res.json({ total, good, warning, critical, overallScore: Number(overallScore), highRisks });
  })
};

// Clear cache when KPIs change
['create','update','delete'].forEach((fn) => {
  const orig = kpiController[fn];
  kpiController[fn] = asyncHandler(async (req, res, next) => {
    await orig(req, res, next);
    try { cachedOverview = null; cachedAt = 0; } catch (e) {}
  });
});

export const riskController = createCrudController(QualityRisk, { searchFields: ['code','issue','category'] });
export const recommendationController = createCrudController(QualityRecommendation, { searchFields: ['title','category','priority'] });

// Invalidate overview cache when recommendations/risks/kpis change so UI sees fresh data
const invalidateCache = () => { cachedOverview = null; cachedAt = 0; };

// Wrap create/update/delete for recommendationController and riskController to clear cache
['create','update','delete'].forEach((fn) => {
  const origRec = recommendationController[fn];
  recommendationController[fn] = asyncHandler(async (req, res, next) => {
    // For create/update endpoints, ensure numeric fields are present when possible
    try {
      if (req && req.body && (fn === 'create' || fn === 'update')) {
        // budget_amount: prefer numeric input, otherwise parse budget string
        if (req.body.budget_amount == null && req.body.budget) {
          const num = Number(String(req.body.budget).replace(/[^0-9.-]+/g, ''));
          if (Number.isFinite(num)) req.body.budget_amount = num;
        }
        // timeline_months: prefer numeric input, otherwise parse timeline text like '3 bulan'
        if (req.body.timeline_months == null && req.body.timeline) {
          const n = parseInt(String(req.body.timeline).replace(/[^0-9]+/g, ''), 10);
          if (!isNaN(n)) req.body.timeline_months = n;
        }
        // expected_impact_value: prefer numeric input, otherwise parse expected_impact text
        if (req.body.expected_impact_value == null && req.body.expected_impact) {
          const v = Number(String(req.body.expected_impact).replace(/[^0-9.\-]+/g, ''));
          if (Number.isFinite(v)) req.body.expected_impact_value = v;
        }
      }
    } catch (e) {
      // don't block operation on parsing errors; proceed with original payload
      console.warn('Recommendation numeric parse warning:', e && e.message);
    }

    await origRec(req, res, next);
    try { invalidateCache(); } catch (e) {}
  });

  const origRisk = riskController[fn];
  riskController[fn] = asyncHandler(async (req, res, next) => {
    await origRisk(req, res, next);
    try { invalidateCache(); } catch (e) {}
  });
});

// Overview endpoint combines all in one response with caching
export const overviewController = asyncHandler(async (req, res) => {
  const now = Date.now();
  if (cachedOverview && now - cachedAt < CACHE_TTL_MS) {
    return res.json({ ...cachedOverview, cached: true });
  }
  // Recompute stats directly (avoid calling controller response plumbing)
  const total = await Kpi.count();
  const good = await Kpi.count({ where: { status: 'good' } });
  const warning = await Kpi.count({ where: { status: 'warning' } });
  const critical = await Kpi.count({ where: { status: 'critical' } });
  const [[{ overallScore = 0 }]] = await Kpi.sequelize.query(`SELECT COALESCE(ROUND(AVG(current_percentage),1),0) as overallScore FROM quality_kpis`);
  const highRisks = await QualityRisk.count({ where: { severity: 'high' } });
  const kpis = await Kpi.findAll({ order: [['last_updated','DESC']] });
  const risks = await QualityRisk.findAll({ order: [['created_at','DESC']], limit: 20 });
  const recommendations = await QualityRecommendation.findAll({ order: [['created_at','DESC']], limit: 20 });

  // compute lastUpdated as the most recent updated_at among kpis, risks, recommendations
  const collectDates = (rows, field) => (Array.isArray(rows) ? rows.map(r => r[field]).filter(Boolean).map(d => new Date(d).getTime()) : []);
  const dates = [];
  dates.push(...collectDates(kpis, 'updated_at'));
  dates.push(...collectDates(risks, 'updated_at'));
  dates.push(...collectDates(recommendations, 'updated_at'));
  const maxTs = dates.length ? Math.max(...dates) : Date.now();
  const lastUpdated = new Date(maxTs).toISOString();

  cachedOverview = { stats: { total, good, warning, critical, overallScore: Number(overallScore), highRisks }, kpis, risks, recommendations, lastUpdated };
  cachedAt = now;
  res.json(cachedOverview);
});

// Export endpoints
export const exportKpisCsv = asyncHandler(async (req, res) => {
  const rows = await Kpi.findAll();
  const parser = new Parser({ fields: ['code','label','category','current_percentage','target_percentage','status','trend','last_updated'] });
  const csv = parser.parse(rows.map(r=>r.toJSON()));
  res.setHeader('Content-Type','text/csv');
  res.setHeader('Content-Disposition','attachment; filename="kpis.csv"');
  res.send(csv);
});

export const exportRisksCsv = asyncHandler(async (req, res) => {
  const rows = await QualityRisk.findAll();
  const parser = new Parser({ fields: ['code','category','issue','severity','probability','impact','risk_score','status','progress'] });
  const csv = parser.parse(rows.map(r=>r.toJSON()));
  res.setHeader('Content-Type','text/csv');
  res.setHeader('Content-Disposition','attachment; filename="risks.csv"');
  res.send(csv);
});

export const exportRecommendationsCsv = asyncHandler(async (req, res) => {
  const rows = await QualityRecommendation.findAll();
  const parser = new Parser({ fields: ['category','priority','title','timeline','timeline_months','budget','budget_amount','expected_impact','expected_impact_value'] });
  const csv = parser.parse(rows.map(r=>r.toJSON()));
  res.setHeader('Content-Type','text/csv');
  res.setHeader('Content-Disposition','attachment; filename="recommendations.csv"');
  res.send(csv);
});

// Excel export: KPIs with Risks & Recommendations
export const exportKpisExcel = asyncHandler(async (req, res) => {
  // Fetch data
  const [kpis, risks, recommendations] = await Promise.all([
    Kpi.findAll({ order: [['last_updated','DESC']] }),
    QualityRisk.findAll({ order: [['created_at','DESC']] }),
    QualityRecommendation.findAll({ order: [['created_at','DESC']] })
  ]);

  // Compute quick stats
  const total = kpis.length;
  const good = kpis.filter(k=>k.status==='good').length;
  const warning = kpis.filter(k=>k.status==='warning').length;
  const critical = kpis.filter(k=>k.status==='critical').length;
  const overall = total ? Math.round(kpis.reduce((s,k)=> s + (Number(k.current_percentage)||0), 0) / total) : 0;

  const wb = new ExcelJS.Workbook();
  wb.creator = 'PRIMA';
  wb.created = new Date();

  // Styling helper
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
  const headerFont = { color: { argb: 'FFFFFFFF' }, bold: true };
  const thinBorder = { style: 'thin', color: { argb: 'FF94A3B8' } };
  const tableHeader = (ws) => {
    const row = ws.getRow(1);
    row.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };
    });
    const colCount = ws.columnCount || 0;
    if (colCount > 0) {
      ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: colCount } };
    }
    ws.views = [{ state: 'frozen', ySplit: 1 }];
  };

  // Overview sheet
  const wsOverview = wb.addWorksheet('Overview');
  wsOverview.columns = [ { header: 'Metric', key: 'metric', width: 40 }, { header: 'Value', key: 'value', width: 30 }, { header: 'Notes', key: 'notes', width: 60 } ];
  wsOverview.addRows([
    { metric: 'Total KPIs', value: total, notes: 'Jumlah indikator kinerja' },
    { metric: 'Good', value: good, notes: 'Status baik' },
    { metric: 'Warning', value: warning, notes: 'Perlu perhatian' },
    { metric: 'Critical', value: critical, notes: 'Prioritas tinggi' },
    { metric: 'Overall Score (%)', value: overall, notes: 'Rata-rata current_percentage' },
    { metric: 'Total Risks', value: risks.length, notes: 'Risiko kualitas terdaftar' },
    { metric: 'Total Recommendations', value: recommendations.length, notes: 'Rekomendasi perbaikan' },
    { metric: 'Generated At', value: new Date().toISOString(), notes: 'Waktu pembuatan file' }
  ]);
  tableHeader(wsOverview);

  // KPIs sheet
  const wsKpis = wb.addWorksheet('KPIs');
  wsKpis.columns = [
    { header: 'code', key: 'code', width: 16 },
    { header: 'label', key: 'label', width: 40 },
    { header: 'category', key: 'category', width: 24 },
    { header: 'current_percentage', key: 'current_percentage', width: 20 },
    { header: 'target_percentage', key: 'target_percentage', width: 20 },
    { header: 'status', key: 'status', width: 14 },
    { header: 'trend', key: 'trend', width: 12 },
    { header: 'last_updated', key: 'last_updated', width: 24 }
  ];
  wsKpis.addRows(kpis.map(k => ({
    code: k.code,
    label: k.label,
    category: k.category,
    current_percentage: k.current_percentage != null ? Number(k.current_percentage) : null,
    target_percentage: k.target_percentage != null ? Number(k.target_percentage) : null,
    status: k.status,
    trend: k.trend,
    last_updated: k.last_updated ? new Date(k.last_updated).toISOString() : ''
  })));
  tableHeader(wsKpis);

  // Risks sheet
  const wsRisks = wb.addWorksheet('Risks');
  wsRisks.columns = [
    { header: 'code', key: 'code', width: 16 },
    { header: 'category', key: 'category', width: 24 },
    { header: 'issue', key: 'issue', width: 50 },
    { header: 'severity', key: 'severity', width: 12 },
    { header: 'probability', key: 'probability', width: 14 },
    { header: 'impact', key: 'impact', width: 10 },
    { header: 'risk_score', key: 'risk_score', width: 12 },
    { header: 'status', key: 'status', width: 12 },
    { header: 'progress', key: 'progress', width: 16 }
  ];
  wsRisks.addRows(risks.map(r => ({
    code: r.code,
    category: r.category,
    issue: r.issue,
    severity: r.severity,
    probability: r.probability,
    impact: r.impact,
    risk_score: r.risk_score != null ? Number(r.risk_score) : null,
    status: r.status,
    progress: r.progress
  })));
  tableHeader(wsRisks);

  // Recommendations sheet
  const wsRecs = wb.addWorksheet('Recommendations');
  wsRecs.columns = [
    { header: 'category', key: 'category', width: 24 },
    { header: 'priority', key: 'priority', width: 12 },
    { header: 'title', key: 'title', width: 60 },
    { header: 'timeline', key: 'timeline', width: 20 },
    { header: 'timeline_months', key: 'timeline_months', width: 16 },
    { header: 'budget', key: 'budget', width: 16 },
    { header: 'budget_amount', key: 'budget_amount', width: 20 },
    { header: 'expected_impact', key: 'expected_impact', width: 60 },
    { header: 'expected_impact_value', key: 'expected_impact_value', width: 20 }
  ];
  wsRecs.addRows(recommendations.map(r => ({
    category: r.category,
    priority: r.priority,
    title: r.title,
    timeline: r.timeline,
    timeline_months: r.timeline_months != null ? Number(r.timeline_months) : null,
    budget: r.budget != null ? r.budget : null,
    budget_amount: r.budget_amount != null ? Number(r.budget_amount) : null,
    expected_impact: r.expected_impact,
    expected_impact_value: r.expected_impact_value != null ? Number(r.expected_impact_value) : null
  })));
  tableHeader(wsRecs);

  // Readme sheet
  const wsReadme = wb.addWorksheet('Readme');
  wsReadme.columns = [ { header: 'Section', key: 'section', width: 28 }, { header: 'Description', key: 'description', width: 100 } ];
  wsReadme.addRows([
    { section: 'Overview', description: 'Ringkasan KPI, risiko, dan rekomendasi dengan statistik kunci.' },
    { section: 'KPIs', description: 'Detail indikator kinerja: persentase saat ini, target, status, dan tren.' },
    { section: 'Risks', description: 'Daftar risiko mutu: severity, probabilitas, dampak, status.' },
    { section: 'Recommendations', description: 'Rekomendasi perbaikan: prioritas, timeline, estimasi anggaran.' },
    { section: 'Format', description: 'Kolom angka sebagai numerik; tanggal ISO8601; filter aktif di header.' },
    { section: 'Generated', description: `PRIMA Export • ${new Date().toISOString()}` }
  ]);
  tableHeader(wsReadme);

  const buffer = await wb.xlsx.writeBuffer();
  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition','attachment; filename="kpis.xlsx"');
  res.send(Buffer.from(buffer));
});

// Excel export: Risks
export const exportRisksExcel = asyncHandler(async (req, res) => {
  const risks = await QualityRisk.findAll({ order: [['created_at','DESC']] });

  const wb = new ExcelJS.Workbook();
  wb.creator = 'PRIMA';
  wb.created = new Date();

  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
  const headerFont = { color: { argb: 'FFFFFFFF' }, bold: true };
  const thinBorder = { style: 'thin', color: { argb: 'FF94A3B8' } };
  const tableHeader = (ws) => {
    const row = ws.getRow(1);
    row.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };
    });
    const colCount = ws.columnCount || 0;
    if (colCount > 0) ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: colCount } };
    ws.views = [{ state: 'frozen', ySplit: 1 }];
  };

  // Overview
  const wsOverview = wb.addWorksheet('Overview');
  wsOverview.columns = [ { header: 'Metric', key: 'metric', width: 40 }, { header: 'Value', key: 'value', width: 30 } ];
  const bySeverity = risks.reduce((acc, r)=>{ acc[r.severity] = (acc[r.severity]||0)+1; return acc; }, {});
  wsOverview.addRows([
    { metric: 'Total Risks', value: risks.length },
    { metric: 'High', value: bySeverity['high'] || 0 },
    { metric: 'Medium', value: bySeverity['medium'] || 0 },
    { metric: 'Low', value: bySeverity['low'] || 0 },
    { metric: 'Generated At', value: new Date().toISOString() }
  ]);
  tableHeader(wsOverview);

  // Risks sheet
  const ws = wb.addWorksheet('Risks');
  ws.columns = [
    { header: 'code', key: 'code', width: 16 },
    { header: 'category', key: 'category', width: 24 },
    { header: 'issue', key: 'issue', width: 60 },
    { header: 'severity', key: 'severity', width: 12 },
    { header: 'probability', key: 'probability', width: 14 },
    { header: 'impact', key: 'impact', width: 10 },
    { header: 'risk_score', key: 'risk_score', width: 12 },
    { header: 'status', key: 'status', width: 12 },
    { header: 'progress', key: 'progress', width: 16 }
  ];
  ws.addRows(risks.map(r => ({
    code: r.code,
    category: r.category,
    issue: r.issue,
    severity: r.severity,
    probability: r.probability,
    impact: r.impact,
    risk_score: r.risk_score != null ? Number(r.risk_score) : null,
    status: r.status,
    progress: r.progress
  })));
  tableHeader(ws);

  const buffer = await wb.xlsx.writeBuffer();
  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition','attachment; filename="risks.xlsx"');
  res.send(Buffer.from(buffer));
});

// Excel export: Recommendations
export const exportRecommendationsExcel = asyncHandler(async (req, res) => {
  const recs = await QualityRecommendation.findAll({ order: [['created_at','DESC']] });

  const wb = new ExcelJS.Workbook();
  wb.creator = 'PRIMA';
  wb.created = new Date();

  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
  const headerFont = { color: { argb: 'FFFFFFFF' }, bold: true };
  const thinBorder = { style: 'thin', color: { argb: 'FF94A3B8' } };
  const tableHeader = (ws) => {
    const row = ws.getRow(1);
    row.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };
    });
    const colCount = ws.columnCount || 0;
    if (colCount > 0) ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: colCount } };
    ws.views = [{ state: 'frozen', ySplit: 1 }];
  };

  const wsOverview = wb.addWorksheet('Overview');
  wsOverview.columns = [ { header: 'Metric', key: 'metric', width: 40 }, { header: 'Value', key: 'value', width: 30 } ];
  const byPriority = recs.reduce((acc, r)=>{ acc[r.priority] = (acc[r.priority]||0)+1; return acc; }, {});
  wsOverview.addRows([
    { metric: 'Total Recommendations', value: recs.length },
    { metric: 'High Priority', value: byPriority['high'] || 0 },
    { metric: 'Medium Priority', value: byPriority['medium'] || 0 },
    { metric: 'Low Priority', value: byPriority['low'] || 0 },
    { metric: 'Generated At', value: new Date().toISOString() }
  ]);
  tableHeader(wsOverview);

  const ws = wb.addWorksheet('Recommendations');
  ws.columns = [
    { header: 'category', key: 'category', width: 24 },
    { header: 'priority', key: 'priority', width: 12 },
    { header: 'title', key: 'title', width: 60 },
    { header: 'timeline', key: 'timeline', width: 20 },
    { header: 'budget', key: 'budget', width: 16 },
    { header: 'expected_impact', key: 'expected_impact', width: 60 }
  ];
  ws.addRows(recs.map(r => ({
    category: r.category,
    priority: r.priority,
    title: r.title,
    timeline: r.timeline,
    budget: r.budget != null ? Number(r.budget) : null,
    expected_impact: r.expected_impact
  })));
  tableHeader(ws);

  const buffer = await wb.xlsx.writeBuffer();
  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition','attachment; filename="recommendations.xlsx"');
  res.send(Buffer.from(buffer));
});
