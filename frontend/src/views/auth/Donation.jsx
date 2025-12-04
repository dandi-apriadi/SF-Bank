import React, { useState } from 'react';
import { GiTwoCoins, GiTrophyCup, GiCrown } from 'react-icons/gi';
import { MdTrendingUp, MdPeople } from 'react-icons/md';
import { FiDollarSign, FiHeart } from 'react-icons/fi';

const Donation = () => {
  const [selectedTier, setSelectedTier] = useState(null);

  const donationTiers = [
    {
      id: 1,
      name: "Bronze Supporter",
      amount: "$5",
      icon: "🥉",
      benefits: ["Bronze Badge", "Special Chat Color", "Supporter Role"],
      color: "from-[#CD7F32] to-[#8B4513]"
    },
    {
      id: 2,
      name: "Silver Supporter",
      amount: "$10",
      icon: "🥈",
      benefits: ["Silver Badge", "Custom Avatar Frame", "Priority Support", "All Bronze Benefits"],
      color: "from-[#C0C0C0] to-[#808080]",
      popular: true
    },
    {
      id: 3,
      name: "Gold Supporter",
      amount: "$25",
      icon: "🥇",
      benefits: ["Gold Badge", "Exclusive Emotes", "VIP Channel Access", "All Silver Benefits"],
      color: "from-[#FFD700] to-[#C5A059]"
    },
    {
      id: 4,
      name: "Diamond Supporter",
      amount: "$50",
      icon: "💎",
      benefits: ["Diamond Badge", "Custom Role Name", "Kingdom Title", "Monthly Rewards", "All Gold Benefits"],
      color: "from-[#B9F2FF] to-[#00CED1]"
    }
  ];

  const topDonors = [
    { rank: 1, name: "Lord_Alpha", amount: "$500", badge: "💎", contributions: 25 },
    { rank: 2, name: "Commander_Beta", amount: "$350", badge: "💎", contributions: 18 },
    { rank: 3, name: "Knight_Gamma", amount: "$250", badge: "🥇", contributions: 15 },
    { rank: 4, name: "Warrior_Delta", amount: "$200", badge: "🥇", contributions: 12 },
    { rank: 5, name: "Duke_Epsilon", amount: "$150", badge: "🥈", contributions: 10 }
  ];

  const donationGoals = [
    { name: "Server Costs", current: 750, target: 1000, icon: "🖥️" },
    { name: "Event Prizes", current: 450, target: 800, icon: "🏆" },
    { name: "Community Tools", current: 300, target: 500, icon: "🛠️" }
  ];

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] flex items-center justify-center shadow-2xl border-4 border-[#FFD700]/30">
              <GiTwoCoins className="w-12 h-12 text-[#0F172A]" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#FFD700] mb-4 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            Support Kingdom 3946
          </h1>
          <p className="text-xl text-[#E2E8F0]/70 max-w-2xl mx-auto">
            Help us maintain and improve our kingdom community with your generous support
          </p>
        </div>

        {/* Donation Goals */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6 text-center" style={{ fontFamily: 'Cinzel, serif' }}>
            Current Goals
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {donationGoals.map((goal, index) => (
              <div key={index} className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-6 border-2 border-[#C5A059]/30 shadow-lg">
                <div className="text-center mb-4">
                  <span className="text-4xl mb-2 block">{goal.icon}</span>
                  <h3 className="text-xl font-bold text-[#E2E8F0]">{goal.name}</h3>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-[#E2E8F0]/70 mb-2">
                    <span>${goal.current}</span>
                    <span>${goal.target}</span>
                  </div>
                  <div className="w-full bg-[#0F172A]/60 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#FFD700] to-[#C5A059] h-full rounded-full transition-all"
                      style={{ width: `${(goal.current / goal.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-center text-[#FFD700] font-bold">
                  {Math.round((goal.current / goal.target) * 100)}% Complete
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Donation Tiers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6 text-center" style={{ fontFamily: 'Cinzel, serif' }}>
            Supporter Tiers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationTiers.map((tier) => (
              <div 
                key={tier.id} 
                className={`bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-6 border-2 ${
                  tier.popular ? 'border-[#FFD700] ring-2 ring-[#FFD700]/50' : 'border-[#C5A059]/30'
                } hover:border-[#FFD700]/50 transition-all shadow-lg relative group`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] px-4 py-1 rounded-full text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <span className="text-5xl mb-3 block">{tier.icon}</span>
                  <h3 className="text-xl font-bold text-[#FFD700] mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                    {tier.name}
                  </h3>
                  <div className={`text-4xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                    {tier.amount}
                  </div>
                  <p className="text-[#E2E8F0]/60 text-sm">per month</p>
                </div>

                <div className="space-y-2 mb-6">
                  {tier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start text-[#E2E8F0] text-sm">
                      <span className="text-[#FFD700] mr-2">✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full bg-gradient-to-r ${tier.color} text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all group-hover:scale-105`}>
                  Choose Tier
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-8 border-2 border-[#C5A059]/30 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <GiCrown className="w-10 h-10 text-[#FFD700] mr-3" />
            <h2 className="text-3xl font-bold text-[#FFD700]" style={{ fontFamily: 'Cinzel, serif' }}>
              Top Supporters
            </h2>
          </div>
          
          <div className="space-y-4">
            {topDonors.map((donor) => (
              <div key={donor.rank} className="flex items-center justify-between p-4 bg-[#0F172A]/60 rounded-lg border border-[#C5A059]/20 hover:border-[#FFD700]/30 transition-all">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4 ${
                    donor.rank === 1 ? 'bg-gradient-to-br from-[#FFD700] to-[#C5A059] text-[#0F172A] scale-110' :
                    donor.rank === 2 ? 'bg-gradient-to-br from-[#C0C0C0] to-[#808080] text-white' :
                    donor.rank === 3 ? 'bg-gradient-to-br from-[#CD7F32] to-[#8B4513] text-white' :
                    'bg-[#1E293B] text-[#E2E8F0]'
                  }`}>
                    {donor.rank === 1 && <GiCrown className="w-6 h-6" />}
                    {donor.rank > 1 && `#${donor.rank}`}
                  </div>
                  <div>
                    <p className="font-bold text-[#E2E8F0] flex items-center">
                      {donor.name}
                      <span className="ml-2 text-xl">{donor.badge}</span>
                    </p>
                    <p className="text-sm text-[#E2E8F0]/60">{donor.contributions} contributions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#FFD700] text-xl">{donor.amount}</p>
                  <p className="text-sm text-[#E2E8F0]/60">Total donated</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Donate Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/80 backdrop-blur-md rounded-xl p-6 border-2 border-[#C5A059]/30 text-center">
            <FiDollarSign className="w-12 h-12 text-[#FFD700] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#FFD700] mb-2">Server Costs</h3>
            <p className="text-[#E2E8F0]/70 text-sm">Help cover hosting and maintenance expenses</p>
          </div>
          <div className="bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/80 backdrop-blur-md rounded-xl p-6 border-2 border-[#C5A059]/30 text-center">
            <GiTrophyCup className="w-12 h-12 text-[#FFD700] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#FFD700] mb-2">Event Prizes</h3>
            <p className="text-[#E2E8F0]/70 text-sm">Fund exciting rewards for kingdom events</p>
          </div>
          <div className="bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/80 backdrop-blur-md rounded-xl p-6 border-2 border-[#C5A059]/30 text-center">
            <FiHeart className="w-12 h-12 text-[#FFD700] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#FFD700] mb-2">Community</h3>
            <p className="text-[#E2E8F0]/70 text-sm">Support tools and features for all members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
