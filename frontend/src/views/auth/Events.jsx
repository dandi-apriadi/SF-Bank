import React, { useState } from 'react';
import { MdEvent, MdPeople, MdTimer, MdEmojiEvents } from 'react-icons/md';
import { GiTrophyCup, GiPartyPopper } from 'react-icons/gi';
import { FiCalendar, FiClock } from 'react-icons/fi';

const Events = () => {
  const [filter, setFilter] = useState('all');

  const events = [
    {
      id: 1,
      title: "Kingdom Tournament",
      description: "Annual tournament to determine the strongest warriors",
      date: "December 20, 2025",
      time: "19:00 UTC",
      participants: 45,
      maxParticipants: 100,
      status: "upcoming",
      category: "tournament",
      rewards: "100,000 Gems + Legendary Equipment"
    },
    {
      id: 2,
      title: "Alliance War Event",
      description: "Team-based combat event for glory and rewards",
      date: "December 18, 2025",
      time: "20:00 UTC",
      participants: 89,
      maxParticipants: 150,
      status: "registration",
      category: "pvp",
      rewards: "50,000 Gems + Rare Resources"
    },
    {
      id: 3,
      title: "Kingdom Building Challenge",
      description: "Collaborative event to develop kingdom infrastructure",
      date: "December 25, 2025",
      time: "All Day",
      participants: 156,
      maxParticipants: 200,
      status: "upcoming",
      category: "cooperation",
      rewards: "Resource Packs + Speedups"
    },
    {
      id: 4,
      title: "Weekly Raid Boss",
      description: "Defeat the legendary dragon and claim epic rewards",
      date: "Every Friday",
      time: "21:00 UTC",
      participants: 78,
      maxParticipants: 100,
      status: "ongoing",
      category: "pve",
      rewards: "Legendary Gear + Dragon Tokens"
    }
  ];

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.status === filter);

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Upcoming' },
      registration: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', label: 'Registration Open' },
      ongoing: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Ongoing' },
      completed: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', label: 'Completed' }
    };
    const badge = badges[status];
    return (
      <span className={`px-4 py-1 rounded-full text-sm font-bold ${badge.bg} ${badge.text} border ${badge.border}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] flex items-center justify-center shadow-2xl border-4 border-[#FFD700]/30">
              <MdEvent className="w-12 h-12 text-[#0F172A]" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#FFD700] mb-4 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            Kingdom Events
          </h1>
          <p className="text-xl text-[#E2E8F0]/70 max-w-2xl mx-auto">
            Participate in epic events and tournaments to earn glory and legendary rewards!
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['all', 'upcoming', 'registration', 'ongoing'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-lg font-semibold tracking-wide transition-all border-2 ${
                filter === status
                  ? 'bg-[#FFD700] text-[#0F172A] border-[#FFD700]'
                  : 'bg-[#1E293B]/60 text-[#E2E8F0] border-[#C5A059]/30 hover:border-[#FFD700]/50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-6 border-2 border-[#C5A059]/30 hover:border-[#FFD700]/50 transition-all shadow-lg group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#FFD700] mb-2 group-hover:text-[#FFD700] transition-colors" style={{ fontFamily: 'Cinzel, serif' }}>
                    {event.title}
                  </h3>
                  <p className="text-[#E2E8F0]/70 text-sm">{event.description}</p>
                </div>
                {getStatusBadge(event.status)}
              </div>

              {/* Event Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-[#E2E8F0]">
                  <FiCalendar className="w-5 h-5 mr-3 text-[#C5A059]" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-[#E2E8F0]">
                  <FiClock className="w-5 h-5 mr-3 text-[#C5A059]" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-[#E2E8F0]">
                  <MdPeople className="w-5 h-5 mr-3 text-[#C5A059]" />
                  <span>Participants: {event.participants}/{event.maxParticipants}</span>
                </div>
              </div>

              {/* Rewards */}
              <div className="bg-[#0F172A]/60 rounded-lg p-4 mb-4 border border-[#C5A059]/20">
                <div className="flex items-center mb-2">
                  <GiTrophyCup className="w-5 h-5 text-[#FFD700] mr-2" />
                  <span className="font-bold text-[#FFD700]">Rewards</span>
                </div>
                <p className="text-[#E2E8F0] text-sm">{event.rewards}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-[#E2E8F0]/70 mb-2">
                  <span>Registration Progress</span>
                  <span>{Math.round((event.participants / event.maxParticipants) * 100)}%</span>
                </div>
                <div className="w-full bg-[#0F172A]/60 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#FFD700] to-[#C5A059] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all">
                {event.status === 'registration' ? 'Register Now' : 'View Details'}
              </button>
            </div>
          ))}
        </div>

        {/* No Events Message */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <GiPartyPopper className="w-16 h-16 text-[#C5A059] mx-auto mb-4" />
            <p className="text-xl text-[#E2E8F0]/70">No events found for this filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
