import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInstitutionDashboard } from 'services/institutionService';

// Aggregate institution-wide metrics from backend APIs
export const fetchInstitutionMetrics = createAsyncThunk('institution/fetch', async () => {
  const data = await getInstitutionDashboard();
  return data;
});

const institutionSlice = createSlice({
  name: 'institution',
  initialState: { data: null, isLoading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchInstitutionMetrics.pending, (state)=>{ state.isLoading = true; state.error=null; })
      .addCase(fetchInstitutionMetrics.fulfilled, (state, action)=>{ state.isLoading=false; state.data=action.payload; })
      .addCase(fetchInstitutionMetrics.rejected, (state, action)=>{ state.isLoading=false; state.error=action.error.message; });
  }
});

export default institutionSlice.reducer;