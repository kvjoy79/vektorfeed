import React, { useState, useEffect } from 'react';
import './SignupPage.css';
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import GradientButton from '../../components/GradientButton/gradientbutton';
import ExclamationMarkIcon from '../../assets/svgs/exclamation-mark-inside-a-circle.svg';
import { useNavigate } from 'react-router-dom'; 
import { API_URL, DATABASE_NAME } from '../../config/config';
import { v4 as uuidv4 } from 'uuid'; 

const SignupPage = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  useEffect(() => {
    document.title = 'Sign Up - Vektordata';
  }, []);

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);

    // Regex pattern to reject common personal email domains
    const businessEmailPattern = /^(?!.*@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|live\.com|icloud\.com|aol\.com|protonmail\.com|mail\.com)).+@.+\..+$/;  
    const isValid = businessEmailPattern.test(newEmail); // Define isValid here
    setEmailValid(isValid);

    if (!isValid) {
      setErrorMessage("Please enter a valid email address");
    } else {
      setErrorMessage(''); // Clear error message if valid
    }

  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);

    // Validation checks
    setPasswordValid({
      length: newPassword.length >= 6,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    });
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordMatch(event.target.value === password);
  };

  // const handleSignup = (event) => {
  //   event.preventDefault();
  //   if (!emailValid) {
  //     alert("Please enter a valid business email.");
  //     return;
  //   }

  //   if (passwordMatch && Object.values(passwordValid).every(Boolean)) {
  //     console.log('Sign-up successful');
  //     navigate('/check-email'); // Navigate to the check-email page
  //   } else {
  //     console.log('Password validation failed');
  //   }
  // };


  const handleSignup = async (event) => {
    event.preventDefault();
    
    if (!emailValid) {
      alert("Please enter a valid business email.");
      return;
    }
  
    if (passwordMatch && Object.values(passwordValid).every(Boolean)) {
      const verification_hash = uuidv4(); 
  
      try {
        const response = await fetch(`${API_URL}/add-useremail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            database_name: DATABASE_NAME,
            email: email,
            hashpassword: password,
            verification_hash: verification_hash 
          })
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Sign-up successful', data);
          
          // Store verification_hash in localStorage
          localStorage.setItem('verification_hash', verification_hash);

          // Store email in localStorage
          localStorage.setItem('userEmail', email);
  
          // Send verification email
          const emailResponse = await fetch(`${API_URL}/send-verification-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              recipient_email: email,
              token: verification_hash // Send the verification hash as token
            })
          });
  
          if (emailResponse.ok) {
            console.log('Verification email sent successfully');
            navigate('/check-email');
          } else {
            const errorData = await emailResponse.json();
            alert(errorData.error); // Show error message from email sending
          }
        } else {
          const errorData = await response.json();
          alert(errorData.message); // Show error message from server
        }
      } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred during signup. Please try again.');
      }
    } else {
      console.log('Password validation failed');
    }
  };
  
  

  return (


    // <div className="signup-container flex items-center justify-center h-screen bg-gray-100 relative">
    <div className="signup-container flex items-center justify-center h-screen bg-white-100 relative">
  {/* //  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50"> */}


      {/* <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md mt-6"> */}
      {/* <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg"> */}
      <div className="w-full max-w-md p-8 space-y-8 ">

  
        <div className="flex justify-center">

          <img src={VektordataBanner} alt="Vektordata Logo" className="w-48 logo" style={{ marginBottom: '0px' }} />

        </div>

        {/* <h2 className="text-center text-2xl font-semibold text-gray-700 mb-4">SIGN UP</h2> */}

        {/* <h2 className="text-2xl font-extrabold text-center" style={{ marginTop: '0', marginBottom: '16px' }}>LOG IN</h2> */}
        <h2 className="text-2xl text-center" style={{ marginTop: '0', marginBottom: '16px', fontWeight: '900' }}>
          SIGN UP
        </h2>
        
        <p className="text-center text-sm text-gray-400 mb-5">Find faster, build smarter</p>

        <form onSubmit={handleSignup}>
          {/* Email Input */}
          <div className="mb-2">
            {/* <label className="block text-gray-700">Email</label> */}
            <label htmlFor="email" className={`text-sm font-medium ${emailValid ? 'text-gray-700' : 'text-red-500' }`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onFocus={() => setEmailFocused(true)} 
              onBlur={() => setEmailFocused(false)} 
              placeholder="Please use only business email"
              className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500 ${!emailValid ? 'border-red-500 bg-red-100' : ''}`}
              required
            />

            {/* {!emailValid && (
              <p className="text-red-500 text-xs mt-1">Please use only business email. Other emails are not allowed.</p>
            )} */}
            {emailFocused && ( // Show validation messages if focused
              <p className="text-red-500 text-xs mt-1">Please use only business email. Other emails are not allowed.</p>
            )}
          </div>

          {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-center mb-4 flex items-center text-sm">
                <img src={ExclamationMarkIcon} alt="Error" className="w-5 h-5 mr-2" />
                {errorMessage}
              </p>
          )}

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => setPasswordFocused(true)} 
              onBlur={() => setPasswordFocused(false)} 
              placeholder="Password"
              className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500 ${!Object.values(passwordValid).every(Boolean) ? 'border-red-500 bg-red-100' : ''}`}
              required
            />
            {passwordFocused && ( // Show validation messages if focused
              <div className="mt-2 text-sm">
                <p className={passwordValid.length ? 'text-green-500' : 'text-red-500'}>
                  {passwordValid.length ? '✔' : '✘'} Min 6 characters
                </p>
                <p className={passwordValid.uppercase ? 'text-green-500' : 'text-red-500'}>
                  {passwordValid.uppercase ? '✔' : '✘'} An uppercase letter
                </p>
                <p className={passwordValid.lowercase ? 'text-green-500' : 'text-red-500'}>
                  {passwordValid.lowercase ? '✔' : '✘'} A lowercase letter
                </p>
                <p className={passwordValid.number ? 'text-green-500' : 'text-red-500'}>
                  {passwordValid.number ? '✔' : '✘'} A number
                </p>
                <p className={passwordValid.specialChar ? 'text-green-500' : 'text-red-500'}>
                  {passwordValid.specialChar ? '✔' : '✘'} A special character
                </p>
              </div>
            )}
          </div>

          {/* Repeat Password Input */}
          <div className="mb-1">
            <label className="block text-gray-700">Repeat Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Repeat Password"
              className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500 ${!passwordMatch ? 'border-red-500 bg-red-100' : ''}`}
              required
            />
            {!passwordMatch && (
              <p className="text-red-500 text-sm mt-3 flex items-center"> {/* Increased margin and font size */}
                <img src={ExclamationMarkIcon} alt="Error" className="w-5 h-5 mr-2" />
                The passwords do not match.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div> 
            <GradientButton type="submit">SIGN UP</GradientButton>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 "  >
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
        {/* more space here */}
        <div className="mt-50" />
      </div>
    </div>
  );
};

export default SignupPage;
