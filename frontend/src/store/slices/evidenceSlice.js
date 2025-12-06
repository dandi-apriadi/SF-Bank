import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEvidence = createAsyncThunk('evidence/fetch', async () => {
  await new Promise(r => setTimeout(r, 180));
  return {
    totals: { all: 248, validated: 203, pending: 45, rejected: 5, thisMonth: 24 },
    items: Array.from({ length: 12 }).map((_, i) => ({
      id: `EVD-${1000+i}`,
      title: `Evidence Document ${i+1}`,
      criterion: ['K1','K2','K3','K4','K5','K6','K7','K8','K9'][i%9],
      status: i % 7 === 0 ? 'rejected' : (i % 3 === 0 ? 'pending' : 'validated'),
      version: 1 + (i % 3),
      uploadedBy: 'dosen'+ ((i%5)+1),
      updatedAt: new Date(Date.now() - i*86400000).toISOString()
    }))
  };
});

const evidenceSlice = createSlice({
  name: 'evidence',
  initialState: { data: null, isLoading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchEvidence.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchEvidence.fulfilled, (state, action) => { state.isLoading = false; state.data = action.payload; })
      .addCase(fetchEvidence.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; });
  }
});

export default evidenceSlice.reducer;
