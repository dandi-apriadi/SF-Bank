import { NewsPost, NewsAttachment, User, StudyProgram, User as UserModel, Kpi, QualityRisk } from '../../models/index.js';
import { asyncHandler } from '../shared/crudFactory.js';

// Public homepage controller: aggregate news, stats, services, testimonials
export const homepageController = {
  get: asyncHandler(async (req, res) => {
    // Latest published news (limit 6)
    const news = await NewsPost.findAll({
      where: { status: 'published' },
      include: [ { model: User, attributes: ['user_id','fullname'] } ],
      limit: 6,
      order: [['published_at','DESC']]
    });

    // Basic org stats
    const studyProgramCount = await StudyProgram.count();
    const userCount = await UserModel.count();

    // KPI overview (simple)
    let overallScore = 0;
    try {
      const [[{ overallScore: os = 0 }]] = await Kpi.sequelize.query(`SELECT COALESCE(ROUND(AVG(current_percentage),1),0) as overallScore FROM quality_kpis`);
      overallScore = Number(os);
    } catch (e) {
      overallScore = 0;
    }

    const highRisks = await QualityRisk.count({ where: { severity: 'high' } });

    // Services & testimonials - provided from backend so frontend has no dummy data
    const services = [
      { key: 'accreditation', title: 'Sistem Akreditasi Terintegrasi' },
      { key: 'spmi', title: 'Sistem Penjaminan Mutu Internal (SPMI)' },
      { key: 'ami', title: 'Audit Mutu Internal (AMI)' },
      { key: 'audit', title: 'Sistem Audit Lapangan' },
      { key: 'gkm', title: 'Gugus Kendali Mutu (GKM)' },
      { key: 'survey', title: 'Survey Kepuasan Stakeholder' }
    ];

    const testimonials = [
      { name: 'Prof. Dr. Ahmad Sudirman, M.T.', position: 'Koordinator Prodi', text: 'PRIMA memudahkan pengelolaan siklus PPEPP' },
      { name: 'Dr. Sarah Wijaya, M.Pd.', position: 'Kepala Unit PPMPP', text: 'Fitur analytics dan progress monitoring memberikan insight' }
    ];

    res.json({
      news,
      stats: {
        studyProgramCount,
        userCount,
        overallScore,
        highRisks
      },
      services,
      testimonials
    });
  })
};

// Public news listing (simple)
export const publicNewsController = {
  list: asyncHandler(async (req, res) => {
    const { limit = 6, offset = 0 } = req.query;
    const newsItems = await NewsPost.findAndCountAll({
      where: { status: 'published' },
      include: [ { model: User, attributes: ['user_id','fullname'] } ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['published_at','DESC']]
    });

    res.json({ data: newsItems.rows, totalCount: newsItems.count });
  })
};

export default homepageController;
