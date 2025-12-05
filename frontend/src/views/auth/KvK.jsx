import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GiCrossedSwords, GiTrophyCup, GiSwordsPower, GiCrown } from 'react-icons/gi';
import { MdCalendarToday, MdTimer } from 'react-icons/md';

const KvK = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Dummy data for KvK
  const upcomingKvK = [
    {
      id: 1,
      season: "Season 8",
      date: "December 15-21, 2025",
      status: "Registration Open",
      participants: 156,
      maxParticipants: 200
    },
    {
      id: 2,
      season: "Season 9",
      date: "January 10-16, 2026",
      status: "Coming Soon",
      participants: 0,
      maxParticipants: 200
    }
  ];

  const pastKvK = [
    {
      id: 1,
      season: "Season 7",
      date: "November 20-26, 2025",
      winner: "Sacred3946",
      score: "1,248,500",
      rank: 1
    },
    {
      id: 2,
      season: "Season 6",
      date: "October 15-21, 2025",
      winner: "Sacred3946",
      score: "1,156,230",
      rank: 2
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] pt-24 pb-32 overflow-hidden">
      {/* Optimized Static Background - Better Performance */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Simple SVG Pattern - No Blur Filter */}
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="kvk-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#kvk-grad)" opacity="0.08" />
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

        {/* Static Gradient Overlays - No Rotation */}
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

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex justify-center mb-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] flex items-center justify-center shadow-2xl border-4 border-[#FFD700]/40">
              <GiCrossedSwords className="w-14 h-14 text-[#0F172A]" />
            </div>
          </motion.div>
          <motion.h1 
            className="text-6xl font-bold text-[#FFD700] mb-4 tracking-wider uppercase" 
            style={{ fontFamily: 'Cinzel, serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Kingdom vs Kingdom
          </motion.h1>
          <motion.p 
            className="text-xl text-[#E2E8F0]/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Epic battles between kingdoms. Prove your might and claim victory for Sacred3946!
          </motion.p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="flex justify-center gap-4 mb-12 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {[
            { id: 'upcoming', label: 'Upcoming KvK', icon: '⚔️' },
            { id: 'history', label: 'Battle History', icon: '📜' },
            { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative px-8 py-4 rounded-xl font-bold tracking-wide transition-all border-2 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] border-[#FFD700] shadow-lg shadow-[#FFD700]/50'
                  : 'bg-[#1E293B]/60 text-[#E2E8F0] border-[#C5A059]/30 hover:border-[#FFD700]/60 hover:bg-[#1E293B]/80'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Upcoming KvK Tab */}
        {activeTab === 'upcoming' && (
          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {upcomingKvK.map((kvk, index) => (
              <motion.div 
                key={kvk.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="group relative bg-[#1E293B]/95 rounded-2xl p-8 border-2 border-[#C5A059]/40 hover:border-[#FFD700]/70 transition-colors shadow-lg overflow-hidden"
                style={{ transform: 'translateZ(0)', contain: 'layout style paint' }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Card glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C5A059]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 
                        className="text-3xl font-bold text-[#FFD700] mb-2" 
                        style={{ fontFamily: 'Cinzel, serif' }}
                      >
                        {kvk.season}
                      </h3>
                      <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold shadow-md ${
                        kvk.status === 'Registration Open' 
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      }`}>
                        {kvk.status}
                      </span>
                    </div>
                    <div className="text-5xl hover:scale-110 transition-transform duration-200">
                      ⚔️
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center p-3 bg-[#0F172A]/60 rounded-lg border border-[#C5A059]/20">
                      <MdCalendarToday className="w-6 h-6 mr-3 text-[#FFD700]" />
                      <div>
                        <p className="text-xs text-[#E2E8F0]/60 mb-1">Battle Period</p>
                        <p className="text-[#E2E8F0] font-bold">{kvk.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-[#0F172A]/60 rounded-lg border border-[#C5A059]/20">
                      <GiSwordsPower className="w-6 h-6 mr-3 text-[#FFD700]" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs text-[#E2E8F0]/60">Participants</p>
                          <p className="text-[#E2E8F0] font-bold">{kvk.participants}/{kvk.maxParticipants}</p>
                        </div>
                        <div className="w-full bg-[#0F172A]/60 rounded-full h-2 overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-[#FFD700] to-[#C5A059]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(kvk.participants / kvk.maxParticipants) * 100}%` }}
                            transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {kvk.status === 'Registration Open' && (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] font-bold py-4 rounded-xl hover:shadow-xl hover:shadow-[#FFD700]/50 transition-all flex items-center justify-center group text-lg"
                    >
                      <GiCrossedSwords className="w-5 h-5 mr-2" />
                      Register Now
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Battle History Tab */}
        {activeTab === 'history' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {pastKvK.map((kvk, index) => (
              <motion.div 
                key={kvk.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                whileHover={{ x: 4 }}
                className="group relative bg-[#1E293B]/95 rounded-2xl p-8 border-2 border-[#C5A059]/40 hover:border-[#FFD700]/70 transition-colors shadow-lg overflow-hidden"
                style={{ transform: 'translateZ(0)', contain: 'layout style paint' }}
              >
                {/* Left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFD700] via-[#C5A059] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Card glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C5A059]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-6xl hover:scale-110 transition-transform duration-200">
                      {kvk.rank === 1 ? '🏆' : kvk.rank === 2 ? '🥈' : '🥉'}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-[#FFD700] mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                        {kvk.season}
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-[#E2E8F0]/80">
                          <MdCalendarToday className="w-4 h-4 mr-2 text-[#C5A059]" />
                          <span className="text-sm">{kvk.date}</span>
                        </div>
                        <div className="px-3 py-1 bg-[#0F172A]/60 rounded-lg border border-[#FFD700]/30">
                          <span className="text-sm font-bold text-[#FFD700]">Winner: {kvk.winner}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-3 mb-2">
                      {kvk.rank === 1 && (
                        <div className="hover:scale-110 transition-transform duration-200">
                          <GiCrown className="w-10 h-10 text-[#FFD700]" />
                        </div>
                      )}
                      <span className={`text-5xl font-bold ${
                        kvk.rank === 1 ? 'text-[#FFD700]' : 
                        kvk.rank === 2 ? 'text-[#C0C0C0]' : 
                        'text-[#CD7F32]'
                      }`}>
                        #{kvk.rank}
                      </span>
                    </div>
                    <div className="px-4 py-2 bg-[#0F172A]/60 rounded-lg border border-[#FFD700]/30">
                      <p className="text-xs text-[#E2E8F0]/60 mb-1">Final Score</p>
                      <p className="text-2xl font-bold text-[#FFD700]">{kvk.score}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <motion.div 
            className="relative bg-[#1E293B]/95 rounded-2xl p-10 border-2 border-[#C5A059]/40 shadow-lg overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ transform: 'translateZ(0)', contain: 'layout style paint' }}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GiTrophyCup className="w-20 h-20 text-[#FFD700] mx-auto mb-6 drop-shadow-lg" />
              </motion.div>
              <h2 className="text-4xl font-bold text-[#FFD700] mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
                Hall of Fame
              </h2>
              <p className="text-lg text-[#E2E8F0]/70">Top warriors of Sacred3946</p>
            </motion.div>

            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((rank) => (
                <motion.div 
                  key={rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + rank * 0.1, duration: 0.6 }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  className="group relative flex items-center justify-between p-6 bg-[#0F172A]/60 rounded-xl border-2 border-[#C5A059]/30 hover:border-[#FFD700]/60 hover:bg-[#0F172A]/80 transition-all overflow-hidden"
                >
                  {/* Left accent glow */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFD700] to-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-center gap-5 relative z-10">
                    <motion.div 
                      className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg ${
                        rank === 1 ? 'bg-gradient-to-br from-[#FFD700] to-[#C5A059] text-[#0F172A]' :
                        rank === 2 ? 'bg-gradient-to-br from-[#C0C0C0] to-[#808080] text-white' :
                        rank === 3 ? 'bg-gradient-to-br from-[#CD7F32] to-[#8B4513] text-white' :
                        'bg-[#1E293B] text-[#E2E8F0] border-2 border-[#C5A059]/30'
                      }`}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: rank * 0.2 }}
                    >
                      #{rank}
                    </motion.div>
                    <div className="flex items-center gap-3">
                      <motion.span 
                        className="text-4xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: rank * 0.2 }}
                      >
                        {rank === 1 ? '👑' : rank === 2 ? '⚔️' : rank === 3 ? '🛡️' : '⚡'}
                      </motion.span>
                      <div>
                        <p className="font-bold text-xl text-[#E2E8F0] mb-1">Commander_{rank}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded border border-[#FFD700]/30 font-bold">LEGEND</span>
                          <span className="text-sm text-[#E2E8F0]/60">Alliance Leader</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right relative z-10">
                    <p className="text-3xl font-bold text-[#FFD700] mb-1">{(1500000 - rank * 100000).toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-2">
                      <GiSwordsPower className="w-4 h-4 text-[#C5A059]" />
                      <p className="text-sm text-[#E2E8F0]/60">Total Power</p>
                    </div>
                  </div>

                  {/* Card shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[#FFD700]/5 to-transparent" />
                </motion.div>
              ))}
            </div>

            {/* Bottom info */}
            <motion.div 
              className="mt-8 p-5 bg-[#0F172A]/60 rounded-xl border-2 border-[#FFD700]/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <p className="text-[#E2E8F0]/80 text-sm flex items-start">
                <span className="text-[#FFD700] font-bold mr-3">ℹ️</span>
                <span>Rankings are updated after each KvK season. Keep fighting to climb the ladder and earn your place in the Hall of Fame!</span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default KvK;
