import { createSelector } from '@reduxjs/toolkit';

export const selectAccreditationSummary = state => state.accreditation.data?.summary;
export const selectCriteria = state => state.accreditation.data?.criteria || [];
export const selectEvidenceTotals = state => state.evidence.data?.totals || { validated:0, all:0 };
export const selectProgressData = state => state.progress.data;
export const selectInstitution = state => state.institution.data;
export const selectProjection = state => state.projection.data;

export const selectValidationRate = createSelector(
  [selectEvidenceTotals],
  totals => totals.all ? Math.round(totals.validated / totals.all * 100) : 0
);

export const selectCriteriaCompletionPercent = createSelector(
  [selectAccreditationSummary],
  summary => summary ? Math.round((summary.criteriaCompleted/summary.totalCriteria)*100) : 0
);

export const selectWeightedProgress = createSelector(
  [selectCriteria],
  criteria => criteria.reduce((s,c)=> s + (c.progress/100)*(c.weight||0), 0)
);

export const selectDashboardKaprodiModel = createSelector(
  [selectAccreditationSummary, selectCriteria, selectEvidenceTotals, selectProgressData, selectProjection],
  (summary, criteria, evidenceTotals, progressData, projection) => ({
    accreditation: summary ? {
      grade: summary.grade,
      currentScore: summary.currentScore,
      criteriaCompleted: summary.criteriaCompleted,
      totalCriteria: summary.totalCriteria,
      completionPercent: Math.round((summary.criteriaCompleted/summary.totalCriteria)*100),
      predicted: summary.predictedGrade
    } : null,
    criteriaSnapshot: criteria.slice(0,5),
    evidence: evidenceTotals,
    progress: progressData,
    projection
  })
);