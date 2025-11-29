import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaRocket, FaShieldAlt, FaUsers, FaCog, FaChartLine, FaGlobe,
  FaCheckCircle, FaMobile, FaDesktop, FaCloud, FaLightbulb, 
  FaArrowRight, FaPlay, FaDownload, FaCode, FaDatabase, FaLock
} from 'react-icons/fa';
import { 
  MdSecurity, MdSpeed, MdSupport, MdIntegrationInstructions,
  MdAnalytics, MdAutorenew, MdCloudSync, MdNotifications
} from 'react-icons/md';
import { 
  BsLightning, BsShield, BsGraph, BsPeople, BsGear, BsCloud
} from 'react-icons/bs';

const Features = () => {
  useEffect(() => {
    // Removed AOS initialization
  }, []);

  // Data fitur utama
  const mainFeatures = [
    {
      icon: <FaRocket className="w-12 h-12" />,
      title: "Performa Super Cepat",
      description: "Arsitektur cloud-native dengan teknologi terdepan memberikan kecepatan loading hingga 3x lebih cepat dibanding kompetitor.",
      benefits: [
        "Loading time < 2 detik",
        "Optimasi database otomatis",
        "CDN global terintegrasi",
        "Caching pintar"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaShieldAlt className="w-12 h-12" />,
      title: "Keamanan Enterprise",
      description: "Perlindungan berlapis dengan enkripsi end-to-end, monitoring 24/7, dan compliance standar internasional.",
      benefits: [
        "Enkripsi AES-256",
        "Two-factor authentication",
        "Audit trail lengkap",
        "GDPR compliant"
      ],
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FaUsers className="w-12 h-12" />,
      title: "Kolaborasi Real-time",
      description: "Bekerja bersama tim secara real-time dengan fitur chat, video call, dan sharing dokumen yang terintegrasi.",
      benefits: [
        "Live collaboration",
        "Video conference HD",
        "Screen sharing",
        "Comment system"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <FaCog className="w-12 h-12" />,
      title: "Automasi Cerdas",
      description: "AI-powered automation yang mempelajari pola kerja Anda dan mengotomatisasi tugas-tugas berulang.",
      benefits: [
        "Workflow automation",
        "Smart notifications",
        "Auto-scheduling",
        "Predictive analytics"
      ],
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <FaChartLine className="w-12 h-12" />,
      title: "Analytics Mendalam",
      description: "Dashboard analitik komprehensif dengan real-time insights dan laporan yang dapat dikustomisasi.",
      benefits: [
        "Real-time dashboard",
        "Custom reports",
        "Predictive insights",
        "Data visualization"
      ],
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: <FaGlobe className="w-12 h-12" />,
      title: "Multi-platform Access",
      description: "Akses dari mana saja dengan dukungan web, mobile, dan desktop apps dengan sinkronisasi otomatis.",
      benefits: [
        "Web application",
        "Mobile apps (iOS/Android)",
        "Desktop clients",
        "Offline sync"
      ],
      color: "from-teal-500 to-teal-600"
    }
  ];

  // Fitur teknis detail
  const technicalFeatures = [
    {
      category: "Development",
      icon: <FaCode className="w-8 h-8" />,
      features: [
        { name: "RESTful API", description: "API lengkap untuk integrasi custom" },
        { name: "Webhooks", description: "Real-time notifications untuk sistem eksternal" },
        { name: "SDK Multiple Languages", description: "Support JavaScript, Python, PHP, Java" },
        { name: "GraphQL Support", description: "Query data yang efisien dan fleksibel" }
      ]
    },
    {
      category: "Infrastructure",
      icon: <FaCloud className="w-8 h-8" />,
      features: [
        { name: "Auto-scaling", description: "Kapasitas yang menyesuaikan beban otomatis" },
        { name: "Load Balancing", description: "Distribusi beban untuk performa optimal" },
        { name: "Backup Otomatis", description: "Backup harian dengan retention 30 hari" },
        { name: "Disaster Recovery", description: "RTO < 4 jam, RPO < 1 jam" }
      ]
    },
    {
      category: "Security",
      icon: <FaLock className="w-8 h-8" />,
      features: [
        { name: "ISO 27001 Certified", description: "Standar keamanan informasi internasional" },
        { name: "SOC 2 Compliant", description: "Audit keamanan dan ketersediaan" },
        { name: "Penetration Testing", description: "Security testing berkala oleh expert" },
        { name: "RBAC", description: "Role-based access control granular" }
      ]
    },
    {
      category: "Integration",
      icon: <MdIntegrationInstructions className="w-8 h-8" />,
      features: [
        { name: "1000+ Integrations", description: "Koneksi dengan tools populer" },
        { name: "Zapier Support", description: "Automasi dengan 3000+ apps" },
        { name: "Custom Connectors", description: "Buat koneksi ke sistem internal" },
        { name: "Single Sign-On", description: "SSO dengan SAML, OAuth, LDAP" }
      ]
    }
  ];

  // Use cases
  const useCases = [
    {
      title: "Startup & UMKM",
      description: "Solusi lengkap untuk bisnis yang sedang berkembang",
      features: ["Setup cepat", "Solusi efisien", "Skalabilitas tinggi", "Support 24/7"],
      icon: <BsLightning className="w-8 h-8" />
    },
    {
      title: "Enterprise",
      description: "Platform enterprise dengan keamanan dan compliance tinggi",
      features: ["Custom deployment", "Dedicated support", "SLA guarantee", "White-label"],
      icon: <BsShield className="w-8 h-8" />
    },
    {
      title: "Agency & Konsultan",
      description: "Multi-tenant platform untuk mengelola multiple clients",
      features: ["Client management", "White-label branding", "Reporting tools", "Billing automation"],
      icon: <BsPeople className="w-8 h-8" />
    },
    {
      title: "Developer Team",
      description: "Tools lengkap untuk development dan deployment",
      features: ["Git integration", "CI/CD pipeline", "Testing tools", "Code collaboration"],
      icon: <BsGear className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation Bar - Simplified */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Fitur 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Powerful{" "}
              </span>
              untuk Bisnis Modern
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
              Jelajahi semua fitur canggih Prima yang dirancang khusus untuk mengakselerasi 
              pertumbuhan bisnis Anda dengan teknologi terdepan dan user experience yang luar biasa.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/auth/contact" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center"
              >
                Konsultasi Gratis
                <FaArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 inline-flex items-center justify-center">
                <FaPlay className="mr-2 w-4 h-4" />
                Demo Interaktif
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              6 Pilar Utama Prima
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Fitur-fitur inti yang membuat Prima menjadi pilihan utama ribuan perusahaan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center space-x-3">
                      <FaCheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Spesifikasi Teknis
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Detail teknis untuk developer dan IT professional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {technicalFeatures.map((category, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.category}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {category.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Solusi untuk Setiap Bisnis
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Prima dapat disesuaikan dengan kebutuhan berbagai jenis bisnis dan organisasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-blue-600 mb-4">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  {useCase.description}
                </p>
                <ul className="space-y-2">
                  {useCase.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Compatibility */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Akses dari Mana Saja
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Prima tersedia di semua platform dengan sinkronisasi real-time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6">
                <FaDesktop className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Web Application</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Akses langsung melalui browser tanpa instalasi. Support Chrome, Firefox, Safari, Edge.
              </p>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div>• Progressive Web App (PWA)</div>
                <div>• Offline capability</div>
                <div>• Cross-browser compatibility</div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6">
                <FaMobile className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mobile Apps</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Native apps untuk iOS dan Android dengan fitur push notifications dan offline sync.
              </p>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div>• iOS App Store</div>
                <div>• Google Play Store</div>
                <div>• Push notifications</div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6">
                <FaCloud className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Desktop Clients</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Desktop applications untuk Windows, macOS, dan Linux dengan performa optimal.
              </p>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div>• Windows 10/11</div>
                <div>• macOS 10.15+</div>
                <div>• Ubuntu 18.04+</div>
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
              Siap Merasakan Semua Fitur Prima?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Coba gratis selama 14 hari tanpa perlu kartu kredit. Akses penuh ke semua fitur platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/auth/contact" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Hubungi Kami
                <FaRocket className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/auth/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 inline-flex items-center justify-center"
              >
                Konsultasi Gratis
                <FaArrowRight className="ml-2 w-5 h-5" />
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

export default Features;

