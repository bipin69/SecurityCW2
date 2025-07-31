import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import zxcvbn from 'zxcvbn';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const location = useLocation();
  
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState('');
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Add state for password strength and requirements
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [requirements, setRequirements] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  // Pre-fill email and password if redirected from reset password
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
    if (location.state && location.state.password) {
      setPassword(location.state.password);
    }
  }, [location.state]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (currentState === 'Sign up') {
        const response = await axios.post(backendUrl + '/api/user/register', {name, email, password})

        if (response.data.success) {
          setCurrentState('Login');
          toast.success('Account created successfully! Please log in.')
        } else {
          toast.error(response.data.message)
        }
      } else if (!showOtpStep) {
        // Login step 1: email/password
        const response = await axios.post(backendUrl + '/api/user/login', {email, password})
        if (response.data.mfa) {
          setShowOtpStep(true);
          toast.success('OTP sent to your email.');
        } else if (response.data.success && response.data.token) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          toast.success('Welcome back!')
        } else {
          toast.error(response.data.message)
        }
      } else {
        // Login step 2: OTP
        setOtpLoading(true);
        const response = await axios.post(backendUrl + '/api/user/verify-otp', {email, otp});
        if (response.data.success && response.data.token) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          toast.success('Login successful!')
        } else {
          toast.error(response.data.message)
        }
        setOtpLoading(false);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setIsLoading(false);
    }
  }

  // Update password strength and requirements on change
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordTouched(true);
    const result = zxcvbn(val);
    setPasswordScore(result.score);
    setPasswordFeedback(result.feedback.suggestions?.[0] || '');
    setRequirements({
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[^A-Za-z0-9]/.test(val),
    });
  };

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] to-[#fff5f5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-[#8B0000] rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fresh Meat</h1>
          <p className="text-gray-600">Premium quality meat delivered to your doorstep</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentState === 'Login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {currentState === 'Login' 
                ? "Sign in to access fresh meat and groceries" 
                : "Join us for fresh chicken, mutton, pork, and buff from local butchers"}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={onSubmitHandler}>
            {/* Name Field (Sign up only) */}
            {currentState === 'Sign up' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => setPasswordTouched(true)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Password Strength Meter & Requirements (Sign up only) */}
            {currentState === 'Sign up' && passwordTouched && (
              <div className="mt-2">
                {/* Strength Bar */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 rounded bg-gray-200 overflow-hidden">
                    <div
                      className={`h-2 rounded transition-all duration-300 ${
                        passwordScore === 0 ? 'bg-red-400 w-1/4' :
                        passwordScore === 1 ? 'bg-orange-400 w-1/3' :
                        passwordScore === 2 ? 'bg-yellow-400 w-2/3' :
                        passwordScore === 3 ? 'bg-green-400 w-3/4' :
                        'bg-green-600 w-full'
                      }`}
                    ></div>
                  </div>
                  <span className={`text-xs font-semibold ${
                    passwordScore === 0 ? 'text-red-500' :
                    passwordScore === 1 ? 'text-orange-500' :
                    passwordScore === 2 ? 'text-yellow-600' :
                    passwordScore === 3 ? 'text-green-600' :
                    'text-green-800'
                  }`}>
                    {['Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordScore]}
                  </span>
                </div>
                {/* Requirements Checklist */}
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className={requirements.length ? 'text-green-600' : 'text-red-500'}>
                    • At least 8 characters
                  </li>
                  <li className={requirements.upper ? 'text-green-600' : 'text-red-500'}>
                    • At least one uppercase letter
                  </li>
                  <li className={requirements.lower ? 'text-green-600' : 'text-red-500'}>
                    • At least one lowercase letter
                  </li>
                  <li className={requirements.number ? 'text-green-600' : 'text-red-500'}>
                    • At least one number
                  </li>
                  <li className={requirements.special ? 'text-green-600' : 'text-red-500'}>
                    • At least one special character
                  </li>
                </ul>
                {passwordFeedback && <div className="text-xs text-gray-500 mt-1">{passwordFeedback}</div>}
              </div>
            )}

            {/* Forgot Password (Login only) */}
            {currentState === 'Login' && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {showOtpStep ? (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <div className="flex gap-2 mb-4">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition-colors"
                    placeholder="Enter the 6-digit OTP"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-[#8B0000] text-white font-semibold hover:bg-[#B22222] transition-colors"
                    disabled={otpLoading}
                    onClick={async () => {
                      setOtpLoading(true);
                      try {
                        const response = await axios.post(backendUrl + '/api/user/resend-otp', { email });
                        if (response.data.success) {
                          toast.success('OTP resent to your email.');
                        } else {
                          toast.error(response.data.message);
                        }
                      } catch (err) {
                        toast.error('Failed to resend OTP.');
                      }
                      setOtpLoading(false);
                    }}
                  >Resend OTP</button>
                </div>
                {/* Add Sign In button for OTP step */}
                <button
                  type="submit"
                  disabled={isLoading || otpLoading}
                  className="w-full bg-[#8B0000] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#B22222] focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {(isLoading || otpLoading) ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Email/Password fields
              <>
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || otpLoading}
                  className="w-full bg-[#8B0000] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#B22222] focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {(isLoading || otpLoading) ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {currentState === 'Login' ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      {currentState === 'Login' ? 'Sign In' : 'Create Account'}
                      <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </>
            )}
          </form>

          {/* Toggle between Login/Sign up */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600">
                {currentState === 'Login' ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setCurrentState(currentState === 'Login' ? 'Sign up' : 'Login')}
                  className="ml-1 text-[#8B0000] hover:text-[#B22222] font-medium"
                >
                  {currentState === 'Login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-xs text-gray-600">Free Delivery</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600">Fresh Quality</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600">24/7 Support</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
