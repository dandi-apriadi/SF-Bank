import React from 'react';
import { shadows } from 'styles/designTokens';

const ButtonSecondary = ({ children, className='', disabled=false, loading=false, ...rest }) => {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-gray-200 dark:hover:bg-navy-600 focus:outline-none ${shadows.focus} transition-colors ${loading?'opacity-70 cursor-wait':''} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ButtonSecondary;
