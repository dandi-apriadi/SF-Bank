import React from 'react';
import { motion } from 'framer-motion';
import { GiCastle, GiCrown, GiCrossedSwords, GiScrollUnfurled } from 'react-icons/gi';
import { FiUsers, FiTarget, FiShield } from 'react-icons/fi';
import SacredLogo from '../../assets/img/sacred-forces-logo.png';

const About = () => {
  const pillars = [
    { icon: FiUsers, title: 'Community', desc: 'A welcoming home for all players—F2P and P2W alike.' },
    { icon: FiTarget, title: 'Strategy', desc: 'Coordinated tactics, clear roles, and disciplined execution in KvK.' },
    { icon: FiShield, title: 'Honor', desc: 'Respect, accountability, and fair play across all alliances.' }
  ];

  const timeline = [
    { year: '2023', title: 'Founding of Sacred3946', desc: 'Established with core values of honor and teamwork.' },
    { year: '2024', title: 'First KvK Victory', desc: 'Achieved a decisive win through superior coordination.' },
    { year: '2025', title: 'Community Expansion', desc: 'Grew to 45K+ subscribers and multiple thriving alliances.' }
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] overflow-hidden">
      {/* Optimized Static Background - Better Performance */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Simple SVG Pattern - No Blur Filter */}
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="about-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-grad)" opacity="0.08" />
        </svg>

        {/* Static Glow Effects - No Animation */}
        <div
          className="absolute top-[-15%] right-[-10%] w-[420px] h-[420px] rounded-full opacity-20 dark:opacity-12"
          style={{ 
            background: 'radial-gradient(circle at 30% 30%, #FFD700, transparent)', 
            filter: 'blur(40px)',
            transform: 'translateZ(0)',
            contain: 'layout style paint'
          }}
        />
        <div
          className="absolute bottom-[-18%] left-[-12%] w-[460px] h-[460px] rounded-full opacity-18 dark:opacity-10"
          style={{ 
            background: 'radial-gradient(circle at 70% 70%, #C5A059, transparent)', 
            filter: 'blur(40px)',
            transform: 'translateZ(0)',
            contain: 'layout style paint'
          }}
        />

        {/* Hexagon Pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L45 15 L45 45 L30 60 L15 45 L15 15 Z' fill='none' stroke='%23FFD700' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        ></div>

        {/* Static Gradient Overlay - No Rotation */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ 
            width: '680px', 
            height: '680px', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, transparent 40%, rgba(255,215,0,0.06) 70%, transparent 100%)', 
            opacity: 0.5,
            transform: 'translateZ(0)'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Hero */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex justify-center mb-8 relative"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="relative">
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] blur-xl opacity-40"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative w-56 h-56 rounded-full flex items-center justify-center">
                <img src={SacredLogo} alt="Sacred Forces" className="w-56 h-56 rounded-full object-contain drop-shadow-2xl filter brightness-125" />
              </div>
            </div>
          </motion.div>
          <motion.h1 
            className="text-6xl font-bold text-[#FFD700] mb-4 tracking-wider uppercase" 
            style={{ fontFamily: 'Cinzel, serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            About Sacred3946
          </motion.h1>
          <motion.p 
            className="text-xl text-[#E2E8F0]/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            A medieval-themed community united by strategy, honor, and camaraderie.
          </motion.p>
        </motion.div>

        {/* Pillars */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {pillars.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/25 to-[#C5A059]/25 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-[#1E293B]/95 rounded-2xl p-8 border-2 border-[#C5A059]/40 text-center hover:border-[#FFD700]/80 transition-colors duration-300 overflow-hidden shadow-lg" style={{ transform: 'translateZ(0)', contain: 'layout style paint' }}>
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C5A059]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 hover:scale-110 transition-transform duration-200 inline-block">
                  <p.icon className="w-20 h-20 text-[#FFD700] mx-auto mb-4 drop-shadow-lg" />
                </div>
                
                <h3 className="text-2xl font-bold text-[#FFD700] mb-3 relative z-10" style={{ fontFamily: 'Cinzel, serif' }}>
                  {p.title}
                </h3>
                <p className="text-[#E2E8F0]/80 text-sm leading-relaxed relative z-10">
                  {p.desc}
                </p>

                {/* Shine effect */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission & Vision */}
        <motion.div 
          className="grid md:grid-cols-2 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ y: -8 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/25 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-[#1E293B]/90 to-[#0F172A]/70 backdrop-blur-md rounded-2xl p-8 border-2 border-[#FFD700]/40 hover:border-[#FFD700]/80 transition-all duration-500 overflow-hidden shadow-lg">
              {/* Top accent line */}
              <motion.div 
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />

              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <motion.div 
                className="flex items-center mb-5 relative z-10"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <GiCrown className="w-10 h-10 text-[#FFD700] mr-3 drop-shadow-lg" />
                <h2 className="text-3xl font-bold text-[#FFD700]" style={{ fontFamily: 'Cinzel, serif' }}>Our Vision</h2>
              </motion.div>
              <p className="text-[#E2E8F0]/85 leading-relaxed relative z-10 font-medium">
                To be the most respected and coordinated Rise of Kingdoms community, known for honor, strategy, and unforgettable battles.
              </p>

              {/* Shine effect */}
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ y: -8 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/25 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-[#1E293B]/90 to-[#0F172A]/70 backdrop-blur-md rounded-2xl p-8 border-2 border-[#C5A059]/40 hover:border-[#FFD700]/80 transition-all duration-500 overflow-hidden shadow-lg">
              {/* Top accent line */}
              <motion.div 
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />

              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#C5A059]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <motion.div 
                className="flex items-center mb-5 relative z-10"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.2 }}
              >
                <GiCrossedSwords className="w-10 h-10 text-[#FFD700] mr-3 drop-shadow-lg" />
                <h2 className="text-3xl font-bold text-[#FFD700]" style={{ fontFamily: 'Cinzel, serif' }}>Our Mission</h2>
              </motion.div>
              <p className="text-[#E2E8F0]/85 leading-relaxed relative z-10 font-medium">
                Empower players through education, fair rules, and disciplined teamwork to achieve victory while fostering a friendly environment.
              </p>

              {/* Shine effect */}
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Timeline */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <motion.div 
            className="flex items-center mb-12"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <GiScrollUnfurled className="w-10 h-10 text-[#FFD700] mr-3" />
            <h2 className="text-4xl font-bold text-[#FFD700]" style={{ fontFamily: 'Cinzel, serif' }}>Kingdom Timeline</h2>
          </motion.div>
          
          <div className="relative">
            {/* Clean timeline line */}
            <motion.div 
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FFD700] via-[#C5A059] to-transparent"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
              style={{ transformOrigin: 'top' }}
            />

            <div className="grid md:grid-cols-3 gap-8">
              {timeline.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.15, duration: 0.6 }}
                  whileHover={{ y: -12 }}
                  className="group relative"
                >
                  {/* Timeline dot - clean design */}
                  <motion.div 
                    className="hidden md:block absolute -left-[32px] top-8 w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] border-2 border-[#0F172A] shadow-[0_0_15px_rgba(255,215,0,0.6)]"
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                  />

                  {/* Card - cleaner design */}
                  <div className="relative bg-gradient-to-br from-[#1E293B]/85 to-[#0F172A]/70 backdrop-blur-md rounded-xl p-8 border border-[#C5A059]/35 hover:border-[#FFD700]/70 transition-all duration-400 overflow-hidden shadow-lg">
                    {/* Top accent line - subtle */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Year badge */}
                    <div className="inline-block bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] px-4 py-2 rounded-lg font-bold text-sm mb-4 shadow-md">
                      {t.year}
                    </div>
                    
                    {/* Icon/marker */}
                    <motion.div 
                      className="text-4xl mb-4"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                    >
                      {i === 0 ? '⚔️' : i === 1 ? '🏆' : '👑'}
                    </motion.div>
                    
                    <h3 className="text-lg font-bold text-[#FFD700] mb-3 uppercase tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>
                      {t.title}
                    </h3>
                    <p className="text-[#E2E8F0]/75 text-sm leading-relaxed">
                      {t.desc}
                    </p>

                    {/* Subtle hover effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-40 bg-gradient-to-br from-[#FFD700]/5 to-transparent transition-opacity duration-300 rounded-xl pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Closing */}
        <motion.div 
          className="relative bg-gradient-to-br from-[#1E293B]/90 to-[#0F172A]/80 backdrop-blur-md rounded-2xl p-12 border-2 border-[#C5A059]/40 text-center overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          whileHover={{ y: -8 }}
        >
          {/* Top accent line */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />

          {/* Decorative glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 via-transparent to-[#C5A059]/10 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          <motion.div 
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 10, repeat: Infinity }}
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, #FFD700/20, transparent)',
              backgroundSize: '200% 200%'
            }}
          />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.3, duration: 0.6, type: 'spring', stiffness: 100 }}
            className="relative z-10"
          >
            <GiCrown className="w-16 h-16 text-[#FFD700] mx-auto mb-4 drop-shadow-lg" />
          </motion.div>

          <motion.h3 
            className="text-4xl font-bold text-[#FFD700] mb-4" 
            style={{ fontFamily: 'Cinzel, serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            Join Our Kingdom
          </motion.h3>

          <motion.p 
            className="text-[#E2E8F0]/85 mb-8 max-w-2xl mx-auto leading-relaxed text-lg relative z-10 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            Ready to fight alongside honorable warriors? Explore events, join an alliance, and be part of our story.
          </motion.p>

          <motion.a 
            href="#/auth/forms" 
            className="relative z-10 inline-block group"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#C5A059] rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            <button className="relative bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] font-bold px-12 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 uppercase tracking-wider text-lg">
              Apply Now
            </button>
          </motion.a>

          {/* Shine effect */}
          <motion.div 
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
              pointerEvents: 'none'
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default About;
