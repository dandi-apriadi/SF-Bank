import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/Homepage.css';
// apiClient removed — homepage uses local fallback data now
import { 
  FaGraduationCap, FaShieldAlt, FaUsers, FaCog, FaChartLine, FaGlobe,
  FaCheckCircle, FaStar, FaQuoteLeft, FaArrowRight, FaPlayCircle,
  FaFileAlt, FaClipboardCheck, FaChartBar, FaLightbulb, FaHeart, FaAward,
  FaUniversity, FaBookOpen, FaCertificate, FaUserGraduate, FaChalkboardTeacher,
  FaBars, FaTimes, FaCalendarAlt, FaSearch, FaMapMarkerAlt, FaBuilding,
  FaCamera, FaUserFriends, FaProjectDiagram, FaBullseye, FaPoll
} from 'react-icons/fa';
import { MdSecurity, MdSpeed, MdSupport, MdAnalytics, MdAssignment } from 'react-icons/md';
import { BsLightning, BsShield, BsGraph, BsTelephone, BsEnvelope, BsGeoAlt, BsClipboardData } from 'react-icons/bs';

// Import komponen navbar jika ada
// import NavbarHome from '../../components/navbarhome';

const Homepage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  // Remote data from backend
  const [remoteNews, setRemoteNews] = useState([]);
  const [remoteStats, setRemoteStats] = useState(null);
  const [remoteServices, setRemoteServices] = useState([]);
  const [remoteTestimonials, setRemoteTestimonials] = useState([]);
  // News modal state
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newsModalItem, setNewsModalItem] = useState(null);
  // Default fallback image for news when DB image is missing or broken
  const DEFAULT_NEWS_IMAGE = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80&auto=format&fit=crop';

  const resolveImage = (item) => {
    if (!item) return DEFAULT_NEWS_IMAGE;
    if (item.image && typeof item.image === 'string' && item.image.trim() !== '') return item.image;
    return DEFAULT_NEWS_IMAGE;
  };

  // Handle dropdown toggle
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Handle service click
  const handleServiceClick = (serviceKey) => {
    // Prefer remoteServices (array with { key, ... }) when available
    if (remoteServices && remoteServices.length) {
      const svc = remoteServices.find(s => s.key === serviceKey) || null;
      setSelectedService(svc || servicesData[serviceKey] || null);
    } else {
      setSelectedService(servicesData[serviceKey] || null);
    }
    setIsServiceModalOpen(true);
  };

  // Get service data by key
  const getServiceByKey = (key) => {
    return servicesData[key] || null;
  };

  // Format number for display
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Open / close news modal
  const openNewsModal = (item) => {
    setNewsModalItem(item);
    setIsNewsModalOpen(true);
  };

  const closeNewsModal = () => {
    setIsNewsModalOpen(false);
    setNewsModalItem(null);
  };

  useEffect(() => {
    // Auto rotate testimonials
    const total = (remoteTestimonials && remoteTestimonials.length) ? remoteTestimonials.length : testimonials.length;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % (total || 1));
    }, 5000);

    // Handle ESC key for mobile menu
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  // Load homepage aggregate from backend
  useEffect(() => {
    // Network calls removed: use local fallback data for homepage
    let mounted = true;
    if (mounted) {
      setRemoteNews(newsData || []);
      setRemoteStats(stats || null);
      setRemoteServices([]);
      setRemoteTestimonials(testimonials || []);
    }
    return () => { mounted = false; };
  }, []);

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Features removed from homepage per request

  const stats = [
    { number: "24", label: "Program Studi", icon: <FaUniversity /> },
    { number: "342", label: "Dosen Aktif", icon: <FaChalkboardTeacher /> },
    { number: "98.5%", label: "Tingkat Kepuasan", icon: <BsLightning /> },
    { number: "24/7", label: "Sistem Monitoring", icon: <MdSupport /> }
  ];

  const testimonials = [
    {
      name: "Prof. Dr. Ahmad Sudirman, M.T.",
      position: "Koordinator Program Studi Teknik Informatika, Universitas Prima Indonesia",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fit=crop&crop=face",
      rating: 5,
      text: "PRIMA memudahkan pengelolaan siklus PPEPP dan dokumentasi akreditasi. Dashboard yang intuitif dan sistem notifikasi otomatis sangat membantu koordinasi tim."
    },
    {
      name: "Dr. Sarah Wijaya, M.Pd.",
      position: "Kepala Unit PPMPP, Universitas Prima Indonesia",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80&fit=crop&crop=face",
      rating: 5,
      text: "Fitur analytics dan progress monitoring memberikan insight mendalam untuk pengambilan keputusan strategis. Sistem validasi dokumen sangat efisien dan akurat."
    },
    {
      name: "Dra. Nina Hartati, M.M.",
      position: "Koordinator Program Studi Akuntansi, Universitas Prima Indonesia",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&fit=crop&crop=face",
      rating: 5,
      text: "Platform yang sangat user-friendly dengan fitur lengkap untuk manajemen mutu akademik. Workflow yang terstruktur membantu meningkatkan efisiensi kerja tim."
    }
  ];

  const newsData = [
    {
      id: 1,
      title: "BAN-PT Luncurkan Panduan Akreditasi Online Terbaru 2025",
      excerpt: "Panduan terbaru mencakup prosedur akreditasi digital yang lebih efisien dan terintegrasi dengan platform manajemen mutu perguruan tinggi.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
      date: "2025-01-15",
      category: "Akreditasi",
      author: "Tim Redaksi PRIMA",
      readTime: "5 menit baca"
    },
    {
      id: 2,
      title: "Kemendikbudristek Sosialisasi Standar Mutu Akademik Nasional",
      excerpt: "Program sosialisasi standar mutu akademik nasional untuk meningkatkan kualitas pendidikan tinggi di Indonesia.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
      date: "2025-01-10",
      category: "Regulasi",
      author: "Tim Redaksi PRIMA",
      readTime: "7 menit baca"
    },
    {
      id: 3,
      title: "Tips Optimalisasi Sistem PPEPP untuk Program Studi",
      excerpt: "Strategi dan best practices untuk mengoptimalkan implementasi siklus PPEPP dalam program studi guna meningkatkan mutu akademik.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
      date: "2025-01-08",
      category: "Tutorial",
      author: "Dr. Ahmad Mulyadi",
      readTime: "6 menit baca"
    },
    {
      id: 4,
      title: "LAM-PTKes Umumkan Perubahan Instrumen Akreditasi 2025",
      excerpt: "Instrumen akreditasi terbaru untuk program studi kesehatan dengan fokus pada digitalisasi dan inovasi pembelajaran.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80",
      date: "2025-01-05",
      category: "Akreditasi",
      author: "Tim Redaksi PRIMA",
      readTime: "4 menit baca"
    },
    {
      id: 5,
      title: "Webinar: Transformasi Digital Manajemen Mutu Akademik",
      excerpt: "Menghadiri webinar nasional tentang transformasi digital dalam manajemen mutu akademik dan implementasi platform PRIMA.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
      date: "2025-01-03",
      category: "Event",
      author: "Prof. Dr. Siti Nurhasanah",
      readTime: "3 menit baca"
    },
    {
      id: 6,
      title: "Panduan Lengkap Dokumentasi LED untuk Akreditasi",
      excerpt: "Langkah-langkah detail dalam menyusun Laporan Evaluasi Diri (LED) yang efektif untuk proses akreditasi institusi dan program studi.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
      date: "2025-01-01",
      category: "Tutorial",
      author: "Dr. Rina Kartika",
      readTime: "8 menit baca"
    }
  ];

  // Data dummy untuk layanan PRIMA (simplified after removing Features section)
  const servicesData = {
    accreditation: {
      title: "Sistem Akreditasi",
      description: "Manajemen dokumen dan proses akreditasi.",
      features: [],
      stats: [],
      recentActivities: []
    },
    spmi: {
      title: "SPMI",
      description: "Sistem Penjaminan Mutu Internal.",
      features: [],
      stats: [],
      recentActivities: []
    },
    ami: {
      title: "AMI",
      description: "Audit Mutu Internal.",
      features: [],
      stats: [],
      recentActivities: []
    },
    audit: {
      title: "Sistem Audit Lapangan",
      description: "Platform digital untuk mendukung pelaksanaan audit lapangan dengan tools yang lengkap",
      stats: [
        { label: "Audit Lapangan", value: "64", icon: FaMapMarkerAlt },
        { label: "Lokasi Audit", value: "18", icon: FaBuilding },
        { label: "Foto Dokumentasi", value: "1,247", icon: FaCamera },
        { label: "GPS Tracking Aktif", value: "100%", icon: FaGlobe }
      ],
      features: [
        { name: "Mobile Audit Application", desc: "Aplikasi mobile untuk melakukan audit lapangan secara real-time", progress: 94 },
        { name: "GPS Tracking & Geolocation", desc: "Pelacakan lokasi auditor untuk validasi kehadiran di tempat audit", progress: 100 },
        { name: "Dokumentasi Foto & Video", desc: "Fitur dokumentasi multimedia untuk bukti temuan audit", progress: 87 },
        { name: "Offline Mode Support", desc: "Tetap dapat melakukan audit meskipun tidak ada koneksi internet", progress: 83 }
      ],
      recentActivities: [
        { action: "Audit lapangan laboratorium komputer selesai", time: "15 menit yang lalu", user: "Tim Audit Lapangan" },
        { action: "Upload 47 foto dokumentasi fasilitas perpustakaan", time: "1 jam yang lalu", user: "Auditor Mobile" },
        { action: "Check-in GPS lokasi audit ruang kelas gedung A", time: "2 jam yang lalu", user: "Lead Auditor" },
        { action: "Sinkronisasi data audit offline ke server", time: "3 jam yang lalu", user: "System" }
      ]
    }
  };





  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <FaGraduationCap className="text-white w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                PRIMA
              </span>
            </div>
            
            {/* Desktop Navigation - Clean & Organized */}
            <div className="hidden lg:flex items-center space-x-8">
              {[
                { name: 'Akreditasi', id: 'accreditation' },
                { name: 'SPMI', id: 'spmi-documents' },
                { name: 'AMI', id: 'ami' },
                { name: 'Info', id: 'info', submenu: [
                  { name: 'Beranda', id: 'hero' },
                  { name: 'Tentang', id: 'about' },
                  { name: 'Berita', id: 'news' }
                ]}
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <a 
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(item.id);
                      if (element) {
                        element.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }
                    }}
                    className="relative text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 font-medium cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    {item.name}
                    {item.submenu && (
                      <span className="ml-1 text-xs">▼</span>
                    )}
                  </a>
                  
                  {/* Dropdown Menu for Info */}
                  {item.submenu && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="py-2">
                        {item.submenu.map((subitem, subindex) => (
                          <a
                            key={subindex}
                            href={`#${subitem.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const element = document.getElementById(subitem.id);
                              if (element) {
                                element.scrollIntoView({ 
                                  behavior: 'smooth',
                                  block: 'start'
                                });
                              }
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                          >
                            {subitem.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="w-6 h-6" />
                ) : (
                  <FaBars className="w-6 h-6" />
                )}
              </button>

              <Link 
                to="/auth/sign-in"
                className="group relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden transform hover:scale-105 text-sm"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative flex items-center">
                  <FaGraduationCap className="mr-2 w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="hidden sm:inline">Masuk</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="relative w-80 h-full bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                    <FaGraduationCap className="text-white w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">PRIMA</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {/* Main Menu Items - Layanan PRIMA */}
                {[
                  { name: 'Akreditasi', id: 'accreditation', icon: FaCertificate },
                    { name: 'SPMI', id: 'spmi-documents', icon: FaFileAlt },
                    { name: 'AMI', id: 'ami', icon: FaClipboardCheck },
                    { name: 'Audit Evaluasi', id: 'audit-evaluation', icon: FaChartLine }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleMobileMenuClick(item.id)}
                      className="w-full flex items-center space-x-3 p-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group"
                    >
                      <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
                
                {/* Info Section */}
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-4">
                    Informasi
                  </div>
                  {[
                    { name: 'Beranda', id: 'hero', icon: FaGraduationCap },
                    { name: 'Tentang', id: 'about', icon: FaUniversity },
                    { name: 'Berita', id: 'news', icon: FaFileAlt }
                  ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleMobileMenuClick(item.id)}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group text-sm"
                      >
                        <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>

              {/* Mobile CTA */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/auth/sign-in"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <FaGraduationCap className="w-5 h-5" />
                  <span>Masuk ke Sistem PRIMA</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-20 overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                Dipercaya oleh 500+ Program Studi
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Platform Integrasi 
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent animate-gradient">
                    {" "}Manajemen Mutu{" "}
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-full transform scale-x-0 animate-scale-x"></div>
                </span>
                Akademik
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg">
                PRIMA (Platform Integrasi Manajemen Mutu Akademik) adalah solusi komprehensif untuk 
                manajemen akreditasi, monitoring PPEPP, dan peningkatan mutu akademik perguruan tinggi.
              </p>
              
              {/* Features highlight */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FaCheckCircle className="text-green-500 w-4 h-4 mr-2" />
                  <span>Setup 5 menit</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FaCheckCircle className="text-green-500 w-4 h-4 mr-2" />
                  <span>Keamanan tingkat bank</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FaCheckCircle className="text-green-500 w-4 h-4 mr-2" />
                  <span>Support 24/7</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/auth/sign-in" 
                  className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 flex items-center justify-center transform hover:scale-105 overflow-hidden"
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <FaGraduationCap className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10">Masuk ke Sistem PRIMA</span>
                  <FaArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                </Link>
                <button 
                  onClick={() => setIsVideoPlaying(true)}
                  className="group relative border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  <FaPlayCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="relative">Lihat Demo</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80" 
                  alt="Prima Platform - Modern University Management System" 
                  className="relative w-full h-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl animate-float">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Live Data</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl animate-float animation-delay-1000">
                  <div className="flex items-center space-x-3">
                    <FaUsers className="text-blue-600 w-5 h-5" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">+1,247</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">New Users</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-8 -left-8 w-full h-full bg-gradient-to-br from-blue-200/50 to-purple-200/50 dark:from-blue-800/50 dark:to-purple-800/50 rounded-2xl -z-10 transform rotate-3"></div>
              <div className="absolute -bottom-8 -right-8 w-full h-full bg-gradient-to-br from-purple-200/50 to-pink-200/50 dark:from-purple-800/50 dark:to-pink-800/50 rounded-2xl -z-20 transform -rotate-2"></div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {(remoteStats ? [
                { number: String(remoteStats.studyProgramCount || 0), label: 'Program Studi', icon: FaUniversity },
                { number: String(remoteStats.userCount || 0), label: 'Dosen Aktif', icon: FaChalkboardTeacher },
                { number: `${remoteStats.overallScore || 0}%`, label: 'Skor Rata-rata', icon: MdAnalytics },
                { number: String(remoteStats.highRisks || 0), label: 'High Risks', icon: MdSupport }
              ] : stats).map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-4">
                    <div className="relative p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg text-blue-600 text-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      {stat.icon}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Akreditasi Section */}
      <section id="accreditation" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-6 py-2 rounded-full text-sm font-medium mb-6">
              <FaCertificate className="mr-2 w-4 h-4" />
              Sistem Akreditasi
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Manajemen Akreditasi Terintegrasi
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Platform lengkap untuk mengelola seluruh proses akreditasi institusi dan program studi sesuai standar BAN-PT, LAM-PTKes, dan lembaga akreditasi lainnya
            </p>
            {/* 'Lihat Detail Lengkap' button removed */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Fitur Akreditasi PRIMA</h3>
              <div className="space-y-4">
                {[
                  { title: "Manajemen Borang Akreditasi", desc: "Template borang yang dapat disesuaikan dengan standar berbagai lembaga akreditasi" },
                  { title: "Pelacakan Progress Akreditasi", desc: "Dashboard monitoring untuk memantau kelengkapan dokumen dan timeline akreditasi" },
                  { title: "Sistem Validasi Dokumen", desc: "Validasi otomatis kelengkapan dokumen sesuai kriteria akreditasi" },
                  { title: "Simulasi Penilaian", desc: "Estimasi skor akreditasi berdasarkan data yang telah diinput" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <FaCheckCircle className="text-green-500 w-6 h-6 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80" 
                alt="Sistem Akreditasi PRIMA" 
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SPMI Documents Section */}
      <section id="spmi-documents" className="py-20 bg-white dark:bg-gray-900">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-6 py-2 rounded-full text-sm font-medium mb-6">
              <FaFileAlt className="mr-2 w-4 h-4" />
              Dokumen SPMI
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Sistem Penjaminan Mutu Internal
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Kelola dokumen SPMI dengan sistem yang terorganisir dan mudah diakses oleh seluruh civitas akademika
            </p>
            {/* 'Lihat Detail Lengkap' button removed */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Manual SPMI", icon: FaBookOpen, desc: "Dokumen panduan pelaksanaan SPMI institusi" },
              { title: "Standar SPMI", icon: FaClipboardCheck, desc: "Standar mutu akademik dan non-akademik" },
              { title: "Formulir SPMI", icon: FaFileAlt, desc: "Template formulir untuk berbagai kebutuhan SPMI" }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex p-4 bg-green-100 dark:bg-green-900/50 rounded-2xl text-green-600 dark:text-green-400 mb-6">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AMI Section */}
      <section id="ami" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-6 py-2 rounded-full text-sm font-medium mb-6">
              <FaClipboardCheck className="mr-2 w-4 h-4" />
              Audit Mutu Internal
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              AMI (Audit Mutu Internal)
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Sistem komprehensif untuk pelaksanaan Audit Mutu Internal sesuai standar ISO dan SPMI perguruan tinggi
            </p>
            {/* 'Lihat Detail Lengkap' button removed */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" 
                alt="AMI System" 
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Kelola AMI dengan Mudah</h3>
              <div className="space-y-6">
                {[
                  "Penjadwalan audit otomatis",
                  "Manajemen tim auditor",
                  "Checklist audit digital",
                  "Laporan temuan dan rekomendasi",
                  "Monitoring tindak lanjut"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <FaCheckCircle className="text-purple-500 w-5 h-5" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section removed */}
      <section id="features" />

      {/* Field Audit Section removed */}
      <section id="field-audit" />

      {/* Audit Evaluation Section */}
      <section id="audit-evaluation" className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 px-6 py-2 rounded-full text-sm font-medium mb-6">
              <FaChartLine className="mr-2 w-4 h-4" />
              Audit Laporan dan Evaluasi
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Sistem Pelaporan dan Evaluasi Audit
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Kelola laporan audit dan evaluasi tindak lanjut dengan sistem yang terintegrasi dan mudah digunakan
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Fitur Pelaporan Komprehensif</h3>
              <div className="space-y-4">
                {[
                  { title: "Auto-Generated Reports", desc: "Laporan audit dibuat otomatis berdasarkan temuan di lapangan" },
                  { title: "Analytics Dashboard", desc: "Dashboard analitik untuk melihat tren dan pola temuan audit" },
                  { title: "Follow-up Tracking", desc: "Pelacakan status tindak lanjut rekomendasi audit" },
                  { title: "Performance Metrics", desc: "Metrik kinerja unit yang diaudit dengan visualisasi yang jelas" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <FaCheckCircle className="text-teal-500 w-6 h-6 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" 
                alt="Audit Evaluation System" 
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quality Control Section removed */}
      <section id="quality-control" />

      {/* Satisfaction Survey section removed - anchor preserved for compatibility */}
      <section id="satisfaction-survey" />

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Tentang PRIMA
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                PRIMA (Platform Integrasi Manajemen Mutu Akademik) dikembangkan khusus untuk memenuhi 
                kebutuhan perguruan tinggi Indonesia dalam mengelola sistem mutu akademik dan proses akreditasi 
                secara digital dan terintegrasi.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Platform ini dibangun berdasarkan pemahaman mendalam tentang standar akreditasi nasional 
                (BAN-PT, LAM-PTKes) dan siklus PPEPP, dengan dukungan tim ahli teknologi dan quality assurance 
                yang berpengalaman di bidang pendidikan tinggi.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-500 w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Standar Akreditasi</h4>
                    <p className="text-gray-600 dark:text-gray-300">Sesuai standar BAN-PT dan LAM-PTKes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-500 w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Support Akademik</h4>
                    <p className="text-gray-600 dark:text-gray-300">Tim ahli quality assurance siap membantu</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-500 w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Data Security</h4>
                    <p className="text-gray-600 dark:text-gray-300">Keamanan data institusi terjamin</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-500 w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Efisiensi Proses</h4>
                    <p className="text-gray-600 dark:text-gray-300">Mengurangi waktu persiapan akreditasi 70%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80" 
                alt="Tim Pengembang PRIMA - Quality Management System" 
                className="w-full h-auto rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl text-white">
                <div className="text-3xl font-bold">5+</div>
                <div className="text-sm">Tahun Pengalaman</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(59 130 246 / 0.5) 1px, transparent 0)', backgroundSize: '20px 20px'}}></div>
        </div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-6 py-2 rounded-full text-sm font-medium mb-6">
              <FaFileAlt className="mr-2 w-4 h-4" />
              Berita & Update
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Berita Terbaru
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ikuti perkembangan terbaru seputar akreditasi, regulasi, dan tips manajemen mutu akademik
            </p>
          </div>

          {/* Featured News */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img 
                  src={resolveImage((remoteNews && remoteNews.length) ? remoteNews[0] : newsData[0])}
                  alt={(remoteNews && remoteNews.length) ? remoteNews[0].title : newsData[0].title}
                  onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_NEWS_IMAGE; }}
                  className="relative w-full h-80 object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {(remoteNews && remoteNews.length) ? remoteNews[0].category : newsData[0].category}
                  </span>
                </div>
              </div>
              
              <div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{new Date(((remoteNews && remoteNews.length) ? remoteNews[0].date : newsData[0].date)).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span className="mx-2">•</span>
                  <span>{(remoteNews && remoteNews.length) ? remoteNews[0].readTime : newsData[0].readTime}</span>
                  <span className="mx-2">•</span>
                  <span>{(remoteNews && remoteNews.length) ? (remoteNews[0].author || '') : newsData[0].author}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  {(remoteNews && remoteNews.length) ? remoteNews[0].title : newsData[0].title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {(remoteNews && remoteNews.length) ? remoteNews[0].excerpt : newsData[0].excerpt}
                </p>
                <button onClick={() => openNewsModal((remoteNews && remoteNews.length) ? remoteNews[0] : newsData[0])} className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors group">
                  <span className="mr-2">Baca Selengkapnya</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(remoteNews && remoteNews.length ? remoteNews.slice(1,6) : newsData.slice(1, 6)).map((news, index) => (
              <div 
                key={news.id}
                onClick={() => openNewsModal(news)}
                onKeyDown={(e) => { if (e.key === 'Enter') openNewsModal(news); }}
                role="button"
                tabIndex={0}
                className="group relative cursor-pointer bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/50 dark:group-hover:from-blue-900/20 group-hover:via-purple-50/30 dark:group-hover:via-purple-900/15 group-hover:to-pink-50/50 dark:group-hover:to-pink-900/20 transition-all duration-500 rounded-3xl"></div>
                
                <div className="relative z-10">
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <img 
                      src={resolveImage(news)}
                      alt={news.title}
                      onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_NEWS_IMAGE; }}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                        news.category === 'Akreditasi' ? 'bg-blue-600' :
                        news.category === 'Regulasi' ? 'bg-green-600' :
                        news.category === 'Tutorial' ? 'bg-purple-600' :
                        news.category === 'Event' ? 'bg-orange-600' : 'bg-gray-600'
                      }`}>
                        {news.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span>{new Date(news.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="mx-2">•</span>
                      <span>{news.readTime}</span>
                    </div>
                    
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
                      {news.title}
                    </h4>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                      {news.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {news.author}
                      </span>
                      <button onClick={(e) => { e.stopPropagation(); openNewsModal(news); }} className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <span className="mr-1">Baca</span>
                        <FaArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl"></div>
              </div>
            ))}
          </div>

          {/* View All News Button */}
          <div className="text-center mt-12">
            <button className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 overflow-hidden transform hover:scale-105">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center">
                <FaFileAlt className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Lihat Semua Berita
                <FaArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
    

      {/* Related Links Section */}
      <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(59 130 246 / 0.5) 1px, transparent 0)', backgroundSize: '20px 20px'}}></div>
        </div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-6 py-2 rounded-full text-sm font-medium mb-6">
              <FaGlobe className="mr-2 w-4 h-4" />
              Tautan Terkait
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Organisasi & Lembaga Terkait
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Lembaga akreditasi dan organisasi resmi yang mendukung sistem mutu akademik di Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* BAN-PT */}
            <div 
              className="group relative bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/50 dark:group-hover:from-blue-900/20 group-hover:via-purple-50/30 dark:group-hover:via-purple-900/15 group-hover:to-pink-50/50 dark:group-hover:to-pink-900/20 transition-all duration-500 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-gray-200/50 dark:border-gray-600/50">
                  <img 
                    src="https://www.banpt.or.id/wp-content/uploads/2018/12/logo-ban-pt.png" 
                    alt="Logo BAN-PT" 
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-8 h-8 items-center justify-center">
                    <FaCertificate className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  BAN-PT
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Badan Akreditasi Nasional Perguruan Tinggi - Lembaga resmi akreditasi institusi dan program studi di Indonesia
                </p>
                
                <a 
                  href="https://www.banpt.or.id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors group-hover:translate-x-2 duration-300"
                >
                  <span className="mr-2">Kunjungi Website</span>
                  <FaArrowRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl"></div>
            </div>

            {/* Kemendikbudristek */}
            <div 
              className="group relative bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/50 dark:group-hover:from-blue-900/20 group-hover:via-purple-50/30 dark:group-hover:via-purple-900/15 group-hover:to-pink-50/50 dark:group-hover:to-pink-900/20 transition-all duration-500 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-gray-200/50 dark:border-gray-600/50">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Coat_of_arms_of_the_Ministry_of_Education%2C_Culture%2C_Research%2C_and_Technology_of_the_Republic_of_Indonesia.svg/1200px-Coat_of_arms_of_the_Ministry_of_Education%2C_Culture%2C_Research%2C_and_Technology_of_the_Republic_of_Indonesia.svg.png" 
                    alt="Logo Kemendikbudristek" 
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-8 h-8 items-center justify-center">
                    <FaUniversity className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Kemendikbudristek
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi - Pembina pendidikan tinggi Indonesia
                </p>
                
                <a 
                  href="https://kemdiktisaintek.go.id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors group-hover:translate-x-2 duration-300"
                >
                  <span className="mr-2">Kunjungi Website</span>
                  <FaArrowRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-2xl"></div>
            </div>

            {/* LAM Wisata */}
            <div 
              className="group relative bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/50 dark:group-hover:from-blue-900/20 group-hover:via-purple-50/30 dark:group-hover:via-purple-900/15 group-hover:to-pink-50/50 dark:group-hover:to-pink-900/20 transition-all duration-500 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-gray-200/50 dark:border-gray-600/50">
                  <img 
                    src="https://lamwisata.or.id/wp-content/uploads/2020/05/logo-lam-wisata.png" 
                    alt="Logo LAM Wisata" 
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-8 h-8 items-center justify-center">
                    <FaGlobe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  LAM Wisata
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Lembaga Akreditasi Mandiri Pariwisata - Akreditasi program studi bidang pariwisata dan hospitality
                </p>
                
                <a 
                  href="https://lamwisata.or.id/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors group-hover:translate-x-2 duration-300"
                >
                  <span className="mr-2">Kunjungi Website</span>
                  <FaArrowRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-2xl"></div>
            </div>

            {/* LAM Teknik */}
            <div 
              className="group relative bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/50 dark:group-hover:from-blue-900/20 group-hover:via-purple-50/30 dark:group-hover:via-purple-900/15 group-hover:to-pink-50/50 dark:group-hover:to-pink-900/20 transition-all duration-500 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-gray-200/50 dark:border-gray-600/50">
                  <img 
                    src="https://lamteknik.or.id/assets/img/logo.png" 
                    alt="Logo LAM Teknik" 
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-8 h-8 items-center justify-center">
                    <FaCog className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  LAM Teknik
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Lembaga Akreditasi Mandiri Teknik - Akreditasi program studi bidang teknik dan rekayasa
                </p>
                
                <a 
                  href="https://lamteknik.or.id/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors group-hover:translate-x-2 duration-300"
                >
                  <span className="mr-2">Kunjungi Website</span>
                  <FaArrowRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-2xl"></div>
            </div>

            {/* LAM EMBA */}
            <div 
              className="group relative bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/50 dark:group-hover:from-blue-900/20 group-hover:via-purple-50/30 dark:group-hover:via-purple-900/15 group-hover:to-pink-50/50 dark:group-hover:to-pink-900/20 transition-all duration-500 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-gray-200/50 dark:border-gray-600/50">
                  <img 
                    src="https://lamemba.or.id/wp-content/uploads/2021/07/logo-lam-emba.png" 
                    alt="Logo LAM EMBA" 
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-8 h-8 items-center justify-center">
                    <FaChartLine className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  LAM EMBA
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Lembaga Akreditasi Mandiri Ekonomi, Manajemen, Bisnis, dan Akuntansi - Akreditasi bidang ekonomi bisnis
                </p>
                
                <a 
                  href="https://lamemba.or.id/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors group-hover:translate-x-2 duration-300"
                >
                  <span className="mr-2">Kunjungi Website</span>
                  <FaArrowRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-teal-200/20 to-cyan-200/20 rounded-full blur-2xl"></div>
            </div>

            {/* LAM Infokom */}
            <div 
              className="group relative bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/50 dark:group-hover:from-blue-900/20 group-hover:via-purple-50/30 dark:group-hover:via-purple-900/15 group-hover:to-pink-50/50 dark:group-hover:to-pink-900/20 transition-all duration-500 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-gray-200/50 dark:border-gray-600/50">
                  <img 
                    src="https://laminfokom.or.id/official/wp-content/uploads/2021/01/logo-lam-infokom.png" 
                    alt="Logo LAM Infokom" 
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-8 h-8 items-center justify-center">
                    <FaLightbulb className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  LAM Infokom
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Lembaga Akreditasi Mandiri Informatika dan Komputer - Akreditasi program studi teknologi informasi
                </p>
                
                <a 
                  href="https://laminfokom.or.id/official/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors group-hover:translate-x-2 duration-300"
                >
                  <span className="mr-2">Kunjungi Website</span>
                  <FaArrowRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-700/50">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                  <FaShieldAlt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Komitmen Terhadap Standar Nasional
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                PRIMA dikembangkan dengan mengacu pada standar dan panduan resmi dari lembaga-lembaga akreditasi di atas, 
                memastikan kesesuaian dengan persyaratan akreditasi nasional dan internasional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact section removed - anchor preserved for compatibility */}
      <section id="contact" />


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <FaGraduationCap className="text-white w-5 h-5" />
                </div>
                <span className="text-2xl font-bold">PRIMA</span>
              </div>
              <p className="text-gray-400 mb-6">
                Platform Integrasi Manajemen Mutu Akademik untuk perguruan tinggi Indonesia.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                    f
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                    t
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                    in
                  </div>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Produk</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Dashboard Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Team Collaboration</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Project Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Integration</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Perusahaan</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karier</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press Kit</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Dukungan</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-left">
                © 2025 Prima. Semua hak cipta dilindungi.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Demo Prima</h3>
              <button 
                onClick={() => setIsVideoPlaying(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <FaPlayCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">Video demo akan diputar di sini</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {isServiceModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-8 py-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedService.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {selectedService.description}
                  </p>
                </div>
                <button 
                  onClick={() => setIsServiceModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {selectedService.stats.map((stat, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      </div>
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Features Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Fitur Utama</h3>
                  <div className="space-y-4">
                    {selectedService.features.map((feature, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{feature.name}</h4>
                          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            {feature.progress}%
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{feature.desc}</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${feature.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Aktivitas Terbaru</h3>
                  <div className="space-y-4">
                    {selectedService.recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white font-medium">
                            {activity.action}
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.time}
                            </p>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              {activity.user}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  to="/login"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                >
                  Akses {selectedService.title}
                </Link>
                <button 
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News Detail Modal */}
      {isNewsModalOpen && newsModalItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={closeNewsModal}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
              <div className="max-w-[85%]">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{newsModalItem.title || newsModalItem.name}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>{new Date(newsModalItem.date || newsModalItem.published_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span className="mx-2">•</span>
                  <span>{newsModalItem.author || newsModalItem.writer || ''}</span>
                </div>
              </div>
              <button onClick={closeNewsModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              { (newsModalItem.image || newsModalItem.thumbnail) && (
                <img src={newsModalItem.image || newsModalItem.thumbnail} alt={newsModalItem.title} className="w-full h-64 object-cover rounded-xl shadow-md" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_NEWS_IMAGE; }} />
              )}

              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-200">
                <p>{newsModalItem.content || newsModalItem.excerpt || newsModalItem.body || ''}</p>
              </div>

              {newsModalItem.attachments && Array.isArray(newsModalItem.attachments) && newsModalItem.attachments.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Lampiran</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {newsModalItem.attachments.map((att, i) => (
                      <a key={i} href={att.url || att.file_path} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-sm overflow-hidden">
                          {att.mime_type && att.mime_type.startsWith('image') ? (
                            <img src={att.url || att.file_path} alt={att.original_name || att.name} className="w-full h-full object-cover" />
                          ) : (
                            <FaFileAlt className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{att.original_name || att.name || 'Lampiran'}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{att.mime_type || ''} • {att.file_size ? `${att.file_size} bytes` : ''}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={closeNewsModal} className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
