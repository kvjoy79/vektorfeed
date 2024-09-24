// src/pages/link-expired/index.js

import React, { useEffect, useState } from 'react';
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import TimeExpiredIcon from '../../assets/svgs/time-expired-icon.svg';
import './LinkExpiredPage.css'
import GradientButton from '../../components/GradientButton/gradientbutton';


const LinkExpiredPage = () => {
  useEffect(() => {
    document.title = 'Link Expired - Vektordata';
  }, []);

  const [alertVisible, setAlertVisible] = useState(false);

  const handleResend = () => {
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 2000);
  };

  return (
  
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="mt-12">
        {/* Logo */}
        <img src={VektordataBanner} alt="VektordataBanner-logo" /> 
      </div>

      <div className="text-center mt-8">
        <div className="bg-blue-100 p-6 rounded-full inline-block">
          {/* Expired Icon */}
          <img src={TimeExpiredIcon} alt="TimeExpiredIcon" /> 
        </div>

        <h1 className="mt-4 text-3xl font-black text-red-500">
          The link has expired
        </h1>
        <p className="mt-6 text-gray-400 text-lg">
          Your verification link has expired. Please resend a new link to your
        </p>

        <p className="mt-2 text-gray-400 text-lg">
          inbox and click verification.
        </p>

        {/* <button className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500 transition">
          RESEND
        </button> */}

        {/* <button className="mt-8 w-full max-w-md px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-400 text-white rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-300 transition">
          RESEND
        </button> */}

    <div>
      <GradientButton onClick={handleResend}>
        RESEND
      </GradientButton>
      {alertVisible && <div className="alert">Resend clicked!</div>}
    </div>


        <p className="mt-6 text-blue-500 hover:underline">
          <a href="/login">Go Back to login page</a>
        </p>

        {/* more space here */}
        <div className="mt-60" />


      </div>
    </div>
  );
};

export default LinkExpiredPage;
