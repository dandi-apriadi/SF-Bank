import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaRocket, FaArrowRight, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaClock, FaFacebook, FaTwitter, FaLinkedin, FaInstagram,
  FaWhatsapp, FaTelegram, FaDiscord, FaYoutube
} from 'react-icons/fa';
import { 
  MdEmail, MdPhone, MdLocationOn, MdAccessTime, MdSend,
  MdSupport, MdBusiness, MdQuestionAnswer, MdFeedback
} from 'react-icons/md';
import { 
  BsGeoAlt, BsTelephone, BsEnvelope, BsClock, BsChat,
  BsPerson, BsBuilding, BsQuestionCircle
} from 'react-icons/bs';
import { apiClient } from '../../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: 'general',
    message: '',
    budget: '',
    timeline: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // Removed AOS initialization
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // send to backend: POST /api/contact
      await apiClient.post('/api/contact', formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: 'general',
        message: '',
        budget: '',
        timeline: ''
      });
    } catch (err) {
      console.error('Contact submit failed', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact information
  const contactInfo = [
    {
      icon: <BsGeoAlt className="w-6 h-6" />,
      title: "Alamat Kantor",
      details: [
        "Jl. Teknologi Raya No. 123",
        "Gedung Prima Tower, Lantai 15",
        "Jakarta Selatan 12950",
        "Indonesia"
      ],
      color: "bg-blue-100 dark:bg-blue-900 text-blue-600"
    },
    {
      icon: <BsTelephone className="w-6 h-6" />,
      title: "Telepon",
      details: [
        "+62 21 1234 5678",
        "+62 812 3456 7890",
        "Toll Free: 0800-1-PRIMA"
      ],
      color: "bg-green-100 dark:bg-green-900 text-green-600"
    },
    {
      icon: <BsEnvelope className="w-6 h-6" />,
      title: "Email",
      details: [
        "hello@prima.id",
        "support@prima.id",
        "sales@prima.id",
        "careers@prima.id"
      ],
      color: "bg-purple-100 dark:bg-purple-900 text-purple-600"
    },
    {
      icon: <BsClock className="w-6 h-6" />,
      title: "Jam Operasional",
      details: [
        "Senin - Jumat: 09:00 - 18:00",
        "Sabtu: 09:00 - 15:00",
        "Minggu: Tutup",
        "Support 24/7 tersedia online"
      ],
      color: "bg-orange-100 dark:bg-orange-900 text-orange-600"
    }
  ];

  // Office locations
  const offices = [
    {
      city: "Jakarta",
      address: "Jl. Teknologi Raya No. 123, Jakarta Selatan 12950",
      phone: "+62 21 1234 5678",
      type: "Head Office",
      employees: "35+ staff"
    },
    {
      city: "Surabaya",
      address: "Jl. Innovation Hub No. 45, Surabaya 60292",
      phone: "+62 31 9876 5432",
      type: "Regional Office",
      employees: "12+ staff"
    },
    {
      city: "Bandung",
      address: "Jl. Creative District No. 78, Bandung 40132",
      phone: "+62 22 5555 4444",
      type: "Development Center",
      employees: "8+ developers"
    }
  ];

  // FAQ Section
  const faqs = [
    {
      question: "Bagaimana cara memulai menggunakan Prima?",
      answer: "Anda bisa memulai dengan mendaftar akun gratis di platform kami. Setelah registrasi, Anda akan mendapat akses trial 14 hari untuk mencoba semua fitur platform."
    },
    {
      question: "Apakah Prima aman untuk data bisnis saya?",
      answer: "Ya, Prima menggunakan enkripsi tingkat enterprise (AES-256) dan telah tersertifikasi ISO 27001 dan SOC 2 Type II. Data Anda disimpan di server yang aman dengan backup otomatis."
    },
    {
      question: "Bisakah Prima diintegrasikan dengan sistem yang sudah ada?",
      answer: "Tentu saja! Prima menyediakan API yang comprehensive dan mendukung 1000+ integrasi dengan tools populer seperti Slack, Trello, Google Workspace, dan banyak lagi."
    },
    {
      question: "Bagaimana sistem support Prima?",
      answer: "Kami menyediakan support 24/7 melalui chat, email, dan phone. Tim support kami terdiri dari technical expert yang siap membantu menyelesaikan setiap kendala Anda."
    },
    {
      question: "Apakah ada training untuk menggunakan Prima?",
      answer: "Ya, kami menyediakan onboarding session gratis, webinar rutin, documentation lengkap, dan video tutorial. Untuk enterprise customer, tersedia dedicated training session."
    }
  ];

  // Social media links
  const socialMedia = [
    { name: "Facebook", icon: <FaFacebook />, url: "#", color: "text-blue-600" },
    { name: "Twitter", icon: <FaTwitter />, url: "#", color: "text-blue-400" },
    { name: "LinkedIn", icon: <FaLinkedin />, url: "#", color: "text-blue-700" },
    { name: "Instagram", icon: <FaInstagram />, url: "#", color: "text-pink-600" },
    { name: "YouTube", icon: <FaYoutube />, url: "#", color: "text-red-600" },
    { name: "WhatsApp", icon: <FaWhatsapp />, url: "#", color: "text-green-500" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/auth/homepage" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FaRocket className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Prima</span>
            </Link>
            <div className="flex space-x-4">
              <Link to="/auth/homepage" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                Kembali ke Beranda
              </Link>
              <Link to="/auth/sign-in" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Hubungi
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Tim Prima
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
              Tim support dan sales kami siap membantu Anda 24/7. Mulai dari konsultasi gratis 
              hingga technical support, kami hadir untuk kesuksesan bisnis Anda.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="#contact-form"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center"
              >
                Kirim Pesan
                <MdSend className="ml-2 w-4 h-4" />
              </a>
              <a 
                href="tel:+622112345678"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 inline-flex items-center justify-center"
              >
                <FaPhone className="mr-2 w-4 h-4" />
                Telepon Langsung
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Options */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Cara Tercepat Menghubungi Kami
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Pilih metode komunikasi yang paling nyaman untuk Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className={`p-3 rounded-lg ${info.color} w-fit mb-4`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {info.title}
                </h3>
                <div className="space-y-2">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-600 dark:text-gray-300 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section id="contact-form" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Kirim Pesan Anda
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Isi form di bawah ini dan tim kami akan merespons dalam 24 jam kerja.
                </p>
                
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-700 dark:text-green-300">
                      ✅ Pesan Anda berhasil dikirim! Tim kami akan segera menghubungi Anda.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nama Lengkap *
                      </label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                        placeholder="Masukkan nama lengkap Anda"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                        placeholder="nama@perusahaan.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nama Perusahaan
                      </label>
                      <input 
                        type="text" 
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                        placeholder="PT. Nama Perusahaan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        No. Telepon
                      </label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                        placeholder="+62 812 3456 7890"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subjek Inquiry *
                    </label>
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                    >
                      <option value="general">Konsultasi Umum</option>
                      <option value="demo">Request Demo Produk</option>
                      <option value="product">Informasi Produk</option>
                      <option value="technical">Support Teknis</option>
                      <option value="partnership">Kemitraan</option>
                      <option value="career">Informasi Karier</option>
                      <option value="media">Media & Press</option>
                      <option value="feedback">Feedback & Saran</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Budget (Opsional)
                      </label>
                      <select 
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                      >
                        <option value="">Pilih Range Budget</option>
                        <option value="under-5jt">&lt; Rp 5 Juta</option>
                        <option value="5-15jt">Rp 5 - 15 Juta</option>
                        <option value="15-50jt">Rp 15 - 50 Juta</option>
                        <option value="over-50jt">&gt; Rp 50 Juta</option>
                        <option value="custom">Custom Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timeline
                      </label>
                      <select 
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                      >
                        <option value="">Kapan ingin memulai?</option>
                        <option value="asap">Segera (&lt; 1 bulan)</option>
                        <option value="1-3months">1 - 3 bulan</option>
                        <option value="3-6months">3 - 6 bulan</option>
                        <option value="over-6months">&gt; 6 bulan</option>
                        <option value="research">Masih riset</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pesan atau Pertanyaan *
                    </label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                      placeholder="Ceritakan lebih detail tentang kebutuhan Anda, tantangan yang dihadapi, atau pertanyaan spesifik tentang Prima..."
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Mengirim Pesan...
                      </>
                    ) : (
                      <>
                        Kirim Pesan
                        <FaArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information & Map */}
            <div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Informasi Kantor
                </h3>
                
                <div className="space-y-6">
                  {offices.map((office, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {office.city}
                        </h4>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 text-xs rounded-full">
                          {office.type}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                        📍 {office.address}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                        📞 {office.phone}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        👥 {office.employees}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Response Time
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <BsChat className="text-green-500 w-4 h-4" />
                        <span className="text-gray-600 dark:text-gray-300">Live Chat</span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">&lt; 5 menit</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <MdEmail className="text-blue-500 w-4 h-4" />
                        <span className="text-gray-600 dark:text-gray-300">Email</span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">&lt; 4 jam</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FaPhone className="text-orange-500 w-4 h-4" />
                        <span className="text-gray-600 dark:text-gray-300">Phone</span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">Langsung</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FaWhatsapp className="text-green-500 w-4 h-4" />
                        <span className="text-gray-600 dark:text-gray-300">WhatsApp</span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">&lt; 30 menit</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Ikuti Kami
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Dapatkan update terbaru, tips, dan insight melalui social media kami.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className={`text-2xl ${social.color} group-hover:scale-110 transition-transform mb-2`}>
                        {social.icon}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300 text-center">
                        {social.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Temukan jawaban untuk pertanyaan umum tentang Prima
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-start">
                  <BsQuestionCircle className="text-blue-500 w-5 h-5 mt-1 mr-3 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed ml-8">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Tidak menemukan jawaban yang Anda cari?
            </p>
            <a 
              href="#contact-form"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center"
            >
              Hubungi Support
              <FaArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FaRocket className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold">Prima</span>
          </div>
          <p className="text-gray-400">
            © 2025 Prima. Semua hak cipta dilindungi. | 
            <Link to="/auth/homepage" className="hover:text-white ml-2">Kembali ke Beranda</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;

