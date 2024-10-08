// src/pages/check-email/index.js

import React from 'react';
import { Link } from 'react-router-dom';
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import MessageSentIcon from '../../assets/svgs/message-sent-icon.svg';
import './CheckEmailPage.css';
import GradientButton from '../../components/GradientButton/gradientbutton';
import { API_URL} from '../../config/config';

const CheckEmailPage = () => {

  const handleResendEmail = async () => {
    const email = localStorage.getItem('userEmail'); 
    const verificationHash = localStorage.getItem('verification_hash');

    if (email && verificationHash) {
      try {
        const response = await fetch(`${API_URL}/send-verification-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipient_email: email,
            token: verificationHash,
          }),
        });

        if (response.ok) {
          alert('Verification email has been resent!');
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Failed to resend email.');
        }
      } catch (error) {
        console.error('Error resending email:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      alert('Email or verification hash not found in local storage.');
    }
  };

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="checkemail flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">

        <div className="flex justify-center">
          
          <img src={VektordataBanner} alt="Vektordata Logo" className="w-48 logo" style={{ marginBottom: '0px' }} />
        
        </div>

        {/* Confirmation Message */}
        <div className="mt-1 w-full max-w-lg p-8 bg-white shadow-sm rounded-lg text-center">
          
          <div className="mb-2 flex justify-center" style={{marginTop: '-60px'}}>
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
            <GradientButton onClick={handleResendEmail}>
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
    </div>
  );
};

export default CheckEmailPage;
