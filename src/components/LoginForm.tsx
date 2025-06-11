import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, AlertCircle, User } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  const demoUsers = [
    { role: 'Administrator', email: 'admin@hospital.com', description: 'Full system access' },
    { role: 'Doctor', email: 'dr.smith@hospital.com', description: 'Patient management & analysis' },
    { role: 'Nurse', email: 'nurse.johnson@hospital.com', description: 'Read-only access' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-blue-600 rounded-full p-3">
              <Shield className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
            </div>
          </div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
            MedSafe DDI System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Healthcare Drug Interaction Analysis Platform
          </p>
        </div>
        
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 shadow-xl rounded-lg">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-600 break-words">{error}</span>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-3">Demo Credentials (Password: password):</p>
              <div className="space-y-3">
                {demoUsers.map((user, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-start sm:items-center min-w-0 flex-1">
                        <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">{user.role}</p>
                          <p className="text-xs text-gray-500 break-words">{user.description}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmail(user.email)}
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium flex-shrink-0 self-start sm:self-center"
                      >
                        Use
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 break-all">{user.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;