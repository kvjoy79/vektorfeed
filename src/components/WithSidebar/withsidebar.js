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

    // Fetch table data if placeId and placeName exist
    if (placeId && placeName) {
      setPlaceId(placeId); // Sync with state
      setPlaceName(placeName); // Sync with state
      fetchReviewsFromFlask(placeId);
      sendTableDataToFlask(placeId, placeName); // Call function to send table data
    } else {
      toast.error("No place_id or place_name found. Please select a location.");
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
  }, [placeId, placeName]); // Re-run the effect when placeId changes

  const fetchReviewsFromFlask = async (placeId) => {
    try {

      // Check if the "milvusdb_loaded" flag is set to "yes" in localStorage
      const isMilvusdbLoaded = localStorage.getItem('milvusdb_loaded');

      // If "milvusdb_loaded" is "yes", skip the API call
      if (isMilvusdbLoaded === 'yes') {
        console.log("API calls skipped, milvusdb already loaded.");
        return; // Exit the function
      }

      console.log(`load-review-by-id: ${placeId}`);
      const response = await fetch(`${API_URL}/load-review-by-id?review_id=${placeId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to load review data from server');
      }

      const data = await response.json();
      if (data.error) {
        // Check if the specific error message exists
        if (data.error === "No valid review text found.") {
          toast.error("No valid review text found."); // Show this specific error message as a toast
        } else {
          toast.error(data.error); // Handle other errors as generic toast errors
        }
      } else {
        // Set the "milvusdb_loaded" flag to "yes" in localStorage
        localStorage.setItem('milvusdb_loaded', 'yes');
        toast.success(data.message); // Show success message if reviews are successfully loaded
      }
    } catch (error) {
      toast.error(error.message); // Handle any errors
    }
  };

  const sendTableDataToFlask = async (placeId, placeName) => {
    try {
      // Prepare the data to be sent
      const data = [
        {
          place_id: placeId,    // Ensure placeId is valid
          placename: placeName, // Ensure placeName is valid
        },
      ];

      // Check if the "table_loaded" flag is set to "yes" in localStorage
      const isTableLoaded = localStorage.getItem('table_loaded');

      // If "table_loaded" is "yes", skip the API call
      if (isTableLoaded === 'yes') {
        console.log("API calls skipped, table already loaded.");
        return; // Exit the function
      }
  
      // Log the data to make sure it's in the correct format
      console.log('Data to send to Flask:', data);
  
      // Make the API call
      const response = await fetch(`${API_URL}/vektordata/add-review-table-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send data as JSON
      });
  
      // Check if response is OK
      if (!response.ok) {
        throw new Error('Failed to send table data to Flask');
      }
  
      // Parse the response
      const responseData = await response.json();
  
      // Handle response
      if (responseData.error) {
        toast.error(responseData.error); // Show error if any
      } else {
        // Set the "table_loaded" flag to "yes" in localStorage
        localStorage.setItem('table_loaded', 'yes');
        // toast.success(responseData.message); // Show success message
        console.log(responseData.message);
      }
    } catch (error) {
      // Handle errors
      toast.error(error.message); 
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
