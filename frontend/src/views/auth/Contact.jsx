import React, { useState } from 'react';
import { FiMail, FiPhone, FiMessageCircle } from 'react-icons/fi';
import { GiScrollUnfurled } from 'react-icons/gi';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for backend integration
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] flex items-center justify-center shadow-2xl border-4 border-[#FFD700]/30">
              <GiScrollUnfurled className="w-12 h-12 text-[#0F172A]" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#FFD700] mb-4 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            Contact Leadership
          </h1>
          <p className="text-xl text-[#E2E8F0]/70 max-w-2xl mx-auto">
            Reach out for alliance requests, appeals, event inquiries, or feedback.
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-6 border-2 border-[#C5A059]/30 text-center">
            <FiMail className="w-12 h-12 text-[#FFD700] mx-auto mb-2" />
            <p className="text-[#E2E8F0] font-semibold">Discord: sacred3946</p>
            <p className="text-[#E2E8F0]/60 text-sm">Primary channel for announcements and support</p>
          </div>
          <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-6 border-2 border-[#C5A059]/30 text-center">
            <FiPhone className="w-12 h-12 text-[#FFD700] mx-auto mb-2" />
            <p className="text-[#E2E8F0] font-semibold">In-Game Mail</p>
            <p className="text-[#E2E8F0]/60 text-sm">Message R5 leadership for urgent matters</p>
          </div>
          <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl p-6 border-2 border-[#C5A059]/30 text-center">
            <FiMessageCircle className="w-12 h-12 text-[#FFD700] mx-auto mb-2" />
            <p className="text-[#E2E8F0] font-semibold">Feedback Form</p>
            <p className="text-[#E2E8F0]/60 text-sm">General suggestions and improvement ideas</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl border-2 border-[#C5A059]/30 p-8">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
            Send a Message
          </h2>
          {submitted && (
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#FFD700]/20 to-[#C5A059]/20 border border-[#FFD700]/40 text-[#E2E8F0]">
              Thank you! Your message has been sent. Leadership will respond via Discord or in-game mail.
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-[#E2E8F0]/70 mb-2">Your Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="bg-[#0F172A]/60 border border-[#C5A059]/30 rounded-lg px-4 py-3 text-[#E2E8F0] focus:border-[#FFD700]/50 focus:outline-none" required />
            </div>
            <div className="flex flex-col">
              <label className="text-[#E2E8F0]/70 mb-2">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="bg-[#0F172A]/60 border border-[#C5A059]/30 rounded-lg px-4 py-3 text-[#E2E8F0] focus:border-[#FFD700]/50 focus:outline-none" required />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label className="text-[#E2E8F0]/70 mb-2">Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} className="bg-[#0F172A]/60 border border-[#C5A059]/30 rounded-lg px-4 py-3 text-[#E2E8F0] focus:border-[#FFD700]/50 focus:outline-none" required />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label className="text-[#E2E8F0]/70 mb-2">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={5} className="bg-[#0F172A]/60 border border-[#C5A059]/30 rounded-lg px-4 py-3 text-[#E2E8F0] focus:border-[#FFD700]/50 focus:outline-none" required />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] font-bold px-8 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
