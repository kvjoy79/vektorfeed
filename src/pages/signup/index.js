// src/pages/signup/index.js

import React, { useEffect } from 'react';
import './SignupPage.css'
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import GradientButton from '../../components/GradientButton/gradientbutton';


const SignupPage = () => {
  useEffect(() => {
    document.title = 'Sign Up - Vektordata';
  }, []);

  const handleSignup = (event) => {
    event.preventDefault();
    // Handle signup logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
  
      <div className="mt-12">
        {/* {SVG logo} */}
        <img src={VektordataBanner} alt="VektordataBanner-logo" /> 
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md mt-6">
        <h2 className="text-center text-2xl font-semibold text-gray-700 mb-4">SIGN UP</h2>
        <p className="text-center text-sm text-gray-400 mb-8">Find faster, build smarter</p>

        <form>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Please use only business email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              required
            />
            <p className="text-xs text-red-500 mt-1">
              Please use only business email. Other emails are not allowed.
            </p>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          {/* Repeat Password Input */}
          <div className="mb-6">
            <label className="block text-gray-700">Repeat Password</label>
            <input
              type="password"
              placeholder="Repeat Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
          <GradientButton type="submit">
              SIGN UP
          </GradientButton>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>

      {/* more space here */}
      <div className="mt-60" />

    </div>
  );
};

export default SignupPage;
