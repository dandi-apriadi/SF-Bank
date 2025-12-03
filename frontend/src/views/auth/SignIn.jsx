import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, reset } from "../../store/slices/authSlice";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiUsers, FiAward, FiShield, FiBarChart, FiTarget } from "react-icons/fi";
import { MdAssessment, MdVerifiedUser, MdAnalytics } from "react-icons/md";
import { GiCastle, GiCrossedSwords } from "react-icons/gi";
import Checkbox from "components/checkbox";
import Swal from 'sweetalert2';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'SF BANK';
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    document.title = `Masuk - ${APP_NAME} | Portal SF BANK`;
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Handle authentication state
  useEffect(() => {
    // Redirect saat login sukses (state.auth.user langsung objek user)
    if (isSuccess && user) {
      const role = (user.role || '').toLowerCase();
      console.log("Login successful role:", role);
      let route = "/dashboard";
      if (role === 'customer') route = "/customer/dashboard";
      else if (role === 'teller') route = "/teller/dashboard";
      else if (role === 'manager') route = "/manager/dashboard";
      else if (role === 'admin') route = "/admin/dashboard";
      navigate(route);
      dispatch(reset());
    }
    if (isError) dispatch(reset());
  }, [isSuccess, isError, user, navigate, dispatch]);

  const handleAuth = async (e) => {
    e.preventDefault();

    // Form validation
    if (!email.trim() || !password.trim()) {
      Swal.fire({
        icon: 'warning',
        iconColor: '#f59e0b',
        title: 'Kolom Kosong',
        text: 'Silahkan isi email dan password',
        timer: 2000,
        timerProgressBar: true,
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'Ok',
        customClass: {
          popup: 'rounded-xl border border-blue-100',
          title: 'text-gray-800',
          htmlContainer: 'text-gray-600',
          confirmButton: 'rounded-lg'
        }
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'warning',
        iconColor: '#f59e0b',
        title: 'Email Tidak Valid',
        text: 'Harap masukkan alamat email yang valid',
        timer: 2000,
        timerProgressBar: true,
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'Ok',
        customClass: {
          popup: 'rounded-xl border border-blue-100',
          title: 'text-gray-800',
          htmlContainer: 'text-gray-600',
          confirmButton: 'rounded-lg'
        }
      });
      return;
    }

    try {
      await dispatch(loginUser({ email: email.trim(), password: password.trim() })).unwrap();
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        iconColor: '#3b82f6',
        title: 'Login Gagal',
        text: error?.message || 'Email atau password tidak valid',
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'Coba Lagi',
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'rounded-xl border border-blue-100',
          title: 'text-gray-800',
          htmlContainer: 'text-gray-600',
          confirmButton: 'rounded-lg'
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50">
        <div className="bg-white/95 rounded-2xl p-8 flex flex-col items-center shadow-2xl border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent mb-4" />
          <p className="text-gray-700 font-semibold">Memverifikasi kredensial...</p>
          <p className="text-gray-500 text-sm mt-1">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex">
      {/* Left Panel - Professional Academic Visual */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1986&q=80" 
            alt="Epic fantasy landscape representing kingdoms and battles" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-gray-900/95"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Header */}
          <div>
            <Link to="/auth/homepage" className="flex items-center mb-8 hover:opacity-80 transition-opacity duration-200">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <GiCastle className="h-8 w-8 text-yellow-200" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold">SF BANK</h1>
                <p className="text-blue-200 text-sm">Portal Internal & Layanan Perbankan</p>
              </div>
            </Link>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Bangun Kerajaan Anda
                <span className="text-yellow-300 block">Rise of Kingdoms — Pimpin Kerajaan</span>
              </h2>
              <p className="text-xl text-yellow-100 max-w-2xl mx-auto leading-relaxed">
                Masuki dunia epik, rekrut komandan, dan perluas wilayah Anda melalui strategi dan aliansi.
              </p>
            </div>
            
            {/* Role Cards */}
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/15 transition-all duration-300">
                <GiCrossedSwords className="h-8 w-8 text-red-300 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Komandan</h3>
                <p className="text-yellow-200 text-sm">Pimpin pasukan dan kuasai medan perang</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/15 transition-all duration-300">
                <FiUsers className="h-8 w-8 text-cyan-300 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Gubernur</h3>
                <p className="text-yellow-200 text-sm">Kelola sumber daya dan kembangkan kota Anda</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/15 transition-all duration-300">
                <FiAward className="h-8 w-8 text-purple-300 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Pemimpin Aliansi</h3>
                <p className="text-yellow-200 text-sm">Koordinasi aliansi dan raih kemenangan bersama</p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-blue-200 text-sm">
            © 2025 SF BANK - Portal Perbankan Internal
          </div>
        </div>
      </div>
      
      {/* Right Panel - Sign In Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 lg:p-12">
  <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/auth/homepage" className="inline-block hover:opacity-80 transition-opacity duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-2xl mb-4 shadow-lg">
                <GiCastle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">SF BANK</h1>
              <p className="text-gray-600 text-sm">Tema: Rise of Kingdoms — Visual</p>
            </Link>
          </div>
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang</h2>
            <p className="text-gray-600">Masuk ke akun Anda untuk mengakses portal SF BANK</p>
          </div>
          
          {/* Sign In Form */}
          <form onSubmit={handleAuth} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-700 
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             transition-all duration-200 hover:border-gray-300"
                  placeholder="user@sfbank.co.id"
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Kata Sandi
                </label>
                <Link 
                  to="/auth/forgot-password" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-700 
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             transition-all duration-200 hover:border-gray-300"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            {/* Remember Me */}
            <div className="flex items-center">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                />
                <label htmlFor="remember-me" className="ml-3 text-sm text-gray-600">
                  Ingat saya selama 30 hari
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent 
                           text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700
                           hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <div className="h-full flex items-center justify-center w-6">
                    {isLoading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" />
                    ) : (
                      <FiArrowRight className="h-5 w-5 text-blue-200 group-hover:text-white transition-colors duration-200" />
                    )}
                  </div>
                </span>
                {isLoading ? "Memproses masuk..." : "Masuk ke Sistem"}
              </button>
            </div>
            
            {/* Divider removed per request */}
            
            {/* Google SSO removed */}
            
            {/* Contact Admin link removed per request */}
          </form>
          
          {/* Info panel removed per request */}

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            <p className="mb-2">© 2025 SF BANK - Portal Perbankan Internal</p>
            <div className="space-x-4">
              <Link to="/auth/terms" className="text-blue-600 hover:text-blue-700 transition-colors">
                Syarat & Ketentuan
              </Link>
              <span>&middot;</span>
              <Link to="/auth/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

