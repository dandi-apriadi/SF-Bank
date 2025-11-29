import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaRocket, FaUsers, FaAward, FaGlobe, FaHeart, FaLightbulb,
  FaCheckCircle, FaArrowRight, FaLinkedin, FaTwitter, FaGithub,
  FaChartLine, FaCog, FaShieldAlt, FaBullseye, FaEye
} from 'react-icons/fa';
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md';
import { BsCalendar, BsPeople, BsGlobe, BsAward } from 'react-icons/bs';

const About = () => {
  useEffect(() => {
    // Removed AOS initialization
  }, []);

  // Data statistik perusahaan
  const companyStats = [
    { number: "2020", label: "Tahun Didirikan", icon: <BsCalendar /> },
    { number: "50+", label: "Tim Professional", icon: <BsPeople /> },
    { number: "25+", label: "Negara Dilayani", icon: <BsGlobe /> },
    { number: "15+", label: "Penghargaan", icon: <BsAward /> }
  ];

  // Tim leadership
  const leadership = [
    {
      name: "Dr. Sarah Johnson",
      position: "Chief Executive Officer",
      bio: "15+ tahun pengalaman di bidang teknologi dan transformasi digital. Alumni MIT dengan expertise di AI dan machine learning.",
      image: "/avatars/avatar1.png",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah@prima.id"
      }
    },
    {
      name: "Ahmad Rizki",
      position: "Chief Technology Officer", 
      bio: "Expert software architect dengan pengalaman membangun platform scalable untuk millions users. Kontributor open source aktif.",
      image: "/avatars/avatar2.png",
      social: {
        linkedin: "#",
        github: "#",
        email: "ahmad@prima.id"
      }
    },
    {
      name: "Maria Santos",
      position: "Chief Product Officer",
      bio: "Product strategist berpengalaman dengan track record membangun produk yang loved by users. Background di design thinking dan UX research.",
      image: "/avatars/avatar3.png",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "maria@prima.id"
      }
    },
    {
      name: "David Chen",
      position: "Chief Marketing Officer",
      bio: "Growth hacker dengan expertise di digital marketing dan customer acquisition. Berhasil scaling multiple startups dari 0 to 100K users.",
      image: "/avatars/avatar4.png",
      social: {
        linkedin: "#",
        twitter: "#", 
        email: "david@prima.id"
      }
    }
  ];

  // Values perusahaan
  const companyValues = [
    {
      icon: <FaLightbulb className="w-8 h-8" />,
      title: "Innovation First",
      description: "Kami selalu mencari cara baru dan lebih baik untuk memecahkan masalah. Inovasi adalah DNA kami."
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Customer Obsession",
      description: "Kepuasan dan kesuksesan customer adalah prioritas utama dalam setiap keputusan yang kami buat."
    },
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: "Passion & Excellence",
      description: "Kami passionate terhadap apa yang kami kerjakan dan selalu berusaha memberikan hasil terbaik."
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Trust & Integrity",
      description: "Transparansi, kejujuran, dan kepercayaan adalah fondasi dari setiap hubungan yang kami bangun."
    },
    {
      icon: <FaGlobe className="w-8 h-8" />,
      title: "Global Mindset",
      description: "Kami berpikir global namun bertindak lokal, memahami kebutuhan unik setiap market."
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: "Growth Together",
      description: "Kesuksesan adalah perjalanan bersama. Kami tumbuh dengan tim, partner, dan customer."
    }
  ];

  // Timeline perusahaan
  const timeline = [
    {
      year: "2020",
      title: "Founding",
      description: "Prima didirikan dengan visi mempermudah transformasi digital untuk UMKM Indonesia.",
      milestone: "Seed funding $500K"
    },
    {
      year: "2021", 
      title: "Product Launch",
      description: "Launch MVP dengan 3 fitur inti. Onboarding 100 early adopters dalam 3 bulan pertama.",
      milestone: "100+ customers"
    },
    {
      year: "2022",
      title: "Series A",
      description: "Ekspansi tim dan pengembangan fitur advanced. Mulai eksplorasi market regional.",
      milestone: "Series A $2M"
    },
    {
      year: "2023",
      title: "Regional Expansion",
      description: "Ekspansi ke 5 negara ASEAN. Launch mobile apps dan desktop clients.",
      milestone: "10K+ users"
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Integrasi AI dan machine learning untuk automasi dan predictive analytics.",
      milestone: "AI-powered features"
    },
    {
      year: "2025",
      title: "Enterprise Focus",
      description: "Launch enterprise solutions dengan security dan compliance yang enhanced.",
      milestone: "Enterprise ready"
    }
  ];

  // Partner dan sertifikasi
  const partners = [
    { name: "AWS Partner", logo: "/img/partners/aws.png" },
    { name: "Google Cloud", logo: "/img/partners/gcp.png" },
    { name: "Microsoft Azure", logo: "/img/partners/azure.png" },
    { name: "Stripe", logo: "/img/partners/stripe.png" }
  ];

  const certifications = [
    "ISO 27001:2013",
    "SOC 2 Type II",
    "GDPR Compliant",
    "PCI DSS Level 1"
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
              <Link to="/auth/contact" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Tentang
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Prima
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
              Kami adalah tim passionate yang berkomitmen untuk memberdayakan bisnis Indonesia 
              melalui teknologi dan inovasi. Lahir dari visi untuk membuat transformasi digital 
              accessible untuk semua.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg text-blue-600 text-2xl">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FaBullseye className="text-blue-600 w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Misi Kami
                </h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Memberdayakan setiap bisnis di Indonesia untuk sukses di era digital melalui 
                platform teknologi yang powerful, mudah digunakan, dan terjangkau.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-500 w-5 h-5 mt-1" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Democratize akses ke teknologi enterprise untuk UMKM
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-500 w-5 h-5 mt-1" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Menyediakan tools yang mengakselerasi pertumbuhan bisnis
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-500 w-5 h-5 mt-1" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Membangun ekosistem digital yang sustainable
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <FaEye className="text-purple-600 w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Visi Kami
                </h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Menjadi platform teknologi #1 yang dipercaya untuk transformasi digital 
                bisnis di Asia Tenggara pada tahun 2030.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-500 w-5 h-5 mt-1" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Platform pilihan utama untuk digital transformation
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-500 w-5 h-5 mt-1" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Trusted by 1M+ businesses across Southeast Asia
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-500 w-5 h-5 mt-1" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Innovation leader dalam business technology
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Values yang Kami Pegang
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Prinsip-prinsip fundamental yang memandu setiap keputusan dan tindakan kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyValues.map((value, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="text-blue-600 mb-6 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tim Leadership
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Dipimpin oleh para expert dengan pengalaman puluhan tahun di industri teknologi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300"
              >
                <img 
                  src={leader.image} 
                  alt={leader.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-200 dark:border-blue-800"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {leader.name}
                </h3>
                <p className="text-blue-600 font-medium mb-4">
                  {leader.position}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                  {leader.bio}
                </p>
                <div className="flex justify-center space-x-3">
                  {leader.social.linkedin && (
                    <a href={leader.social.linkedin} className="text-blue-600 hover:text-blue-700 transition-colors">
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                  )}
                  {leader.social.twitter && (
                    <a href={leader.social.twitter} className="text-blue-400 hover:text-blue-500 transition-colors">
                      <FaTwitter className="w-5 h-5" />
                    </a>
                  )}
                  {leader.social.github && (
                    <a href={leader.social.github} className="text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                      <FaGithub className="w-5 h-5" />
                    </a>
                  )}
                  <a href={`mailto:${leader.social.email}`} className="text-red-500 hover:text-red-600 transition-colors">
                    <MdEmail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Perjalanan Prima
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Timeline milestone penting dalam perjalanan membangun Prima
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200 dark:bg-blue-800"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div 
                  key={index}
                  className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-full text-sm font-semibold">
                          {item.year}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {item.description}
                      </p>
                      <div className="text-sm font-semibold text-blue-600">
                        {item.milestone}
                      </div>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 z-10"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners & Certifications */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Partner & Sertifikasi
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Didukung oleh partner teknologi terkemuka dan tersertifikasi standar internasional
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Partners */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Technology Partners
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {partners.map((partner, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 flex items-center justify-center hover:shadow-lg transition-all duration-300"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mx-auto mb-3 flex items-center justify-center text-white text-lg font-bold">
                        {partner.name.charAt(0)}
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        {partner.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Security & Compliance
              </h3>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-4"
                  >
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <FaAward className="text-green-600 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {cert}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Certified & Compliant
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ingin Bergabung dengan Perjalanan Prima?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Kami selalu mencari talent terbaik untuk bergabung dengan tim kami. 
              Mari wujudkan visi transformasi digital Indonesia bersama-sama.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/auth/contact" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Hubungi Kami
                <FaArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/auth/careers"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 inline-flex items-center justify-center"
              >
                Lihat Posisi Terbuka
                <FaUsers className="ml-2 w-5 h-5" />
              </Link>
            </div>
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

export default About;

