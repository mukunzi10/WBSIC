
import React, { useState } from 'react';
import { Info } from 'lucide-react';
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', { username, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex flex-col">
      {/* Header */}
      <div className="bg-white py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center">
          <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="ml-3 text-2xl font-semibold text-gray-800">Sanlam</span>
         
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Log in to your account
          </h1>

          <div className="space-y-6">
            {/* Email/Username Field */}
            <div>
              <input
                type="text"
                placeholder="Email / Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-500"
              />
              <a href="#" className="inline-block mt-2 text-sm text-blue-600 hover:underline">
                Forgotten username?
              </a>
            </div>

            {/* Password Field */}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-500"
              />
              <a href="#" className="inline-block mt-2 text-sm text-blue-600 hover:underline">
                Forgot your password?
              </a>
            </div>

            {/* Terms and Conditions */}
            <p className="text-sm text-gray-600">
              By continuing, you are agreeing to our{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Terms and Conditions
              </a>
            </p>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gray-200 text-gray-500 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              Log in
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Alternative Login */}
            <button
              onClick={() => console.log('ID/Passport login')}
              className="w-full border border-gray-300 text-blue-600 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              Log in with your ID or Passport
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 font-medium hover:underline">
              Register
            </a>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="ml-3 text-sm text-gray-700">
                For your security, you might need to log in again to access certain secure features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
