// src/pages/reset-password/index.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ResetPasswordPage.css';
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import GradientButton from '../../components/GradientButton/gradientbutton';
import ExclamationMarkIcon from '../../assets/svgs/exclamation-mark-inside-a-circle.svg';
import { API_URL, DATABASE_NAME } from '../../config/config';

const ResetPasswordPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    document.title = 'Reset Password - Vektordata';
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mt-12">
        <img src={VektordataBanner} alt="VektordataBanner-logo" />
      </div>

      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md mt-6">
        <h2 className="text-center text-2xl font-semibold text-gray-700 mb-4">RESET PASSWORD</h2>

        <form onSubmit={handleReset}>
          {/* New Password Input */}
          <div className="mb-4">
            <label className={`block text-sm font-medium ${passwordValid.length ? 'text-gray-700' : 'text-red-500'}`}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500 ${!Object.values(passwordValid).every(Boolean) ? 'border-red-500 bg-red-100' : ''}`}
              required
            />
            <div className="mt-2 text-sm">
              <p className={passwordValid.length ? 'text-green-500' : 'text-red-500'}>{passwordValid.length ? '✔' : '✘'} Min 6 characters</p>
              <p className={passwordValid.uppercase ? 'text-green-500' : 'text-red-500'}>{passwordValid.uppercase ? '✔' : '✘'} An uppercase letter</p>
              <p className={passwordValid.lowercase ? 'text-green-500' : 'text-red-500'}>{passwordValid.lowercase ? '✔' : '✘'} A lowercase letter</p>
              <p className={passwordValid.number ? 'text-green-500' : 'text-red-500'}>{passwordValid.number ? '✔' : '✘'} A number</p>
              <p className={passwordValid.specialChar ? 'text-green-500' : 'text-red-500'}>{passwordValid.specialChar ? '✔' : '✘'} A special character</p>
            </div>
          </div>

          {/* Repeat Password Input */}
          <div className="mb-6">
            <label className={`block text-sm font-medium ${passwordMatch ? 'text-gray-700' : 'text-red-500'}`}>Repeat Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Repeat new password"
              className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500 ${!passwordMatch ? 'border-red-500 bg-red-100' : ''}`}
              required
            />
            {!passwordMatch && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <img src={ExclamationMarkIcon} alt="Error" className="w-5 h-5 mr-2" />
                The passwords do not match.
              </p>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-center mb-4 flex items-center text-sm">
              <img src={ExclamationMarkIcon} alt="Error" className="w-5 h-5 mr-2" />
              {errorMessage}
            </p>
          )}

          {/* Submit Button */}
          <div>
            <GradientButton type="submit">RESET PASSWORD</GradientButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
