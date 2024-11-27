// src/components/WithSidebar/withsidebar.js
import React, { useEffect } from 'react';
import { API_URL } from '../../config/config';
import Sidebar from '../Sidebar/sidebar';
import './withsidebar.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WithSidebar = ({ children }) => {

  // useEffect hook to log when the component is loaded
  useEffect(() => {
    console.log("withsidebar is loaded");

    const placeId = localStorage.getItem('place_id'); // Get place_id from localStorage

    if (!placeId) {
      toast.error("No place_id found. Please select a location.");
    } else {
      // Fetch review data from Flask API
      fetchReviewsFromFlask(placeId);
    }
  }, []); // The empty array ensures this runs only once when the component mounts.

  const fetchReviewsFromFlask = async (placeId) => {
    try {
      const response = await fetch(`${API_URL}/load-review-by-id?review_id=${placeId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to load review data from server');
      }

      const data = await response.json();
      if (data.error) {
        toast.error(data.error); // Show error message if any
      } else {
        toast.success(data.message); // Show success message if reviews are successfully loaded
      }
    } catch (error) {
      toast.error(error.message); // Handle any errors
    }
  };

  return (
    <div className="app-container">
      <ToastContainer /> {/* To display toast notifications */}
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default WithSidebar;
