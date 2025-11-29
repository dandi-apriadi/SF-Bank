import { asyncHandler } from '../shared/crudFactory.js';
import { Sequelize } from 'sequelize';
import { Kpi, QualityRisk, QualityRecommendation, AccreditationCycle, StudyProgram, DocumentTemplate, Document, IntegrationJob, ActivityLog } from '../../models/index.js';

export const executiveReportsController = {
  overview: asyncHandler(async (req, res) => {
    const [kpiCount, cyclesCount, good, warning, critical] = await Promise.all([
      Kpi.count(),
      AccreditationCycle.count(),
      Kpi.count({ where: { status: 'good' } }),
      Kpi.count({ where: { status: 'warning' } }),
      Kpi.count({ where: { status: 'critical' } })
    ]);
    const [[{ overallScore = 0 }]] = await Kpi.sequelize.query(`SELECT COALESCE(ROUND(AVG(current_percentage)),0) as overallScore FROM quality_kpis`);
    // Define reports available: KPI workbook + all cycles LED workbook
    const totalReports = (kpiCount > 0 ? 1 : 0) + cyclesCount;

    // Compute custom reports (documents that may represent custom exports)
    const customReports = await Document.count();

    // Scheduled reports -> infer from integration jobs in pending state (if any)
    const scheduledReports = await IntegrationJob.count({ where: { status: 'pending' } });

    // Recent views: count activity log entries that look like exports/downloads in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentViews = await ActivityLog.count({ where: {
      action: { [Sequelize.Op.like]: '%export%' },
      created_at: { [Sequelize.Op.gte]: thirtyDaysAgo }
    } });

    // Average generation time: use integration job durations (fallback to null)
    const jobRows = await IntegrationJob.findAll({ where: {
      finished_at: { [Sequelize.Op.ne]: null },
      started_at: { [Sequelize.Op.ne]: null },
      updated_at: { [Sequelize.Op.gte]: thirtyDaysAgo }
    }, attributes: ['started_at','finished_at'] });
    let avgGenerationTime = null;
    if (jobRows && jobRows.length > 0) {
      const totalMs = jobRows.reduce((acc, j) => acc + (new Date(j.finished_at).getTime() - new Date(j.started_at).getTime()), 0);
      const avgMs = Math.round(totalMs / jobRows.length);
      avgGenerationTime = `${(avgMs / 1000).toFixed(2)}s`;
    }

    res.json({
      summaryMetrics: {
        totalReports,
        automatedReports: kpiCount > 0 ? 1 : 0,
        customReports: Number(customReports || 0),
        scheduledReports: Number(scheduledReports || 0),
        recentViews: Number(recentViews || 0),
        avgGenerationTime: avgGenerationTime || 'N/A'
      },
      kpiStats: { total: kpiCount, good, warning, critical, overallScore: Number(overallScore) }
    });
  }),

  recent: asyncHandler(async (req, res) => {
    const now = new Date();
    const monthYear = now.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

    // Build KPI workbook item if KPI exists
    const kpiExists = await Kpi.count();
    const items = [];
    if (kpiExists) {
      items.push({
        id: 'kpis-workbook',
        title: 'Quality KPI Workbook',
        type: 'automated',
        category: 'quality',
        generatedDate: now.toISOString(),
        period: monthYear,
        status: 'ready',
        size: '-',
        views: 0,
        recipients: ['Leadership'],
        keyInsights: [],
        file_url: '/api/quality/export/kpis.csv'
      });
    }

    // Latest accreditation cycles -> LED workbooks
    const cycles = await AccreditationCycle.findAll({
      include: [{ model: StudyProgram }],
      order: [['updated_at','DESC']],
      limit: 4
    });
    for (const c of cycles) {
      items.push({
        id: `led-${c.cycle_id}`,
        title: `Accreditation LED • ${c.study_program?.name || c.study_program_id}`,
        type: 'compliance',
        category: 'accreditation',
        generatedDate: (c.updated_at || now).toISOString(),
        period: c.year ? `${c.year}` : 'Current',
        status: 'ready',
        size: '-',
        views: 0,
        recipients: ['Quality Assurance Team', 'Academic Directors'],
        keyInsights: [],
        file_url: `/api/led/${c.cycle_id}/export.csv`
      });
    }

    res.json({ recentReports: items });
  }),

  templates: asyncHandler(async (_req, res) => {
    // Return active document templates (may include LED, LKPS, RPS, etc.) as available report templates
    const templates = await DocumentTemplate.findAll({ where: { is_active: true }, order: [['updated_at','DESC']] });
    const mapped = templates.map(t => ({ id: t.template_id, type: t.type, name: t.name, description: t.description, structure: t.structure, version_no: t.version_no }));
    res.json({ reportTemplates: mapped });
  }),

  schedules: asyncHandler(async (_req, res) => {
    // Return pending integration jobs as scheduled reports (if any)
    const jobs = await IntegrationJob.findAll({ where: { status: 'pending' }, order: [['created_at','DESC']] });
    const mapped = jobs.map(j => ({ id: j.job_id, type: j.job_type, status: j.status, started_at: j.started_at, finished_at: j.finished_at, summary: j.summary }));
    res.json({ scheduledReports: mapped });
  })
};
