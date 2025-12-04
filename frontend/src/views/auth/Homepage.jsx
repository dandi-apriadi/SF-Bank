import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  FiAward
} from 'react-icons/fi';
import Navbar from '../../components/navbarhome';

const Homepage = () => {
  const [stats, setStats] = useState({
    members: 150,
    battles: 45,
    victories: 38,
    donations: 2500000
  });

  useEffect(() => {
    document.title = "Kingdom 3946 - Rise of Kingdoms Community";
  }, []);

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
              {/* Status Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-8 shadow-sm">
                <span className="relative flex h-3 w-3 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD700]"></span>
                </span>
                <span className="text-slate-600 dark:text-blue-200 font-bold text-xs tracking-[0.2em] uppercase">Official 3946 Community Portal</span>
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
                className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-xl leading-relaxed font-medium"
              >
                Join the elite forces of Kingdom 3946. Experience the pinnacle of strategy, 
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
              <motion.div variants={fadeInUp} className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 flex items-center gap-8">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0a0e27] bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                      <FiUsers className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{stats.members}+</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Active Commanders</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - 3D Glass Composition */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block h-[600px]"
            >
              {/* Main Glass Card */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px] bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-transparent backdrop-blur-2xl rounded-[40px] border border-white/50 dark:border-white/10 shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.3)] z-10 overflow-hidden group">
                {/* Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/20 to-transparent opacity-50"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-32 h-32 bg-gradient-to-br from-[#FFD700] to-[#C5A059] rounded-3xl flex items-center justify-center shadow-lg mb-8 relative"
                  >
                    <GiCastle className="w-20 h-20 text-[#0F172A]" />
                    <div className="absolute inset-0 bg-white/20 rounded-3xl blur-lg -z-10"></div>
                  </motion.div>
                  
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2" style={{ fontFamily: 'Cinzel, serif' }}>KINGDOM 3946</h3>
                  <p className="text-slate-600 dark:text-blue-200/70 text-sm mb-8">The Sovereign Territory</p>
                  
                  <div className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-[#FFD700] rounded-full"></div>
                  </div>
                  <div className="flex justify-between w-full mt-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>POWER</span>
                    <span>75M+</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements - Parallax Effect */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                className="absolute top-0 right-10 w-48 p-4 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-white/10 shadow-xl z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg text-green-600 dark:text-green-400">
                    <GiTrophyCup className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">VICTORIES</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">38 Wins</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 left-10 w-48 p-4 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-white/10 shadow-xl z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400">
                    <GiCrossedSwords className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">BATTLES</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">45 Epic</p>
                  </div>
                </div>
              </motion.div>

              {/* King Profile Card */}
              <motion.div 
                animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/2 -right-8 transform -translate-y-1/2 p-4 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-white/10 shadow-xl z-30 flex items-center gap-4 min-w-[220px]"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] p-[2px]">
                    <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                       <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=King3946&backgroundColor=b6e3f4" alt="King" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FFD700] rounded-full flex items-center justify-center border-2 border-white dark:border-[#1E293B] shadow-sm">
                    <GiCrown className="w-3 h-3 text-[#0F172A]" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">Reigning King</p>
                  <p className="text-base font-bold text-slate-800 dark:text-white leading-tight">King 3946</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
                    <span className="text-[10px] font-medium text-green-600 dark:text-green-400">Online</span>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-slate-200 dark:border-white/5 rounded-full -z-10 animate-[spin_60s_linear_infinite]"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-dashed border-slate-300 dark:border-white/10 rounded-full -z-10 animate-[spin_40s_linear_infinite_reverse]"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Kingdom Achievements */}
      <section className="py-16 px-6 bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-[#1E293B] dark:via-[#0F172A] dark:to-[#1E293B] border-y-2 border-slate-200 dark:border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            {[
              { icon: FiUsers, label: "Active Members", value: stats.members, suffix: "+" },
              { icon: GiCrossedSwords, label: "Battles Fought", value: stats.battles, suffix: "" },
              { icon: GiTrophyCup, label: "Victories", value: stats.victories, suffix: "" },
              { icon: GiTwoCoins, label: "Total Donations", value: `${(stats.donations / 1000000).toFixed(1)}M`, suffix: "" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 text-center shadow-lg border-2 border-slate-200 dark:border-[#C5A059]/30 hover:border-[#C5A059] dark:hover:border-[#FFD700]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(197,160,89,0.2)]"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#C5A059] rounded-xl mb-4 shadow-lg">
                  <stat.icon className="w-8 h-8 text-[#0F172A]" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-[#FFD700] mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-slate-600 dark:text-[#E2E8F0]/70 font-semibold tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Kingdom Services */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#C5A059] rounded-xl mb-6 shadow-lg">
              <GiWingedSword className="w-8 h-8 text-[#0F172A]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-[#E2E8F0] mb-4 tracking-tight" style={{ fontFamily: 'Cinzel, serif' }}>
              Kingdom <span className="text-[#C5A059] dark:text-[#FFD700]">Features</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-[#E2E8F0]/70 max-w-2xl mx-auto">
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
                  className="group block h-full bg-white dark:bg-[#1E293B] rounded-2xl p-8 shadow-lg border-2 border-slate-200 dark:border-[#C5A059]/30 hover:border-[#C5A059] dark:hover:border-[#FFD700]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:hover:shadow-[0_0_30px_rgba(197,160,89,0.2)]"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-[#E2E8F0] mb-3 group-hover:text-[#C5A059] dark:group-hover:text-[#FFD700] transition-colors tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-[#E2E8F0]/70 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-[#C5A059] dark:text-[#FFD700] font-semibold group-hover:translate-x-2 transition-transform">
                    <span className="tracking-wide">Explore</span>
                    <FiArrowRight className="ml-2 w-5 h-5" />
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
                Become part of Kingdom 3946 and experience the ultimate Rise of Kingdoms community. 
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
                KINGDOM 3946
              </h3>
              <p className="text-sm text-slate-600 dark:text-[#C5A059]">Rise of Kingdoms</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-[#E2E8F0]/70 mb-4">
            United We Conquer • Together We Prosper
          </p>
          <p className="text-sm text-slate-500 dark:text-[#E2E8F0]/50">
            © 2024 Kingdom 3946. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Bottom spacing for mobile nav */}
      <div className="h-20 lg:h-0"></div>
    </div>
  );
};

export default Homepage;