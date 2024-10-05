// src/pages/login/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import VektordataLogo from '../../assets/svgs/vektordata-banner.svg';
import GradientButton from '../../components/GradientButton/gradientbutton';
import './LoginPage.css';
import ExclamationMarkIcon from '../../assets/svgs/exclamation-mark-inside-a-circle.svg';
import EyeIcon from '../../assets/svgs/eye-icon.svg'; 
import EyeOffIcon from '../../assets/svgs/eye-off-icon.svg'; 
import { API_URL, DATABASE_NAME } from '../../config/config';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
    document.title = 'Vektordata - Login';
  }, []);



  // const buttons = [
  //   { text: "Sign Up", href: "/signup" },
  //   { text: "Check Email", href: "/check-email" },
  //   { text: "Success", href: "/success" },
  //   { text: "Verify Email", href: "/verify-email" },
  //   { text: "Link Expired", href: "/link-expired" },
  //   { text: "Login", href: "/login" },
  // ];

  const notifyVerifyEmail = () => {
    toast(
      <div>
        <div className="flex items-center">
          <img src={ExclamationMarkIcon} alt="Error" className="w-5 h-5 mr-2" />
          <p className="font-bold text-xl text-red-500">Verify Your Email Address</p>
        </div>
        <p className="mt-1 text-gray-400">Please check your inbox and verify your email address.</p>

      </div>,
      {
        position: 'top-right',
        autoClose: 5000,
        closeOnClick: true,
        hideProgressBar: true,
        className: 'custom-toast-container',
      }
    );
  };
  

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log('Logging in with', email, password);
    
  //   // Hardcoded login check
  //   if (email === 'admin@test.com' && password === 'admin') {
  //     setErrorMessage('');
  //     setEmailError(false);
  //     setPasswordError(false);
  //     // alert('Login successful!');
  //     // navigate('/success');
  //     // Show success toast notification
  //     notifyVerifyEmail(); // Show email verification toast
  //     // setTimeout(() => navigate('/success'), 3000); // Navigate after a delay

  //   } else {
  //     setErrorMessage('Email and/or password you have entered is incorrect');
  //     setEmailError(true);
  //     setPasswordError(true);
  //   }
  // };


  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log('Logging in with', email, password);

    // Save email to localStorage
    localStorage.setItem('userEmail', email);
  
    // Prepare the data to send
    const requestData = {
      database_name: DATABASE_NAME, 
      email: email,
      hashpassword: password
    };
  
    try {
      const response = await fetch(`${API_URL}/email-login`, { // Use the API_URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Handle success (you might want to navigate to a success page here)
        notifyVerifyEmail(); // Show email verification toast
        setTimeout(() => navigate('/admin'), 3000); // Uncomment to navigate after a delay
      } else {
        // Handle error
        setErrorMessage(data.message);
        setEmailError(true);
        setPasswordError(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while logging in.');
      setEmailError(true);
      setPasswordError(true);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 relative">

      {/* Toast Container for displaying notifications */}
      <ToastContainer />

      {/* Button Container */}
      {/* <div className="absolute top-4 right-4 flex flex-col items-center space-y-4">
        {buttons.map((button, index) => (
          <button
            key={index}
            className="w-full max-w-xs px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500 transition"
            onClick={() => navigate(button.href)}
          >
            {button.text}
          </button>
        ))}
      </div> */}

      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        {/* <div className="flex justify-center">
          <img src={VektordataLogo} alt="Vektordata Logo" className="w-48" />
        </div>

        <h2 className="text-2xl font-extrabold text-center">LOG IN</h2> */}

        <div className="flex justify-center">
            <img src={VektordataLogo} alt="Vektordata Logo" className="w-48 logo" style={{ marginBottom: '0px' }} />
        </div>

        {/* <h2 className="text-2xl font-extrabold text-center" style={{ marginTop: '0', marginBottom: '16px' }}>LOG IN</h2> */}
        <h2 className="text-2xl text-center" style={{ marginTop: '0', marginBottom: '16px', fontWeight: '900' }}>
          LOG IN
        </h2>
        <p className="text-center text-sm text-gray-400 mb-8">Find faster, build smarter</p>
        
        {/* Error Message */}
        {/* {errorMessage && (
          <p className="text-red-500 text-center mb-4 flex items-center justify-center text-sm">
            <img src={ExclamationMarkIcon} alt="Error" className="w-5 h-5 mr-2" /> 
            {errorMessage}
          </p>
        )} */}

        {errorMessage && (
          <p className="text-red-500 mb-4 flex items-center justify-center text-sm whitespace-nowrap">
            <img src={ExclamationMarkIcon} alt="Error" className="w-5 h-5 mr-2" />
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`text-sm font-medium ${emailError ? 'text-red-500' : 'text-gray-700'}`}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className={`w-full px-4 py-2 mt-1 border rounded-full bg-gray-50 ${emailError ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-700'} focus:border-blue-500 focus:ring-blue-500`}
            />
          </div>
          
      <div className="relative">
        <label htmlFor="password" className={`text-sm font-medium ${passwordError ? 'text-red-500' : 'text-gray-700'}`}>
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"} // Toggle type based on showPassword
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className={`w-full px-4 py-2 mt-1 border rounded-full bg-gray-50 ${passwordError ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-700'} focus:border-blue-500 focus:ring-blue-500`}
        />
        <button
          type="button"
          className="absolute right-3 top-10" // Adjust positioning inside the input
          onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
        >
          <img src={showPassword ? EyeOffIcon : EyeIcon} alt="Toggle Password Visibility" className="w-5 h-5" />
        </button>
      </div>

          
        {/* <div className="flex items-center justify-end">
          <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot password?</a>
        </div> */}

        <div className="flex items-center justify-end">
          <a
            href="/forgot-password"
            className="text-sm text-blue-500 hover:underline font-black"
            onClick={async (e) => {
              e.preventDefault(); // Prevent the default anchor behavior
              const storedEmail = localStorage.getItem('userEmail');
              if (storedEmail) {
                const requestData = {
                  database_name: DATABASE_NAME,
                  email: storedEmail,
                };

                try {
                  const response = await fetch(`${API_URL}/check-email`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                  });

                  if (response.ok) {
                    // If email exists, navigate to the forgot password page
                    navigate('/forgot-password');
                  } else {
                    const data = await response.json();
                    alert(data.message || 'Email does not exist');
                  }
                } catch (error) {
                  console.error('Error checking email:', error);
                  alert('An error occurred while checking the email.');
                }
              } else {
                alert("No email found");
              }
            }}
            
          >
            Forgot password?
          </a>
        </div>

          <div>
            <GradientButton>
              LOG IN
            </GradientButton>
          </div>
        </form>
        
        <p className="text-sm text-center">
          Don't have an account? <a href="/signup" className="text-blue-500 hover:underline font-black">Sign up</a>
        </p>

        {/* more space here */}
        <div className="mt-100" />
      </div>
    </div>
  );
};

export default LoginPage;
