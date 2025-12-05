import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdGavel, MdWarning, MdInfo, MdCheckCircle } from 'react-icons/md';
import { GiScrollUnfurled, GiCastle, GiCrossedSwords, GiShield } from 'react-icons/gi';
import { FiChevronDown, FiChevronUp, FiAlertTriangle } from 'react-icons/fi';
import SacredLogo from '../../assets/img/sacred-forces-logo.png';

const Laws = () => {
  const [expandedSection, setExpandedSection] = useState('general');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const lawSections = [
    {
      id: 'general',
      title: 'General Kingdom Rules',
      icon: GiCastle,
      color: 'from-[#FFD700] to-[#C5A059]',
      rules: [
        {
          title: "Respect All Members",
          description: "Treat every kingdom member with respect. No harassment, hate speech, or discrimination will be tolerated.",
          severity: "critical"
        },
        {
          title: "English Primary Language",
          description: "Use English in kingdom chat for clear communication. Other languages allowed in private alliances.",
          severity: "medium"
        },
        {
          title: "Active Participation Required",
          description: "Members must be active at least 3 days per week. Notify leadership of extended absences.",
          severity: "medium"
        },
        {
          title: "Follow Chain of Command",
          description: "Respect leadership hierarchy. Questions or concerns should go through proper channels.",
          severity: "low"
        }
      ]
    },
    {
      id: 'kvk',
      title: 'KvK Battle Regulations',
      icon: GiCrossedSwords,
      color: 'from-[#880808] to-[#CC0000]',
      rules: [
        {
          title: "Mandatory KvK Participation",
          description: "All members must participate in Kingdom vs Kingdom battles unless excused by leadership.",
          severity: "critical"
        },
        {
          title: "Follow Battle Strategies",
          description: "Adhere to assigned strategies and targets. Do not engage in unauthorized attacks.",
          severity: "critical"
        },
        {
          title: "Report KvK Scores Daily",
          description: "Submit your KvK points through designated channels daily during active seasons.",
          severity: "medium"
        },
        {
          title: "No Individual Glory Hunting",
          description: "Focus on kingdom objectives, not personal killpoints. Team success over individual stats.",
          severity: "medium"
        }
      ]
    },
    {
      id: 'alliance',
      title: 'Alliance Conduct',
      icon: GiShield,
      color: 'from-[#4169E1] to-[#1E90FF]',
      rules: [
        {
          title: "Support Your Alliance",
          description: "Help alliance members with resources, reinforcements, and coordination.",
          severity: "medium"
        },
        {
          title: "Donation Requirements",
          description: "Meet minimum alliance donation requirements monthly. Contribute to alliance growth.",
          severity: "medium"
        },
        {
          title: "No Alliance Hopping",
          description: "Switching alliances requires leadership approval. Frequent changes may result in removal.",
          severity: "medium"
        },
        {
          title: "Represent Kingdom Positively",
          description: "Your behavior reflects on the entire kingdom. Maintain good reputation in all interactions.",
          severity: "low"
        }
      ]
    },
    {
      id: 'resources',
      title: 'Resource & Trading Rules',
      icon: GiScrollUnfurled,
      color: 'from-[#32CD32] to-[#228B22]',
      rules: [
        {
          title: "Fair Resource Distribution",
          description: "Resources from kingdom events distributed based on participation and need.",
          severity: "medium"
        },
        {
          title: "No Resource Hoarding",
          description: "Share excess resources with alliance members who need them.",
          severity: "low"
        },
        {
          title: "Trading Restrictions",
          description: "All major trades must be logged with alliance leaders for transparency.",
          severity: "low"
        }
      ]
    }
  ];

  const punishmentGuidelines = [
    { offense: "First Minor Violation", action: "Verbal Warning", duration: "N/A" },
    { offense: "Second Minor Violation", action: "Written Warning + 3-day Ban", duration: "3 days" },
    { offense: "Major Violation", action: "7-day Ban + Rank Demotion", duration: "7 days" },
    { offense: "Critical Violation", action: "Permanent Ban", duration: "Permanent" },
    { offense: "Repeated Violations", action: "Permanent Ban + Blacklist", duration: "Permanent" }
  ];

  const faqs = [
    {
      question: "What happens if I need to take a break from the game?",
      answer: "Notify your alliance leader or kingdom leadership before extended absences. Breaks up to 2 weeks are generally acceptable with prior notice. Longer absences may result in removal to make space for active players, but you can rejoin when you return."
    },
    {
      question: "How do I report a rule violation?",
      answer: "Report violations to your alliance leader or kingdom R4/R5 through Discord private message. Include screenshots and detailed information. All reports are investigated confidentially."
    },
    {
      question: "Can I appeal a punishment?",
      answer: "Yes, appeals can be submitted through the official appeal form or by contacting R5 leadership. Appeals are reviewed within 48 hours. Provide detailed explanation and any evidence supporting your case."
    },
    {
      question: "What if someone from another kingdom attacks me?",
      answer: "Report external attacks to leadership immediately. Do not retaliate individually. Kingdom will coordinate an appropriate response through official channels to maintain diplomacy."
    },
    {
      question: "Are there rules about spending money in the game?",
      answer: "No spending requirements. Kingdom welcomes both F2P and P2W players equally. However, all members must contribute through participation and activity, regardless of spending level."
    },
    {
      question: "How are leadership positions selected?",
      answer: "Leadership positions based on activity, contribution, experience, and community trust. R4 positions may open periodically with applications reviewed by R5 council. Favoritism is strictly prohibited."
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'text-[#880808]';
      case 'medium': return 'text-[#FFD700]';
      case 'low': return 'text-[#4169E1]';
      default: return 'text-[#E2E8F0]';
    }
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'critical': return <MdWarning className="w-5 h-5" />;
      case 'medium': return <MdInfo className="w-5 h-5" />;
      case 'low': return <MdCheckCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] overflow-hidden">
      {/* Modern Creative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="laws-blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
            </filter>
            <linearGradient id="laws-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#laws-grad)" opacity="0.1" />
          <path d="M0,60 Q250,10 500,60 T1000,60" stroke="#FFD700" strokeWidth="2" fill="none" opacity="0.25" filter="url(#laws-blur)" />
          <path d="M0,180 Q300,130 600,180 T1200,180" stroke="#C5A059" strokeWidth="2" fill="none" opacity="0.2" filter="url(#laws-blur)" />
          <path d="M0,300 Q200,250 400,300 T800,300" stroke="#FFD700" strokeWidth="2" fill="none" opacity="0.15" filter="url(#laws-blur)" />
        </svg>

        <motion.div
          className="absolute top-[-15%] right-[-10%] w-[420px] h-[420px] rounded-full opacity-25 dark:opacity-15"
          style={{ background: 'radial-gradient(circle at 30% 30%, #FFD700, transparent)', filter: 'blur(90px)' }}
          animate={{ x: [0, 26, -16, 0], y: [0, -24, 16, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-18%] left-[-12%] w-[560px] h-[560px] rounded-full opacity-22 dark:opacity-12"
          style={{ background: 'radial-gradient(circle at 70% 70%, #C5A059, transparent)', filter: 'blur(110px)' }}
          animate={{ x: [0, -34, 20, 0], y: [0, 34, -22, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-[340px] h-[340px] rounded-full opacity-18 dark:opacity-10"
          style={{ background: 'radial-gradient(circle at 50% 50%, #FFD700, transparent)', filter: 'blur(85px)' }}
          animate={{ x: [0, 16, -22, 0], y: [0, 20, -16, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
        />

        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L45 15 L45 45 L30 60 L15 45 L15 15 Z' fill='none' stroke='%23FFD700' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        ></div>

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: '780px', height: '780px', borderRadius: '50%', border: '2px solid transparent', backgroundImage: 'conic-gradient(from 0deg, #FFD700, #C5A059, #FFD700)', opacity: 0.08, zIndex: 0 }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: '580px', height: '580px', borderRadius: '50%', border: '2px solid transparent', backgroundImage: 'conic-gradient(from 180deg, #C5A059, #FFD700, #C5A059)', opacity: 0.06, zIndex: 0 }}
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        />

        <motion.div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
          style={{ backgroundImage: `linear-gradient(90deg, transparent 0%, #FFD700 50%, transparent 100%)` }}
          animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-56 h-56 rounded-full flex items-center justify-center">
              <img src={SacredLogo} alt="Sacred Forces" className="w-56 h-56 rounded-full object-contain drop-shadow-2xl filter brightness-125" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#FFD700] mb-4 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            Kingdom Laws
          </h1>
          <p className="text-xl text-[#E2E8F0]/70 max-w-2xl mx-auto">
            Official rules, regulations, and code of conduct for Sacred3946
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-[#880808]/20 to-[#CC0000]/20 border-2 border-[#880808] rounded-xl p-6 mb-12 flex items-start">
          <FiAlertTriangle className="w-8 h-8 text-[#880808] mr-4 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-[#880808] mb-2">IMPORTANT</h3>
            <p className="text-[#E2E8F0]/80">
              All kingdom members are expected to read and follow these rules. Ignorance of the rules is not an excuse for violations. 
              By remaining in Sacred3946, you agree to abide by these regulations.
            </p>
          </div>
        </div>

        {/* Law Sections */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
            Code of Conduct
          </h2>
          <div className="space-y-4">
            {lawSections.map((section) => (
              <div key={section.id} className="bg-[#1E293B]/80  rounded-xl border-2 border-[#C5A059]/30 overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  className={`w-full flex items-center justify-between p-6 bg-gradient-to-r ${section.color} hover:opacity-90 transition-all`}
                >
                  <div className="flex items-center">
                    <section.icon className="w-8 h-8 text-[#0F172A] mr-4" />
                    <h3 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Cinzel, serif' }}>
                      {section.title}
                    </h3>
                  </div>
                  {expandedSection === section.id ? 
                    <FiChevronUp className="w-6 h-6 text-[#0F172A]" /> : 
                    <FiChevronDown className="w-6 h-6 text-[#0F172A]" />
                  }
                </button>
                
                {expandedSection === section.id && (
                  <div className="p-6 space-y-4">
                    {section.rules.map((rule, index) => (
                      <div key={index} className="bg-[#0F172A]/60 rounded-lg p-5 border border-[#C5A059]/20">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-bold text-[#E2E8F0] flex-1">
                            {rule.title}
                          </h4>
                          <div className={`flex items-center ${getSeverityColor(rule.severity)} ml-4`}>
                            {getSeverityIcon(rule.severity)}
                          </div>
                        </div>
                        <p className="text-[#E2E8F0]/70">
                          {rule.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Punishment Guidelines */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
            Punishment Guidelines
          </h2>
          <div className="bg-[#1E293B]/80  rounded-xl border-2 border-[#C5A059]/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#FFD700] to-[#C5A059]">
                    <th className="px-6 py-4 text-left text-[#0F172A] font-bold">Offense Level</th>
                    <th className="px-6 py-4 text-left text-[#0F172A] font-bold">Disciplinary Action</th>
                    <th className="px-6 py-4 text-left text-[#0F172A] font-bold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {punishmentGuidelines.map((item, index) => (
                    <tr key={index} className="border-b border-[#C5A059]/20 hover:bg-[#0F172A]/40 transition-colors">
                      <td className="px-6 py-4 text-[#E2E8F0] font-semibold">{item.offense}</td>
                      <td className="px-6 py-4 text-[#E2E8F0]">{item.action}</td>
                      <td className="px-6 py-4 text-[#FFD700]">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-[#E2E8F0]/60 text-sm mt-4 text-center">
            * Leadership reserves the right to adjust punishments based on specific circumstances and severity
          </p>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#1E293B]/80  rounded-xl border-2 border-[#C5A059]/30 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 hover:bg-[#0F172A]/40 transition-all text-left"
                >
                  <h3 className="text-lg font-bold text-[#E2E8F0] pr-4">
                    {faq.question}
                  </h3>
                  {expandedFaq === index ? 
                    <FiChevronUp className="w-5 h-5 text-[#FFD700] flex-shrink-0" /> : 
                    <FiChevronDown className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
                  }
                </button>
                {expandedFaq === index && (
                  <div className="px-5 pb-5 pt-2 bg-[#0F172A]/40">
                    <p className="text-[#E2E8F0]/80">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/80  rounded-xl p-8 border-2 border-[#C5A059]/30 text-center">
          <MdInfo className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[#FFD700] mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
            Questions or Concerns?
          </h3>
          <p className="text-[#E2E8F0]/70 mb-6 max-w-2xl mx-auto">
            If you have questions about these rules or need clarification, please contact kingdom leadership through Discord or in-game messaging.
          </p>
          <button className="bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] font-bold px-8 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all">
            Contact Leadership
          </button>
        </div>
      </div>
    </div>
  );
};

export default Laws;
