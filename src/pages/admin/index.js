// src/pages/admin/index.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import CongratsIcon from '../../assets/svgs/congrats-icon.svg';
import './AdminPage.css'
import GradientButton from '../../components/GradientButton/gradientbutton';


const AdminPage = () => {
  const navigate = useNavigate(); 
  useEffect(() => {
    document.title = 'Admin- Vektordata';
  }, []);

  const handleLoginClick = () => {
    // Navigate to "/success" when the button is clicked
    navigate('/login');
  };

  return (
    // <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center">
          <img src={VektordataBanner} alt="Vektordata Logo" className="w-48 logo" style={{ marginBottom: '0px' }} />
        </div>

        <div className="text-center mt-6">
          <div className="bg-blue-100 p-6 rounded-full inline-block" style={{marginTop: '-50px'}}>
            {/* Congratulations Icon */}
            <img src={CongratsIcon} alt="CongratsIcon" /> 
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-800">
            Congratulations!
          </h1>
          <p className="mt-4 text-2xl font-bold text-gray-80">
            You have successfully logon.
          </p>
          {/* <p className="mt-4 text-gray-500">
            Thank you for joining our platform. You're now part of a smarter way to search, collaborate, and build incredible products.
          </p> */}

          <GradientButton onClick={handleLoginClick}>
              Start Exploring
          </GradientButton>
        </div>
      </div>

      <div className="mt-60" />
    </div>
  );
};

export default AdminPage;
