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
    // <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <div className="flex items-center justify-center h-screen bg-white-100 relative">

      {/* <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg"> */}
      <div className="w-full max-w-md p-8 space-y-8">

          <div className="flex justify-center">
            {/* <div className="mt-12"> */}
            <img src={VektordataBanner} alt="Vektordata Logo" className="w-48 logo" style={{ marginBottom: '0px' }} />
            {/* </div> */}
          </div>

        {/* <div className="text-center mt-10">  */}
        <div className="text-center"> 

          <h1 className="mt-10 text-3xl font-bold text-gray-800">
            Forgot Password?
          </h1>

          <GradientButton onClick={handleResetPasswordClick}>
              RESET PASSWORD
          </GradientButton>
        </div>
      </div>

      <div className="mt-60" />
    </div>
  );
};

export default ForgotPasswordPage;
