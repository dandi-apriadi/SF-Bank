import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGapAnalysis = createAsyncThunk('gaps/fetch', async () => {
  await new Promise(r => setTimeout(r, 150));
  return {
    overall: { avgScore: 3.48, completeness: 82, good: 3, fair: 4, warning: 2 },
    criteria: [
      { id: 1, title: 'Vision and Mission', current: 3.8, target: 4.0, completeness: 95, status: 'good', gaps: 2 },
      { id: 2, title: 'Governance', current: 3.5, target: 4.0, completeness: 87, status: 'fair', gaps: 3 },
      { id: 3, title: 'Student Affairs', current: 3.6, target: 4.0, completeness: 90, status: 'good', gaps: 2 },
      { id: 4, title: 'Human Resources', current: 3.2, target: 4.0, completeness: 80, status: 'warning', gaps: 4 },
      { id: 5, title: 'Finance and Infrastructure', current: 3.4, target: 4.0, completeness: 85, status: 'fair', gaps: 3 }
    ],
    updatedAt: new Date().toISOString()
  };
});

const gapSlice = createSlice({
  name: 'gaps',
  initialState: { data: null, isLoading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchGapAnalysis.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchGapAnalysis.fulfilled, (state, action) => { state.isLoading = false; state.data = action.payload; })
      .addCase(fetchGapAnalysis.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; });
  }
});

export default gapSlice.reducer;
