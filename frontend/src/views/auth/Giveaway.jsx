import React, { useState } from 'react';
import { FiGift, FiUser, FiClock } from 'react-icons/fi';
import { GiTrophyCup, GiPartyPopper, GiDiamondTrophy } from 'react-icons/gi';
import { MdTimer, MdPeople } from 'react-icons/md';

const Giveaway = () => {
  const [selectedGiveaway, setSelectedGiveaway] = useState(null);

  const giveaways = [
    {
      id: 1,
      title: "Weekly Legendary Chest",
      description: "Win exclusive legendary items and rare resources",
      prize: "1x Legendary Chest + 50,000 Gems",
      entries: 1247,
      maxEntries: 2000,
      endsIn: "3 days",
      status: "active",
      image: "legendary",
      requirements: "Kingdom members only"
    },
    {
      id: 2,
      title: "New Year Mega Giveaway",
      description: "Celebrate the new year with epic rewards",
      prize: "100,000 Gems + Exclusive Avatar Frame",
      entries: 2856,
      maxEntries: 5000,
      endsIn: "15 days",
      status: "active",
      image: "newyear",
      requirements: "Active players (7+ days)"
    },
    {
      id: 3,
      title: "Battle Pass Giveaway",
      description: "Get a free premium battle pass",
      prize: "Premium Battle Pass + Starter Pack",
      entries: 892,
      maxEntries: 1000,
      endsIn: "5 days",
      status: "active",
      image: "battlepass",
      requirements: "All players welcome"
    },
    {
      id: 4,
      title: "Alliance Achievement Reward",
      description: "Exclusive rewards for top alliance members",
      prize: "Resource Pack + Speed-ups",
      entries: 156,
      maxEntries: 500,
      endsIn: "Completed",
      status: "ended",
      image: "alliance",
      winner: "Commander_Alpha"
    }
  ];

  const recentWinners = [
    { name: "Commander_Beta", prize: "50,000 Gems", date: "Dec 1, 2025" },
    { name: "Warrior_Gamma", prize: "Legendary Chest", date: "Nov 28, 2025" },
    { name: "Knight_Delta", prize: "Premium Pass", date: "Nov 25, 2025" },
    { name: "Lord_Epsilon", prize: "Resource Pack", date: "Nov 20, 2025" }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] pt-24 pb-32 overflow-hidden">
      {/* Optimized Static Background - Better Performance */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Simple SVG Pattern - No Blur Filter */}
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="giveaway-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#giveaway-grad)" opacity="0.08" />
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

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] flex items-center justify-center shadow-2xl border-4 border-[#FFD700]/30 animate-pulse">
              <FiGift className="w-14 h-14 text-[#0F172A]" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#FFD700] mb-6 tracking-wider uppercase drop-shadow-lg" style={{ fontFamily: 'Cinzel, serif' }}>
            Kingdom Giveaways
          </h1>
          <p className="text-lg md:text-xl text-[#E2E8F0]/90 max-w-3xl mx-auto leading-relaxed font-medium">
            Participate in our giveaways and win amazing rewards for your kingdom!
          </p>
        </div>

        {/* Active Giveaways */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#FFD700] mb-8 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            Active Giveaways
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {giveaways.filter(g => g.status === 'active').map((giveaway) => (
              <div key={giveaway.id} className="bg-gradient-to-br from-[#1E293B]/95 to-[#0F172A]/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-[#C5A059]/40 hover:border-[#FFD700]/60 transition-all shadow-xl hover:shadow-2xl hover:shadow-[#FFD700]/20 group hover:scale-105 duration-300">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-[#C5A059]/20 flex items-center justify-center border-2 border-[#FFD700]/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <GiDiamondTrophy className="w-12 h-12 text-[#FFD700]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-black text-[#FFD700] mb-3 text-center" style={{ fontFamily: 'Cinzel, serif' }}>
                  {giveaway.title}
                </h3>
                <p className="text-[#E2E8F0]/80 text-sm md:text-base text-center mb-6 font-medium">{giveaway.description}</p>

                {/* Prize */}
                <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-xl p-4 mb-6 border-2 border-[#FFD700]/30 shadow-lg">
                  <div className="flex items-center justify-center">
                    <GiTrophyCup className="w-6 h-6 text-[#FFD700] mr-3" />
                    <span className="text-[#FFD700] font-black text-sm md:text-base">{giveaway.prize}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-[#E2E8F0] text-sm md:text-base">
                    <div className="flex items-center">
                      <MdPeople className="w-5 h-5 mr-2 text-[#C5A059]" />
                      <span className="font-semibold">Entries</span>
                    </div>
                    <span className="font-black text-white">{giveaway.entries.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#E2E8F0] text-sm md:text-base">
                    <div className="flex items-center">
                      <MdTimer className="w-5 h-5 mr-2 text-[#C5A059]" />
                      <span className="font-semibold">Ends in</span>
                    </div>
                    <span className="font-black text-[#FFD700]">{giveaway.endsIn}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="w-full bg-[#0F172A] rounded-full h-3 overflow-hidden border border-[#C5A059]/30">
                    <div 
                      className="bg-gradient-to-r from-[#FFD700] to-[#C5A059] h-full rounded-full transition-all shadow-lg"
                      style={{ width: `${(giveaway.entries / giveaway.maxEntries) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs md:text-sm text-[#E2E8F0]/80 mt-2 text-center font-semibold">
                    {Math.round((giveaway.entries / giveaway.maxEntries) * 100)}% full
                  </p>
                </div>

                {/* Requirements */}
                <p className="text-xs md:text-sm text-[#E2E8F0]/70 text-center mb-6 italic font-medium">
                  {giveaway.requirements}
                </p>

                {/* Enter Button */}
                <button className="w-full bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] font-black text-base md:text-lg py-4 rounded-xl hover:shadow-2xl hover:shadow-[#FFD700]/50 transition-all hover:scale-105 border-2 border-[#FFD700]/30 uppercase tracking-wide">
                  Enter Giveaway
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Winners */}
        <div className="bg-gradient-to-br from-[#1E293B]/95 to-[#0F172A]/90 backdrop-blur-xl rounded-3xl p-10 border-2 border-[#C5A059]/40 shadow-2xl mb-16">
          <div className="flex items-center justify-center mb-8">
            <GiPartyPopper className="w-12 h-12 text-[#FFD700] mr-4 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-black text-[#FFD700] tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              Recent Winners
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {recentWinners.map((winner, index) => (
              <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl border-2 border-[#C5A059]/30 hover:border-[#FFD700]/50 transition-all hover:scale-105 shadow-lg">
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] flex items-center justify-center mr-4 shadow-xl">
                    <FiUser className="w-7 h-7 text-[#0F172A]" />
                  </div>
                  <div>
                    <p className="font-black text-white text-base md:text-lg">{winner.name}</p>
                    <p className="text-sm md:text-base text-[#E2E8F0]/70 font-medium">{winner.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-[#FFD700] text-sm md:text-base">{winner.prize}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Participate */}
        <div className="bg-gradient-to-br from-[#1E293B]/95 to-[#0F172A]/90 backdrop-blur-xl rounded-3xl p-10 border-2 border-[#C5A059]/40 shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-black text-[#FFD700] mb-10 text-center tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            How to Participate
          </h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group hover:scale-105 transition-all">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#C5A059]/20 border-4 border-[#FFD700] flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-all">
                <span className="text-[#FFD700] font-black text-2xl">1</span>
              </div>
              <h4 className="font-black text-white text-lg md:text-xl mb-3">Choose Giveaway</h4>
              <p className="text-[#E2E8F0]/80 text-sm md:text-base font-medium">Select a giveaway you want to enter</p>
            </div>
            <div className="group hover:scale-105 transition-all">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#C5A059]/20 border-4 border-[#FFD700] flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-all">
                <span className="text-[#FFD700] font-black text-2xl">2</span>
              </div>
              <h4 className="font-black text-white text-lg md:text-xl mb-3">Click Enter</h4>
              <p className="text-[#E2E8F0]/80 text-sm md:text-base font-medium">Submit your entry with one click</p>
            </div>
            <div className="group hover:scale-105 transition-all">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#C5A059]/20 border-4 border-[#FFD700] flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-all">
                <span className="text-[#FFD700] font-black text-2xl">3</span>
              </div>
              <h4 className="font-black text-white text-lg md:text-xl mb-3">Wait for Results</h4>
              <p className="text-[#E2E8F0]/80 text-sm md:text-base font-medium">Winners announced when giveaway ends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Giveaway;
