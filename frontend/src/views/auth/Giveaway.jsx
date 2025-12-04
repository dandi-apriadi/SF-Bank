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
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] flex items-center justify-center shadow-2xl border-4 border-[#FFD700]/30 animate-pulse">
              <FiGift className="w-12 h-12 text-[#0F172A]" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#FFD700] mb-4 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            Kingdom Giveaways
          </h1>
          <p className="text-xl text-[#E2E8F0]/70 max-w-2xl mx-auto">
            Participate in our giveaways and win amazing rewards for your kingdom!
          </p>
        </div>

        {/* Active Giveaways */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
            Active Giveaways
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {giveaways.filter(g => g.status === 'active').map((giveaway) => (
              <div key={giveaway.id} className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-6 border-2 border-[#C5A059]/30 hover:border-[#FFD700]/50 transition-all shadow-lg group">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#C5A059]/20 flex items-center justify-center border-2 border-[#FFD700]/30 group-hover:scale-110 transition-transform">
                    <GiDiamondTrophy className="w-10 h-10 text-[#FFD700]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#FFD700] mb-2 text-center" style={{ fontFamily: 'Cinzel, serif' }}>
                  {giveaway.title}
                </h3>
                <p className="text-[#E2E8F0]/70 text-sm text-center mb-4">{giveaway.description}</p>

                {/* Prize */}
                <div className="bg-[#0F172A]/60 rounded-lg p-3 mb-4 border border-[#FFD700]/20">
                  <div className="flex items-center justify-center">
                    <GiTrophyCup className="w-5 h-5 text-[#FFD700] mr-2" />
                    <span className="text-[#FFD700] font-bold text-sm">{giveaway.prize}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-[#E2E8F0] text-sm">
                    <div className="flex items-center">
                      <MdPeople className="w-4 h-4 mr-2 text-[#C5A059]" />
                      <span>Entries</span>
                    </div>
                    <span className="font-bold">{giveaway.entries.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#E2E8F0] text-sm">
                    <div className="flex items-center">
                      <MdTimer className="w-4 h-4 mr-2 text-[#C5A059]" />
                      <span>Ends in</span>
                    </div>
                    <span className="font-bold text-[#FFD700]">{giveaway.endsIn}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-[#0F172A]/60 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#FFD700] to-[#C5A059] h-full rounded-full transition-all"
                      style={{ width: `${(giveaway.entries / giveaway.maxEntries) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-[#E2E8F0]/60 mt-1 text-center">
                    {Math.round((giveaway.entries / giveaway.maxEntries) * 100)}% full
                  </p>
                </div>

                {/* Requirements */}
                <p className="text-xs text-[#E2E8F0]/60 text-center mb-4 italic">
                  {giveaway.requirements}
                </p>

                {/* Enter Button */}
                <button className="w-full bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all">
                  Enter Giveaway
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Winners */}
        <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-8 border-2 border-[#C5A059]/30 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <GiPartyPopper className="w-10 h-10 text-[#FFD700] mr-3" />
            <h2 className="text-3xl font-bold text-[#FFD700]" style={{ fontFamily: 'Cinzel, serif' }}>
              Recent Winners
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {recentWinners.map((winner, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-[#0F172A]/60 rounded-lg border border-[#C5A059]/20 hover:border-[#FFD700]/30 transition-all">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] flex items-center justify-center mr-3">
                    <FiUser className="w-5 h-5 text-[#0F172A]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#E2E8F0]">{winner.name}</p>
                    <p className="text-sm text-[#E2E8F0]/60">{winner.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#FFD700] text-sm">{winner.prize}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Participate */}
        <div className="mt-12 bg-gradient-to-r from-[#1E293B]/80 to-[#0F172A]/80 backdrop-blur-md rounded-xl p-8 border-2 border-[#C5A059]/30">
          <h3 className="text-2xl font-bold text-[#FFD700] mb-4 text-center" style={{ fontFamily: 'Cinzel, serif' }}>
            How to Participate
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 border-2 border-[#FFD700] flex items-center justify-center mx-auto mb-3">
                <span className="text-[#FFD700] font-bold text-xl">1</span>
              </div>
              <h4 className="font-bold text-[#E2E8F0] mb-2">Choose Giveaway</h4>
              <p className="text-[#E2E8F0]/70 text-sm">Select a giveaway you want to enter</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 border-2 border-[#FFD700] flex items-center justify-center mx-auto mb-3">
                <span className="text-[#FFD700] font-bold text-xl">2</span>
              </div>
              <h4 className="font-bold text-[#E2E8F0] mb-2">Click Enter</h4>
              <p className="text-[#E2E8F0]/70 text-sm">Submit your entry with one click</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 border-2 border-[#FFD700] flex items-center justify-center mx-auto mb-3">
                <span className="text-[#FFD700] font-bold text-xl">3</span>
              </div>
              <h4 className="font-bold text-[#E2E8F0] mb-2">Wait for Results</h4>
              <p className="text-[#E2E8F0]/70 text-sm">Winners announced when giveaway ends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Giveaway;
