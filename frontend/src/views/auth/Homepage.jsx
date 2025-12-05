import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiCastle, 
  GiCrossedSwords, 
  GiTrophyCup, 
  GiScrollUnfurled, 
  GiTwoCoins, 
  GiCrown,
  GiSwordsEmblem,
  GiShield,
  GiWingedSword
} from 'react-icons/gi';
import { 
  MdEvent, 
  MdPeople, 
  MdTrendingUp,
  MdStar,
  MdArrowForward
} from 'react-icons/md';
import { 
  FiGift, 
  FiBookOpen, 
  FiYoutube,
  FiArrowRight,
  FiUsers,
  FiAward,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import Navbar from '../../components/navbarhome';
import SacredLogo from '../../assets/img/auth/animatedlogo.gif';
import Logo from '../../assets/img/auth/logo.png';
const Homepage = () => {
  const [stats, setStats] = useState({
    members: 150,
    battles: 45,
    victories: 38,
    donations: 2500000
  });

  useEffect(() => {
    document.title = "Sacred3946 - Rise of Kingdoms Community";
  }, []);

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const SacredLogoIcon = ({ className }) => (
    <img src={SacredLogo} alt="Sacred Forces" className={`${className} object-contain`} />
  );

  const heroSlides = [
    {
      id: 'overview',
      title: 'SACRED3946',
      subtitle: 'The Sovereign Territory',
      icon: GiCastle,
      mainContent: (
        <>
           <div className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-[#FFD700] rounded-full"></div>
          </div>
          <div className="flex justify-between w-full mt-2 text-xs font-bold text-slate-500 dark:text-slate-200">
            <span>POWER</span>
            <span>75M+</span>
          </div>
        </>
      ),
      floating: [
        { 
          type: 'stat', 
          icon: GiTrophyCup, 
          label: 'VICTORIES', 
          value: '38 Wins', 
          color: 'green', 
          pos: 'top-right',
          delay: 0 
        },
        { 
          type: 'stat', 
          icon: GiCrossedSwords, 
          label: 'BATTLES', 
          value: '45 Epic', 
          color: 'red', 
          pos: 'bottom-left',
          delay: 0.2 
        },
        { 
          type: 'profile', 
          name: 'King Sacred', 
          role: 'Reigning King', 
          status: 'Online',
          pos: 'center-right',
          delay: 0.1 
        }
      ]
    },
    {
      id: 'alliances',
      title: 'TOP ALLIANCES',
      subtitle: 'Our Strongest Forces',
      icon: SacredLogoIcon,
      floating: [
        { 
          type: 'stat', 
          icon: GiShield, 
          label: '[CL] Crimson Legion', 
          value: '12.5B Power', 
          color: 'blue', 
          pos: 'top-right',
          delay: 0 
        },
        { 
          type: 'stat', 
          icon: GiShield, 
          label: '[GG] Golden Guard', 
          value: '10.2B Power', 
          color: 'yellow', 
          pos: 'bottom-left',
          delay: 0.2 
        },
        { 
          type: 'stat', 
          icon: GiShield, 
          label: '[SH] Shadow Hunters', 
          value: '9.8B Power', 
          color: 'purple', 
          pos: 'center-right',
          delay: 0.1 
        }
      ]
    },
    {
      id: 'kvk',
      title: 'KVK HISTORY',
      subtitle: 'Legacy of Conquest',
      icon: GiCrossedSwords,
      floating: [
        { 
          type: 'stat', 
          icon: GiTrophyCup, 
          label: 'Season 1', 
          value: 'Victory (15M)', 
          color: 'green', 
          pos: 'top-right',
          delay: 0 
        },
        { 
          type: 'stat', 
          icon: GiTrophyCup, 
          label: 'Season 2', 
          value: 'Victory (22M)', 
          color: 'green', 
          pos: 'bottom-left',
          delay: 0.2 
        },
        { 
          type: 'stat', 
          icon: GiCrossedSwords, 
          label: 'Season 3', 
          value: 'Defeat (18M)', 
          color: 'red', 
          pos: 'center-right',
          delay: 0.1 
        }
      ]
    },
    {
      id: 'giveaway',
      title: 'GIVEAWAY WINNERS',
      subtitle: 'Community Rewards',
      icon: FiGift,
      floating: [
        { 
          type: 'stat', 
          icon: FiGift, 
          label: 'DragonSlayer', 
          value: 'Gold Chest', 
          color: 'yellow', 
          pos: 'top-right',
          delay: 0 
        },
        { 
          type: 'stat', 
          icon: FiGift, 
          label: 'LadyRose', 
          value: 'Speedups', 
          color: 'blue', 
          pos: 'bottom-left',
          delay: 0.2 
        },
        { 
          type: 'stat', 
          icon: FiGift, 
          label: 'WarLord99', 
          value: 'Gems Pack', 
          color: 'purple', 
          pos: 'center-right',
          delay: 0.1 
        },
        { 
          type: 'stat', 
          icon: FiGift, 
          label: 'NightHawk', 
          value: 'VIP Points', 
          color: 'green', 
          pos: 'top-left',
          delay: 0.15 
        },
        { 
          type: 'stat', 
          icon: FiGift, 
          label: 'StormBringer', 
          value: 'Resource Pack', 
          color: 'red', 
          pos: 'bottom-right',
          delay: 0.25 
        }
      ]
    },
    {
      id: 'donators',
      title: 'TOP DONATORS',
      subtitle: 'Kingdom Supporters',
      icon: GiTwoCoins,
      floating: [
        { 
          type: 'stat', 
          icon: GiTwoCoins, 
          label: 'Sir Lancelot', 
          value: '50M Gold', 
          color: 'yellow', 
          pos: 'top-right',
          delay: 0 
        },
        { 
          type: 'stat', 
          icon: GiTwoCoins, 
          label: 'Queen Mary', 
          value: '35M Gold', 
          color: 'yellow', 
          pos: 'bottom-left',
          delay: 0.2 
        },
        { 
          type: 'stat', 
          icon: GiTwoCoins, 
          label: 'King Arthur', 
          value: '30M Gold', 
          color: 'yellow', 
          pos: 'top-left',
          delay: 0.1 
        },
        { 
          type: 'stat', 
          icon: GiTwoCoins, 
          label: 'Merlin', 
          value: '25M Gold', 
          color: 'yellow', 
          pos: 'bottom-right',
          delay: 0.15 
        }
      ]
    },
    {
      id: 'players',
      title: 'TOP PLAYERS',
      subtitle: 'Power Rankings',
      icon: GiCrown,
      floating: [
        { 
          type: 'profile', 
          name: 'Emperor', 
          role: 'Rank 1', 
          status: '150M Power',
          pos: 'top-right',
          delay: 0 
        },
        { 
          type: 'profile', 
          name: 'Warlord', 
          role: 'Rank 2', 
          status: '145M Power',
          pos: 'bottom-left',
          delay: 0.2 
        },
        { 
          type: 'profile', 
          name: 'General', 
          role: 'Rank 3', 
          status: '140M Power',
          pos: 'center-right',
          delay: 0.1 
        },
        { 
          type: 'profile', 
          name: 'Commander', 
          role: 'Rank 4', 
          status: '135M Power',
          pos: 'top-left',
          delay: 0.15 
        },
        { 
          type: 'profile', 
          name: 'Strategist', 
          role: 'Rank 5', 
          status: '130M Power',
          pos: 'bottom-right',
          delay: 0.25 
        },
        { 
          type: 'profile', 
          name: 'Vanguard', 
          role: 'Rank 6', 
          status: '125M Power',
          pos: 'center-left',
          delay: 0.05 
        }
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Kingdom Features
  const features = [
    {
      icon: GiCrossedSwords,
      title: "Kingdom vs Kingdom",
      description: "Join epic battles, track scores, and climb the rankings with your alliance.",
      link: "/auth/kvk",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: MdEvent,
      title: "Kingdom Events",
      description: "Participate in exclusive events, win rewards, and strengthen our kingdom.",
      link: "/auth/events",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FiGift,
      title: "Giveaways",
      description: "Regular giveaways and rewards for active members of our community.",
      link: "/auth/giveaway",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: GiTwoCoins,
      title: "Donation System",
      description: "Track contributions, view leaderboards, and support kingdom growth.",
      link: "/auth/donation",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: FiYoutube,
      title: "Video Gallery",
      description: "Watch battle highlights, tutorials, and community content.",
      link: "/auth/youtube",
      color: "from-red-600 to-red-500"
    },
    {
      icon: FiBookOpen,
      title: "Kingdom Blog",
      description: "Read strategies, news, and stories from our community members.",
      link: "/auth/blog",
      color: "from-green-500 to-emerald-500"
    }
  ];

  // Quick Links
  const quickLinks = [
    { icon: GiScrollUnfurled, title: "Join Kingdom", link: "/auth/forms", desc: "Apply now" },
    { icon: GiShield, title: "Kingdom Laws", link: "/auth/laws", desc: "Read rules" },
    { icon: GiCrown, title: "About Us", link: "/auth/about", desc: "Our story" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section - Premium Modern Design */}
      <section className="relative min-h-screen flex items-center pt-20 pb-20 px-6 overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Royal Pattern Overlay - Hero Background */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          </div>

          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FFD700]/10 dark:bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#C5A059]/10 dark:bg-indigo-500/10 rounded-full blur-[120px]" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content - Typography & CTA */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-left relative"
            >
              {/* Decorative Elements (Left Side) - Enhanced Visibility */}
              
              {/* 1. Massive Rotating Rune Circles */}
              <div className="absolute top-[-20%] left-[-20%] w-[700px] h-[700px] border-[2px] border-dashed border-[#FFD700]/20 dark:border-[#FFD700]/10 rounded-full -z-20 animate-[spin_120s_linear_infinite]"></div>
              <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] border border-[#FFD700]/30 dark:border-[#FFD700]/20 rounded-full -z-20 animate-[spin_80s_linear_infinite_reverse]"></div>

              {/* 2. Large Floating Background Icons */}
              <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] flex items-center justify-center -z-10 pointer-events-none">
                <motion.div 
                  className="w-full h-full flex items-center justify-center rounded-full overflow-hidden"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [1, 1, 0.5],
                    filter: ["drop-shadow(0 0 20px rgba(255, 215, 0, 0.1))", "drop-shadow(0 0 40px rgba(255, 215, 0, 0.2))", "drop-shadow(0 0 20px rgba(255, 215, 0, 0.1))"]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img src={SacredLogo} alt="Sacred Forces" className="w-full h-full object-cover opacity-50" />
                </motion.div>
              </div>

              {/* 3. Vivid Gradient Orbs */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#FFD700]/10 to-transparent rounded-full blur-[80px] -z-30"></div>

              {/* Status Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-8 shadow-sm">
                <span className="relative flex h-3 w-3 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD700]"></span>
                </span>
                <span className="text-slate-600 dark:text-blue-200 font-bold text-xs tracking-[0.2em] uppercase">Official Sacred3946 Community Portal</span>
              </motion.div>

              {/* Main Title */}
              <motion.div variants={fadeInUp} className="relative mb-8">
                <h1 className="text-4xl lg:text-6xl font-black leading-[0.9] tracking-tighter text-slate-900 dark:text-white relative z-10" style={{ fontFamily: 'Cinzel, serif' }}>
                  RISE OF <br />
                  <span className="bg-gradient-to-r from-[#C5A059] via-[#FFD700] to-[#C5A059] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                    KINGDOM
                  </span>
                </h1>
                
              </motion.div>

              {/* Description */}
              <motion.p 
                variants={fadeInUp}
                className="text-lg md:text-xl text-slate-600 dark:text-white mb-10 max-w-xl leading-relaxed font-medium"
              >
                Join the elite forces of Sacred3946. Experience the pinnacle of strategy, 
                unity, and conquest in the ultimate Rise of Kingdoms community.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5">
                <Link 
                  to="/auth/forms"
                  className="group relative px-8 py-4 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center">
                    <GiSwordsEmblem className="w-5 h-5 mr-3" />
                    Join Forces
                  </span>
                </Link>

                <Link 
                  to="/auth/about"
                  className="group px-8 py-4 bg-white/50 dark:bg-white/5 text-slate-700 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
                >
                  <span className="mr-3">Explore Kingdom</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div variants={fadeInUp} className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { label: 'Active Members', value: '150+', icon: FiUsers, color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Battles Fought', value: '45', icon: GiCrossedSwords, color: 'text-red-600 dark:text-red-400' },
                    { label: 'Victories', value: '38', icon: GiTrophyCup, color: 'text-[#C5A059] dark:text-[#FFD700]' },
                    { label: 'Total Donations', value: '2.5M', icon: GiTwoCoins, color: 'text-green-600 dark:text-green-400' }
                  ].map((stat, index) => (
                    <div key={index} className="group">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 group-hover:bg-white/10 transition-colors">
                          <stat.icon className="w-5 h-5 text-slate-600 dark:text-[#FFD700] group-hover:text-[#FFD700] transition-colors" />
                        </div>
                        <span className={`text-2xl font-black ${stat.color}`}>
                          {stat.value}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-[#FFD700] uppercase tracking-widest">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - 3D Glass Composition with Slider */}
            <div className="relative hidden lg:block h-[600px]">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  {/* Main Glass Card */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px] bg-gradient-to-br from-white/60 to-white/20 dark:from-[#1E293B]/90 dark:to-[#0F172A]/90 backdrop-blur-3xl rounded-[40px] border-2 border-[#FFD700]/30 dark:border-[#FFD700]/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(197,160,89,0.15)] z-10 overflow-hidden group">
                    {/* Royal Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.25] pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                    </div>
                    
                    {/* Inner Glow & Effects */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/10 via-transparent to-[#0F172A]/50 opacity-50"></div>
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FFD700]/20 rounded-full blur-[80px] animate-pulse"></div>
                    <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#C5A059]/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                    
                    {/* Decorative Corner Accents */}
                    <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-[#FFD700]/30 rounded-tr-3xl"></div>
                    <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-[#FFD700]/30 rounded-bl-3xl"></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20">
                      <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-32 h-32 bg-gradient-to-br from-[#FFD700] to-[#C5A059] rounded-3xl flex items-center justify-center shadow-lg mb-8 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden"
                      >
                        {currentSlide === 1 ? (
                          <img src={Logo} alt="Logo" className="w-24 h-24 object-contain" />
                        ) : (
                          React.createElement(heroSlides[currentSlide].icon, { className: "w-20 h-20 text-[#0F172A]" })
                        )}
                        <div className="absolute inset-0 bg-white/20 rounded-3xl blur-lg -z-10"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </motion.div>
                      
                      <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                        {heroSlides[currentSlide].title}
                      </h3>
                      <p className="text-slate-600 dark:text-blue-100 text-sm mb-8 font-medium tracking-wide uppercase">
                        {heroSlides[currentSlide].subtitle}
                      </p>
                      
                      {heroSlides[currentSlide].mainContent}
                    </div>

                    {/* Navigation Buttons (Inside Card) */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 flex items-center justify-between px-8 z-30 bg-gradient-to-t from-white/50 dark:from-[#0F172A]/50 to-transparent pb-6">
                      <button 
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="p-2 rounded-full bg-white/20 hover:bg-[#FFD700] dark:bg-white/5 dark:hover:bg-[#FFD700] backdrop-blur-md border border-white/20 text-slate-600 dark:text-white hover:text-[#0F172A] transition-all duration-300 hover:scale-110 group/btn"
                      >
                        <FiChevronLeft className="w-5 h-5" />
                      </button>
                      
                      {/* Slide Indicators (Inside Card) */}
                      <div className="flex gap-1.5">
                        {heroSlides.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                            className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                              currentSlide === idx 
                                ? 'w-6 bg-[#FFD700]' 
                                : 'w-1.5 bg-slate-400 dark:bg-white/30 hover:bg-[#FFD700]/50'
                            }`}
                          />
                        ))}
                      </div>

                      <button 
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="p-2 rounded-full bg-white/20 hover:bg-[#FFD700] dark:bg-white/5 dark:hover:bg-[#FFD700] backdrop-blur-md border border-white/20 text-slate-600 dark:text-white hover:text-[#0F172A] transition-all duration-300 hover:scale-110 group/btn"
                      >
                        <FiChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  {heroSlides[currentSlide].floating.map((item, idx) => {
                    // Position classes
                    const posClasses = {
                      'top-right': 'top-0 right-10',
                      'bottom-left': 'bottom-0 left-10',
                      'center-right': 'top-1/2 -right-8 transform -translate-y-1/2',
                      'top-left': 'top-0 left-10',
                      'bottom-right': 'bottom-0 right-10',
                      'center-left': 'top-1/2 -left-8 transform -translate-y-1/2'
                    };

                    // Animation variants
                    const animVariants = {
                      'top-right': { y: [0, -15, 0] },
                      'bottom-left': { y: [0, 15, 0] },
                      'center-right': { x: [0, 10, 0], y: [0, -5, 0] },
                      'top-left': { y: [0, -15, 0] },
                      'bottom-right': { y: [0, 15, 0] },
                      'center-left': { x: [0, -10, 0], y: [0, -5, 0] }
                    };

                    if (item.type === 'profile') {
                      return (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            opacity: { duration: 0.3, delay: item.delay },
                            scale: { duration: 0.3, delay: item.delay },
                            default: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: item.delay }
                          }}
                          className={`absolute ${posClasses[item.pos]} p-4 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-white/10 shadow-xl z-30 flex items-center gap-4 min-w-[220px]`}
                        >
                          <motion.div 
                            animate={animVariants[item.pos]}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
                            className="flex items-center gap-4 w-full"
                          >
                            <div className="relative">
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] p-[2px]">
                                <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                  <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=KingSacred&backgroundColor=b6e3f4" alt="King" className="w-full h-full object-cover" />
                                </div>
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FFD700] rounded-full flex items-center justify-center border-2 border-white dark:border-[#1E293B] shadow-sm">
                                <GiCrown className="w-3 h-3 text-[#0F172A]" />
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-500 dark:text-white font-bold uppercase tracking-wider mb-0.5">{item.role}</p>
                              <p className="text-base font-bold text-slate-800 dark:text-white leading-tight">{item.name}</p>
                              <div className="flex items-center mt-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
                                <span className="text-[10px] font-medium text-green-600 dark:text-green-400">{item.status}</span>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    }

                    // Standard Stat Card
                    const colorClasses = {
                      green: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400',
                      red: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400',
                      blue: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
                      yellow: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
                      purple: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
                    };

                    return (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: item.pos.includes('right') ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          opacity: { duration: 0.3, delay: item.delay },
                          x: { duration: 0.3, delay: item.delay }
                        }}
                        className={`absolute ${posClasses[item.pos]} w-48 p-4 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-white/10 shadow-xl z-20`}
                      >
                        <motion.div
                          animate={animVariants[item.pos]}
                          transition={{ duration: item.pos === 'top-right' ? 4 : 5, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
                          className="flex items-center gap-3"
                        >
                          <div className={`p-2 rounded-lg ${colorClasses[item.color] || colorClasses.green}`}>
                            {React.createElement(item.icon, { className: "w-6 h-6" })}
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 dark:text-white font-bold uppercase">{item.label}</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{item.value}</p>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Decorative Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-slate-200 dark:border-white/5 rounded-full -z-10 animate-[spin_60s_linear_infinite]"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-dashed border-slate-300 dark:border-white/10 rounded-full -z-10 animate-[spin_40s_linear_infinite_reverse]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Kingdom Services */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Modern Creative Background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated Mesh Gradient Background */}
          <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" preserveAspectRatio="xMidYMid slice">
            <defs>
              <filter id="blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
              </filter>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#C5A059" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad1)" opacity="0.1" />
            
            {/* Animated Flowing Waves */}
            <path d="M0,50 Q250,0 500,50 T1000,50" stroke="#FFD700" strokeWidth="2" fill="none" opacity="0.3" filter="url(#blur)" />
            <path d="M0,150 Q300,100 600,150 T1200,150" stroke="#C5A059" strokeWidth="2" fill="none" opacity="0.2" filter="url(#blur)" />
            <path d="M0,250 Q200,200 400,250 T800,250" stroke="#FFD700" strokeWidth="2" fill="none" opacity="0.15" filter="url(#blur)" />
          </svg>
          
          {/* Organic Blob Shapes - Flowing */}
          <motion.div 
            className="absolute top-[-20%] right-[-15%] w-[500px] h-[500px] rounded-full opacity-30 dark:opacity-20"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #FFD700, transparent)',
              filter: 'blur(80px)',
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -30, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-25 dark:opacity-15"
            style={{
              background: 'radial-gradient(circle at 70% 70%, #C5A059, transparent)',
              filter: 'blur(100px)',
            }}
            animate={{
              x: [0, -40, 20, 0],
              y: [0, 40, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          <motion.div 
            className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-10"
            style={{
              background: 'radial-gradient(circle at 50% 50%, #FFD700, transparent)',
              filter: 'blur(90px)',
            }}
            animate={{
              x: [0, 20, -30, 0],
              y: [0, 30, -20, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          {/* Geometric Pattern Overlay - Subtle Hexagons */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L45 15 L45 45 L30 60 L15 45 L15 15 Z' fill='none' stroke='%23FFD700' stroke-width='1'/%3E%3C/svg%3E")`,
                 backgroundSize: '60px 60px'
               }}>
          </div>
          
          {/* Animated Floating Particles */}
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1), transparent 50%),
                          radial-gradient(circle at 80% 30%, rgba(197, 160, 89, 0.1), transparent 50%),
                          radial-gradient(circle at 40% 80%, rgba(255, 215, 0, 0.08), transparent 50%)`,
              filter: 'blur(60px)',
            }}
            animate={{
              background: [
                `radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1), transparent 50%),
                 radial-gradient(circle at 80% 30%, rgba(197, 160, 89, 0.1), transparent 50%),
                 radial-gradient(circle at 40% 80%, rgba(255, 215, 0, 0.08), transparent 50%)`,
                `radial-gradient(circle at 30% 60%, rgba(255, 215, 0, 0.12), transparent 50%),
                 radial-gradient(circle at 70% 40%, rgba(197, 160, 89, 0.12), transparent 50%),
                 radial-gradient(circle at 50% 70%, rgba(255, 215, 0, 0.1), transparent 50%)`,
                `radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1), transparent 50%),
                 radial-gradient(circle at 80% 30%, rgba(197, 160, 89, 0.1), transparent 50%),
                 radial-gradient(circle at 40% 80%, rgba(255, 215, 0, 0.08), transparent 50%)`
              ]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Rotating Gradient Ring */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '800px',
              height: '800px',
              borderRadius: '50%',
              border: '2px solid transparent',
              backgroundImage: 'conic-gradient(from 0deg, #FFD700, #C5A059, #FFD700)',
              backgroundClip: 'border-box',
              WebkitMaskImage: 'linear-gradient(#fff 0 0)',
              WebkitMaskClip: 'padding-box',
              opacity: 0.08,
              zIndex: 0
            }}
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Counter-rotating Gradient Ring */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              border: '2px solid transparent',
              backgroundImage: 'conic-gradient(from 180deg, #C5A059, #FFD700, #C5A059)',
              backgroundClip: 'border-box',
              WebkitMaskImage: 'linear-gradient(#fff 0 0)',
              WebkitMaskClip: 'padding-box',
              opacity: 0.06,
              zIndex: 0
            }}
            animate={{
              rotate: [0, -360]
            }}
            transition={{
              duration: 80,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Accent Lines - Modern Design */}
          <motion.div
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
            style={{
              backgroundImage: `linear-gradient(90deg, transparent 0%, #FFD700 50%, transparent 100%)`
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 0%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#C5A059] rounded-xl mb-6 shadow-lg shadow-[#FFD700]/20">
              <GiWingedSword className="w-8 h-8 text-[#0F172A]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight" style={{ fontFamily: 'Cinzel, serif' }}>
              Kingdom <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#FFD700] to-[#C5A059] animate-gradient">Features</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-blue-100/70 max-w-2xl mx-auto font-medium">
              Discover all the powerful tools and features available for our kingdom members
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
              >
                <Link 
                  to={feature.link}
                  className="group relative block h-full bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-[#FFD700]/20 hover:border-[#FFD700] dark:hover:border-[#FFD700] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Card Pattern Overlay */}
                  <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] group-hover:opacity-[0.1] dark:group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none" 
                       style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)', backgroundSize: '16px 16px' }}>
                  </div>
                  
                  {/* Hover Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/0 via-transparent to-[#FFD700]/0 group-hover:from-[#FFD700]/5 group-hover:to-[#C5A059]/5 transition-all duration-500"></div>

                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-[#C5A059] dark:group-hover:text-[#FFD700] transition-colors tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>
                      {feature.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-blue-100/70 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center text-[#C5A059] dark:text-[#FFD700] font-bold group-hover:translate-x-2 transition-transform">
                      <span className="tracking-wide uppercase text-sm">Explore Feature</span>
                      <FiArrowRight className="ml-2 w-5 h-5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-[#1E293B] dark:via-[#0F172A] dark:to-[#1E293B] border-y-2 border-slate-200 dark:border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            {quickLinks.map((link, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Link 
                  to={link.link}
                  className="group flex items-center bg-white dark:bg-[#1E293B] rounded-xl p-6 shadow-lg border-2 border-slate-200 dark:border-[#C5A059]/30 hover:border-[#C5A059] dark:hover:border-[#FFD700]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(197,160,89,0.2)]"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FFD700] to-[#C5A059] rounded-lg flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform">
                    <link.icon className="w-7 h-7 text-[#0F172A]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-[#E2E8F0] mb-1 group-hover:text-[#C5A059] dark:group-hover:text-[#FFD700] transition-colors tracking-wide">
                      {link.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-[#E2E8F0]/70">{link.desc}</p>
                  </div>
                  <FiArrowRight className="w-5 h-5 text-[#C5A059] dark:text-[#FFD700] group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Join Kingdom */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="relative bg-gradient-to-br from-[#FFD700] via-[#C5A059] to-[#FFD700] rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <GiCastle className="absolute top-10 left-10 w-32 h-32 transform -rotate-12" />
              <GiSwordsEmblem className="absolute bottom-10 right-10 w-40 h-40 transform rotate-12" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0F172A] rounded-2xl mb-6 shadow-xl">
                <GiCrown className="w-12 h-12 text-[#FFD700]" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-6 tracking-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                Ready to Join the Kingdom?
              </h2>
              <p className="text-lg md:text-xl text-[#0F172A]/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Become part of Sacred3946 and experience the ultimate Rise of Kingdoms community. 
                United we stand, divided we fall!
              </p>
              <Link 
                to="/auth/forms"
                className="group inline-flex items-center px-10 py-5 bg-[#0F172A] text-[#FFD700] font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-2 border-[#0F172A]"
              >
                <GiSwordsEmblem className="w-7 h-7 mr-3 group-hover:rotate-12 transition-transform" />
                <span className="tracking-wide text-lg">Apply Now</span>
                <MdArrowForward className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-100 dark:bg-[#1E293B] border-t-2 border-slate-200 dark:border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#C5A059] rounded-lg flex items-center justify-center shadow-lg mr-4">
              <GiCastle className="w-7 h-7 text-[#0F172A]" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-slate-800 dark:text-[#FFD700] tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                SACRED3946
              </h3>
              <p className="text-sm text-slate-600 dark:text-[#C5A059]">Rise of Kingdoms</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-[#E2E8F0]/70 mb-4">
            United We Conquer • Together We Prosper
          </p>
          <p className="text-sm text-slate-500 dark:text-[#E2E8F0]/50">
            © 2024 Sacred3946. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Bottom spacing for mobile nav */}
      <div className="h-20 lg:h-0"></div>
    </div>
  );
};

export default Homepage;