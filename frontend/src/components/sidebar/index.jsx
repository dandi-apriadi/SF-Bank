import React, { useMemo } from 'react';
import { HiX } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import Links from "./components/Links";
// Use single routes file for admin only
import routesAdmin from "../../routes/routes-admin.js";
import { useSelector } from "react-redux";
// Replaced local images with Unsplash URLs
const BETON_LOGO_URL = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80';
const PROPOSAL_GEDUNG_URL = 'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1400&q=80';

// Validate routes to ensure they contain valid components
const validateRoutes = (routes) => {
  if (!Array.isArray(routes)) return [];

  return routes.filter(route => {
    // Check if the route has a valid component or is a valid route object
    return route && typeof route === 'object' && (
      route.component || // Allow routes without components (for parent routes)
      typeof route.component === 'function' ||
      typeof route.component === 'string' ||
      React.isValidElement(route.component)
    );
  });
};

const Sidebar = ({ open, onClose }) => {
  const { user } = useSelector((state) => state.auth);

  // Use useMemo to only recalculate routes when user role changes
  // NOTE: Updated user roles (dosen removed): 'koordinator', 'pimpinan'
  const routes = useMemo(() => {
    try {
      // Always use admin routes regardless of logged-in user's role
      return validateRoutes(routesAdmin);
    } catch (error) {
      console.error("Error processing routes:", error);
      return [];
    }
  }, []);

  // Single admin color scheme (other role schemes removed as not needed)
  const roleColorScheme = useMemo(() => ({
    bg: 'bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900',
    text: 'text-white dark:text-white',
    accent: 'bg-blue-700 dark:bg-blue-800',
    gradient: 'from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900',
    border: 'border-blue-500/50 dark:border-blue-400/30',
    shadow: 'shadow-lg shadow-blue-500/20 dark:shadow-blue-800/20',
    hoverBg: 'hover:bg-blue-50 dark:hover:bg-navy-700',
    activeBg: 'bg-blue-50 dark:bg-navy-700',
    activeText: 'text-blue-700 dark:text-blue-400'
  }), []);

  return (
    <div
      className={`
        sm:none duration-300 linear fixed
        h-full w-72 flex flex-col
        bg-white dark:!bg-navy-800
        shadow-xl shadow-gray-300/20 dark:shadow-white/5
        transition-all dark:text-white
        md:!z-50 lg:!z-50 xl:!z-0
        rounded-r-xl
        ${open ? "translate-x-0" : "-translate-x-96"}
      `}
    >
      {/* Close Button */}
      <button
        className={`
          absolute top-4 right-4 cursor-pointer xl:hidden 
          ${roleColorScheme.bg} p-1.5 rounded-full 
          transition-all duration-200 ${roleColorScheme.shadow}
        `}
        onClick={onClose}
        aria-label="Close Sidebar"
      >
        <HiX className="h-4 w-4 text-white" />
      </button>

      {/* Enhanced Logo Header Section with Background Image */}
      <div className="mt-5 mx-auto w-full px-4">
        <div className={`
          relative overflow-hidden
          ${roleColorScheme.shadow}
          w-full rounded-xl py-6 text-center
          bg-white dark:bg-navy-900
        `}>
          {/* Background Overlay with Role-based Color */}
          <div className={`absolute inset-0 ${roleColorScheme.bg} opacity-90`}></div>

          {/* Background Image with Parallax Effect - Using Building Image */}
          <div className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{
              backgroundImage: `url(${PROPOSAL_GEDUNG_URL})`,
              transform: 'scale(1.1)',
              backgroundPosition: 'center'
            }}>
          </div>

          {/* Logo and Text Content - Improved Text Visibility */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="h-16 w-16 mb-2 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img
                src={BETON_LOGO_URL}
                alt="SF BANK Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-1 bg-black/20 backdrop-blur-sm px-4 py-1 rounded-lg">
              <h1 className="font-poppins text-[24px] font-bold text-white leading-tight tracking-wide drop-shadow-md">
                SF BANK
              </h1>
              <p className="text-xs text-white/80 mt-1">Aplikasi Manajemen Perbankan</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Section - Improved */}
      <div className="px-4 py-5 mx-2 mt-4 bg-gray-50 dark:bg-navy-900/40 rounded-xl">
        <div className="flex items-center">
          <div className={`w-14 h-14 rounded-full overflow-hidden ${roleColorScheme.shadow} flex items-center justify-center ${roleColorScheme.bg}`}>
            <FaUserCircle className="h-9 w-9 text-white" />
          </div>
          <div className="ml-3 flex-1">
            <h4 className="font-bold text-gray-800 dark:text-white truncate">{user?.fullname || 'User'}</h4>
            {user?.role && (
              <div className="flex items-center mt-1">
                <span className={`
                  text-xs px-3 py-1 rounded-full font-medium capitalize
                  ${roleColorScheme.bg} ${roleColorScheme.text}
                  ${roleColorScheme.shadow}
                `}>
                  {user?.role === 'admin' ? 'Admin' : user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 pt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-navy-600 scrollbar-track-transparent">
        <div className="mb-3 px-4">
          <h3 className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400">Menu Utama</h3>
        </div>
        <ul className="w-full space-y-1.5 pb-4">
          {Array.isArray(routes) && routes.length > 0 ? (
            <Links routes={routes} />
          ) : (
            <div className="text-center py-4 text-gray-500">No menu items available</div>
          )}
        </ul>
      </nav>

      {/* Footer with version info */}
      <div className="px-6 py-4 mt-auto">
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            SF BANK v1.0.0
            <p className="mt-1 text-xs">© 2025 SF BANK</p>
          </div>
      </div>
    </div>
  );
};

export default Sidebar;

