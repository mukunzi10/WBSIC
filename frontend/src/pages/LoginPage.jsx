// src/pages/LoginPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Info, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { validateLoginForm } from '../api/utils/validation';
import { AuthContext } from '../api/context/AuthContext';

export const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize remembered email & messages
  useEffect(() => {
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }

    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location]);

  const getErrorMessage = (err) => {
    if (err.code === 'ECONNABORTED') return 'Connection timeout. Please try again.';
    if (err.code === 'ERR_NETWORK') return 'Network error. Please check your connection.';
    
    const messages = {
      400: 'Invalid email or password format.',
      401: 'Invalid credentials.',
      403: 'Account suspended. Contact support.',
      404: 'User not found.',
      429: 'Too many login attempts. Try later.',
      500: 'Server error. Try again later.',
    };
    return messages[err.response?.status] || err.response?.data?.message || 'Login failed.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate form
    const validationError = validateLoginForm(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      // Call login API
      const result = await loginUser({ email: email.trim(), password });

      // Check if login was successful
      if (result.success) {
        // Store token in context/state
        login(result.user, result.token);

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email.trim());
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Redirect to dashboard or original destination
        const redirectTo = location.state?.from || '/ClientDashboard';
        navigate(redirectTo, { replace: true });
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password', { state: { email } });
  };

  const handleForgotUsername = () => {
    navigate('/forgot-username');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex flex-col">
      {/* Header */}
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="ml-3 text-2xl font-semibold text-gray-800">Sanlam</span>
          </div>
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-6">Log in to access your insurance dashboard</p>

          {successMessage && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="ml-3 text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                disabled={loading}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={handleForgotUsername}
                className="inline-block mt-2 text-sm text-blue-600 hover:underline"
              >
                Forgotten username?
              </button>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  disabled={loading}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 pr-12 disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="inline-block mt-2 text-sm text-blue-600 hover:underline"
              >
                Forgot your password?
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                Remember my username
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-md font-medium transition-colors`}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Register now
            </Link>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded flex items-start">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="ml-3 text-sm text-gray-700">
              For your security, we never ask for your password via email.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-white text-sm">
        <p>© 2025 Sanlam. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
