import {
  Kpi,
  AccreditationCycle,
  PpeppAction,
  StudyProgram,
  Evidence
} from '../../models/index.js';

// Simple health check controller that performs lightweight DB queries
export const healthController = {
  status: async (req, res, next) => {
    try {
      console.log('Health check requested');

      const results = {};

      try {
        const kpiCount = await Kpi.count();
        console.log('KPI count:', kpiCount);
        results.kpi = { ok: true, count: kpiCount };
      } catch (e) {
        console.error('KPI check failed', e.message);
        results.kpi = { ok: false, error: e.message };
      }

      try {
        const cycle = await AccreditationCycle.findOne({ order: [['updated_at', 'DESC']] });
        console.log('Latest accreditation cycle:', !!cycle);
        results.accreditation = { ok: true, found: !!cycle };
      } catch (e) {
        console.error('Accreditation cycle check failed', e.message);
        results.accreditation = { ok: false, error: e.message };
      }

      try {
        const action = await PpeppAction.findOne();
        console.log('PPEPP action available:', !!action);
        results.ppepp = { ok: true, found: !!action };
      } catch (e) {
        console.error('PPEPP action check failed', e.message);
        results.ppepp = { ok: false, error: e.message };
      }

      try {
        const spCount = await StudyProgram.count();
        console.log('StudyProgram count:', spCount);
        results.studyPrograms = { ok: true, count: spCount };
      } catch (e) {
        console.error('StudyProgram check failed', e.message);
        results.studyPrograms = { ok: false, error: e.message };
      }

      try {
        const evidenceCount = await Evidence.count();
        console.log('Evidence count:', evidenceCount);
        results.evidence = { ok: true, count: evidenceCount };
      } catch (e) {
        console.error('Evidence check failed', e.message);
        results.evidence = { ok: false, error: e.message };
      }

      const ok = Object.values(results).every(r => r.ok === true);
      res.json({ ok, checks: results, timestamp: new Date().toISOString() });
    } catch (err) {
      next(err);
    }
  }
};

export default healthController;
