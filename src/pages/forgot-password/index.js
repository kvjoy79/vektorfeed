// src/pages/success/index.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import './ForgotPassword.css';
import GradientButton from '../../components/GradientButton/gradientbutton';

const ForgotPasswordPage = () => {
  
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Forgot Password - Vektordata';
  }, []);

  const handleResetPasswordClick = () => {
    // Navigate to "/reset-password" when the button is clicked
    navigate('/reset-password');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="mt-12">
        {/* Logo */}
        <img src={VektordataBanner} alt="VektordataBanner-logo" /> 
      </div>

      <div className="text-center mt-10"> {/* Increased margin-top here */}

        <h1 className="mt-40 text-3xl font-bold text-gray-800">
          Forgot Password?
        </h1>

        <GradientButton onClick={handleResetPasswordClick}>
            RESET PASSWORD
        </GradientButton>
      </div>

      <div className="mt-60" />
    </div>
  );
};

export default ForgotPasswordPage;
