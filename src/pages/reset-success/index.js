// src/pages/reset-success/index.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import CongratsIcon from '../../assets/svgs/congrats-icon.svg';
import './ResetSuccessPage.css'
import GradientButton from '../../components/GradientButton/gradientbutton';


const ResetSuccessPage = () => {
  const navigate = useNavigate(); 

  useEffect(() => {
    document.title = 'Reset Success - Vektordata';
  }, []);

  const handleLoginClick = () => {
    // Navigate to "/success" when the button is clicked
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="mt-12">
        {/* Logo */}
        <img src={VektordataBanner} alt="VektordataBanner-logo" /> 
      </div>

      <div className="text-center mt-6">
        <div className="bg-blue-100 p-6 rounded-full inline-block">
          {/* Congratulations Icon */}
          <img src={CongratsIcon} alt="CongratsIcon" /> 
        </div>

        <h1 className="mt-4 text-3xl font-bold text-gray-800">
          Congratulations!
        </h1>
        <p className="mt-4 text-gray-500">
          You password have been successfully reset.
        </p>

        <GradientButton onClick={handleLoginClick}>
            LOGIN
        </GradientButton>
      </div>

      <div className="mt-60" />
    </div>
  );
};

export default ResetSuccessPage;
