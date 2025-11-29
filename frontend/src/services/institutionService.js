import { apiClient } from './api';

// Fetch and compose institution-wide metrics from multiple API endpoints
export async function getInstitutionDashboard() {
  // Fetch in parallel
  // We request additional data (study programs + users) so frontend can compute
  // derived metrics such as accredited programs and faculty count. Use a
  // reasonably large limit for listing endpoints so we can compute totals.
  const [spAll, spSmall, docsAll, docsApproved, actInProgress, actOpen, kpiStats, notifications, activityLogs, usersResp] = await Promise.all([
    apiClient.get('/api/study-programs?limit=1000'),
    apiClient.get('/api/study-programs?limit=1'),
    apiClient.get('/api/documents?limit=1'),
    apiClient.get('/api/documents?status=approved&limit=1'),
    apiClient.get('/api/ppepp-actions?status=in_progress&limit=1'),
    apiClient.get('/api/ppepp-actions?status=open&limit=1'),
    apiClient.get('/api/quality/kpis/stats'),
    apiClient.get('/api/notifications?limit=5&order=created_at:DESC'),
    apiClient.get('/api/activity-logs?limit=5&order=created_at:DESC'),
    apiClient.get('/api/administrator/users')
  ]);

  // Prefer the count from the full list if available, otherwise fall back to the small list
  const studyPrograms = (spAll && spAll.total) ? spAll.total : (spSmall?.total || 0);
  const allDocs = docsAll?.total || 0;
  const validatedDocs = docsApproved?.total || 0;
  const activeProjects = (actInProgress?.total || 0) + (actOpen?.total || 0);
  const overallScore = kpiStats?.overallScore ?? 0;

  // Map notifications to alerts with derived priority
  const alerts = (notifications?.rows || []).map(n => ({
    id: n.notification_id,
    type: n.type,
    message: n.title || n.message,
    priority: n.type === 'task' ? 'high' : (n.type === 'reminder' ? 'medium' : 'medium'),
    dueDate: null
  }));

  // Map activity logs to recent activities
  const recentActivities = (activityLogs?.rows || []).map(a => ({
    id: a.log_id,
    type: a.entity_type,
    title: a.action,
    timestamp: new Date(a.created_at).toLocaleString('id-ID'),
    status: 'completed',
    user: 'User'
  }));

  // Compute accredited programs where backend exposes `accreditation_grade` or `accreditation`
  let accreditedPrograms = 0;
  let programPerformance = [];
  if (spAll && Array.isArray(spAll.rows)) {
    accreditedPrograms = spAll.rows.reduce((acc, sp) => {
      const grade = sp.accreditation_grade || sp.accreditation || sp.accreditationGrade || null;
      if (grade === 'A') return acc + 1;
      return acc;
    }, 0);

    // Map a lightweight performance list for the table. Only include available fields.
    programPerformance = spAll.rows.slice(0, 50).map(sp => ({
      name: sp.name,
      accreditation: sp.accreditation_grade || sp.accreditation || sp.accreditationGrade || '-',
      score: sp.overall_score ?? sp.score ?? '-',
      students: sp.student_count ?? '-',
      faculty: sp.faculty_count ?? sp.faculty_members ?? '-'
    }));
  }

  // Compute faculty count from users list (count users with role 'koordinator' as faculty members)
  let totalFaculty = 0;
  if (usersResp && Array.isArray(usersResp.data)) {
    totalFaculty = usersResp.data.filter(u => u.role === 'koordinator').length;
  }

  return {
    totals: {
      studyPrograms,
      allDocs,
      validatedDocs,
      accreditedPrograms,
      faculty: totalFaculty
    },
    quality: {
      qualityScore: Number(overallScore),
      complianceRate: Number(overallScore)
    },
    activities: {
      activeProjects,
      pendingActions: actOpen?.total || 0,
      recentActivities
    },
    programPerformance,
    alerts,
    lastUpdated: new Date().toISOString()
  };
}

export default { getInstitutionDashboard };
