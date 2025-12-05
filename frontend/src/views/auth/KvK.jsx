import React, { useState } from 'react';
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
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] flex items-center justify-center shadow-2xl border-4 border-[#FFD700]/30">
              <GiCrossedSwords className="w-12 h-12 text-[#0F172A]" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#FFD700] mb-4 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            Kingdom vs Kingdom
          </h1>
          <p className="text-xl text-[#E2E8F0]/70 max-w-2xl mx-auto">
            Epic battles between kingdoms. Prove your might and claim victory for Sacred3946!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 border-b-2 border-[#C5A059]/30">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-8 py-4 font-semibold tracking-wide transition-all ${
              activeTab === 'upcoming'
                ? 'text-[#FFD700] border-b-2 border-[#FFD700]'
                : 'text-[#E2E8F0]/60 hover:text-[#FFD700]'
            }`}
          >
            Upcoming KvK
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-8 py-4 font-semibold tracking-wide transition-all ${
              activeTab === 'history'
                ? 'text-[#FFD700] border-b-2 border-[#FFD700]'
                : 'text-[#E2E8F0]/60 hover:text-[#FFD700]'
            }`}
          >
            Battle History
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-8 py-4 font-semibold tracking-wide transition-all ${
              activeTab === 'leaderboard'
                ? 'text-[#FFD700] border-b-2 border-[#FFD700]'
                : 'text-[#E2E8F0]/60 hover:text-[#FFD700]'
            }`}
          >
            Leaderboard
          </button>
        </div>

        {/* Upcoming KvK Tab */}
        {activeTab === 'upcoming' && (
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingKvK.map((kvk) => (
              <div key={kvk.id} className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-6 border-2 border-[#C5A059]/30 hover:border-[#FFD700]/50 transition-all shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-[#FFD700]" style={{ fontFamily: 'Cinzel, serif' }}>
                    {kvk.season}
                  </h3>
                  <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                    kvk.status === 'Registration Open' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {kvk.status}
                  </span>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-[#E2E8F0]">
                    <MdCalendarToday className="w-5 h-5 mr-3 text-[#C5A059]" />
                    <span>{kvk.date}</span>
                  </div>
                  <div className="flex items-center text-[#E2E8F0]">
                    <GiSwordsPower className="w-5 h-5 mr-3 text-[#C5A059]" />
                    <span>Participants: {kvk.participants}/{kvk.maxParticipants}</span>
                  </div>
                </div>
                {kvk.status === 'Registration Open' && (
                  <button className="w-full bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all">
                    Register Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Battle History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {pastKvK.map((kvk) => (
              <div key={kvk.id} className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-6 border-2 border-[#C5A059]/30 hover:border-[#FFD700]/50 transition-all shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-[#FFD700] mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                      {kvk.season}
                    </h3>
                    <p className="text-[#E2E8F0]/70">{kvk.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end mb-2">
                      {kvk.rank === 1 && <GiCrown className="w-8 h-8 text-[#FFD700] mr-2" />}
                      <span className={`text-3xl font-bold ${kvk.rank === 1 ? 'text-[#FFD700]' : 'text-[#C5A059]'}`}>
                        #{kvk.rank}
                      </span>
                    </div>
                    <p className="text-[#E2E8F0]">Score: <span className="font-bold text-[#FFD700]">{kvk.score}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-8 border-2 border-[#C5A059]/30 shadow-lg">
            <div className="text-center mb-8">
              <GiTrophyCup className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-[#FFD700]" style={{ fontFamily: 'Cinzel, serif' }}>
                Hall of Fame
              </h2>
              <p className="text-[#E2E8F0]/70 mt-2">Top warriors of Sacred3946</p>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((rank) => (
                <div key={rank} className="flex items-center justify-between p-4 bg-[#0F172A]/60 rounded-lg border border-[#C5A059]/20 hover:border-[#FFD700]/30 transition-all">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 ${
                      rank === 1 ? 'bg-gradient-to-br from-[#FFD700] to-[#C5A059] text-[#0F172A]' :
                      rank === 2 ? 'bg-gradient-to-br from-[#C0C0C0] to-[#808080] text-white' :
                      rank === 3 ? 'bg-gradient-to-br from-[#CD7F32] to-[#8B4513] text-white' :
                      'bg-[#1E293B] text-[#E2E8F0]'
                    }`}>
                      #{rank}
                    </div>
                    <div>
                      <p className="font-bold text-[#E2E8F0]">Commander_{rank}</p>
                      <p className="text-sm text-[#E2E8F0]/60">Alliance Leader</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#FFD700]">{(1500000 - rank * 100000).toLocaleString()}</p>
                    <p className="text-sm text-[#E2E8F0]/60">Total Power</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KvK;
