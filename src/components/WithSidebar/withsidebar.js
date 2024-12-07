import React, { useEffect, useState } from 'react';
import { API_URL } from '../../config/config';
import Sidebar from '../Sidebar/sidebar';
import './withsidebar.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WithSidebar = ({ children }) => {
  // Declare state to store place_id
  const [placeId, setPlaceId] = useState(localStorage.getItem('place_id')); // Initialize from localStorage
  const [placeName, setPlaceName] = useState(localStorage.getItem('place_name')); // Initialize from localStorage


  useEffect(() => {
    // This effect runs on component mount and listens for storage changes
    console.log("withsidebar is loaded");

    // Fetch review data if placeId exists
    if (placeId) {
      setPlaceId(placeId); // Sync with state
      setPlaceName(placeName); // Sync with state
      fetchReviewsFromFlask(placeId);
      sendTableDataToFlask(placeId, placeName); // Call function to send table data
    } else {
      toast.error("No place_id found. Please select a location.");
    }

    // Event listener to handle changes to localStorage
    const handleStorageChange = (event) => {
      if (event.key === 'place_id') { // Check if the place_id was modified
        const newPlaceId = localStorage.getItem('place_id');
        const newPlaceName = localStorage.getItem('place_name');
        
        if (newPlaceId !== placeId || newPlaceName !== placeName) {
          setPlaceId(newPlaceId);  // Update state with new place_id from localStorage
          setPlaceName(newPlaceName);  // Update state with new place_name from localStorage
          console.log("localStorage Changed!");
          sendTableDataToFlask(newPlaceId, newPlaceName);  // Send data to Flask
        }
      }
    };

    // Add storage event listener for cross-tab/localStorage changes
    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [placeId, placeName]); // Re-run the effect when placeId changes

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

  // Function to send table data to Flask
  const sendTableDataToFlask = async (placeId, placeName) => {
    try {
      console.log('Sending table data to Flask...');
      
      // Prepare data to send in the request body
      const data = [
        {
          place_id: placeId,
          place_name: placeName,
          // Add other necessary fields for the table data here if needed
        },
      ];

      const response = await fetch(`${API_URL}/vektordata/add-review-table-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send the data as JSON
      });

      if (!response.ok) {
        throw new Error('Failed to send table data to Flask');
      }

      const responseData = await response.json();
      if (responseData.error) {
        toast.error(responseData.error); // Show error message if any
      } else {
        toast.success(responseData.message); // Show success message if data is successfully added
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
