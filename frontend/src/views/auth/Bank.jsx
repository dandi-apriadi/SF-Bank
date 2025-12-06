import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GiTwoCoins, 
  GiTrophyCup,
  GiChestArmor,
  GiCoinsPile,
  GiWheat,
  GiWoodPile,
  GiStoneBlock,
  GiGoldBar
} from 'react-icons/gi';
import { 
  MdTrendingUp,
  MdAccountBalance,
  MdStar
} from 'react-icons/md';
import { 
  FiArrowRight
} from 'react-icons/fi';
import SacredLogo from '../../assets/img/auth/animatedlogo.gif';
import { fetchAlliances, fetchReportsSummary } from '../../services/bankService';

const Bank = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [topContributors, setTopContributors] = useState([]);
  const [recentContributions, setRecentContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Kingdom Bank - Sacred3946";
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const [summary, alliances] = await Promise.all([
          fetchReportsSummary(),
          fetchAlliances(),
        ]);

        const allianceList = Array.isArray(alliances) ? alliances : [];
        const deposits = Array.isArray(summary?.deposits) ? summary.deposits : [];
        const members = Array.isArray(summary?.members) ? summary.members : [];

        const totals = allianceList.reduce((acc, alliance) => {
          acc.food += parseInt(alliance.food) || 0;
          acc.wood += parseInt(alliance.wood) || 0;
          acc.stone += parseInt(alliance.stone) || 0;
          acc.gold += parseInt(alliance.gold) || 0;
          acc.members += parseInt(alliance.members_count) || 0;
          return acc;
        }, { food: 0, wood: 0, stone: 0, gold: 0, members: 0 });

        const totalContributions = totals.food + totals.wood + totals.stone + totals.gold;
        const uniqueWeeks = new Set(deposits.map((d) => parseInt(d.week) || 0).filter(Boolean));
        const weeklyAverage = uniqueWeeks.size ? Math.round(totalContributions / uniqueWeeks.size) : 0;

        setStats({
          totalFood: totals.food,
          totalWood: totals.wood,
          totalStone: totals.stone,
          totalGold: totals.gold,
          totalMembers: totals.members,
          totalContributions,
          weeklyAverage,
        });

        const contributorIcons = ['👑', '⚔️', '🛡️', '🏆', '📜', '🎯', '🧭'];
        const contributors = members
          .slice()
          .sort((a, b) => (b.total || 0) - (a.total || 0))
          .slice(0, 5)
          .map((m, idx) => ({
            rank: idx + 1,
            name: m.name || `Member ${m.id}`,
            totalRss: m.total || 0,
            food: m.food || 0,
            wood: m.wood || 0,
            stone: m.stone || 0,
            gold: m.gold || 0,
            icon: contributorIcons[idx] || '🏅',
          }));
        setTopContributors(contributors);

        const recent = deposits
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 10)
          .map((d) => {
            const food = d.food || 0;
            const wood = d.wood || 0;
            const stone = d.stone || 0;
            const gold = d.gold || 0;
            const total = d.total || food + wood + stone + gold;
            return {
              id: d.id,
              member: d.member || d.member_name || 'Member',
              food,
              wood,
              stone,
              gold,
              totalRss: total,
              week: d.week || 0,
              date: d.date ? new Date(d.date).toLocaleString() : '-'
            };
          });
        setRecentContributions(recent);
      } catch (err) {
        const message = err?.message || 'Failed to load bank data';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  const formatNumber = (num) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const resolvedStats = stats || {
    totalFood: 0,
    totalWood: 0,
    totalStone: 0,
    totalGold: 0,
    totalMembers: 0,
    totalContributions: 0,
    weeklyAverage: 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0F172A] text-navy-700 dark:text-white">
        <p className="text-lg font-semibold">Loading bank data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0F172A] text-navy-700 dark:text-white px-4 text-center">
        <div>
          <p className="text-lg font-semibold mb-2">Failed to load bank data</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] pt-24 pb-32 overflow-hidden">
      {/* Optimized Static Background - Better Performance */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Simple SVG Pattern - No Blur Filter */}
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="bank-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#bank-grad)" opacity="0.08" />
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
      
      {/* Hero Section */}
      <section className="relative flex items-center pb-16 px-6 overflow-hidden">

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            {/* Logo and Title */}
            <motion.div variants={fadeInUp} className="mb-6">
              <motion.div 
                className="flex justify-center mb-8"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="relative w-48 h-48 rounded-full flex items-center justify-center">
                  <img src={SacredLogo} alt="Sacred Forces" className="w-48 h-48 rounded-full object-contain drop-shadow-2xl filter brightness-125" />
                </div>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-black text-[#FFD700] mb-6 tracking-wider uppercase drop-shadow-lg" style={{ fontFamily: 'Cinzel, serif' }}>
                Kingdom Bank
              </h1>
              <p className="text-lg md:text-2xl text-[#E2E8F0]/90 max-w-3xl mx-auto leading-relaxed font-medium">
                Central treasury of Sacred3946 - Managing alliance resources and member contributions
              </p>
            </motion.div>

            {/* Stats Cards - Resource Based */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-gradient-to-br from-[#1E293B]/95 to-[#0F172A]/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-green-500/30 hover:border-green-400/60 shadow-lg hover:shadow-green-500/20 transition-all duration-300"
              >
                <div className="bg-green-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <GiWheat className="w-10 h-10 text-green-400" />
                </div>
                <div className="text-3xl font-black text-white mb-2">{formatNumber(resolvedStats.totalFood)}</div>
                <div className="text-sm font-semibold text-green-400/90 uppercase tracking-wide">Total Food</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-gradient-to-br from-[#1E293B]/95 to-[#0F172A]/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-amber-600/30 hover:border-amber-500/60 shadow-lg hover:shadow-amber-600/20 transition-all duration-300"
              >
                <div className="bg-amber-600/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <GiWoodPile className="w-10 h-10 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-white mb-2">{formatNumber(resolvedStats.totalWood)}</div>
                <div className="text-sm font-semibold text-amber-600/90 uppercase tracking-wide">Total Wood</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-gradient-to-br from-[#1E293B]/95 to-[#0F172A]/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-slate-400/30 hover:border-slate-300/60 shadow-lg hover:shadow-slate-400/20 transition-all duration-300"
              >
                <div className="bg-slate-200/15 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <GiStoneBlock className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-black text-white mb-2">{formatNumber(resolvedStats.totalStone)}</div>
                <div className="text-sm font-semibold text-white/90 uppercase tracking-wide">Total Stone</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-gradient-to-br from-[#1E293B]/95 to-[#0F172A]/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-[#FFD700]/30 hover:border-[#FFD700]/60 shadow-lg hover:shadow-[#FFD700]/20 transition-all duration-300"
              >
                <div className="bg-[#FFD700]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <GiGoldBar className="w-10 h-10 text-[#FFD700]" />
                </div>
                <div className="text-3xl font-black text-white mb-2">{formatNumber(resolvedStats.totalGold)}</div>
                <div className="text-sm font-semibold text-[#FFD700]/90 uppercase tracking-wide">Total Gold</div>
              </motion.div>
            </motion.div>

            {/* Secondary Stats */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-5xl mx-auto">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-[#FFD700]/10 via-[#C5A059]/5 to-transparent backdrop-blur-xl rounded-2xl p-8 border-2 border-[#FFD700]/40 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <MdAccountBalance className="w-12 h-12 text-[#FFD700]" />
                  <div className="bg-[#FFD700]/10 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-[#FFD700] uppercase">Total</span>
                  </div>
                </div>
                <div className="text-4xl font-black text-white mb-2">{formatNumber(resolvedStats.totalContributions)}</div>
                <div className="text-sm font-semibold text-[#E2E8F0]/80 uppercase tracking-wide">Total Resources</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-[#C5A059]/10 via-[#FFD700]/5 to-transparent backdrop-blur-xl rounded-2xl p-8 border-2 border-[#C5A059]/40 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <MdStar className="w-12 h-12 text-[#C5A059]" />
                  <div className="bg-[#C5A059]/10 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-[#C5A059] uppercase">Active</span>
                  </div>
                </div>
                <div className="text-4xl font-black text-white mb-2">{resolvedStats.totalMembers}</div>
                <div className="text-sm font-semibold text-[#E2E8F0]/80 uppercase tracking-wide">Contributors</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent backdrop-blur-xl rounded-2xl p-8 border-2 border-blue-400/40 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <MdTrendingUp className="w-12 h-12 text-blue-400" />
                  <div className="bg-blue-400/10 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-blue-400 uppercase">Weekly</span>
                  </div>
                </div>
                <div className="text-4xl font-black text-white mb-2">{formatNumber(resolvedStats.weeklyAverage)}</div>
                <div className="text-sm font-semibold text-[#E2E8F0]/80 uppercase tracking-wide">Average</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Top Contributors Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#C5A059] rounded-2xl mb-8 shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <GiTrophyCup className="w-10 h-10 text-[#0F172A]" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-[#FFD700] mb-6 tracking-wider uppercase drop-shadow-lg" style={{ fontFamily: 'Cinzel, serif' }}>
              Top Contributors
            </h2>
            <p className="text-lg md:text-xl text-[#E2E8F0]/90 max-w-3xl mx-auto leading-relaxed font-medium">
              Kingdom heroes who contribute the most resources to our alliance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            {topContributors.map((contributor, index) => (
              <motion.div
                key={contributor.rank}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="relative group"
              >
                <div className={`relative bg-gradient-to-br from-[#1E293B]/95 to-[#0F172A]/90 backdrop-blur-xl rounded-3xl p-6 border-2 ${
                  contributor.rank === 1 ? 'border-[#FFD700] shadow-2xl shadow-[#FFD700]/30' :
                  contributor.rank === 2 ? 'border-slate-300 shadow-xl shadow-slate-400/20' :
                  contributor.rank === 3 ? 'border-[#CD7F32] shadow-xl shadow-[#CD7F32]/20' :
                  'border-[#C5A059]/40 shadow-lg'
                } transition-all duration-300 overflow-hidden`}>
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`absolute inset-0 ${
                      contributor.rank === 1 ? 'bg-gradient-to-br from-[#FFD700]/5 to-transparent' :
                      contributor.rank === 2 ? 'bg-gradient-to-br from-slate-400/5 to-transparent' :
                      contributor.rank === 3 ? 'bg-gradient-to-br from-[#CD7F32]/5 to-transparent' :
                      'bg-gradient-to-br from-[#C5A059]/5 to-transparent'
                    }`}></div>
                  </div>
                  
                  {contributor.rank <= 3 && (
                    <div className="absolute -top-4 -right-4 z-10">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg shadow-xl ${
                        contributor.rank === 1 ? 'bg-gradient-to-br from-[#FFD700] to-[#C5A059] text-[#0F172A]' :
                        contributor.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white' :
                        'bg-gradient-to-br from-[#CD7F32] to-[#8B4513] text-white'
                      }`}>
                        {contributor.rank}
                      </div>
                    </div>
                  )}
                  <div className="text-center relative z-10">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{contributor.icon}</div>
                    {contributor.rank > 3 && (
                      <div className="text-sm font-bold text-slate-400 mb-2">#{contributor.rank}</div>
                    )}
                    <h3 className="text-xl font-black text-white mb-4">{contributor.name}</h3>
                    <div className="text-3xl font-black text-[#FFD700] mb-4">{formatNumber(contributor.totalRss)}</div>
                    <div className="bg-[#0F172A]/60 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center text-green-400 font-semibold"><GiWheat className="w-4 h-4 mr-1" />Food</span>
                        <span className="font-black text-white">{formatNumber(contributor.food)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center text-amber-600 font-semibold"><GiWoodPile className="w-4 h-4 mr-1" />Wood</span>
                        <span className="font-black text-white">{formatNumber(contributor.wood)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center text-white font-semibold"><GiStoneBlock className="w-4 h-4 mr-1" />Stone</span>
                        <span className="font-black text-white">{formatNumber(contributor.stone)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center text-[#FFD700] font-semibold"><GiGoldBar className="w-4 h-4 mr-1" />Gold</span>
                        <span className="font-black text-white">{formatNumber(contributor.gold)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Contributions */}
      <section className="relative py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-[#FFD700] mb-6 tracking-wider uppercase drop-shadow-lg" style={{ fontFamily: 'Cinzel, serif' }}>
              Recent Contributions
            </h2>
            <p className="text-lg md:text-xl text-[#E2E8F0]/90 max-w-3xl mx-auto leading-relaxed font-medium">
              Latest resource contributions from our members
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#1E293B]/95 to-[#0F172A]/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-[#C5A059]/50 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#C5A059]/30">
                <thead className="bg-gradient-to-r from-[#0F172A] to-[#1E293B]">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-black text-[#FFD700] uppercase tracking-wider">Member</th>
                    <th className="px-6 py-5 text-center text-sm font-black text-[#FFD700] uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <GiWheat className="w-5 h-5 mr-2" />Food
                      </div>
                    </th>
                    <th className="px-6 py-5 text-center text-sm font-black text-[#FFD700] uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <GiWoodPile className="w-5 h-5 mr-2" />Wood
                      </div>
                    </th>
                    <th className="px-6 py-5 text-center text-sm font-black text-[#FFD700] uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <GiStoneBlock className="w-5 h-5 mr-2" />Stone
                      </div>
                    </th>
                    <th className="px-6 py-5 text-center text-sm font-black text-[#FFD700] uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <GiGoldBar className="w-5 h-5 mr-2" />Gold
                      </div>
                    </th>
                    <th className="px-6 py-5 text-right text-sm font-black text-[#FFD700] uppercase tracking-wider">Total RSS</th>
                    <th className="px-6 py-5 text-center text-sm font-black text-[#FFD700] uppercase tracking-wider">Week</th>
                    <th className="px-6 py-5 text-right text-sm font-black text-[#FFD700] uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C5A059]/30">
                  {recentContributions.map((contribution, idx) => (
                    <motion.tr 
                      key={contribution.id} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gradient-to-r hover:from-[#1E293B]/60 hover:to-[#0F172A]/40 transition-all duration-200 group"
                    >
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-base font-bold text-white group-hover:text-[#FFD700] transition-colors">{contribution.member}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <div className="text-base font-black text-green-400">{formatNumber(contribution.food)}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <div className="text-base font-black text-amber-600">{formatNumber(contribution.wood)}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <div className="text-base font-black text-white">{formatNumber(contribution.stone)}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <div className="text-base font-black text-[#FFD700]">{formatNumber(contribution.gold)}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="text-lg font-black text-white">{formatNumber(contribution.totalRss)}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <span className="px-3 py-2 text-xs font-black bg-[#C5A059]/20 text-[#FFD700] rounded-xl border border-[#FFD700]/30">W{contribution.week}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-[#E2E8F0]/80">{contribution.date}</div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="relative bg-gradient-to-br from-[#FFD700] via-[#C5A059] to-[#FFD700] rounded-[2rem] p-16 md:p-20 text-center overflow-hidden shadow-2xl border-4 border-[#FFD700]/60"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <GiCoinsPile className="absolute top-10 left-10 w-40 h-40 transform -rotate-12" />
              </motion.div>
              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 25, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <GiChestArmor className="absolute bottom-10 right-10 w-48 h-48 transform rotate-12" />
              </motion.div>
            </div>

            <div className="relative z-10">
              <motion.div 
                className="inline-flex items-center justify-center w-24 h-24 bg-[#0F172A] rounded-3xl mb-8 shadow-2xl"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <GiTwoCoins className="w-14 h-14 text-[#FFD700]" />
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black text-[#0F172A] mb-8 tracking-tight uppercase leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                Contribute to<br />Alliance Treasury
              </h2>
              <p className="text-xl md:text-2xl text-[#0F172A]/90 mb-10 max-w-3xl mx-auto leading-relaxed font-semibold">
                Help strengthen our alliance! Contribute resources to our bank and be recognized as a top contributor
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/auth/forms"
                  className="group inline-flex items-center px-12 py-6 bg-[#0F172A] text-[#FFD700] font-black text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border-4 border-[#0F172A] hover:bg-[#1E293B]"
                >
                  <FiArrowRight className="w-7 h-7 mr-4 group-hover:translate-x-2 transition-transform" />
                  <span className="tracking-wide uppercase">Join Kingdom</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Bank;
