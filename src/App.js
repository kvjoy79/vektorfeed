// src\App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SignupPage from './pages/signup'; 
import CheckEmailPage from './pages/check-email';
import SuccessPage from './pages/success';
import ResetSuccessPage from './pages/reset-success';
import VerifyEmailPage from './pages/verify-email'; 
import LinkExpiredPage from './pages/link-expired';
import ForgotPasswordPage from './pages/forgot-password';
import ResetPasswordPage from './pages/reset-password'; 
import LoginPage from './pages/login';
import AdminPage from './pages/admin';
import Dashboard from './pages/dashboard'; 
import FeedbackGPT from './pages/feedbackgpt';
import Notifications from './pages/notifications';
import Settings from './pages/settings';
import Logout from './pages/logout';
import Reviews from './pages/reviews';
import WithSidebar from './components/WithSidebar/withsidebar';



function App() {
  return (
    <Router>
      <Routes>
        {/* No sidebar routes */}
        {/* <Route path="/" element={<AllPages />} /> */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/reset-success" element={<ResetSuccessPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/link-expired" element={<LinkExpiredPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* Routes with sidebar */}
        <Route
          path="/dashboard"
          element={
            <WithSidebar>
              <Dashboard />
            </WithSidebar>
          }
        />

        <Route
          path="/reviews"
          element={
            <WithSidebar>
              <Reviews />
            </WithSidebar>
          }
        />

        <Route
          path="/feedbackgpt"
          element={
            <WithSidebar>
              <FeedbackGPT />
            </WithSidebar>
          }
        />

        <Route
          path="/notifications"
          element={
            <WithSidebar>
              <Notifications />
            </WithSidebar>
          }
        />

        <Route
          path="/settings"
          element={
            <WithSidebar>
              <Settings />
            </WithSidebar>
          }
        />

        <Route
          path="/logout"
          element={
            <WithSidebar>
              <Logout />
            </WithSidebar>
          }
        />


      </Routes>
    </Router>
  );
}

export default App;
