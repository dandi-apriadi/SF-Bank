import React from 'react';
import { buttonVariants } from '../../styles/designTokens';

/**
 * Unified Button component
 * Props:
 * - variant: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
 * - size: 'sm' | 'md' | 'lg'
 * - outlined: boolean
 * - loading: boolean (shows spinner & disables)
 * - leftIcon / rightIcon: React nodes
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  outlined = false,
  type = 'button',
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...rest
}) => {
  const classes = buttonVariants({ variant, size, outlined });
  return (
    <button
      type={type}
      className={`${classes} gap-2 ${loading ? 'cursor-wait' : ''} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent'></span>
      )}
      {leftIcon && <span className='flex items-center'>{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className='flex items-center'>{rightIcon}</span>}
    </button>
  );
};

export default Button;