import { Faculty, StudyProgram, NewsPost, AccreditationCycle, Kpi } from '../../models/index.js';
import InstitutionConfig from '../../config/institutionConfig.js';
import { Op } from 'sequelize';

const safeNumber = (v) => (v === null || v === undefined ? 0 : Number(v));

export const institutionController = {
  async overview(req, res, next) {
    try {
      // Basic counts
      // Try to get faculty count from the faculties table, but fall back to
      // counting distinct faculty_id on study_programs when the faculties
      // table is sparse or not populated.
      let totalFaculties = 0;
      try {
        totalFaculties = Number(await Faculty.count()) || 0;
      } catch (e) {
        totalFaculties = 0;
      }
      const totalPrograms = Number(await StudyProgram.count()) || 0;
      // distinct faculties as fallback
      let distinctFacultyCount = 0;
      try {
        distinctFacultyCount = Number(await StudyProgram.count({ distinct: true, col: 'faculty_id' })) || 0;
      } catch (e) {
        distinctFacultyCount = 0;
      }
      if (!totalFaculties || distinctFacultyCount > totalFaculties) {
        totalFaculties = distinctFacultyCount;
      }

      // Aggregates from StudyProgram (student_count, faculty_count)
      const totalStudents = safeNumber(await StudyProgram.sum('student_count'));
      const totalLecturers = safeNumber(await StudyProgram.sum('faculty_count'));

      // Accredited programs (have a non-null accreditation_grade)
      // Count accredited programs: treat empty string as not accredited as well
      const accreditedPrograms = Number(await StudyProgram.count({
        where: {
          [Op.and]: [
            { accreditation_grade: { [Op.not]: null } },
            { accreditation_grade: { [Op.ne]: '' } }
          ]
        }
      })) || 0;

      // Accreditation average score across cycles (if available)
      const avgAccScoreRow = await AccreditationCycle.findAll({
        attributes: [[AccreditationCycle.sequelize.fn('AVG', AccreditationCycle.sequelize.col('final_score')), 'avgScore']],
        where: { final_score: { [Op.not]: null } },
        raw: true
      });
      const accreditationScore = avgAccScoreRow && avgAccScoreRow[0] ? safeNumber(avgAccScoreRow[0].avgScore) : 0;

      // Recent achievements: try DB news_posts, but fallback gracefully to config if table missing or empty
      let recentAchievements = [];
      try {
        if (NewsPost && typeof NewsPost.findAll === 'function') {
          const recentNews = await NewsPost.findAll({ where: { status: 'published' }, order: [['published_at', 'DESC']], limit: 5 });
          recentAchievements = recentNews.map(n => ({
            title: n.title,
            description: n.content ? (n.content.length > 240 ? n.content.substring(0, 237) + '...' : n.content) : '',
            date: n.published_at ? new Date(n.published_at).getFullYear().toString() : '',
            type: 'news'
          }));
        }
      } catch (e) {
        // Table may not exist or DB not seeded; fallback to config later
        recentAchievements = [];
      }

      // Simple KPI fetch (if any KPIs exist)
      let kpis = [];
      try {
        if (Kpi && typeof Kpi.findAll === 'function') {
          kpis = await Kpi.findAll({ limit: 20, order: [['last_updated','DESC']] });
        }
      } catch (e) {
        kpis = [];
      }
      const performance = {
        accreditationScore: accreditationScore || 0,
        graduationRate: null,
        employmentRate: null,
        researchOutput: null,
        communityService: null,
        studentSatisfaction: null,
        facultyRetention: null,
        internationalStudents: null,
        industryPartnerships: null,
        innovationIndex: null,
        kpis: kpis.map(k => ({ code: k.code, label: k.label, current_percentage: safeNumber(k.current_percentage) }))
      };

      // Statistics object
      const statistics = {
        totalFaculties,
        totalPrograms,
        totalStudents,
        totalLecturers,
        internationalPartners: null,
        researchProjects: null,
        graduateEmploymentRate: null,
        accreditedPrograms,
        digitalLibraryBooks: null,
        laboratoryFacilities: null
      };

      // Facilities & strategicGoals are not stored centrally by default; read from config if present
      const facilities = InstitutionConfig.facilities || [];
      const strategicGoals = InstitutionConfig.strategicGoals || [];

      // If recentAchievements empty, try to use a small set from config for UI friendliness
      if ((!recentAchievements || recentAchievements.length === 0) && InstitutionConfig.recentAchievements) {
        recentAchievements = InstitutionConfig.recentAchievements;
      } else if ((!recentAchievements || recentAchievements.length === 0)) {
        // default small set
        recentAchievements = [
          { title: 'Akreditasi Program Studi Teknik Informatika', description: 'Memperoleh akreditasi A dari BAN-PT', date: '2023', type: 'accreditation' },
          { title: 'Green Campus Award', description: 'Penghargaan kampus ramah lingkungan tingkat regional', date: '2023', type: 'sustainability' }
        ];
      }

      const institution = InstitutionConfig.institution || {
        name: null,
        founded: null,
        type: null,
        accreditation: null,
        address: null,
        website: null,
        phone: null,
        email: null
      };

      return res.json({ institution, statistics, performance, recentAchievements, facilities, strategicGoals });
    } catch (err) {
      next(err);
    }
  }
};

export default institutionController;
