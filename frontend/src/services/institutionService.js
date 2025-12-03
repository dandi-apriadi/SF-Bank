// Network calls removed: provide a non-network stub for dashboard
export async function getInstitutionDashboard() {
  return {
    totals: {
      studyPrograms: 0,
      allDocs: 0,
      validatedDocs: 0,
      accreditedPrograms: 0,
      faculty: 0
    },
    quality: {
      qualityScore: 0,
      complianceRate: 0
    },
    activities: {
      activeProjects: 0,
      pendingActions: 0,
      recentActivities: []
    },
    programPerformance: [],
    alerts: [],
    lastUpdated: new Date().toISOString()
  };
}

export default { getInstitutionDashboard };
