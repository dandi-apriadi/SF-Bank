import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
  await new Promise(r => setTimeout(r, 120));
  return [
    { id: 'n1', type: 'task', message: 'Lengkapi LED Kriteria 4', priority: 'high', createdAt: new Date().toISOString() },
    { id: 'n2', type: 'evidence', message: '5 eviden menunggu validasi', priority: 'medium', createdAt: new Date().toISOString() },
    { id: 'n3', type: 'reminder', message: 'Deadline PPEPP Evaluation 7 hari lagi', priority: 'high', createdAt: new Date().toISOString() }
  ];
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], isLoading: false, error: null },
  reducers: {
    markRead: (state, action) => {
      state.items = state.items.map(n => n.id === action.payload ? { ...n, read: true } : n);
    },
  markAllRead: (state) => { state.items = state.items.map(n=>({ ...n, read:true })); },
  clearAll: (state) => { state.items = []; }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, (state)=>{ state.isLoading = true; state.error=null; })
      .addCase(fetchNotifications.fulfilled, (state, action)=>{ state.isLoading=false; state.items=action.payload; })
      .addCase(fetchNotifications.rejected, (state, action)=>{ state.isLoading=false; state.error=action.error.message; });
  }
});

export const { markRead, markAllRead, clearAll } = notificationSlice.actions;
export default notificationSlice.reducer;