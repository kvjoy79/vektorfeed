import React, { useState, useEffect } from 'react';
import './SignupPage.css';
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import GradientButton from '../../components/GradientButton/gradientbutton';
import ExclamationMarkIcon from '../../assets/svgs/exclamation-mark-inside-a-circle.svg';
import { useNavigate } from 'react-router-dom'; 
import { API_URL, DATABASE_NAME } from '../../config/config';

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

  useEffect(() => {
    document.title = 'Sign Up - Vektordata';
  }, []);

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);

    const businessEmailPattern = /@(achieve\.com|company\.com)$/;
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
      // const useremail = email.split('@')[0]; // Simple username extraction

      try {
        const response = await fetch(`${API_URL}/add-useremail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            database_name: DATABASE_NAME,
            email: email,
            hashpassword: password 
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Sign-up successful', data);
          navigate('/check-email');
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mt-12">
        <img src={VektordataBanner} alt="VektordataBanner-logo" />
      </div>

      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md mt-6">
        <h2 className="text-center text-2xl font-semibold text-gray-700 mb-4">SIGN UP</h2>
        <p className="text-center text-sm text-gray-400 mb-8">Find faster, build smarter</p>

        <form onSubmit={handleSignup}>
          {/* Email Input */}
          <div className="mb-4">
            {/* <label className="block text-gray-700">Email</label> */}
            <label htmlFor="email" className={`text-sm font-medium ${emailValid ? 'text-gray-700' : 'text-red-500' }`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Please use only business email"
              className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500 ${!emailValid ? 'border-red-500 bg-red-100' : ''}`}
              required
            />

            {/* {!emailValid && (
              <p className="text-red-500 text-xs mt-1">Please use only business email. Other emails are not allowed.</p>
            )} */}

            <p className="text-red-500 text-xs mt-1">Please use only business email. Other emails are not allowed.</p>
    
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
              placeholder="Password"
              className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500 ${!Object.values(passwordValid).every(Boolean) ? 'border-red-500 bg-red-100' : ''}`}
              required
            />
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
          </div>

          {/* Repeat Password Input */}
          <div className="mb-6">
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
              <p className="text-red-500 text-sm mt-5 flex items-center"> {/* Increased margin and font size */}
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

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>

      <div className="mt-60" />
    </div>
  );
};

export default SignupPage;
