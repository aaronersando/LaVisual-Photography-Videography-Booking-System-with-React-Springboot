import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../service/AdminService";

function Loginform() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <div className="w-[448px] h-[410px] bg-gray-800 rounded-lg p-8 mx-auto my-12 flex flex-col text-white">
      <h2 className="text-2xl font-bold text-center mb-1">
        Welcome Back
      </h2>
      
      <p className="text-sm text-gray-400 text-center mb-6">
        Sign in to your account
      </p>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full ${isLoading ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} 
                       text-white py-3 px-4 rounded-md text-sm font-medium 
                       transition-colors duration-200 mt-4`}
            disabled={isLoading}
          >
            {isLoading ? 'Redirecting...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Loginform;