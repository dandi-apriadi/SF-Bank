import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaRocket, FaArrowRight, FaSave, FaUndo, FaEye, FaEyeSlash,
  FaPalette, FaAdjust, FaMoon, FaSun, FaCog, FaCheck, FaGraduationCap
} from 'react-icons/fa';
import { 
  MdSettings, MdColorLens, MdVisibility, MdBrightness6,
  MdMenu, MdClose, MdRefresh, MdSave, MdSchool, MdAssessment
} from 'react-icons/md';
import { FiBookOpen, FiUsers, FiAward } from 'react-icons/fi';

const NavbarSettings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    showIcons: true,
    compactMode: false,
    showSearch: true,
    logoStyle: 'gradient',
    navbarPosition: 'fixed',
    backgroundColor: 'white',
    textColor: 'dark',
    borderStyle: 'border',
    animation: 'slide'
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [savedSettings, setSavedSettings] = useState(null);

  useEffect(() => {
    // Removed AOS initialization

    // Load saved settings from localStorage
    const saved = localStorage.getItem('navbarSettings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings(parsedSettings);
        setSavedSettings(parsedSettings);
      } catch (error) {
        console.error('Error loading navbar settings:', error);
      }
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('navbarSettings', JSON.stringify(settings));
      setSavedSettings(settings);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Pengaturan berhasil disimpan!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving navbar settings:', error);
    }
  };

  const resetSettings = () => {
    const defaultSettings = {
      theme: 'light',
      showIcons: true,
      compactMode: false,
      showSearch: true,
      logoStyle: 'gradient',
      navbarPosition: 'fixed',
      backgroundColor: 'white',
      textColor: 'dark',
      borderStyle: 'border',
      animation: 'slide'
    };
    
    setSettings(defaultSettings);
  };

  const restoreSettings = () => {
    if (savedSettings) {
      setSettings(savedSettings);
    }
  };

  // Preview navbar styles
  const getNavbarClasses = () => {
    let classes = 'w-full z-50 transition-all duration-300 ';
    
    // Position
    classes += settings.navbarPosition === 'fixed' ? 'fixed top-0 ' : 'relative ';
    
    // Background
    switch (settings.backgroundColor) {
      case 'white':
        classes += 'bg-white/95 backdrop-blur-sm ';
        break;
      case 'dark':
        classes += 'bg-gray-900/95 backdrop-blur-sm ';
        break;
      case 'transparent':
        classes += 'bg-transparent ';
        break;
      case 'gradient':
        classes += 'bg-gradient-to-r from-blue-600 to-indigo-600 ';
        break;
      default:
        classes += 'bg-white/95 backdrop-blur-sm ';
    }
    
    // Border
    if (settings.borderStyle === 'border') {
      classes += 'border-b border-gray-200 ';
    } else if (settings.borderStyle === 'shadow') {
      classes += 'shadow-lg ';
    }
    
    return classes;
  };

  const getTextClasses = () => {
    if (settings.backgroundColor === 'gradient' || settings.backgroundColor === 'dark') {
      return 'text-white';
    }
    return settings.textColor === 'dark' ? 'text-gray-900' : 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Preview Navbar */}
      {previewMode && (
        <nav className={getNavbarClasses()}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex justify-between items-center ${settings.compactMode ? 'py-2' : 'py-4'}`}>
              <div className="flex items-center space-x-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  settings.logoStyle === 'gradient' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                    : 'bg-blue-600'
                }`}>
                  <MdSchool className="text-white w-5 h-5" />
                </div>
                <span className={`text-2xl font-bold ${getTextClasses()}`}>PRIMA</span>
              </div>
              
              <div className="hidden md:flex space-x-8">
                {settings.showIcons && (
                  <>
                    <a href="#" className={`${getTextClasses()} hover:text-blue-600 transition-colors flex items-center space-x-1`}>
                      <FiBookOpen className="w-4 h-4" />
                      <span>Dosen</span>
                    </a>
                    <a href="#" className={`${getTextClasses()} hover:text-blue-600 transition-colors flex items-center space-x-1`}>
                      <FiUsers className="w-4 h-4" />
                      <span>Koordinator</span>
                    </a>
                    <a href="#" className={`${getTextClasses()} hover:text-blue-600 transition-colors flex items-center space-x-1`}>
                      <MdAssessment className="w-4 h-4" />
                      <span>PPMPP</span>
                    </a>
                    <a href="#" className={`${getTextClasses()} hover:text-blue-600 transition-colors flex items-center space-x-1`}>
                      <FiAward className="w-4 h-4" />
                      <span>Pimpinan</span>
                    </a>
                  </>
                )}
                {!settings.showIcons && (
                  <>
                    <a href="#" className={`${getTextClasses()} hover:text-blue-600 transition-colors`}>Dosen</a>
                    <a href="#" className={`${getTextClasses()} hover:text-blue-600 transition-colors`}>Koordinator</a>
                    <a href="#" className={`${getTextClasses()} hover:text-blue-600 transition-colors`}>PPMPP</a>
                    <a href="#" className={`${getTextClasses()} hover:text-blue-600 transition-colors`}>Pimpinan</a>
                  </>
                )}
              </div>
              
              <div className="flex space-x-4">
                <button className={`${getTextClasses()} hover:text-blue-600 font-medium`}>
                  Masuk
                </button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Daftar
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <div className={previewMode ? 'pt-20' : 'pt-8'}>
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center">
              <div>
                <Link to="/auth/homepage" className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <MdSchool className="text-white w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">PRIMA</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Pengaturan Navbar
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Kustomisasi tampilan navbar untuk Platform Integrasi Manajemen Mutu Akademik
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    previewMode 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {previewMode ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
                  <span>{previewMode ? 'Hide Preview' : 'Show Preview'}</span>
                </button>
                
                <Link
                  to="/auth/homepage"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Settings Panel */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Theme Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FaPalette className="text-blue-600 w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Tema & Tampilan
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Mode Tema
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSettingChange('theme', 'light')}
                        className={`p-4 rounded-lg border-2 transition-colors flex items-center space-x-3 ${
                          settings.theme === 'light'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <FaSun className="text-yellow-500 w-5 h-5" />
                        <span className="font-medium text-gray-900 dark:text-white">Mode Terang</span>
                      </button>
                      <button
                        onClick={() => handleSettingChange('theme', 'dark')}
                        className={`p-4 rounded-lg border-2 transition-colors flex items-center space-x-3 ${
                          settings.theme === 'dark'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <FaMoon className="text-blue-500 w-5 h-5" />
                        <span className="font-medium text-gray-900 dark:text-white">Mode Gelap</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Warna Latar Belakang
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'white', label: 'Putih', bg: 'bg-white border-gray-300' },
                        { key: 'dark', label: 'Gelap', bg: 'bg-gray-900 border-gray-700' },
                        { key: 'transparent', label: 'Transparan', bg: 'bg-transparent border-gray-300 border-dashed' },
                        { key: 'gradient', label: 'Gradien', bg: 'bg-gradient-to-r from-blue-600 to-indigo-600' }
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() => handleSettingChange('backgroundColor', option.key)}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            settings.backgroundColor === option.key
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className={`w-full h-8 rounded ${option.bg} mb-2`}></div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Gaya Logo
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSettingChange('logoStyle', 'gradient')}
                        className={`p-4 rounded-lg border-2 transition-colors flex items-center space-x-3 ${
                          settings.logoStyle === 'gradient'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center">
                          <MdSchool className="text-white w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">Gradien</span>
                      </button>
                      <button
                        onClick={() => handleSettingChange('logoStyle', 'solid')}
                        className={`p-4 rounded-lg border-2 transition-colors flex items-center space-x-3 ${
                          settings.logoStyle === 'solid'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <MdSchool className="text-white w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">Solid</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <MdSettings className="text-blue-600 w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Tata Letak & Perilaku
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Tampilkan Ikon dalam Menu</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Menampilkan ikon di samping item menu</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('showIcons', !settings.showIcons)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.showIcons ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.showIcons ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Mode Kompak</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Kurangi tinggi navbar untuk lebih banyak ruang</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('compactMode', !settings.compactMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.compactMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Navbar Position
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSettingChange('navbarPosition', 'fixed')}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          settings.navbarPosition === 'fixed'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <span className="font-medium text-gray-900 dark:text-white">Fixed Top</span>
                      </button>
                      <button
                        onClick={() => handleSettingChange('navbarPosition', 'relative')}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          settings.navbarPosition === 'relative'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <span className="font-medium text-gray-900 dark:text-white">Relative</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Border Style
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { key: 'border', label: 'Border' },
                        { key: 'shadow', label: 'Shadow' },
                        { key: 'none', label: 'None' }
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() => handleSettingChange('borderStyle', option.key)}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            settings.borderStyle === option.key
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <span className="font-medium text-gray-900 dark:text-white">
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                  Actions
                </h3>
                
                <div className="space-y-4">
                  <button
                    onClick={saveSettings}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <FaSave className="w-4 h-4" />
                    <span>Simpan Pengaturan</span>
                  </button>
                  
                  <button
                    onClick={restoreSettings}
                    disabled={!savedSettings}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaUndo className="w-4 h-4" />
                    <span>Restore Saved</span>
                  </button>
                  
                  <button
                    onClick={resetSettings}
                    className="w-full border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 py-3 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MdRefresh className="w-4 h-4" />
                    <span>Reset Default</span>
                  </button>
                </div>

                {savedSettings && (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FaCheck className="text-green-600 w-4 h-4" />
                      <span className="text-green-700 dark:text-green-300 text-sm font-medium">
                        Pengaturan tersimpan
                      </span>
                    </div>
                    <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                      Perubahan akan diterapkan di seluruh website
                    </p>
                  </div>
                )}
              </div>

              {/* Info Panel */}
              <div className="bg-blue-50 dark:bg-blue-900 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">
                  💡 Tips
                </h3>
                <ul className="space-y-3 text-blue-800 dark:text-blue-200 text-sm">
                  <li>• Gunakan Preview untuk melihat perubahan secara real-time</li>
                  <li>• Gradient background cocok untuk landing page yang modern</li>
                  <li>• Compact mode berguna untuk layar kecil</li>
                  <li>• Fixed position membuat navbar selalu terlihat saat scroll</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarSettings;

