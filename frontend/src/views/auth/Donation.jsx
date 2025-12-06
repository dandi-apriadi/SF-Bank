import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiHeart, 
  FiCopy, 
  FiCheckCircle,
  FiExternalLink 
} from 'react-icons/fi';
import { 
  GiTwoCoins,
  GiTrophyCup,
  GiCoinsPile,
  GiCrown
} from 'react-icons/gi';
import { 
  SiBitcoin, 
  SiEthereum,
  SiTether,
  SiBinance
} from 'react-icons/si';
import { 
  MdAccountBalance,
  MdCreditCard 
} from 'react-icons/md';
import SacredLogo from '../../assets/img/auth/animatedlogo.gif';

const Donation = () => {
  const [copiedAddress, setCopiedAddress] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('crypto');

  const cryptoAddresses = [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: SiBitcoin,
      color: '#F7931A',
      address: '1XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx',
      network: 'Bitcoin Network',
      qrCode: '/qr-codes/btc.png'
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      icon: SiEthereum,
      color: '#627EEA',
      address: '0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      network: 'Ethereum (ERC20)',
      qrCode: '/qr-codes/eth.png'
    },
    {
      id: 'usdt',
      name: 'Tether',
      symbol: 'USDT',
      icon: SiTether,
      color: '#26A17B',
      address: '0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      network: 'Ethereum (ERC20)',
      qrCode: '/qr-codes/usdt.png'
    },
    {
      id: 'bnb',
      name: 'Binance Coin',
      symbol: 'BNB',
      icon: SiBinance,
      color: '#F3BA2F',
      address: '0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      network: 'Binance Smart Chain (BEP20)',
      qrCode: '/qr-codes/bnb.png'
    }
  ];

  const bankingDetails = {
    bankName: '[BANK NAME - Development Mode]',
    accountName: '[ACCOUNT NAME - Development Mode]',
    accountNumber: 'XXXXXXXXXX',
    swiftCode: 'XXXXXXXXXX',
    iban: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
    routingNumber: 'XXXXXXXXX',
    address: '[BANK ADDRESS - Development Mode]'
  };

  const topDonors = [
    { rank: 1, name: 'Emperor', amount: '$5,000', icon: '👑' },
    { rank: 2, name: 'Warlord', amount: '$3,500', icon: '⚔️' },
    { rank: 3, name: 'General', amount: '$2,800', icon: '🛡️' },
    { rank: 4, name: 'Commander', amount: '$2,200', icon: '🏆' },
    { rank: 5, name: 'Strategist', amount: '$1,800', icon: '📜' }
  ];

  const handleCopy = (address, id) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(id);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] pt-24 pb-32 overflow-hidden">
      {/* Background Pattern (Same as Forms) */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="donation-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#donation-grad)" opacity="0.08" />
        </svg>

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

        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L45 15 L45 45 L30 60 L15 45 L15 15 Z' fill='none' stroke='%23FFD700' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        ></div>

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

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
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
          
          <h1 className="text-5xl md:text-7xl font-black text-[#FFD700] mb-6 tracking-wider uppercase drop-shadow-lg" style={{ fontFamily: 'Cinzel, serif' }}>
            Support Our Kingdom
          </h1>
          <p className="text-lg md:text-2xl text-[#E2E8F0]/90 max-w-3xl mx-auto leading-relaxed font-medium">
            Your donations help us maintain servers, organize events, and grow our community
          </p>
        </motion.div>

        {/* Method Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setSelectedMethod('crypto')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedMethod === 'crypto'
                ? 'bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] shadow-lg shadow-[#FFD700]/50'
                : 'bg-gradient-to-br from-[#1E293B]/90 to-[#0F172A]/80 text-[#E2E8F0] border-2 border-[#C5A059]/40'
            }`}
          >
            <GiTwoCoins className="inline w-6 h-6 mr-2" />
            Cryptocurrency
          </button>
          <button
            onClick={() => setSelectedMethod('banking')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedMethod === 'banking'
                ? 'bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] shadow-lg shadow-[#FFD700]/50'
                : 'bg-gradient-to-br from-[#1E293B]/90 to-[#0F172A]/80 text-[#E2E8F0] border-2 border-[#C5A059]/40'
            }`}
          >
            <MdAccountBalance className="inline w-6 h-6 mr-2" />
            International Banking
          </button>
        </motion.div>

        {/* Crypto Section */}
        {selectedMethod === 'crypto' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-[#FFD700] mb-8 text-center tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              Crypto Donations
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {cryptoAddresses.map((crypto) => {
                const Icon = crypto.icon;
                return (
                  <motion.div
                    key={crypto.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-[#1E293B]/95 to-[#0F172A]/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-[#C5A059]/40 shadow-xl"
                  >
                    <div className="flex items-center mb-6">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
                        style={{ backgroundColor: `${crypto.color}20` }}
                      >
                        <Icon className="w-10 h-10" style={{ color: crypto.color }} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white">{crypto.name}</h3>
                        <p className="text-[#E2E8F0]/70 font-semibold">{crypto.network}</p>
                      </div>
                    </div>

                    <div className="bg-[#0F172A] rounded-xl p-4 mb-4 border border-[#C5A059]/30">
                      <p className="text-xs font-bold text-[#C5A059] mb-2 uppercase tracking-wide">Wallet Address</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-white font-mono break-all mr-2">{crypto.address}</p>
                        <button
                          onClick={() => handleCopy(crypto.address, crypto.id)}
                          className="flex-shrink-0 p-2 hover:bg-[#1E293B] rounded-lg transition-all"
                        >
                          {copiedAddress === crypto.id ? (
                            <FiCheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <FiCopy className="w-5 h-5 text-[#FFD700]" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="inline-flex items-center text-xs text-[#E2E8F0]/70 font-medium">
                        <FiExternalLink className="w-4 h-4 mr-1" />
                        Scan QR code or copy address
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Banking Section */}
        {selectedMethod === 'banking' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-[#FFD700] mb-8 text-center tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              International Banking
            </h2>
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#1E293B]/95 to-[#0F172A]/90 backdrop-blur-xl rounded-3xl p-10 border-2 border-[#C5A059]/40 shadow-2xl">
              <div className="flex items-center justify-center mb-8">
                <MdCreditCard className="w-16 h-16 text-[#FFD700]" />
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Bank Name', value: bankingDetails.bankName },
                  { label: 'Account Name', value: bankingDetails.accountName },
                  { label: 'Account Number', value: bankingDetails.accountNumber },
                  { label: 'SWIFT Code', value: bankingDetails.swiftCode },
                  { label: 'IBAN', value: bankingDetails.iban },
                  { label: 'Routing Number', value: bankingDetails.routingNumber },
                  { label: 'Bank Address', value: bankingDetails.address }
                ].map((detail, index) => (
                  <div key={index} className="bg-[#0F172A] rounded-xl p-4 border border-[#C5A059]/30">
                    <p className="text-xs font-bold text-[#C5A059] mb-2 uppercase tracking-wide">{detail.label}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-white">{detail.value}</p>
                      <button
                        onClick={() => handleCopy(detail.value, detail.label)}
                        className="flex-shrink-0 p-2 hover:bg-[#1E293B] rounded-lg transition-all"
                      >
                        {copiedAddress === detail.label ? (
                          <FiCheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <FiCopy className="w-5 h-5 text-[#FFD700]" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-[#FFD700]/10 rounded-xl border-2 border-[#FFD700]/30">
                <p className="text-sm text-[#E2E8F0]/90 text-center font-medium">
                  <FiHeart className="inline w-5 h-5 text-red-400 mr-2" />
                  Please include your in-game name in the transfer reference
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top Donors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#C5A059] rounded-2xl mb-6 shadow-2xl">
              <GiTrophyCup className="w-10 h-10 text-[#0F172A]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#FFD700] mb-4 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              Top Donors
            </h2>
            <p className="text-lg text-[#E2E8F0]/80 font-medium">
              Hall of Fame - Our generous supporters
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {topDonors.map((donor) => (
              <motion.div
                key={donor.rank}
                whileHover={{ y: -5, scale: 1.03 }}
                className={`bg-gradient-to-br from-[#1E293B]/95 to-[#0F172A]/90 backdrop-blur-xl rounded-2xl p-6 border-2 ${
                  donor.rank === 1 ? 'border-[#FFD700] shadow-xl shadow-[#FFD700]/30' :
                  donor.rank === 2 ? 'border-slate-300 shadow-lg' :
                  donor.rank === 3 ? 'border-[#CD7F32] shadow-lg' :
                  'border-[#C5A059]/40'
                }`}
              >
                {donor.rank <= 3 && (
                  <div className="absolute -top-3 -right-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-xl ${
                      donor.rank === 1 ? 'bg-gradient-to-br from-[#FFD700] to-[#C5A059] text-[#0F172A]' :
                      donor.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white' :
                      'bg-gradient-to-br from-[#CD7F32] to-[#8B4513] text-white'
                    }`}>
                      {donor.rank}
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-5xl mb-3">{donor.icon}</div>
                  {donor.rank > 3 && (
                    <div className="text-sm font-bold text-slate-400 mb-2">#{donor.rank}</div>
                  )}
                  <h3 className="text-lg font-black text-white mb-2">{donor.name}</h3>
                  <div className="text-2xl font-black text-[#FFD700]">{donor.amount}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#FFD700] via-[#C5A059] to-[#FFD700] rounded-3xl p-12 text-center shadow-2xl border-4 border-[#FFD700]/60"
        >
          <GiCoinsPile className="w-20 h-20 text-[#0F172A] mx-auto mb-6" />
          <h3 className="text-3xl md:text-5xl font-black text-[#0F172A] mb-6 uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            Every Donation Matters
          </h3>
          <p className="text-xl text-[#0F172A]/90 mb-8 max-w-2xl mx-auto font-semibold">
            Your support helps us create better experiences, host amazing events, and keep our community thriving. Thank you! 🙏
          </p>
          <div className="flex justify-center gap-4 text-[#0F172A]/80 text-sm font-bold">
            <span>✓ Secure Transactions</span>
            <span>✓ Transparent Usage</span>
            <span>✓ Community Recognition</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Donation;
