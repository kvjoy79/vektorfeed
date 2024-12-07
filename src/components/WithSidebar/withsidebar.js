import React, { useEffect, useState } from 'react';
import { API_URL } from '../../config/config';
import Sidebar from '../Sidebar/sidebar';
import './withsidebar.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WithSidebar = ({ children }) => {
  // Declare state to store place_id
  const [placeId, setPlaceId] = useState(localStorage.getItem('place_id')); // Initialize from localStorage

  useEffect(() => {
    // This effect runs on component mount and listens for storage changes
    console.log("withsidebar is loaded");

    // Fetch review data if placeId exists
    if (placeId) {
      setPlaceId(placeId); // Sync with state
      fetchReviewsFromFlask(placeId);
    } else {
      toast.error("No place_id found. Please select a location.");
    }

    // Event listener to handle changes to localStorage
    const handleStorageChange = (event) => {
      if (event.key === 'place_id') { // Check if the place_id was modified
        const newPlaceId = localStorage.getItem('place_id');
        if (newPlaceId !== placeId) {
          setPlaceId(newPlaceId);  // Update state with new place_id from localStorage
          console.log("localStorage Changed!");
          console.log(newPlaceId);
          fetchReviewsFromFlask(newPlaceId);  // Fetch new reviews
          
        }
      }
    };

    // Add storage event listener for cross-tab/localStorage changes
    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [placeId]); // Re-run the effect when placeId changes

  const fetchReviewsFromFlask = async (placeId) => {
    try {
      console.log(`load-review-by-id: ${placeId}`);
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
