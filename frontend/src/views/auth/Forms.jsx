import React, { useState } from 'react';
import { GiScrollUnfurled, GiQuillInk } from 'react-icons/gi';
import { MdSend, MdCheckCircle } from 'react-icons/md';
import { FiUser, FiMail, FiMessageSquare } from 'react-icons/fi';

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
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] flex items-center justify-center shadow-2xl border-4 border-[#FFD700]/30">
              <GiScrollUnfurled className="w-12 h-12 text-[#0F172A]" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#FFD700] mb-4 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            Kingdom Forms
          </h1>
          <p className="text-xl text-[#E2E8F0]/70 max-w-2xl mx-auto">
            Submit your applications, feedback, or join our alliance
          </p>
        </div>

        {/* Form Type Selection */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setFormType('application')}
            className={`px-6 py-3 rounded-lg font-semibold tracking-wide transition-all border-2 ${
              formType === 'application'
                ? 'bg-[#FFD700] text-[#0F172A] border-[#FFD700]'
                : 'bg-[#1E293B]/60 text-[#E2E8F0] border-[#C5A059]/30 hover:border-[#FFD700]/50'
            }`}
          >
            Member Application
          </button>
          <button
            onClick={() => setFormType('alliance')}
            className={`px-6 py-3 rounded-lg font-semibold tracking-wide transition-all border-2 ${
              formType === 'alliance'
                ? 'bg-[#FFD700] text-[#0F172A] border-[#FFD700]'
                : 'bg-[#1E293B]/60 text-[#E2E8F0] border-[#C5A059]/30 hover:border-[#FFD700]/50'
            }`}
          >
            Alliance Request
          </button>
          <button
            onClick={() => setFormType('feedback')}
            className={`px-6 py-3 rounded-lg font-semibold tracking-wide transition-all border-2 ${
              formType === 'feedback'
                ? 'bg-[#FFD700] text-[#0F172A] border-[#FFD700]'
                : 'bg-[#1E293B]/60 text-[#E2E8F0] border-[#C5A059]/30 hover:border-[#FFD700]/50'
            }`}
          >
            Feedback
          </button>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="mb-6 bg-green-500/20 border-2 border-green-500/50 rounded-xl p-4 flex items-center justify-center animate-fade-in">
            <MdCheckCircle className="w-6 h-6 text-green-400 mr-3" />
            <span className="text-green-400 font-bold">Form submitted successfully!</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-8 border-2 border-[#C5A059]/30 shadow-lg">
          {/* Form Header */}
          <div className="flex items-center mb-6 pb-4 border-b-2 border-[#C5A059]/30">
            <GiQuillInk className="w-8 h-8 text-[#FFD700] mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-[#FFD700]" style={{ fontFamily: 'Cinzel, serif' }}>
                {formType === 'application' && 'Member Application Form'}
                {formType === 'alliance' && 'Alliance Request Form'}
                {formType === 'feedback' && 'Feedback & Suggestions'}
              </h2>
              <p className="text-[#E2E8F0]/70 text-sm">
                {formType === 'application' && 'Join Kingdom 3946 and fight with us!'}
                {formType === 'alliance' && 'Request to join one of our alliances'}
                {formType === 'feedback' && 'Share your thoughts with our leadership'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-[#E2E8F0] font-semibold mb-2">
                <FiUser className="inline w-4 h-4 mr-2 text-[#C5A059]" />
                In-Game Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#0F172A]/60 border-2 border-[#C5A059]/30 rounded-lg px-4 py-3 text-[#E2E8F0] placeholder-[#E2E8F0]/40 focus:border-[#FFD700] focus:outline-none transition-all"
                placeholder="Enter your game name"
              />
            </div>

            {/* Game ID Field */}
            <div>
              <label className="block text-[#E2E8F0] font-semibold mb-2">
                Governor ID *
              </label>
              <input
                type="text"
                name="gameId"
                value={formData.gameId}
                onChange={handleChange}
                required
                className="w-full bg-[#0F172A]/60 border-2 border-[#C5A059]/30 rounded-lg px-4 py-3 text-[#E2E8F0] placeholder-[#E2E8F0]/40 focus:border-[#FFD700] focus:outline-none transition-all"
                placeholder="Your governor ID"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[#E2E8F0] font-semibold mb-2">
                <FiMail className="inline w-4 h-4 mr-2 text-[#C5A059]" />
                Email (optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#0F172A]/60 border-2 border-[#C5A059]/30 rounded-lg px-4 py-3 text-[#E2E8F0] placeholder-[#E2E8F0]/40 focus:border-[#FFD700] focus:outline-none transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Conditional Fields */}
            {formType === 'alliance' && (
              <div>
                <label className="block text-[#E2E8F0] font-semibold mb-2">
                  Preferred Alliance
                </label>
                <select
                  name="alliance"
                  value={formData.alliance}
                  onChange={handleChange}
                  className="w-full bg-[#0F172A]/60 border-2 border-[#C5A059]/30 rounded-lg px-4 py-3 text-[#E2E8F0] focus:border-[#FFD700] focus:outline-none transition-all"
                >
                  <option value="">Select an alliance</option>
                  <option value="main">Main Alliance - 3946</option>
                  <option value="academy">Academy - 3946A</option>
                  <option value="farm">Farm Alliance - 3946F</option>
                </select>
              </div>
            )}

            {formType !== 'feedback' && (
              <div>
                <label className="block text-[#E2E8F0] font-semibold mb-2">
                  Total Power
                </label>
                <input
                  type="number"
                  name="power"
                  value={formData.power}
                  onChange={handleChange}
                  className="w-full bg-[#0F172A]/60 border-2 border-[#C5A059]/30 rounded-lg px-4 py-3 text-[#E2E8F0] placeholder-[#E2E8F0]/40 focus:border-[#FFD700] focus:outline-none transition-all"
                  placeholder="Your total power (e.g., 25000000)"
                />
              </div>
            )}

            {/* Message Field */}
            <div>
              <label className="block text-[#E2E8F0] font-semibold mb-2">
                <FiMessageSquare className="inline w-4 h-4 mr-2 text-[#C5A059]" />
                {formType === 'feedback' ? 'Your Feedback' : 'Additional Information'}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full bg-[#0F172A]/60 border-2 border-[#C5A059]/30 rounded-lg px-4 py-3 text-[#E2E8F0] placeholder-[#E2E8F0]/40 focus:border-[#FFD700] focus:outline-none transition-all resize-none"
                placeholder={
                  formType === 'feedback' 
                    ? 'Share your suggestions, ideas, or concerns...' 
                    : 'Tell us more about yourself and why you want to join...'
                }
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] font-bold py-4 rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all flex items-center justify-center group"
            >
              <MdSend className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              Submit Form
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-[#0F172A]/40 rounded-lg border border-[#C5A059]/20">
            <p className="text-[#E2E8F0]/70 text-sm">
              <span className="text-[#FFD700] font-bold">Note:</span> All applications will be reviewed by our leadership team. 
              You will receive a response within 24-48 hours via in-game mail or email if provided.
            </p>
          </div>
        </div>

        {/* Requirements Box */}
        {formType === 'application' && (
          <div className="mt-8 bg-gradient-to-r from-[#1E293B]/80 to-[#0F172A]/80 backdrop-blur-md rounded-xl p-6 border-2 border-[#C5A059]/30">
            <h3 className="text-xl font-bold text-[#FFD700] mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
              Membership Requirements
            </h3>
            <ul className="space-y-2 text-[#E2E8F0]">
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Active daily player with consistent login</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Minimum power: 10M (negotiable for active players)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Participate in kingdom events and KvK</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Discord or communication app required</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                <span>Respectful behavior towards all members</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forms;
