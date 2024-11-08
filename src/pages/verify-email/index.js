// src/pages/verify-email/index.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './VerifyPage.css';
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import GradientButton from '../../components/GradientButton/gradientbutton';

const VerifyEmailPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Verify Email - Vektordata';
  }, []);

  const handleVerifyClick = () => {
    // Navigate to "/success" when the button is clicked
    navigate('/success');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white-50">
      <div className="mt-12">
        {/* Logo */}
        <img src={VektordataBanner} alt="VektordataBanner-logo" /> 
      </div>

      {/* <div className="mt-8 w-full max-w-md p-8 bg-white shadow-md rounded-md text-center"> */}
      <div className="w-full max-w-md p-8 space-y-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Welcome to VektorData!
        </h2>
        <p className="text-sm text-gray-600 mb-8">
          Verify your email address to ensure the security of your account.
        </p>

        <GradientButton onClick={handleVerifyClick}>
          VERIFY MY EMAIL
        </GradientButton>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
