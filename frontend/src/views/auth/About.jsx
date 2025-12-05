import React from 'react';
import { GiCastle, GiCrown, GiCrossedSwords, GiScrollUnfurled } from 'react-icons/gi';
import { FiUsers, FiTarget, FiShield } from 'react-icons/fi';

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
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] flex items-center justify-center shadow-2xl border-4 border-[#FFD700]/30">
              <GiCastle className="w-12 h-12 text-[#0F172A]" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#FFD700] mb-4 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            About Sacred3946
          </h1>
          <p className="text-xl text-[#E2E8F0]/70 max-w-2xl mx-auto">
            A medieval-themed community united by strategy, honor, and camaraderie.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {pillars.map((p, i) => (
            <div key={i} className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-6 border-2 border-[#C5A059]/30 text-center">
              <p.icon className="w-12 h-12 text-[#FFD700] mx-auto mb-3" />
              <h3 className="text-xl font-bold text-[#FFD700] mb-2" style={{ fontFamily: 'Cinzel, serif' }}>{p.title}</h3>
              <p className="text-[#E2E8F0]/70 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-8 border-2 border-[#C5A059]/30">
            <div className="flex items-center mb-4">
              <GiCrown className="w-8 h-8 text-[#FFD700] mr-3" />
              <h2 className="text-3xl font-bold text-[#FFD700]" style={{ fontFamily: 'Cinzel, serif' }}>Our Vision</h2>
            </div>
            <p className="text-[#E2E8F0]/80">To be the most respected and coordinated Rise of Kingdoms community, known for honor, strategy, and unforgettable battles.</p>
          </div>
          <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-8 border-2 border-[#C5A059]/30">
            <div className="flex items-center mb-4">
              <GiCrossedSwords className="w-8 h-8 text-[#FFD700] mr-3" />
              <h2 className="text-3xl font-bold text-[#FFD700]" style={{ fontFamily: 'Cinzel, serif' }}>Our Mission</h2>
            </div>
            <p className="text-[#E2E8F0]/80">Empower players through education, fair rules, and disciplined teamwork to achieve victory while fostering a friendly environment.</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <GiScrollUnfurled className="w-8 h-8 text-[#FFD700] mr-3" />
            <h2 className="text-3xl font-bold text-[#FFD700]" style={{ fontFamily: 'Cinzel, serif' }}>Kingdom Timeline</h2>
          </div>
          <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-6 border-2 border-[#C5A059]/30">
            <div className="grid md:grid-cols-3 gap-6">
              {timeline.map((t, i) => (
                <div key={i} className="p-4 bg-[#0F172A]/60 rounded-lg border border-[#C5A059]/20">
                  <p className="text-[#FFD700] font-bold text-lg">{t.year}</p>
                  <p className="text-[#E2E8F0] font-semibold">{t.title}</p>
                  <p className="text-[#E2E8F0]/70 text-sm">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing */}
        <div className="bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/80 backdrop-blur-md rounded-xl p-8 border-2 border-[#C5A059]/30 text-center">
          <h3 className="text-2xl font-bold text-[#FFD700] mb-3" style={{ fontFamily: 'Cinzel, serif' }}>Join Our Kingdom</h3>
          <p className="text-[#E2E8F0]/70 mb-6 max-w-2xl mx-auto">Ready to fight alongside honorable warriors? Explore events, join an alliance, and be part of our story.</p>
          <a href="#/auth/forms" className="bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] font-bold px-8 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all">Apply Now</a>
        </div>
      </div>
    </div>
  );
};

export default About;
