import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import SignupPage from './pages/signup'; 
import CheckEmailPage from './pages/check-email';
import SuccessPage from './pages/success';
import VerifyEmailPage from './pages/verify-email'; 
import LinkExpiredPage from './pages/link-expired'; 
import LoginPage from './pages/login';
import VektordataBanner from './assets/svgs/vektordata-banner.svg'; 

function AllPages() {
  const navigate = useNavigate();

  const buttons = [
    { text: "Sign Up", href: "/signup" },
    { text: "Check Email", href: "/check-email" },
    { text: "Success", href: "/success" },
    { text: "Verify Email", href: "/verify-email" },
    { text: "Link Expired", href: "/link-expired" },
    { text: "Login", href: "/login" },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      
      <div className="mt-12 mb-8">
        {/* Logo */}
        <img src={VektordataBanner} alt="VektordataBanner-logo" /> 
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Navigate to Pages</h1>

      {/* Button Container */}
      <div className="flex flex-col items-center space-y-4 w-full">
        {buttons.map((button, index) => (
          <button
            key={index}
            className="w-full max-w-xs px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500 transition"
            onClick={() => navigate(button.href)}
          >
            {button.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<AllPages />} /> */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/link-expired" element={<LinkExpiredPage />} />
      </Routes>
    </Router>
  );
}

export default App;
