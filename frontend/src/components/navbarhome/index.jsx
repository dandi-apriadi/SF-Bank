import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiX, FiMenu, FiSun, FiMoon, FiYoutube, FiBookOpen, FiGift, FiLogIn } from 'react-icons/fi';
import { GiCastle, GiCrossedSwords, GiScrollUnfurled, GiTwoCoins, GiCrown, GiSwordsEmblem } from 'react-icons/gi';
import { MdEvent, MdGavel, MdPersonAdd } from 'react-icons/md';
import { FaDiscord } from 'react-icons/fa';
import { useSelector, useDispatch } from "react-redux";
import { getMe } from "../../store/slices/authSlice";
import { getNavbarRoutes } from "../../routes/routes-auth";
import "./style.css";

const Navbar = ({ forceTransparent = false }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const mobileMenuRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Get navbar routes from routes configuration
  const navbarRoutes = getNavbarRoutes();
  
  // Check if current path is active
  const isLinkActive = (path) => {
    return location.pathname === `/auth/${path}`;
  };

  // Icon mapping for Kingdom 3946 menu items
  const getMenuIcon = (path) => {
    const iconMap = {
      'homepage': GiCastle,
      'kvk': GiCrossedSwords,
      'events': MdEvent,
      'giveaway': FiGift,
      'forms': GiScrollUnfurled,
      'donation': GiTwoCoins,
      'about': GiCrown,
      'youtube': FiYoutube,
      'blog': FiBookOpen,
      'laws': MdGavel,
      'sign-in': FiLogIn,
      'sign-up': MdPersonAdd,
    };
    return iconMap[path] || GiCastle;
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

  // Initialize theme
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = saved ? saved === 'dark' : prefersDark;
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);
  
  // Scroll effect
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
    return null; // Or a minimal loader
  }

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        (scrolled && !forceTransparent)
          ? 'bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Brand */}
            <Link to="/auth/homepage" className="flex items-center group">
              <div className="relative mr-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#C5A059] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <GiCastle className="h-6 w-6 text-[#0F172A]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-wider text-slate-900 dark:text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                  KINGDOM 3946
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A059] dark:bg-gradient-to-r dark:from-[#FFD700] dark:to-[#FDB931] dark:bg-clip-text dark:text-transparent uppercase">
                  Rise of Kingdoms
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navbarRoutes.filter(route => ['homepage', 'about', 'kvk', 'events'].includes(route.path)).map((route) => {
                const isActive = isLinkActive(route.path);
                return (
                  <Link 
                    key={route.path}
                    to={`${route.layout}/${route.path}`}
                    className={`group px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-slate-100 dark:bg-white/10'
                        : 'hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className={
                      isActive
                        ? 'text-slate-900 dark:bg-gradient-to-r dark:from-[#FFD700] dark:to-[#FDB931] dark:bg-clip-text dark:text-transparent'
                        : 'text-slate-600 dark:text-yellow-600 group-hover:text-slate-900 dark:group-hover:text-[#FFD700]'
                    }>
                      {route.name}
                    </span>
                  </Link>
                );
              })}
              
              {/* More Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'more' ? null : 'more')}
                  className={`dropdown-trigger group flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                    activeDropdown === 'more'
                      ? 'bg-slate-100 dark:bg-white/10'
                      : 'hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span className={
                    activeDropdown === 'more'
                      ? 'text-slate-900 dark:bg-gradient-to-r dark:from-[#FFD700] dark:to-[#FDB931] dark:bg-clip-text dark:text-transparent'
                      : 'text-slate-600 dark:text-yellow-600 group-hover:text-slate-900 dark:group-hover:text-[#FFD700]'
                  }>More</span>
                  <svg className={`w-4 h-4 ml-1 transition-transform ${activeDropdown === 'more' ? 'rotate-180 text-slate-900 dark:text-[#FFD700]' : 'text-slate-600 dark:text-yellow-600 group-hover:text-slate-900 dark:group-hover:text-[#FFD700]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className={`absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden transition-all duration-200 origin-top-right ${
                  activeDropdown === 'more' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}>
                  <div className="p-2">
                    {navbarRoutes.filter(route => ['giveaway', 'forms', 'donation', 'youtube', 'blog', 'laws'].includes(route.path)).map((route) => {
                      const IconComponent = getMenuIcon(route.path);
                      return (
                        <Link
                          key={route.path}
                          to={`${route.layout}/${route.path}`}
                          className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center mr-3 group-hover:bg-[#FFD700]/20 transition-colors">
                            <IconComponent className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-[#C5A059] dark:group-hover:text-[#FFD700]" />
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:bg-gradient-to-r dark:group-hover:from-[#FFD700] dark:group-hover:to-[#FDB931] dark:group-hover:bg-clip-text dark:group-hover:text-transparent">
                              {route.name}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-4"></div>

              {/* Discord Icon */}
              <a
                href="https://discord.gg/kingdom3946" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-[#5865F2] hover:bg-[#5865F2]/10 transition-colors mr-2"
                title="Join our Discord"
              >
                <FaDiscord className="w-5 h-5" />
              </a>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg text-slate-500 dark:text-yellow-600 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>

              {/* Join Button */}
              <Link
                to="/auth/forms"
                className="ml-4 px-6 py-2.5 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center"
              >
                <GiSwordsEmblem className="w-4 h-4 mr-2" />
                Join Kingdom
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden space-x-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg text-slate-500 dark:text-yellow-600 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleMobileMenuClose}
        />

        {/* Menu Panel */}
        <div 
          ref={mobileMenuRef}
          className={`absolute top-0 right-0 w-80 h-full bg-white dark:bg-[#0F172A] shadow-2xl transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#C5A059] flex items-center justify-center shadow-lg mr-3">
                    <GiCastle className="h-6 w-6 text-[#0F172A]" />
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                      KINGDOM 3946
                    </span>
                    <span className="text-[10px] font-bold tracking-wider text-[#C5A059] dark:text-[#FFD700] uppercase">
                      Community
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleMobileMenuClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-[#FFD700] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <Link
                to="/auth/forms"
                onClick={handleMobileMenuClose}
                className="w-full py-3 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] font-bold rounded-xl shadow-lg flex items-center justify-center"
              >
                <GiSwordsEmblem className="w-5 h-5 mr-2" />
                Join Kingdom
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
              {navbarRoutes.filter(route => !['sign-in', 'sign-up'].includes(route.path)).map((route) => {
                const IconComponent = getMenuIcon(route.path);
                const isActive = isLinkActive(route.path);
                
                return (
                  <Link
                    key={route.path}
                    to={`${route.layout}/${route.path}`}
                    onClick={handleMobileMenuClose}
                    className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-slate-100 dark:bg-white/10' 
                        : 'hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                      isActive 
                        ? 'bg-white dark:bg-white/10 text-[#C5A059] dark:text-[#FFD700] shadow-sm' 
                        : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={`block font-bold text-sm ${
                        isActive
                          ? 'text-slate-900 dark:bg-gradient-to-r dark:from-[#FFD700] dark:to-[#FDB931] dark:bg-clip-text dark:text-transparent'
                          : 'text-slate-600 dark:text-yellow-600 group-hover:text-slate-900 dark:group-hover:bg-gradient-to-r dark:group-hover:from-[#FFD700] dark:group-hover:to-[#FDB931] dark:group-hover:bg-clip-text dark:group-hover:text-transparent'
                      }`}>{route.name}</span>
                      <span className="text-xs opacity-70 text-slate-500 dark:text-slate-400">{route.description || 'View page'}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-center space-x-6 text-slate-400">
                <a href="https://discord.gg/kingdom3946" target="_blank" rel="noopener noreferrer" className="hover:text-[#5865F2] transition-colors"><FaDiscord className="w-5 h-5" /></a>
                <a href="#" className="hover:text-[#C5A059] transition-colors"><FiYoutube className="w-5 h-5" /></a>
                <a href="#" className="hover:text-[#C5A059] transition-colors"><FiGift className="w-5 h-5" /></a>
                <a href="#" className="hover:text-[#C5A059] transition-colors"><GiCrown className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
