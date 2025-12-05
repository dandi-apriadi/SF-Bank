import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiCrown, GiShield, GiSwordsEmblem, GiCastle } from 'react-icons/gi';
import { MdArrowForward, MdCheckCircle } from 'react-icons/md';
import { FiUsers, FiMail, FiArrowRight } from 'react-icons/fi';

const JoinKingdom = () => {
  const steps = [
    {
      title: 'Apply to Join',
      desc: 'Submit your in-game details and preferred alliance so we can place you correctly.',
      icon: GiCrown,
    },
    {
      title: 'Review & Interview',
      desc: 'Leadership reviews your profile and may reach out for a quick chat on Discord.',
      icon: FiMail,
    },
    {
      title: 'Battle Ready',
      desc: 'Get assigned to an alliance, briefed on rules, and ready for KvK objectives.',
      icon: GiSwordsEmblem,
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] pt-24 pb-28 overflow-hidden">
      {/* Modern Creative Background (matches homepage features) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Mesh Gradient */}
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="join-blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
            </filter>
            <linearGradient id="join-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#join-grad)" opacity="0.1" />
          <path d="M0,60 Q250,10 500,60 T1000,60" stroke="#FFD700" strokeWidth="2" fill="none" opacity="0.25" filter="url(#join-blur)" />
          <path d="M0,180 Q300,130 600,180 T1200,180" stroke="#C5A059" strokeWidth="2" fill="none" opacity="0.2" filter="url(#join-blur)" />
          <path d="M0,300 Q200,250 400,300 T800,300" stroke="#FFD700" strokeWidth="2" fill="none" opacity="0.15" filter="url(#join-blur)" />
        </svg>

        {/* Flowing Blobs */}
        <motion.div
          className="absolute top-[-15%] right-[-10%] w-[480px] h-[480px] rounded-full opacity-25 dark:opacity-15"
          style={{ background: 'radial-gradient(circle at 30% 30%, #FFD700, transparent)', filter: 'blur(90px)' }}
          animate={{ x: [0, 28, -18, 0], y: [0, -26, 18, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-18%] left-[-12%] w-[620px] h-[620px] rounded-full opacity-22 dark:opacity-12"
          style={{ background: 'radial-gradient(circle at 70% 70%, #C5A059, transparent)', filter: 'blur(110px)' }}
          animate={{ x: [0, -38, 22, 0], y: [0, 36, -24, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-[380px] h-[380px] rounded-full opacity-18 dark:opacity-10"
          style={{ background: 'radial-gradient(circle at 50% 50%, #FFD700, transparent)', filter: 'blur(85px)' }}
          animate={{ x: [0, 18, -26, 0], y: [0, 22, -18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
        />

        {/* Geometric Hexagon Overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L45 15 L45 45 L30 60 L15 45 L15 15 Z' fill='none' stroke='%23FFD700' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        ></div>

        {/* Rotating Gradient Rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: '880px', height: '880px', borderRadius: '50%', border: '2px solid transparent', backgroundImage: 'conic-gradient(from 0deg, #FFD700, #C5A059, #FFD700)', opacity: 0.08, zIndex: 0 }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: '660px', height: '660px', borderRadius: '50%', border: '2px solid transparent', backgroundImage: 'conic-gradient(from 180deg, #C5A059, #FFD700, #C5A059)', opacity: 0.06, zIndex: 0 }}
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 85, repeat: Infinity, ease: 'linear' }}
        />

        {/* Accent Lines */}
        <motion.div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
          style={{ backgroundImage: `linear-gradient(90deg, transparent 0%, #FFD700 50%, transparent 100%)` }}
          animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFD700]/90 via-[#C5A059]/80 to-[#FFD700]/90 p-10 md:p-14 shadow-2xl border border-white/40 dark:border-[#FFD700]/25">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0F172A 1px, transparent 0)', backgroundSize: '18px 18px' }} />
          <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-[#0F172A]/20 blur-3xl" />

          <div className="relative z-10 grid md:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0F172A]/80">Sacred3946 Alliance</p>
              <h1 className="text-3xl md:text-5xl font-bold text-[#0F172A] mt-3 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                Join the Kingdom Forces
              </h1>
              <p className="text-[#0F172A]/80 text-lg leading-relaxed max-w-2xl">
                Become part of Sacred3946. Apply now, get vetted by leadership, and fight alongside elite commanders in our next KvK.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/auth/forms"
                  className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[#0F172A] text-[#FFD700] font-bold border-2 border-[#0F172A] shadow-lg hover:scale-[1.02] transition-transform"
                >
                  <GiShield className="w-6 h-6" />
                  <span>Apply Now</span>
                  <MdArrowForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/80 text-[#0F172A] font-semibold border border-white/60 shadow hover:-translate-y-1 transition-transform"
                >
                  <FiUsers className="w-5 h-5" />
                  Meet Us on Discord
                </a>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-[#0F172A]/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 dark:border-[#FFD700]/20 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-[#FFD700] flex items-center justify-center shadow-lg">
                  <GiCastle className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-200">Snapshot</p>
                  <h3 className="text-xl font-bold text-[#0F172A] dark:text-white">Sacred3946 Readiness</h3>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                <li className="flex items-start gap-2">
                  <MdCheckCircle className="mt-0.5 text-green-500" />
                  90% mobile-first commanders, optimized for quick response.
                </li>
                <li className="flex items-start gap-2">
                  <MdCheckCircle className="mt-0.5 text-green-500" />
                  Coordinated KvK strategies, role-based squads, and live calls.
                </li>
                <li className="flex items-start gap-2">
                  <MdCheckCircle className="mt-0.5 text-green-500" />
                  Donation, laws, and audit-ready tracking for transparency.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="group h-full rounded-2xl bg-white/80 dark:bg-[#0F172A]/70 backdrop-blur-lg border border-slate-200 dark:border-[#FFD700]/20 p-6 shadow-lg hover:-translate-y-2 transition-transform"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#C5A059] text-[#0F172A] mb-4 shadow">
                {React.createElement(step.icon, { className: 'w-6 h-6' })}
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                {idx + 1}. {step.title}
              </h4>
              <p className="text-slate-600 dark:text-blue-100/80 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Ready to march with Sacred3946?
          </h3>
          <p className="text-slate-600 dark:text-blue-100/80 max-w-2xl mx-auto mb-6">
            Start with the application form, then hop into our Discord for a quick hello. We will place you in the right alliance.
          </p>
          <Link
            to="/auth/forms"
            className="inline-flex items-center gap-3 px-7 py-3 rounded-xl bg-[#FFD700] text-[#0F172A] font-bold shadow-xl border border-[#FFD700]/60 hover:-translate-y-1 transition-transform"
          >
            <GiShield className="w-6 h-6" />
            Apply Now
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JoinKingdom;
