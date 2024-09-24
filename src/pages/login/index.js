// src/pages/login/index.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import VektordataLogo from '../../assets/svgs/vektordata-banner.svg';
import GradientButton from '../../components/GradientButton/gradientbutton';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const buttons = [
    { text: "Sign Up", href: "/signup" },
    { text: "Check Email", href: "/check-email" },
    { text: "Success", href: "/success" },
    { text: "Verify Email", href: "/verify-email" },
    { text: "Link Expired", href: "/link-expired" },
    { text: "Login", href: "/login" },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Logging in with', email, password);
    alert('Logging in with: ' + email + ' and ' + password);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 relative">
      {/* Button Container */}
      <div className="absolute top-4 right-4 flex flex-col items-center space-y-4">
        {buttons.map((button, index) => (
          <button
            key={index}
            className="w-full max-w-xs px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500 transition"
            onClick={() => navigate(button.href)}
          >
            {button.text}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center">
          <img src={VektordataLogo} alt="Vektordata Logo" className="w-48" />
        </div>

        <h2 className="text-2xl font-extrabold text-center">LOG IN</h2>
        <p className="text-center text-sm text-gray-400 mb-8">Find faster, build smarter</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-end">
            <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot password?</a>
          </div>

          <div>
            <GradientButton>
              LOG IN
            </GradientButton>
          </div>
        </form>
        
        <p className="text-sm text-center">
          Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
        </p>

        {/* more space here */}
        <div className="mt-100" />

      </div>
      
    </div>

    
  );
};

export default LoginPage;
