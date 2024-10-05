// src/pages/success/index.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import CongratsIcon from '../../assets/svgs/congrats-icon.svg';
import './SuccessPage.css'
import GradientButton from '../../components/GradientButton/gradientbutton';


const SuccessPage = () => {
  const navigate = useNavigate(); 
  useEffect(() => {
    document.title = 'Success - Vektordata';
  }, []);

  const handleLoginClick = () => {
    // Navigate to "/success" when the button is clicked
    navigate('/login');
  };

  return (
    // <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <div className="sucess-container flex items-center justify-center h-screen bg-gray-100 relative">
      
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center">
            <img src={VektordataBanner} alt="Vektordata Logo" className="w-48 logo" style={{ marginBottom: '0px' }} />
        </div>

        <div className="text-center">
        <div className="bg-blue-100 p-6 rounded-full inline-block">
  {/* Congratulations Icon */}
  <img src={CongratsIcon} alt="CongratsIcon" style={{ marginTop: '-80px' }} />
</div>

          <h1 className="mt-2 text-3xl font-bold text-gray-800">
            Congratulations!
          </h1>
          <p className="mt-2 text-2xl font-bold text-gray-80">
            You have successfully signed up.
          </p>
          <p className="mt-2 text-gray-500">
            Thank you for joining our platform. You're now part of a smarter way to search, collaborate, and build incredible products.
          </p>

          <GradientButton onClick={handleLoginClick}>
              Start Exploring
          </GradientButton>
        </div>
      </div>

      {/* <div className="mt-600" /> */}
    </div>
  );
};

export default SuccessPage;
