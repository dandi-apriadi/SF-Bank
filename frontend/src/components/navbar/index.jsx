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

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-lightPrimary dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 transition-all"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <MdLightMode className="h-5 w-5 text-yellow-500" />
          ) : (
            <MdDarkMode className="h-5 w-5 text-slate-700" />
          )}
        </button>

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

        {/* Profile Dropdown */}
        <Dropdown
          button={
            <button className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:shadow-md dark:hover:shadow-blue-900/50 transition-all ml-1">
              <p className="text-base font-bold text-blue-500 dark:text-blue-400">
                {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
              </p>
            </button>
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[16px] bg-white dark:bg-slate-800 bg-cover bg-no-repeat shadow-xl dark:shadow-slate-900/50 border border-gray-200 dark:border-slate-700">
              {/* User Info */}
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Halo, {user?.fullname || "User"}
                  </p>
                </div>
                <p className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400">{user?.role || "User"}</p>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-slate-700" />

              {/* Menu Items */}
              <div className="flex flex-col p-3">
                <Link to={user ? "/admin/profile" : "/auth/sign-in"} className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <span className="mr-2 text-gray-600 dark:text-gray-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                  Profil Saya
                </Link>
                <Link to={user ? "/admin/settings" : "/auth/sign-in"} className="flex items-center rounded-lg px-3 py-2 mt-1 text-sm text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <span className="mr-2 text-gray-600 dark:text-gray-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.83L19.79 16.89C20.1656 17.2655 20.3766 17.7631 20.3766 18.2825C20.3766 18.8019 20.1656 19.2994 19.79 19.675C19.4144 20.0505 18.9169 20.2616 18.3975 20.2616C17.8781 20.2616 17.3805 20.0505 17.005 19.675L16.945 19.615C16.4528 19.1433 15.7321 19.0127 15.115 19.285C14.5136 19.5456 14.1601 20.1571 14.16 20.82V21C14.16 22.0799 13.2799 22.96 12.2 22.96C11.1201 22.96 10.24 22.0799 10.24 21V20.92C10.2329 20.2511 9.87325 19.6395 9.27 19.385C8.65292 19.1127 7.93219 19.2433 7.44 19.715L7.38 19.775C7.00446 20.1505 6.50693 20.3616 5.9875 20.3616C5.46807 20.3616 4.97054 20.1505 4.595 19.775C4.21946 19.3994 4.00842 18.9019 4.00842 18.3825C4.00842 17.8631 4.21946 17.3655 4.595 16.99L4.655 16.93C5.12667 16.4378 5.25733 15.7171 4.985 15.1C4.7244 14.4986 4.11292 14.1451 3.45 14.145H3.27C2.19013 14.145 1.31 13.2649 1.31 12.185C1.31 11.1051 2.19013 10.225 3.27 10.225H3.35C4.01891 10.218 4.6303 9.86055 4.885 9.26C5.15733 8.64293 5.02667 7.92219 4.555 7.43L4.495 7.37C4.11946 6.99446 3.90842 6.49693 3.90842 5.9775C3.90842 5.45807 4.11946 4.96054 4.495 4.585C4.87054 4.20946 5.36807 3.99842 5.8875 3.99842C6.40693 3.99842 6.90446 4.20946 7.28 4.585L7.34 4.645C7.83219 5.11667 8.55292 5.24733 9.17 4.975H9.185C9.78645 4.7144 10.14 4.10292 10.14 3.44V3.27C10.14 2.19013 11.0201 1.31 12.1 1.31C13.1799 1.31 14.06 2.19013 14.06 3.27V3.35C14.06 4.01291 14.4136 4.6244 15.015 4.885C15.6321 5.15733 16.3528 5.02667 16.845 4.555L16.905 4.495C17.2805 4.11946 17.7781 3.90842 18.2975 3.90842C18.8169 3.90842 19.3144 4.11946 19.69 4.495C20.0655 4.87055 20.2766 5.36808 20.2766 5.8875C20.2766 6.40692 20.0655 6.90446 19.69 7.28L19.63 7.34C19.1583 7.83219 19.0277 8.55292 19.3 9.17V9.185C19.5606 9.78645 20.1721 10.1399 20.835 10.14H20.92C21.9999 10.14 22.88 11.0201 22.88 12.1C22.88 13.1799 21.9999 14.06 20.92 14.06H20.84C20.1771 14.0601 19.5656 14.4136 19.305 15.015C19.2971 15.0229 19.2893 15.0309 19.2815 15.0389"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Pengaturan
                </Link>
              </div>

              <div className="h-px w-full bg-gray-200 dark:bg-slate-700" />

              {/* Sign Out */}
              <div className="p-3">
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RiLogoutBoxRLine className="mr-2 h-[16px] w-[16px]" />
                  {isLoading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-12 -right-3 md:right-0 w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;

