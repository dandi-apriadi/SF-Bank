import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const computeProgress = createAsyncThunk('progress/compute', async (_, { getState }) => {
  await new Promise(r => setTimeout(r, 120));
  const { accreditation, evidence } = getState();
  const criteria = accreditation.data?.criteria || [];
  const evidenceTotals = evidence.data?.totals || { validated:0, all:0 };
  const avgProgress = criteria.length ? Math.round(criteria.reduce((s,c)=>s+c.progress,0)/criteria.length) : 0;
  return {
    accreditationProgress: avgProgress,
    evidenceValidationRate: evidenceTotals.all ? Math.round(evidenceTotals.validated / evidenceTotals.all * 100) : 0,
    lastRecalculated: new Date().toISOString()
  };
});

const progressSlice = createSlice({
  name: 'progress',
  initialState: { data: null, isLoading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(computeProgress.pending, (state)=>{ state.isLoading = true; state.error=null; })
      .addCase(computeProgress.fulfilled, (state, action)=>{ state.isLoading=false; state.data=action.payload; })
      .addCase(computeProgress.rejected, (state, action)=>{ state.isLoading=false; state.error=action.error.message; });
  }
});

export default progressSlice.reducer;
