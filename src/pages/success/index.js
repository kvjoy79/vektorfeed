// src/pages/success/index.js

import React, { useEffect } from 'react';
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import CongratsIcon from '../../assets/svgs/congrats-icon.svg';
import './SuccessPage.css'
import GradientButton from '../../components/GradientButton/gradientbutton';


const SuccessPage = () => {
  useEffect(() => {
    document.title = 'Success - Vektordata';
  }, []);

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

        <h1 className="mt-4 text-2xl font-bold text-gray-800">
          Congratulations!
        </h1>
        <p className="mt-2 text-gray-600">
          You have successfully signed up.
        </p>
        <p className="mt-4 text-gray-500">
          Thank you for joining our platform. You're now part of a smarter way to search, collaborate, and build incredible products.
        </p>

        <GradientButton>
            Start Exploring
        </GradientButton>
      </div>
    </div>
  );
};

export default SuccessPage;
