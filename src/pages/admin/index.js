// src/pages/admin/index.js

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import VektordataBanner from '../../assets/svgs/vektordata-banner.svg';
import LocationIcon from '../../assets/svgs/location.svg';
import './AdminPage.css';
// import GradientButton from '../../components/GradientButton/gradientbutton';
import { API_URL } from '../../config/config';

const steps = ['Company', 'Data Source', 'AI Model'];

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [location, setLocation] = useState(''); 
  const [placeIds, setPlaceIds] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");  // Initial state empty

  // const [placeNames, setPlaceNames] = useState({});
  const [placeDetails, setPlaceDetails] = useState({});
  // const [typingTimeout, setTypingTimeout] = useState(null); // State for timeout
  const typingTimeoutRef = useRef(null); // Use ref for timeout ID

  const handlePlaceIdChange = (event) => {
    const newPlaceId = event.target.value;
    setSelectedPlaceId(newPlaceId); // Update local state
    localStorage.setItem("place_id", newPlaceId); // Sync localStorage
  };

  useEffect(() => {
    document.title = 'Admin - Vektordata';
  }, []);

   // Sync selectedPlaceId with localStorage on mount and when localStorage changes
   useEffect(() => {
    const placeIdFromLocalStorage = localStorage.getItem("place_id");
    if (placeIdFromLocalStorage) {
      setSelectedPlaceId(placeIdFromLocalStorage); // Sync with state
    }
  }, []); // Empty array ensures this runs only on initial mount

  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current); // Clear the previous timeout
    }

    // const fetchPlaceNames = async (ids) => {
    //   const names = {};
    //   for (const id of ids) {
    //     try {
    //       const response = await fetch(`${API_URL}/google/get-place-name`, {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ place_id: id }),
    //       });

    //       if (response.ok) {
    //         const data = await response.json();
    //         names[id] = data.place_name; // Store the place name with place ID as key
    //       } else {
    //         console.error(`Error fetching place name for ID ${id}`);
    //       }
    //     } catch (error) {
    //       console.error('Error:', error);
    //     }
    //   }
    //   setPlaceNames(names); // Update state with the fetched names
    // };

    const fetchPlaceDetails = async (ids) => {
      const details = {};
      for (const id of ids) {
        try {
          const response = await fetch(`${API_URL}/google/get-place-details`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ place_id: id }),
          });

          if (response.ok) {
            const data = await response.json();
            details[id] = `${data.place_name}, ${data.address}`; // Store the formatted string
          } else {
            console.error(`Error fetching place details for ID ${id}`);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
      setPlaceDetails(details);
    };

    const fetchTopPlaceIds = async (location) => {
      try {
        const response = await fetch(`${API_URL}/google/get-top-place-ids`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ place_name: location }),
        });
    
        // Check if the response is OK
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error:', errorData.error || 'An error occurred');
          return;
        }
    
        const data = await response.json();
        console.log('Place IDs:', data.place_ids);

        setPlaceIds(data.place_ids); 
        // fetchPlaceNames(data.place_ids);
        fetchPlaceDetails(data.place_ids); 

      } catch (error) {
        console.error('Error:', error);
      }
    };

    
    
    // Set a new timeout
    typingTimeoutRef.current = setTimeout(() => {

      if (location.trim()) { // Check if location is not empty
        console.log(location); // Log the location value when user stops typing
        fetchTopPlaceIds(location);
      }
      
    }, 500); // Adjust the delay as needed

    return () => clearTimeout(typingTimeoutRef.current); // Cleanup on component unmount
  }, [location]); // Only depend on location

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleGotoDashobard = () => {
    navigate('/dashboard'); // Navigate to the dashboard page
  };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  const isStepCompleted = (stepIndex) => stepIndex < activeStep;

  // Function to handle location icon click
  const handleLocationClick = () => {
    alert("You clicked the location icon");
  };

  return (
    <div className="resetpassword-container flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl text-center" style={{ marginTop: '0', marginBottom: '0px', fontWeight: '900', color: 'navy' }}>
            WELCOME TO
          </h2>
          <img src={VektordataBanner} alt="Vektordata Logo" className="w-48 logo" style={{ marginTop: '-50px', marginBottom: '0px' }} />
        </div>

        {/* Stepper */}
        <div className="w-full flex justify-center mb-6 stepper-container">
          <div className="stepper-line"></div>
          <div className="stepper-line-active" style={{ width: `${(activeStep / (steps.length - 1)) * 90}%` }}></div>

          {steps.map((label, index) => (
            <div
              key={label}
              className={`stepper-step ${index === activeStep ? 'stepper-active' : ''}`}
              onClick={() => setActiveStep(index)}
            >
              <div className={`stepper-icon ${isStepCompleted(index) ? 'completed' : ''} ${index === activeStep ? 'stepper-icon-active' : ''}`}>
                {index < activeStep ? '✔' : ''}
              </div>
              <span className="stepper-label">{label}</span>
            </div>
          ))}
        </div>

        {activeStep === 0 && (
          <form onSubmit={handleNext}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Company</label>
              {/* <select
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500"
                required
              >
                <option value="" disabled>Select a company</option>
                <option value="company1">Company 1</option>
                <option value="company2">Company 2</option>
                <option value="company3">Company 3</option>
              </select> */}

            {/* <select
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500"
              required
            >
              <option value="" disabled>Select a company</option>
              {placeIds.map((placeId) => (
                <option key={placeId} value={placeId}>
                  {placeNames[placeId] || 'Loading...'} 
                </option>
              ))}
            </select> */}

              <select
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500"
                required
                value={selectedPlaceId} 
                onChange={handlePlaceIdChange} 
              >
                <option value="" disabled>Select a company</option>
                {placeIds.map((placeId) => (
                  <option key={placeId} value={placeId}>
                    {placeDetails[placeId] || 'Loading...'}
                  </option>
                ))}
              </select>

            </div>

            <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500"
              required
              value={location} // Bind the input value to state
              onChange={(e) => setLocation(e.target.value)} // Update state on input change
            />
              
              {/* <img src={LocationIcon} alt="Location Icon" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" /> */}
              <img 
                src={LocationIcon} 
                alt="Location Icon" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer" 
                onClick={handleLocationClick} 
              />
            </div>

            <div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold py-2 px-4 rounded-full">
                NEXT
              </button>
            </div>
          </form>
        )}

        {activeStep === 1 && (
          <form onSubmit={handleNext}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Internal Data Source</label>
              <select
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500"
                required
              >
                <option value="" disabled>Select an internal data source</option>
                <option value="source1">Source 1</option>
                <option value="source2">Source 2</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">External Data Source</label>
              <select
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500"
                required
              >
                <option value="" disabled>Select an external data source</option>
                <option value="source1">Source 1</option>
                <option value="source2">Source 2</option>
              </select>
            </div>

            <div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold py-2 px-4 rounded-full">
                NEXT
              </button>
            </div>
          </form>
        )}

        {activeStep === 2 && (
          <form onSubmit={handleGotoDashobard}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">AI Model for Internal Data Source</label>
              <select
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500"
                required
              >
                <option value="" disabled>Select an internal data source</option>
                <option value="source1">Source 1</option>
                <option value="source2">Source 2</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">AI Model for  External Data Source</label>
              <select
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-500"
                required
              >
                <option value="" disabled>Select an external data source</option>
                <option value="source1">Source 1</option>
                <option value="source2">Source 2</option>
              </select>
            </div>

            <div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold py-2 px-4 rounded-full">
                GOTO DASHBOARD
              </button>
            </div>
          </form>
        )}


      </div>
    </div>
  );
};

export default AdminPage;
