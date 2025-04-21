import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../service/AdminService";

function Loginform() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const userData = await AdminService.login(email, password);
      
      if (userData.token) {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('role', userData.role);
        
        setIsLoading(true);
        
        setTimeout(() => {
          window.location.href = '/admin';
        }, 100);
      } else {
        setError(userData.message || 'Login failed');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || error.message || 'An error occurred during login');
      
      setTimeout(() => {
        setError('');
      }, 5000);
      
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-[448px] h-auto min-h-[300px] bg-gray-800 rounded-lg p-8 mx-auto my-12 flex flex-col text-white">
      <h2 className="text-2xl font-bold text-center mb-1">
        Welcome Back
      </h2>
      
      <p className="text-sm text-gray-400 text-center mb-6">
        Sign in to your account
      </p>
    
      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={isLoading}
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 focus:outline-none"
                onClick={togglePasswordVisibility}
                tabIndex="-1"
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye-slash text-sm"></i>
                ) : (
                  <i className="fa-solid fa-eye text-sm"></i>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full ${isLoading ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-800'} 
                       text-white py-3 px-4 rounded-md text-sm font-medium 
                       transition-colors duration-200 my-2`}
            disabled={isLoading}
          >
            {isLoading ? 'Redirecting...' : 'Sign in'}
          </button>
        </div>
      </form>

      <div className="h-[30px] flex items-center mt-4">
        {error && (
          <div className="w-full bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded">
            <div className="flex items-center">
            <i className="fa fa-exclamation-circle mt-2 w-5 h-5 mr-2 flex-shrink-0 text-red-100" aria-hidden="true"></i>
              <span>
                {error.toLowerCase().includes('unauthorized') || 
                error.toLowerCase().includes('401') || 
                error.toLowerCase().includes('invalid') ? 
                  'Invalid email or password' : 
                  error.toLowerCase().includes('network') ?
                  'Network error. Please check your connection.' :
                  'Login failed. Please try again.'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Loginform;