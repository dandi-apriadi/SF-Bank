// Design Tokens (Level 1 Semantic Mapping)
// Catatan: Gunakan token ini di komponen baru agar konsisten dan mudah diganti.

export const colors = {
  // Brand / Primary
  primary: 'text-blue-600',
  primaryBg: 'bg-blue-600',
  primaryHoverBg: 'hover:bg-blue-700',
  primaryBorder: 'border-blue-600',

  // Surface / Container
  surface: 'bg-white dark:bg-navy-800',
  surfaceAlt: 'bg-gray-50 dark:bg-navy-700/40',
  surfaceBorder: 'border-gray-200 dark:border-navy-700',

  // Text
  textPrimary: 'text-gray-900 dark:text-white',
  textSecondary: 'text-gray-600 dark:text-gray-300',
  textMuted: 'text-gray-500 dark:text-gray-400',

  // States
  success: 'text-green-600',
  successBg: 'bg-green-50',
  warning: 'text-amber-600',
  warningBg: 'bg-amber-50',
  danger: 'text-red-600',
  dangerBg: 'bg-red-50',
  info: 'text-blue-600',
  infoBg: 'bg-blue-50',

  // Accent badges
  badgeCompleted: 'bg-green-100 text-green-700',
  badgeProgress: 'bg-blue-100 text-blue-700',
  badgePending: 'bg-amber-100 text-amber-700',
  badgeError: 'bg-red-100 text-red-700'
};

export const spacing = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  xxl: '32px'
};

export const radii = {
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full'
};

export const shadows = {
  card: 'shadow-sm hover:shadow-md transition-shadow',
  elevated: 'shadow',
  focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
};

// Helper: compose utility string for a standard card container
export const tokenClasses = {
  card: `${colors.surface} ${colors.surfaceBorder} border ${radii.xl} p-6 ${shadows.card}`,
  cardSectionTitle: `${colors.textPrimary} text-sm font-semibold`,
  badgeBase: 'text-xs font-medium px-2 py-1 rounded-full',
  btnPrimary: `inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white ${colors.primaryBg} ${colors.primaryHoverBg} rounded-lg border border-transparent focus:outline-none ${shadows.focus}`
};

// Dynamic button variant generator
export const buttonVariants = ({ variant='primary', size='md', outlined=false } = {}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
  const sizing = size === 'sm' ? 'text-xs px-3 py-1.5' : size === 'lg' ? 'text-base px-6 py-3' : 'text-sm px-4 py-2';
  const map = {
    primary: outlined ? 'border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-navy-700' : 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: outlined ? 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-navy-600 dark:text-gray-200 dark:hover:bg-navy-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-navy-700 dark:hover:bg-navy-600 dark:text-gray-200',
    danger: outlined ? 'border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'bg-red-600 hover:bg-red-700 text-white',
    success: outlined ? 'border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' : 'bg-green-600 hover:bg-green-700 text-white',
    warning: outlined ? 'border border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'bg-amber-500 hover:bg-amber-600 text-white'
  };
  return `${base} ${sizing} ${map[variant] || map.primary}`;
};

// Example usage (JSDoc for devs)
/**
 * import { tokenClasses, colors } from 'styles/designTokens';
 * <div className={tokenClasses.card}>...</div>
 */
