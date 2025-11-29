import React from 'react';
import { shadows } from 'styles/designTokens';

const ButtonDanger = ({ children, className='', disabled=false, loading=false, ...rest }) => {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 border border-transparent focus:outline-none ${shadows.focus} transition-colors ${loading?'opacity-70 cursor-wait':''} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ButtonDanger;
