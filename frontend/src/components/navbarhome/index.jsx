import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiX, FiMenu, FiHome, FiInfo, FiMail, FiLogIn, FiPhone, FiFeather, FiStar, FiTag, FiUsers, FiHelpCircle } from 'react-icons/fi';
import { MdSchool, MdStar, MdFeatures, MdPersonAdd, MdRocketLaunch } from 'react-icons/md';
import { FaRocket, FaQuoteLeft } from 'react-icons/fa';
import { useSelector, useDispatch } from "react-redux";
import { getMe, logoutUser, reset } from "../../store/slices/authSlice";
import { getNavbarRoutes } from "../../routes/routes-auth";
import "./style.css";

const Navbar = ({ forceTransparent = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const mobileMenuRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Get navbar routes from routes configuration
  const navbarRoutes = getNavbarRoutes();
  
  // Check if current path is active
  const isLinkActive = (path) => {
    return location.pathname === `/auth/${path}`;
  };

  // Icon mapping for menu items
  const getMenuIcon = (path) => {
    const iconMap = {
      'homepage': FiHome,
      'about': FiInfo, 
      'features': FaRocket,
      'pricing': FiTag,
      'contact': FiPhone,
      'sign-in': FiLogIn,
      'sign-up': MdPersonAdd,
      'testimonials': FaQuoteLeft,
      'help': FiHelpCircle
    };
    return iconMap[path] || FiHome;
  };

  const toggleMobileMenu = (e) => {
    e?.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(getMe()).unwrap();
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    document.title = "PRIMA - Platform Integrasi Manajemen Mutu Akademik";
  }, [user]);
  
  // Add navbar scroll effect
  const [scrolled, setScrolled] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(typeof window !== 'undefined' && window.innerWidth < 1024);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest('.menu-button')) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = '';
      }
      if (dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest('.dropdown-trigger')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-50">
        <div className="bg-white/95 rounded-2xl p-8 flex flex-col items-center shadow-2xl border border-slate-200">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent mb-4" />
          <p className="text-slate-700 font-semibold">Memuat sistem...</p>
        </div>
      </div>
    );
  }

  // Check if we're on the login page for small screens - removed location dependency
  
  return (
    <>
      {/* PRIMA Professional Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        (scrolled && !forceTransparent)
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-slate-200/80 py-2' 
          : 'bg-white/10 backdrop-blur-sm py-4'
      }`}
      aria-label="Main navigation">
        <div className={`max-w-7xl mx-auto px-6 ${(scrolled && !forceTransparent) ? 'py-3' : 'py-4'} transition-all duration-300`}>
          <div className="flex justify-between items-center">
            {/* Enhanced Brand Section */}
            <div className="flex items-center">
              <Link to="/auth/homepage" className="flex items-center group">
                <div className="relative mr-4">
                  {/* Modern Logo Container */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-300 ${
                    (scrolled && !forceTransparent)
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                      : 'bg-white/20 backdrop-blur-sm border border-white/30'
                  }`}>
                    <MdSchool className={`h-7 w-7 ${
                      (scrolled && !forceTransparent) ? 'text-white' : 'text-white'
                    }`} />
                  </div>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl ${
                    (scrolled && !forceTransparent) ? 'bg-blue-500/20' : 'bg-white/20'
                  } scale-110 opacity-0 group-hover:opacity-100 blur transition-all duration-300`}></div>
                </div>
                <div className="flex flex-col">
                  <div className="relative">
                    <span className={`text-2xl font-bold transition-all duration-300 ${
                      (scrolled && !forceTransparent)
                        ? 'text-slate-800' 
                        : 'text-white'
                    }`}>
                      PRIMA
                    </span>
                    {/* Animated underline */}
                    <div className={`absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${
                      (scrolled && !forceTransparent) ? 'bg-blue-600' : 'bg-white'
                    }`}></div>
                  </div>
                  <span className={`text-xs font-medium transition-all duration-300 ${
                    (scrolled && !forceTransparent) ? 'text-slate-600' : 'text-white/80'
                  }`}>
                    Platform Integrasi Manajemen Mutu Akademik
                  </span>
                </div>
              </Link>
            </div>

            {/* Enhanced Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Main Navigation */}
              {navbarRoutes.filter(route => ['homepage', 'about', 'features', 'contact'].includes(route.path)).map((route) => {
                const IconComponent = getMenuIcon(route.path);
                const isActive = isLinkActive(route.path);
                
                return (
                  <Link 
                    key={route.path}
                    to={`${route.layout}/${route.path}`}
                    className={`group flex items-center px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 relative ${
                      isActive
                        ? (scrolled && !forceTransparent) 
                          ? 'text-blue-600 bg-blue-50/80' 
                          : 'text-white bg-white/20'
                        : (scrolled && !forceTransparent) 
                          ? 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/80' 
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                    <span>{route.name}</span>
                    {isActive && (
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                        (scrolled && !forceTransparent) ? 'bg-blue-600' : 'bg-white'
                      }`}></div>
                    )}
                  </Link>
                );
              })}
              
              {/* Additional Menu Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'more' ? null : 'more')}
                  className={`dropdown-trigger group flex items-center px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                    (scrolled && !forceTransparent) 
                      ? 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/80' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FiFeather className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                  <span>Lainnya</span>
                  <svg 
                    className={`w-4 h-4 ml-1 transition-transform ${activeDropdown === 'more' ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className={`absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden transition-all duration-300 ${
                  activeDropdown === 'more' 
                    ? 'opacity-100 translate-y-0 visible' 
                    : 'opacity-0 -translate-y-2 invisible'
                }`}>
                  <div className="p-2">
                    {navbarRoutes.filter(route => ['pricing', 'help'].includes(route.path) || route.path === 'testimonials').map((route) => {
                      const IconComponent = getMenuIcon(route.path);
                      return (
                        <Link
                          key={route.path}
                          to={`${route.layout}/${route.path}`}
                          className="group flex items-center px-4 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <IconComponent className="w-4 h-4 mr-3 text-slate-600 group-hover:text-blue-600" />
                          <div className="flex-1">
                            <span className="font-semibold text-slate-700 group-hover:text-blue-700 block">
                              {route.name}
                            </span>
                            <span className="text-xs text-slate-500 group-hover:text-blue-500">
                              {route.description || 'Pelajari lebih lanjut'}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Only */}
            <div className="flex items-center space-x-3">

              {/* Enhanced Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className={`lg:hidden p-3 rounded-xl focus:outline-none transition-all duration-300 ${
                  (scrolled && !forceTransparent) 
                    ? 'text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50' 
                    : 'text-white hover:text-white bg-white/10 hover:bg-white/20'
                } backdrop-blur-sm`}
              >
                <div className="relative w-6 h-6">
                  <FiMenu className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                  }`} />
                  <FiX className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                  }`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed inset-0 z-40 transform transition-all ease-in-out duration-300 ${
          isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
        aria-hidden={!isMobileMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-heading"
      >
        {/* Enhanced Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          onClick={handleMobileMenuClose}
        ></div>
        
        {/* Modern Menu Panel */}
        <div className="relative h-screen bg-white shadow-2xl max-w-sm overflow-y-auto">
          {/* Header with PRIMA Branding */}
          <div className="px-6 py-8 bg-gradient-to-br from-blue-50 via-white to-slate-50 border-b border-slate-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <MdSchool className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800" id="mobile-menu-heading">PRIMA</h2>
                <p className="text-sm text-slate-600">Manajemen Mutu Akademik</p>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation Links */}
          <div className="px-6 py-8 space-y-3">
            {navbarRoutes.filter(route => !['sign-in', 'sign-up'].includes(route.path)).map((route) => {
              const IconComponent = getMenuIcon(route.path);
              const isActive = isLinkActive(route.path);
              
              return (
                <Link
                  key={route.path}
                  to={`${route.layout}/${route.path}`}
                  onClick={handleMobileMenuClose}
                  className={`group flex items-center px-4 py-4 rounded-2xl transition-all duration-300 border ${
                    isActive 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'hover:bg-blue-50 border-transparent hover:border-blue-100'
                  }`}
                >
                  <div className={`w-12 h-12 mr-4 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-100 scale-110' 
                      : 'bg-slate-100 group-hover:bg-blue-100 group-hover:scale-110'
                  }`}>
                    <IconComponent className={`w-5 h-5 transition-colors ${
                      isActive 
                        ? 'text-blue-600' 
                        : 'text-slate-600 group-hover:text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <span className={`font-semibold block transition-colors ${
                      isActive 
                        ? 'text-blue-700' 
                        : 'text-slate-700 group-hover:text-blue-700'
                    }`}>
                      {route.name}
                    </span>
                    <span className={`text-xs transition-colors ${
                      isActive 
                        ? 'text-blue-500' 
                        : 'text-slate-500 group-hover:text-blue-500'
                    }`}>
                      {route.description || `Halaman ${route.name.toLowerCase()}`}
                    </span>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
            
            {/* Contact Information */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-center">
                  <MdSchool className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700 mb-1">Platform Akademik Terpadu</p>
                  <p className="text-xs text-slate-500">Menuju akreditasi berkualitas</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl border border-blue-100">
              <div className="text-center">
                <MdSchool className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 mb-1">Platform Akademik Terpadu</p>
                <p className="text-xs text-slate-500">Menuju akreditasi berkualitas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl">
        <div className="grid grid-cols-4 h-20 max-w-md mx-auto">
          {/* Main Navigation Items */}
          {navbarRoutes.filter(route => ['homepage', 'about', 'features', 'contact'].includes(route.path)).map((route) => {
            const IconComponent = getMenuIcon(route.path);
            const isActive = isLinkActive(route.path);
            
            return (
              <Link
                key={route.path}
                to={`${route.layout}/${route.path}`}
                className={`flex flex-col items-center justify-center transition-all duration-300 group ${
                  isActive ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600 active:text-blue-700'
                }`}
              >
                <div className="relative p-2 mb-1">
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-blue-100 scale-100' : 'bg-blue-50 scale-0 group-hover:scale-100'
                  }`}></div>
                  <IconComponent className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                </div>
                <span className={`text-xs transition-all ${
                  isActive ? 'font-bold' : 'font-semibold group-hover:font-bold'
                }`}>
                  {route.name.split(' ')[0]}
                </span>
                <div className={`w-4 h-0.5 bg-blue-600 rounded-full transition-transform duration-300 mt-1 ${
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
