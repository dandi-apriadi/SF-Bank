import { qualityService } from './qualityService';
import ppeppService from './ppeppService';
import accreditationService from './accreditationService';
import institutionService from './institutionService';
import { apiClient, API_BASE_URL } from './api';

// Run a set of diagnostic requests used by the Kaprodi dashboard and log results.
export async function runFrontendDiagnostics() {
  const results = {};
  console.log('Running frontend diagnostics...');

  try {
    const stats = await qualityService.fetchStats();
    console.log('qualityService.fetchStats:', stats);
    results.quality = { ok: true, data: stats };
  } catch (e) {
    console.error('qualityService.fetchStats failed', e);
    results.quality = { ok: false, error: e.message };
  }

  try {
    const actions = await ppeppService.actions.list({ limit: 1 });
    console.log('ppeppService.actions.list:', actions?.rows ? actions.rows.length : actions);
    results.ppepp = { ok: true, data: actions };
  } catch (e) {
    console.error('ppeppService.actions.list failed', e);
    results.ppepp = { ok: false, error: e.message };
  }

  try {
    const acc = await accreditationService.getAccreditationDashboard();
    console.log('accreditationService.getAccreditationDashboard:', acc?.summary || acc);
    results.accreditation = { ok: true, data: acc };
  } catch (e) {
    console.error('accreditationService.getAccreditationDashboard failed', e);
    results.accreditation = { ok: false, error: e.message };
  }

  try {
    const inst = await institutionService.getInstitutionDashboard();
    console.log('institutionService.getInstitutionDashboard:', inst?.totals || inst);
    results.institution = { ok: true, data: inst };
  } catch (e) {
    console.error('institutionService.getInstitutionDashboard failed', e);
    results.institution = { ok: false, error: e.message };
  }

  try {
    // call backend health endpoint as a final check
    const health = await apiClient.get('/api/health');
    console.log('backend /api/health:', health);
    results.health = { ok: true, data: health };
  } catch (e) {
    console.error('/api/health failed', e);
    results.health = { ok: false, error: e.message };
  }

  console.log('Frontend diagnostics result:', results);
  return results;
}

export default { runFrontendDiagnostics };
