import React from 'react';
import { tokenClasses } from 'styles/designTokens';

/**
 * ButtonPrimary - main button consistent using design tokens.
 * Props:
 * - children: isi konten
 * - className: tambahan kelas opsional
 * - loading: boolean (opsional)
 * - disabled: boolean
 * - onClick: handler
 */
const ButtonPrimary = ({ children, className = '', loading = false, disabled = false, ...rest }) => {
  return (
    <button
      className={`${tokenClasses.btnPrimary} ${className} ${loading ? 'opacity-70 cursor-wait' : ''}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-white" />}
      {children}
    </button>
  );
};

export default ButtonPrimary;
