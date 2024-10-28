// src/pages/admin/index.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import LocationIcon from '../../assets/svgs/location.svg';
import './AdminPage.css'
import GradientButton from '../../components/GradientButton/gradientbutton';
import { API_URL, DATABASE_NAME } from '../../config/config';

const steps = ['Company', 'Data Source', 'AI Model']; // Define steps

const AdminPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [activeStep, setActiveStep] = useState(0); // Track current step

  useEffect(() => {
    document.title = 'Admin - Vektordata';
  }, []);
  

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setNewPassword(password);

    // Validation checks
    setPasswordValid({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleConfirmPasswordChange = (event) => {
    const password = event.target.value;
    setConfirmPassword(password);
    setPasswordMatch(password === newPassword);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleReset = (event) => {
  //   event.preventDefault();
  //   if (passwordMatch && Object.values(passwordValid).every(Boolean)) {
  //     console.log('Password reset successful');
  //     // Navigate to reset success page
  //     navigate('/reset-success');
  //   } else {
  //     setErrorMessage('Please ensure passwords match and meet the criteria.');
  //   }
  // };

  const handleReset = async (event) => {
    event.preventDefault();
    
    if (passwordMatch && Object.values(passwordValid).every(Boolean)) {
      const storedEmail = localStorage.getItem('userEmail');
  
      // Prepare the data to send
      const requestData = {
        database_name: DATABASE_NAME, // Add your database name here
        email: storedEmail, // Use the email as the username
        new_hashpassword: newPassword // The new hashed password
      };
  
      try {
        const response = await fetch(`${API_URL}/update-emailpassword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          console.log(data.message); // Password updated successfully
          navigate('/reset-success'); // Navigate to success page
        } else {
          setErrorMessage(data.message); // Show error message
        }
      } catch (error) {
        console.error('Error updating password:', error);
        setErrorMessage('An error occurred while updating the password.');
      }
    } else {
      setErrorMessage('Please ensure passwords match and meet the criteria.');
    }
  };

  return (
    <div className="resetpassword-container flex flex-col items-center justify-center min-h-screen bg-gray-50">

      {/* <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md mt-6"> */}
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">

        {/* <h2 className="text-2xl text-center" style={{ marginTop: '0', marginBottom: '0px', fontWeight: '900' }}>
          WELCOME TO
        </h2>

        <div className="flex justify-center">
          <img src={VektordataBanner} alt="Vektordata Logo" className="w-48 logo" style={{ marginBottom: '0px' }} />
        </div> */}

        <div className="flex flex-col items-center">
          <h2 className="text-2xl text-center" style={{ marginTop: '0', marginBottom: '0px', fontWeight: '900', color: 'navy' }}>
            WELCOME TO
          </h2>
          <img src={VektordataBanner} alt="Vektordata Logo" className="w-48 logo" style={{ marginTop: '-50px', marginBottom: '0px' }} />
        </div>

        {/* Stepper */}
        <div className="w-full flex justify-center mb-6">
          {steps.map((label, index) => (
            <div 
              key={label}
              className={`flex-1 text-center cursor-pointer py-2 ${index === activeStep ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500'} `}
              onClick={() => setActiveStep(index)}
            >
              {label}
            </div>
          ))}
        </div>


        {activeStep === 0 && (
          <form onSubmit={handleNext}>
            {/* Company Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <select
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500"
                required
              >
                <option value="" disabled>Select a company</option>
                <option value="company1">Company 1</option>
                <option value="company2">Company 2</option>
                <option value="company3">Company 3</option>
              </select>
            </div>

            {/* Location Input with Icon */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                placeholder="Enter location"
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500"
                required
              />
              <img src={LocationIcon} alt="Location Icon" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-center mb-4 flex items-center text-sm">
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold py-2 px-4 rounded-full">
                NEXT
              </button>
            </div>
          </form>
        )}

        {activeStep === 1 && (
          <form onSubmit={handleReset}>
            {/* Company Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <select
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500"
                required
              >
                <option value="" disabled>Select a company</option>
                <option value="company1">Company 1</option>
                <option value="company2">Company 2</option>
                <option value="company3">Company 3</option>
                {/* Add more company options as needed */}
              </select>
            </div>

            {/* Location Input with Icon */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                placeholder="Enter location"
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500"
                required
              />
              <img src={LocationIcon} alt="Location Icon" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            </div>


            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-center mb-4 flex items-center text-sm">
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <div>
              <GradientButton type="submit">NEXT</GradientButton>
            </div>
          </form>
        )}

        {/* more space here */}
        <div className="mt-600" />

      </div>
    </div>
  );
};

export default AdminPage;
