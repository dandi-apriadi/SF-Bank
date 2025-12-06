import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FiAlignJustify } from "react-icons/fi";
import { BsArrowBarUp } from "react-icons/bs";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { MdDarkMode, MdLightMode } from "react-icons/md";
// Notification dropdown removed per request
// removed campus icon import (not used)
import Dropdown from "components/dropdown";
import { useLogout } from "hooks/useLogout";
import SacredLogo from '../../assets/img/auth/animatedlogo.gif';

const Navbar = ({ onOpenSidenav, brandText: initialBrandText }) => {
  const [brandText, setBrandText] = useState(initialBrandText);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if dark mode preference is saved in localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const dispatch = useDispatch();
  const { microPage, user } = useSelector((state) => state.auth);
  // Notifications removed
  const { logout, isLoading } = useLogout();

  // Apply dark mode to document - Force white theme in admin panel
  useEffect(() => {
    const isAdminPath = window.location.pathname.includes('/admin');
    
    if (isAdminPath) {
      // Force white/light theme for admin panel
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      // Apply saved dark mode preference for auth pages
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Update brandText when microPage changes
  useEffect(() => {
    setBrandText(microPage !== "unset" ? microPage : initialBrandText);
  }, [microPage, initialBrandText]);

  // Handle logout using custom hook
  const handleLogout = () => {
    logout();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Removed notifications fetch effect

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl border border-gray-100">
      {/* Left Side - Branding & Page Title */}
      <div className="ml-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center h-6 pt-1">
          <Link to={user ? "/admin/dashboard" : "/auth/sign-in"} className="text-sm font-normal text-navy-700 hover:underline flex items-center">
            SacredBank
          </Link>
          <span className="mx-1 text-sm text-navy-700">/</span>
          <span className="text-sm font-normal capitalize text-navy-700">
            {brandText}
          </span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-[28px] font-bold capitalize text-navy-700 mt-1">{brandText}</h1>
      </div>

      {/* Right Side - Controls & User Interface */}
      <div className="flex items-center gap-1 sm:gap-2">

        {/* Dark Mode Toggle - Hidden */}
        {/* <button
          onClick={toggleDarkMode}
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-lightPrimary dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 transition-all"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <MdLightMode className="h-5 w-5 text-yellow-500" />
          ) : (
            <MdDarkMode className="h-5 w-5 text-slate-700" />
          )}
        </button> */}

        {/* Mobile Menu Toggle */}
        <button
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-lightPrimary dark:bg-slate-700 text-gray-600 dark:text-gray-300 xl:hidden border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600 transition-all"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </button>

        {/* Mobile Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 xl:hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Logout"
        >
          <RiLogoutBoxRLine className={`h-5 w-5 transition-colors ${
            isLoading 
              ? 'text-gray-400' 
              : 'text-red-500 dark:text-red-500'
          }`} />
        </button>

        {/* Desktop Logout Button */}
        <div className="hidden md:flex items-center">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex h-[40px] w-[40px] items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Logout"
          >
            <RiLogoutBoxRLine className={`h-5 w-5 transition-colors ${
              isLoading 
                ? 'text-gray-400' 
                : 'text-red-500 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400'
            }`} />
          </button>
        </div>

        {/* Dashboard Link removed (icon near logout) */}

        {/* Profile Dropdown - REMOVED as per request */}
      </div>
    </nav>
  );
};

export default Navbar;

