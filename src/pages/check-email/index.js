// src/pages/check-email/index.js

import React from 'react';
import { Link } from 'react-router-dom';
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import MessageSentIcon from '../../assets/svgs/message-sent-icon.svg';
import './CheckEmailPage.css';
import GradientButton from '../../components/GradientButton/gradientbutton';


const CheckEmailPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Logo */}
      <div className="mt-12">
        {/* SVG app Icon */}
        <img src={VektordataBanner} alt="VektordataBanner-logo" /> 
      </div>

      {/* Confirmation Message */}
      <div className="mt-12 w-full max-w-lg p-8 bg-white shadow-sm rounded-lg text-center">
        
        <div className="mb-6 flex justify-center">
          {/* SVG Email Icon */}
          <img src={MessageSentIcon} alt="MessageSentIcon" /> 
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Please check your email
        </h2>
        <p className="text-base text-gray-600 mb-6">
          Your email address has been successfully registered. Please check your email to verify your account.
        </p>

        {/* Resend Email Button */}
        <div className="flex flex-col items-center">

          <GradientButton>
          RESEND EMAIL
          </GradientButton>

          {/* more space here */}
          <div className="mt-8" />

          <p className="text-xs text-gray-500 mb-4">
            It may take several minutes for the email to arrive in your inbox. Still haven’t received it?
          </p>

          {/* Back to Login Link */}
          <Link to="/login" className="text-blue-500 text-sm hover:underline">
            Go Back to login page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailPage;
