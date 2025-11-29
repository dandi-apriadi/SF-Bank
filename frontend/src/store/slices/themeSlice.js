import { createSlice } from '@reduxjs/toolkit';

const initial = (()=>{
  if(typeof window === 'undefined') return { mode:'light' };
  const saved = localStorage.getItem('prima_theme');
  return { mode: saved || 'light' };
})();

const themeSlice = createSlice({
  name: 'theme',
  initialState: initial,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      if(typeof window !== 'undefined'){
        localStorage.setItem('prima_theme', state.mode);
        document.documentElement.classList.toggle('dark', state.mode === 'dark');
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      if(typeof window !== 'undefined'){
        localStorage.setItem('prima_theme', state.mode);
        document.documentElement.classList.toggle('dark', state.mode === 'dark');
      }
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;