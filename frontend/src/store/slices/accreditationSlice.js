import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAccreditationDashboard } from 'services/accreditationService';

// Fetch accreditation criteria & progress from backend
export const fetchAccreditation = createAsyncThunk('accreditation/fetch', async () => {
  const data = await getAccreditationDashboard();
  return data;
});

const accreditationSlice = createSlice({
  name: 'accreditation',
  initialState: { data: null, isLoading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAccreditation.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchAccreditation.fulfilled, (state, action) => { state.isLoading = false; state.data = action.payload; })
      .addCase(fetchAccreditation.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; });
  }
});

export default accreditationSlice.reducer;
