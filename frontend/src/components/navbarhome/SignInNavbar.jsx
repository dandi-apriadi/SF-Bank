import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiMenu, FiHome, FiInfo, FiMail, FiLogIn, FiPhone } from 'react-icons/fi';
import { MdSchool } from 'react-icons/md';
import { useSelector, useDispatch } from "react-redux";
import { getMe, logoutUser, reset } from "../../store/slices/authSlice";
import "./style.css";
import logo from "../../assets/img/homepage/logo.png";

const SignInNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  
  // Remove isLinkActive function - no active state needed

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
  
  // Add navbar scroll effect - But always solid for Sign In
  const [isSmallScreen, setIsSmallScreen] = useState(typeof window !== 'undefined' && window.innerWidth < 1024);
  
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(reset());
      setIsProfileOpen(false);
      navigate('/auth/sign-in');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  useEffect(() => {
    const closeDropdowns = (e) => {
      if (!e.target.closest('.profile-menu')) {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', closeDropdowns);
    return () => document.removeEventListener('click', closeDropdowns);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest('.menu-button')) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = '';
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
  
  return (
    <>
      {/* PRIMA Professional Navbar */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-lg"
      aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Brand Section */}
            <div className="flex items-center">
              <Link to="/auth/homepage" className="flex items-center group">
                <div className="relative mr-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                    <MdSchool className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                    PRIMA
                  </h1>
                  <span className="text-xs text-slate-600 font-medium">
                    Platform Integrasi Manajemen Mutu Akademik
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/auth/homepage" 
                className="group flex items-center px-4 py-2 text-slate-700 font-semibold hover:text-blue-600 transition-colors duration-200"
              >
                <FiHome className="w-4 h-4 mr-2" />
                <span>Beranda</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
              
              <Link 
                to="/auth/about" 
                className="group flex items-center px-4 py-2 text-slate-700 font-semibold hover:text-blue-600 transition-colors duration-200"
              >
                <FiInfo className="w-4 h-4 mr-2" />
                <span>Tentang Sistem</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
              
              <Link 
                to="/auth/features" 
                className="group flex items-center px-4 py-2 text-slate-700 font-semibold hover:text-blue-600 transition-colors duration-200"
              >
                <MdSchool className="w-4 h-4 mr-2" />
                <span>Fitur</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
              
              <Link 
                to="/auth/contact" 
                className="group flex items-center px-4 py-2 text-slate-700 font-semibold hover:text-blue-600 transition-colors duration-200"
              >
                <FiPhone className="w-4 h-4 mr-2" />
                <span>Kontak</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
            </div>

            {/* CTA Button */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/auth/sign-in"
                className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                           text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FiLogIn className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
                <span>Sign In System</span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-3 rounded-xl bg-slate-100 hover:bg-slate-200 focus:outline-none 
                           text-slate-600 hover:text-slate-800 transition-all duration-200"
              >
                {isMobileMenuOpen ?
                  <FiX className="w-5 h-5" /> :
                  <FiMenu className="w-5 h-5" />
                }
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modern Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden fixed inset-0 z-40 transform transition-all ease-in-out duration-300 ${
          isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
        aria-hidden={!isMobileMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-heading"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          onClick={handleMobileMenuClose}
        ></div>
        
        {/* Menu Panel */}
        <div className="relative h-screen bg-white shadow-2xl max-w-sm">
          {/* Header */}
          <div className="px-6 py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                <MdSchool className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800" id="mobile-menu-heading">PRIMA</h2>
                <p className="text-xs text-slate-600">Manajemen Mutu Akademik</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-6 py-8 space-y-4">
            <Link
              to="/auth/homepage"
              onClick={handleMobileMenuClose}
              className="flex items-center px-4 py-3 hover:bg-blue-50 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 mr-4 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <FiHome className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
              </div>
              <span className="font-semibold text-slate-700 group-hover:text-blue-700">Beranda</span>
            </Link>
            
            <Link
              to="/auth/about"
              onClick={handleMobileMenuClose}
              className="flex items-center px-4 py-3 hover:bg-blue-50 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 mr-4 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <FiInfo className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
              </div>
              <span className="font-semibold text-slate-700 group-hover:text-blue-700">Tentang Sistem</span>
            </Link>
            
            <Link
              to="/auth/features"
              onClick={handleMobileMenuClose}
              className="flex items-center px-4 py-3 hover:bg-blue-50 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 mr-4 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <MdSchool className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
              </div>
              <span className="font-semibold text-slate-700 group-hover:text-blue-700">Fitur</span>
            </Link>
            
            <Link
              to="/auth/contact"
              onClick={handleMobileMenuClose}
              className="flex items-center px-4 py-3 hover:bg-blue-50 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 mr-4 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <FiPhone className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
              </div>
              <span className="font-semibold text-slate-700 group-hover:text-blue-700">Kontak</span>
            </Link>
            
            {/* CTA Button */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <Link
                to="/auth/sign-in"
                onClick={handleMobileMenuClose}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 
                           py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl
                           flex items-center justify-center gap-3 transform hover:scale-105"
              >
                <FiLogIn className="w-5 h-5" />
                <span>Sign In to System</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-lg">
        <div className="grid grid-cols-4 h-16">
          <Link
            to="/auth/homepage"
            className="flex flex-col items-center justify-center text-slate-500 hover:text-blue-600 active:text-blue-700 transition-colors group"
          >
            <div className="relative p-2">
              <div className="absolute inset-0 rounded-lg bg-blue-50 scale-0 group-hover:scale-100 transition-transform duration-200"></div>
              <FiHome className="w-5 h-5 relative z-10" />
            </div>
            <span className="text-xs font-medium">Beranda</span>
          </Link>
          
          <Link
            to="/auth/about"
            className="flex flex-col items-center justify-center text-slate-500 hover:text-blue-600 active:text-blue-700 transition-colors group"
          >
            <div className="relative p-2">
              <div className="absolute inset-0 rounded-lg bg-blue-50 scale-0 group-hover:scale-100 transition-transform duration-200"></div>
              <FiInfo className="w-5 h-5 relative z-10" />
            </div>
            <span className="text-xs font-medium">Info</span>
          </Link>
          
          <Link
            to="/auth/contact"
            className="flex flex-col items-center justify-center text-slate-500 hover:text-blue-600 active:text-blue-700 transition-colors group"
          >
            <div className="relative p-2">
              <div className="absolute inset-0 rounded-lg bg-blue-50 scale-0 group-hover:scale-100 transition-transform duration-200"></div>
              <FiPhone className="w-5 h-5 relative z-10" />
            </div>
            <span className="text-xs font-medium">Kontak</span>
          </Link>
          
          <Link
            to="/auth/sign-in"
            className="flex flex-col items-center justify-center text-blue-600 hover:text-blue-800 active:text-blue-900 transition-colors group"
          >
            <div className="relative p-2">
              <div className="absolute inset-0 rounded-lg bg-blue-50 scale-0 group-hover:scale-100 transition-transform duration-200"></div>
              <FiLogIn className="w-5 h-5 relative z-10" />
            </div>
            <span className="text-xs font-medium">Sign In</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignInNavbar;

