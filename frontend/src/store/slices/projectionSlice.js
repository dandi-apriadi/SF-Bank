import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProjection = createAsyncThunk('projection/fetch', async (_, { getState }) => {
  const { accreditation } = getState();
  await new Promise(r => setTimeout(r, 150));
  const crit = accreditation.data?.criteria || [];
  const weighted = crit.reduce((sum,c)=> sum + (c.progress/100) * (c.weight || 0), 0);
  // Simple heuristic to project possible improvement (adds 5% of remaining gap)
  const potential = weighted + (1-weighted)*0.05;
  const projectedScore = (accreditation.data?.summary?.currentScore || 3.2) + 0.15; // mock uplift
  const projectedGrade = projectedScore >= 3.6 ? 'A' : projectedScore >= 3.0 ? 'B' : 'C';
  return {
    weightedCompletion: +(weighted*100).toFixed(1),
    potentialWeighted: +(potential*100).toFixed(1),
    projectedScore: +projectedScore.toFixed(2),
    projectedGrade,
    assumptions: [
      'Peningkatan linear 5% terhadap gap tersisa',
      'Tidak ada penurunan kinerja kriteria yang sudah selesai'
    ],
    generatedAt: new Date().toISOString()
  };
});

const projectionSlice = createSlice({
  name: 'projection',
  initialState: { data: null, isLoading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProjection.pending, (state)=>{ state.isLoading=true; state.error=null; })
      .addCase(fetchProjection.fulfilled, (state, action)=>{ state.isLoading=false; state.data=action.payload; })
      .addCase(fetchProjection.rejected, (state, action)=>{ state.isLoading=false; state.error=action.error.message; });
  }
});

export default projectionSlice.reducer;