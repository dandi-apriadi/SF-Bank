import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { loginUser, reset } from "../../store/slices/authSlice";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { GiCastle, GiCrown, GiSwordsEmblem } from "react-icons/gi";
import Swal from 'sweetalert2';
import SacredLogo from '../../assets/img/auth/animatedlogo.gif';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'SacredBank';
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    document.title = `Sign In - ${APP_NAME} | SacredBank Portal`;
    
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
        text: 'Please enter a valid email address',
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
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] overflow-hidden">
      {/* Optimized Static Background - Better Performance */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Simple SVG Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="signin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#signin-grad)" opacity="0.08" />
        </svg>

        {/* Static Glow Effects */}
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

        {/* Static Gradient Overlay */}
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

      <div className="relative min-h-screen flex items-center z-10">
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Welcome Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div 
                className="flex justify-center lg:justify-start mb-8"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-32 h-32 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300" style={{ transform: 'translateZ(0)' }}>
                  <img src={SacredLogo} alt="Sacred Forces" className="w-32 h-32 rounded-full object-contain drop-shadow-2xl" />
                </div>
              </motion.div>
              
              <motion.h1 
                className="text-6xl lg:text-7xl font-bold text-[#FFD700] mb-4 tracking-wider uppercase" 
                style={{ fontFamily: 'Cinzel, serif' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Welcome Back
              </motion.h1>
              <motion.h2
                className="text-3xl lg:text-4xl font-bold text-[#E2E8F0] mb-6"
                style={{ fontFamily: 'Cinzel, serif' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                To Sacred3946
              </motion.h2>
              <motion.p 
                className="text-xl text-[#E2E8F0]/70 mb-8 max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Sign in to access your kingdom dashboard and manage your empire in Rise of Kingdoms.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FFD700]/20 flex items-center justify-center">
                    <GiCrown className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[#FFD700] font-bold">Kingdom Management</p>
                    <p className="text-[#E2E8F0]/60 text-sm">Control your empire</p>
                  </div>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FFD700]/20 flex items-center justify-center">
                    <GiSwordsEmblem className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[#FFD700] font-bold">Battle Strategy</p>
                    <p className="text-[#E2E8F0]/60 text-sm">Plan your victories</p>
                  </div>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FFD700]/20 flex items-center justify-center">
                    <FiShield className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[#FFD700] font-bold">Secure Access</p>
                    <p className="text-[#E2E8F0]/60 text-sm">Protected portal</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Sign In Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
            >
              {/* Sign In Form Container */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative bg-[#1E293B]/95 rounded-2xl p-8 border-2 border-[#C5A059]/40 shadow-lg overflow-hidden"
                style={{ transform: 'translateZ(0)', contain: 'layout style paint' }}
              >
          {/* Form header glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C5A059]/5 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

          {/* Form Header */}
          <motion.div 
            className="flex items-center mb-6 pb-5 border-b-2 border-[#FFD700]/30 relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-3xl mr-3">🔐</div>
            <div>
              <h2 className="text-2xl font-bold text-[#FFD700]" style={{ fontFamily: 'Cinzel, serif' }}>
                Kingdom Login
              </h2>
              <p className="text-[#E2E8F0]/70 text-sm mt-1">
                Enter your credentials to continue
              </p>
            </div>
          </motion.div>

          {/* Sign In Form */}
          <form onSubmit={handleAuth} className="space-y-5 relative z-10">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="flex text-[#E2E8F0] font-bold mb-2 items-center">
                <FiMail className="w-4 h-4 mr-2 text-[#FFD700]" />
                Email Address <span className="text-[#FF6B6B] ml-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0F172A]/60 border-2 border-[#C5A059]/30 rounded-xl px-4 py-3 text-[#E2E8F0] placeholder-[#E2E8F0]/40 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                placeholder="your.email@example.com"
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="flex text-[#E2E8F0] font-bold mb-2 items-center">
                <FiLock className="w-4 h-4 mr-2 text-[#FFD700]" />
                Password <span className="text-[#FF6B6B] ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0F172A]/60 border-2 border-[#C5A059]/30 rounded-xl px-4 py-3 pr-12 text-[#E2E8F0] placeholder-[#E2E8F0]/40 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E2E8F0]/60 hover:text-[#FFD700] transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#C5A059]/30 bg-[#0F172A]/60 text-[#FFD700] focus:ring-[#FFD700] focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-[#E2E8F0]/80">Remember me</span>
              </label>
              <Link 
                to="/auth/forgot-password" 
                className="text-sm text-[#FFD700] hover:text-[#C5A059] transition-colors font-medium"
              >
                Forgot Password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] font-bold py-4 rounded-xl hover:shadow-xl hover:shadow-[#FFD700]/40 transition-all flex items-center justify-center group text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0F172A] border-t-transparent mr-3" />
                  Signing In...
                </>
              ) : (
                <>
                  <FiShield className="w-5 h-5 mr-2" />
                  Sign In to Kingdom
                  <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div 
            className="relative my-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#C5A059]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1E293B] text-[#E2E8F0]/60">New to Sacred3946?</span>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center relative z-10"
          >
            <Link
              to="/auth/forms"
              className="inline-flex items-center px-6 py-3 border-2 border-[#FFD700]/60 text-[#FFD700] font-bold rounded-xl hover:bg-[#FFD700]/10 transition-all"
            >
              <GiSwordsEmblem className="w-5 h-5 mr-2" />
              Join Kingdom
            </Link>
          </motion.div>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-8 text-center text-sm text-[#E2E8F0]/60"
          >
            <div className="flex items-center justify-center gap-4">
              <Link to="/auth/homepage" className="hover:text-[#FFD700] transition-colors">
                ← Back to Home
              </Link>
              <span>•</span>
              <Link to="/auth/about" className="hover:text-[#FFD700] transition-colors">
                About Kingdom
              </Link>
            </div>
            <p className="mt-4 text-xs">
              © 2025 Sacred3946 - Rise of Kingdoms Community
            </p>
          </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

