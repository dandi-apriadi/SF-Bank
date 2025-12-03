// Network calls removed: stubbed implementations to avoid backend requests

export async function getActiveCycle(/* params = {} */) {
  return null;
}

export async function getCriteria(/* params = {} */) {
  return [];
}

export async function getCycleProgress(/* cycleId */) {
  return [];
}

export async function getEvidenceByCriteria(/* cycleId, criteriaId */) {
  return [];
}

export async function exportLED(/* cycleId */) {
  return null;
}

export async function exportLEDExcel(/* cycleId */) {
  return null;
}

export async function listSimulations(/* cycleId, params = {} */) {
  return [];
}

export async function getAccreditationDashboard() {
  return {
    summary: {
      currentScore: 0,
      targetScore: 0,
      grade: '-',
      criteriaCompleted: 0,
      totalCriteria: 0,
      predictedGrade: '-'
    },
    criteria: [],
    lastUpdated: new Date().toISOString(),
    cycle: null
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
