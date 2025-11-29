import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from 'store/slices/themeSlice';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector(s=>s.theme.mode);
  return (
    <button
      onClick={()=>dispatch(toggleTheme())}
      className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 hover:shadow-sm transition"
      title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {mode === 'light' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364-1.414-1.414M8.05 8.05 6.636 6.636m10.728 0-1.414 1.414M8.05 15.95l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.752 15.002A9.718 9.718 0 0112 21.75a.75.75 0 010-1.5 8.218 8.218 0 007.735-5.468.75.75 0 011.434.47 9.642 9.642 0 01-.417.75z" />
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.25 8.25 0 0020.25 12a.75.75 0 011.5 0A9.75 9.75 0 008.89 1.06a.75.75 0 01.638.658z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;