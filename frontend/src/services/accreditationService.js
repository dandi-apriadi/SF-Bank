import { apiClient } from './api';

// Accreditation service using /api endpoints; base URL comes from env via apiClient

export async function getActiveCycle(params = {}) {
  // For simplicity, fetch first cycle (could be filtered by study_program_id or status)
  const res = await apiClient.get('/api/accreditation-cycles?limit=1&order=updated_at:DESC');
  return res?.rows?.[0] || null;
}

export async function getCriteria(params = {}) {
  const query = new URLSearchParams({ limit: '100', order: 'order_no:ASC', ...params }).toString();
  const res = await apiClient.get(`/api/accreditation-criteria?${query}`);
  return res?.rows || [];
}

export async function getCycleProgress(cycleId) {
  const res = await apiClient.get(`/api/cycle-criteria-progress?cycle_id=${encodeURIComponent(cycleId)}&limit=200`);
  return res?.rows || [];
}

export async function getEvidenceByCriteria(cycleId, criteriaId) {
  const params = new URLSearchParams({ cycle_id: cycleId, criteria_id: criteriaId, limit: '50' }).toString();
  const res = await apiClient.get(`/api/evidences?${params}`);
  return res?.rows || [];
}

export async function exportLED(cycleId) {
  // Return Response for file download
  const response = await apiClient.get(`/api/led/${encodeURIComponent(cycleId)}/export`, { headers: { 'Accept': 'application/json' } });
  return response;
}

export async function exportLEDExcel(cycleId) {
  // Returns raw Response for .xlsx (non-JSON)
  const response = await apiClient.get(`/api/led/${encodeURIComponent(cycleId)}/export.xlsx`, {
    headers: { 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
  });
  return response; // caller should call response.blob()
}

export async function listSimulations(cycleId, params = {}) {
  const query = new URLSearchParams({ cycle_id: cycleId, limit: '50', order: 'updated_at:DESC', ...params }).toString();
  const res = await apiClient.get(`/api/score-simulations?${query}`);
  return res?.rows || [];
}

export async function getAccreditationDashboard() {
  // Compose criteria with progress summary
  const cycle = await getActiveCycle();
  const [criteria, progress, cycleEvidences, simulations] = await Promise.all([
    getCriteria(),
    cycle ? getCycleProgress(cycle.cycle_id) : Promise.resolve([]),
    cycle ? apiClient.get(`/api/evidences?cycle_id=${encodeURIComponent(cycle.cycle_id)}&limit=1000`) : Promise.resolve({ rows: [] }),
    cycle ? listSimulations(cycle.cycle_id) : Promise.resolve([])
  ]);

  // Map progress by criteria_id
  const progressMap = new Map(progress.map(p => [p.criteria_id, p]));
  // Count evidences per criteria
  const evidenceRows = cycleEvidences?.rows || [];
  const evidenceCountMap = evidenceRows.reduce((map, ev) => {
    const cid = ev.criteria_id;
    map.set(cid, (map.get(cid) || 0) + 1);
    return map;
  }, new Map());
  const items = criteria.map((c, idx) => {
    const p = progressMap.get(c.criteria_id);
    const evComp = Number(p?.evidence_completion ?? 0);
    const narrative = String(p?.narrative_status || '').toLowerCase();
    const prog = Math.max(0, Math.min(100, Math.round(evComp)));
    const status = narrative === 'approved' && prog >= 80 ? 'completed' : (prog >= 50 || ['draft','review','submitted','validated'].includes(narrative) ? 'in-progress' : 'pending');
    return {
      id: c.criteria_id,
      code: c.code,
      name: c.title || c.code,
      progress: Math.round(prog),
      weight: c.weight || 0,
      status,
      documents: evidenceCountMap.get(c.criteria_id) || 0,
    };
  });

  const completed = items.filter(i => i.status === 'completed').length;
  const avgProgress = items.length ? Math.round(items.reduce((s,i) => s + i.progress, 0) / items.length) : 0;

  // Derive simple projected grade/score from latest simulation if any
  const latestSim = simulations && simulations.length ? simulations[0] : null;
  const projectedGrade = latestSim?.projected_grade || '-';
  const projectedScore = latestSim?.total_score != null ? Number(latestSim.total_score) : 0;

  return {
    summary: {
      currentScore: projectedScore,
      targetScore: 0,
      grade: projectedGrade || '-',
      criteriaCompleted: completed,
      totalCriteria: items.length,
      predictedGrade: projectedGrade || '-'
    },
    criteria: items,
    lastUpdated: new Date().toISOString(),
    cycle
  };
}

export default {
  getActiveCycle,
  getCriteria,
  getCycleProgress,
  getEvidenceByCriteria,
  exportLED,
  exportLEDExcel,
  listSimulations,
  getAccreditationDashboard,
};
