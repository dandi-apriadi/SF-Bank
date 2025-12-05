import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GiScrollUnfurled, GiQuillInk, GiCastle } from 'react-icons/gi';
import { MdSend, MdCheckCircle, GiAward } from 'react-icons/md';
import { FiUser, FiMail, FiMessageSquare, FiCheck } from 'react-icons/fi';
import SacredLogo from '../../assets/img/sacred-forces-logo.png';

const Forms = () => {
  const [formType, setFormType] = useState('application');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gameId: '',
    email: '',
    alliance: '',
    power: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] pt-24 pb-32 overflow-hidden">
      {/* Optimized Static Background - Better Performance */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Simple SVG Pattern - No Blur Filter */}
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="forms-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#forms-grad)" opacity="0.08" />
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

      <div className="relative max-w-5xl mx-auto px-6 z-10">
        {/* Hero Section - Enhanced */}
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
            <div className="relative w-32 h-32 rounded-full flex items-center justify-center">
              <img src={SacredLogo} alt="Sacred Forces" className="w-32 h-32 rounded-full object-contain drop-shadow-2xl filter brightness-125" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-6xl font-bold text-[#FFD700] mb-4 tracking-wider uppercase" 
            style={{ fontFamily: 'Cinzel, serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Kingdom Forms
          </motion.h1>
          <motion.p 
            className="text-xl text-[#E2E8F0]/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Join our community and become part of Sacred3946
          </motion.p>
        </motion.div>

        {/* Form Type Selection - Enhanced Tabs */}
        <motion.div 
          className="flex justify-center gap-4 mb-12 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {[
            { id: 'application', label: 'Member Application', icon: '⚔️' },
            { id: 'alliance', label: 'Alliance Request', icon: '🛡️' },
            { id: 'feedback', label: 'Feedback', icon: '💭' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setFormType(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative px-8 py-4 rounded-xl font-bold tracking-wide transition-all border-2 flex items-center gap-2 ${
                formType === tab.id
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] border-[#FFD700] shadow-lg shadow-[#FFD700]/50'
                  : 'bg-[#1E293B]/60 text-[#E2E8F0] border-[#C5A059]/30 hover:border-[#FFD700]/60 hover:bg-[#1E293B]/80'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
              {formType === tab.id && (
                <motion.div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  layoutId="activeTab"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: submitted ? 1 : 0, y: submitted ? 0 : -20 }}
          transition={{ duration: 0.3 }}
          className={`mb-6 rounded-xl p-5 flex items-center justify-center border-2 backdrop-blur-md ${
            submitted
              ? 'bg-green-500/20 border-green-500/50'
              : 'pointer-events-none'
          }`}
        >
          <motion.div
            animate={{ scale: [0.8, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            <MdCheckCircle className="w-6 h-6 text-green-400 mr-3" />
          </motion.div>
          <span className="text-green-400 font-bold">✓ Form submitted successfully!</span>
        </motion.div>

        {/* Form Container - Enhanced */}
        <motion.div
          key={formType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-[#1E293B]/90 to-[#0F172A]/80 backdrop-blur-md rounded-2xl p-10 border-2 border-[#C5A059]/40 shadow-2xl overflow-hidden"
        >
          {/* Form header glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C5A059]/5 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

          {/* Form Header */}
          <motion.div 
            className="flex items-center mb-8 pb-6 border-b-2 border-[#FFD700]/30 relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-4xl mr-4"
            >
              {formType === 'application' && '⚔️'}
              {formType === 'alliance' && '🛡️'}
              {formType === 'feedback' && '💭'}
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-[#FFD700]" style={{ fontFamily: 'Cinzel, serif' }}>
                {formType === 'application' && 'Member Application'}
                {formType === 'alliance' && 'Alliance Request'}
                {formType === 'feedback' && 'Feedback & Suggestions'}
              </h2>
              <p className="text-[#E2E8F0]/70 text-sm mt-1">
                {formType === 'application' && 'Join Sacred3946 and fight alongside us!'}
                {formType === 'alliance' && 'Find your perfect alliance home'}
                {formType === 'feedback' && 'Your voice matters to us'}
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Form Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="flex text-[#E2E8F0] font-bold mb-3 items-center">
                  <FiUser className="w-4 h-4 mr-2 text-[#FFD700]" />
                  In-Game Name <span className="text-[#FF6B6B] ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F172A]/60 border-2 border-[#C5A059]/30 rounded-xl px-5 py-3 text-[#E2E8F0] placeholder-[#E2E8F0]/40 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                  placeholder="Enter your game name"
                />
              </motion.div>

              {/* Game ID Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block text-[#E2E8F0] font-bold mb-3">
                  Governor ID <span className="text-[#FF6B6B] ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="gameId"
                  value={formData.gameId}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F172A]/60 border-2 border-[#C5A059]/30 rounded-xl px-5 py-3 text-[#E2E8F0] placeholder-[#E2E8F0]/40 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                  placeholder="Your governor ID"
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="flex text-[#E2E8F0] font-bold mb-3 items-center">
                  <FiMail className="w-4 h-4 mr-2 text-[#FFD700]" />
                  Email <span className="text-[#E2E8F0]/50 ml-1">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0F172A]/60 border-2 border-[#C5A059]/30 rounded-xl px-5 py-3 text-[#E2E8F0] placeholder-[#E2E8F0]/40 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                  placeholder="your.email@example.com"
                />
              </motion.div>

              {/* Alliance Field - Conditional */}
              {formType === 'alliance' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <label className="block text-[#E2E8F0] font-bold mb-3">
                    Preferred Alliance <span className="text-[#FF6B6B] ml-1">*</span>
                  </label>
                  <select
                    name="alliance"
                    value={formData.alliance}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0F172A]/60 border-2 border-[#C5A059]/30 rounded-xl px-5 py-3 text-[#E2E8F0] focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                  >
                    <option value="">Select an alliance</option>
                    <option value="main">🛡️ Main Alliance - Sacred</option>
                    <option value="academy">📚 Academy - SacredA</option>
                    <option value="farm">🌾 Farm Alliance - SacredF</option>
                  </select>
                </motion.div>
              )}

              {/* Power Field - Conditional */}
              {formType !== 'feedback' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <label className="block text-[#E2E8F0] font-bold mb-3">
                    Total Power
                  </label>
                  <input
                    type="number"
                    name="power"
                    value={formData.power}
                    onChange={handleChange}
                    className="w-full bg-[#0F172A]/60 border-2 border-[#C5A059]/30 rounded-xl px-5 py-3 text-[#E2E8F0] placeholder-[#E2E8F0]/40 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                    placeholder="Your total power (e.g., 25000000)"
                  />
                </motion.div>
              )}
            </div>

            {/* Message Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="flex text-[#E2E8F0] font-bold mb-3 items-center">
                <FiMessageSquare className="w-4 h-4 mr-2 text-[#FFD700]" />
                {formType === 'feedback' ? 'Your Feedback' : 'Additional Information'}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="w-full bg-[#0F172A]/60 border-2 border-[#C5A059]/30 rounded-xl px-5 py-3 text-[#E2E8F0] placeholder-[#E2E8F0]/40 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all resize-none"
                placeholder={
                  formType === 'feedback' 
                    ? 'Share your suggestions, ideas, or concerns...' 
                    : 'Tell us more about yourself and why you want to join...'
                }
              ></textarea>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] font-bold py-4 rounded-xl hover:shadow-xl hover:shadow-[#FFD700]/40 transition-all flex items-center justify-center group text-lg"
            >
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <MdSend className="w-5 h-5 mr-2" />
              </motion.div>
              Submit Form
            </motion.button>
          </form>

          {/* Info Box */}
          <motion.div 
            className="mt-8 p-5 bg-[#0F172A]/60 rounded-xl border-2 border-[#FFD700]/30 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-[#E2E8F0]/80 text-sm flex items-start">
              <span className="text-[#FFD700] font-bold mr-3">ℹ️</span>
              <span>All applications will be reviewed by our leadership team. You will receive a response within 24-48 hours via in-game mail or email if provided.</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Requirements Box - Enhanced */}
        {formType === 'application' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12 relative bg-gradient-to-br from-[#1E293B]/90 to-[#0F172A]/80 backdrop-blur-md rounded-2xl p-8 border-2 border-[#FFD700]/40 shadow-xl overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C5A059]/5 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

            <motion.h3 
              className="text-3xl font-bold text-[#FFD700] mb-6 flex items-center relative z-10" 
              style={{ fontFamily: 'Cinzel, serif' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-4xl mr-3">✓</span>
              Membership Requirements
            </motion.h3>

            <div className="grid md:grid-cols-2 gap-4 relative z-10">
              {[
                { icon: '⚡', text: 'Active daily player with consistent login' },
                { icon: '💪', text: 'Minimum power: 10M (negotiable for active players)' },
                { icon: '🎯', text: 'Participate in kingdom events and KvK' },
                { icon: '💬', text: 'Discord or communication app required' },
                { icon: '🤝', text: 'Respectful behavior towards all members' },
                { icon: '🔄', text: 'Contributing to kingdom activities' }
              ].map((req, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 + idx * 0.05 }}
                  className="flex items-start p-4 bg-[#0F172A]/40 rounded-xl border border-[#FFD700]/20 hover:border-[#FFD700]/60 hover:bg-[#0F172A]/60 transition-all group"
                >
                  <span className="text-2xl mr-3 group-hover:scale-125 transition-transform">
                    {req.icon}
                  </span>
                  <span className="text-[#E2E8F0] font-medium group-hover:text-[#FFD700]/80 transition-colors">
                    {req.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Forms;
