import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/card';
import './DashboardPage.css';
import LikeIcon from '../../assets/pngs/like-icon.png';
import DislikeIcon from '../../assets/pngs/dislike-icon.png';
import GoogleIcon from '../../assets/svgs/google-icon-logo-svgrepo-com.svg';
import GreenUpArrow from '../../assets/svgs/green-up-arrow.svg';
import RedDownArrow from '../../assets/svgs/red-down-arrow.svg';
import { API_URL } from '../../config/config';
import dayjs from 'dayjs';
import LineGraph from '../../components/LineGraph/linegraph';


const Dashboard = () => {


  const [activeButton, setActiveButton] = useState('Last Month');
  const [overallRating, setOverallRating] = useState(null);
  const [googleRating, setGoogleRating] = useState(null);
  const [starCountOverall, setStarCountOverall] = useState(0.1); // Starting with 0.1 stars
  const [starCountGoogle, setStarCountGoogle] = useState(0.1); // Starting with 0.1 stars
  const [iconTypeOverallRating, setIconTypeOverallRating] = useState(''); // Default to green-up arrow
  const [iconTypeGoogleRating, setIconTypeGoogleRating] = useState(''); // Default to green-up arrow
  const [positiveKeywords, setPositiveKeywords] = useState([]);
  const [negativeKeywords, setNegativeKeywords] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [reviewId, setReviewId] = useState(localStorage.getItem('place_id')); // Initialize from localStorage
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);  // Show custom date range
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [tableData, setTableData] = useState([]);
  const [xLabels, setXLabels] = useState([]);
  const [yValues, setYValues] = useState([]);

  const [modalData, setModalData] = useState(null); // State for storing modal data
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  // const yValues = [1, 0, 3, 4, 5, 6, 10]; // Data for each day of the week (Sunday to Saturday)


  // Handle Date Validation
  const validateDates = (start, end) => {
    const currentDate = dayjs();
    const startDate = dayjs(start);
    const endDate = dayjs(end);

    // Check if the dates are in the valid range
    if (startDate.isAfter(currentDate, 'day') || endDate.isAfter(currentDate, 'day')) {
      setDateError('Dates cannot be in the future.');
      return false;
    }
    if (startDate.year() < 2000 || endDate.year() < 2000) {
      setDateError('Dates cannot be earlier than the year 2000.');
      return false;
    }
    if (endDate.diff(startDate, 'days') > 365) {
      setDateError('The date range cannot be longer than 1 year.');
      return false;
    }

    setDateError('');
    return true;
  };

  // Handle Custom Date Range Submit
  const handleDateSubmit = () => {
    if (validateDates(startDate, endDate)) {
      setActiveButton('Custom Date Range');
      setShowCustomDateRange(false); // Close the modal
      console.log(`Fetching data from ${startDate} to ${endDate}`);
      // You can add your API call here with the custom date range.
    }
  };

  // Function to handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      setShowCustomDateRange(false);
    }
  };

  useEffect(() => {
    if (activeButton === 'Last Month') {
      // setShowCustomDateRange(true);
      console.log("Last Month!");
      
    } 
    // else {
    //   // setShowCustomDateRange(false);
    // }
  }, [activeButton]);

  useEffect(() => {
    if (activeButton === 'Custom Date Range') {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
    }
  }, [activeButton]);
  
  // Fetch Google rating on mount
  useEffect(() => {
    const fetchGoogleRating = async () => {
      const placeId = localStorage.getItem('orig_place_id');
      if (!placeId) {
        setErrorMessage('No orig_place_id');
        return;
      }

      // Check if the rating is already stored in localStorage
      const storedRating = localStorage.getItem('googleRating');
      if (storedRating) {
        // If stored, use the stored rating
        setGoogleRating(JSON.parse(storedRating));

        // Set the arrow based on the stored rating
        if (JSON.parse(storedRating) >= 4.5) {
          setIconTypeGoogleRating('green-up-arrow');
        } else if (JSON.parse(storedRating) < 3.5) {
          setIconTypeGoogleRating('red-down-arrow');
        } else {
          setIconTypeGoogleRating(''); // No arrow for ratings between 3.5 and 4.5
        }

        console.log("Loaded Google rating from localStorage.");
        return; // Exit if the rating is found in localStorage
      }

      try {
        const response = await fetch(`${API_URL}/google/get-place-rating?place_id=${placeId}`);
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          const rating = data.rating;
          setGoogleRating(rating);

          // Set the arrow based on the rating
          if (rating >= 4.5) {
            setIconTypeGoogleRating('green-up-arrow');
          } else if (rating < 3.5) {
            setIconTypeGoogleRating('red-down-arrow');
          } else {
            setIconTypeGoogleRating(''); // No arrow for ratings between 3.5 and 4.5
          }

          // Store the fetched rating in localStorage
          localStorage.setItem('googleRating', JSON.stringify(rating));

        } else {
          setErrorMessage(data.error || 'Error fetching Google rating');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching Google rating');
      }
    };

    fetchGoogleRating();
  }, []); // Run only once on component mount

  useEffect(() => {
    if (!reviewId) {
      setErrorMessage('No place_id found in localStorage');
      return;
    }
    else {
      setReviewId(reviewId); // Sync with state
    }

    const fetchOverallRating = async () => {
      try {
        const response = await fetch(
          // `${API_URL}/vektordata/get-overall-rating-from-storage?period=${activeButton.toLowerCase()}&place_id=${reviewId}`
          `${API_URL}/vektordata/get-overall-rating-from-storage?place_id=${reviewId}`
        );
        const data = await response.json();
        if (response.ok) {
          setOverallRating(data.overall_rating);
          // Set the arrow based on the rating change
          if (data.overall_rating >= 4.5) {
            setIconTypeOverallRating('green-up-arrow');
          } else if (data.overall_rating < 3.5) {
            setIconTypeOverallRating('red-down-arrow');
          } else {
            setIconTypeOverallRating(''); // No arrow for ratings between 3.5 and 4.5
          }
        } else {
          setErrorMessage(data.error || 'Error fetching data');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching data.');
      }
    };

    fetchOverallRating();
  }, [activeButton, reviewId]); // Runs when activeButton (period) or reviewId changes


  // Fetch Positive and Negative Keywords with delay
  useEffect(() => {
    if (!reviewId) {
      setErrorMessage('No place_id found in localStorage');
      return;
    }

    // Function to fetch the keywords
    const fetchKeywords = async (query, setKeywords, storageKey) => {
      try {
        // Check if the keywords are already stored in localStorage
        const storedKeywords = localStorage.getItem(storageKey);
        if (storedKeywords) {
          // If stored, use the stored data
          setKeywords(JSON.parse(storedKeywords));
          console.log(`Loaded ${storageKey} from localStorage.`);
          return; // Exit if keywords are already in localStorage
        }

        // Delay the API call by 6 seconds if not stored
        setTimeout(async () => {
          // If not stored, make an API request
          const response = await fetch(`${API_URL}/langchain-query?vector_store_id=${reviewId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
          });

          const data = await response.json();
          console.log('Response data:', data);  // Log the response for debugging

          if (response.ok) {
            // Clean up the response string before parsing it
            const cleanedResponse = data.response.replace(/'/g, '"');  // Replace single quotes with double quotes
            const keywords = JSON.parse(cleanedResponse);  // Parse the response safely

            // Store the fetched keywords in localStorage
            localStorage.setItem(storageKey, JSON.stringify(keywords));

            // Update the state with the fetched keywords
            setKeywords(keywords);
          } else {
            setErrorMessage(data.error || 'Error fetching keywords');
          }
        }, 6000); // 6000ms = 6 seconds

      } catch (error) {
        setErrorMessage('An error occurred while fetching data.');
      }
    };

    // Fetch the positive and negative keywords
    fetchKeywords("give the 4 positive keywords in format ['keyword1','keyword2','keyword3','keyword4']?", setPositiveKeywords, 'positiveKeywords');
    fetchKeywords("give the 4 negative keywords in format ['keyword1','keyword2','keyword3','keyword4']?", setNegativeKeywords, 'negativeKeywords');

  }, [reviewId]);

  useEffect(() => {
    const fetchReviewProfileData = async () => {
      const placeId = localStorage.getItem('place_id');
      if (!placeId) {
        setErrorMessage('No place_id found');
        return;
      }
  
      // Check if the tableData is already stored in localStorage
      const storedTableData = localStorage.getItem('tableData');
      if (storedTableData) {
        // If stored, use the stored data
        setTableData(JSON.parse(storedTableData));
        console.log('Loaded table data from localStorage');
        return;
      }
  
      try {
        const response = await fetch(`${API_URL}/vektordata/get-review-profile-table-data?place_id=${placeId}`);
        const data = await response.json();
        console.log(data);
  
        if (response.ok) {
          // Set the table data from the response
          setTableData(data.tableData);
  
          // Store the fetched table data in localStorage for future use
          localStorage.setItem('tableData', JSON.stringify(data.tableData));
          console.log('Stored table data in localStorage');
        } else {
          setErrorMessage(data.error || 'Error fetching review profile data');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching the data');
      }
    };
  
    fetchReviewProfileData();
  }, []); // Empty dependency array to run only once when the component mounts

  useEffect(() => {

    const placeIdFromStorage = localStorage.getItem('place_id');
    if (!placeIdFromStorage) {
      console.error('No place_id found during fetching weekly ratings');
      return;
    }

    // Function to fetch weekly ratings data from the API
    const fetchWeeklyRatings = async () => {
      try {
        let apiUrl = `${API_URL}/vektordata/weekly_ratings?place_id=${placeIdFromStorage}`;
        
        // Only add current_date to the URL if needed
        // If current_date is not passed, it will not be added to the URL.
        const response = await fetch(apiUrl);
        
        if (response.ok) {
          const data = await response.json();
          setXLabels(data['x-labels']);  // Set the days of the week
          setYValues(data['y-labels']);  // Set the count of 4-5 star ratings
        } else {
          console.error('Failed to fetch weekly ratings data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching weekly ratings:', error);
      }
    };

    fetchWeeklyRatings();
  }, []);


  
  // useEffect(() => {
  //   if (!reviewId) {
  //     setErrorMessage('No place_id found in localStorage');
  //     return;
  //   }

  //   // Fetch Keywords function
  //   const fetchKeywords = async (query, setKeywords) => {
  //     try {
  //       const response = await fetch(`${API_URL}/langchain-query?vector_store_id=${reviewId}`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ query }),
  //       });

  //       const data = await response.json();
  //       console.log('Response data:', data);  // Log the response for debugging

  //       if (response.ok) {
  //         // Clean up the response string before parsing it
  //         const cleanedResponse = data.response.replace(/'/g, '"');  // Replace single quotes with double quotes
  //         const keywords = JSON.parse(cleanedResponse);  // Parse the response safely
  //         setKeywords(keywords);
  //       } else {
  //         setErrorMessage(data.error || 'Error fetching keywords');
  //       }
  //     } catch (error) {
  //       setErrorMessage('An error occurred while fetching data.');
  //     }
  //   };

  //   // Delay the fetch operation by 3 seconds
  //   setTimeout(() => {
  //     // Fetch Positive Keywords
  //     fetchKeywords("give the 3 positive keywords in format ['keyword1','keyword2','keyword3']?", setPositiveKeywords);
  //     // Fetch Negative Keywords
  //     fetchKeywords("give the 3 negative keywords in format ['keyword1','keyword2','keyword3']?", setNegativeKeywords);
  //   }, 6000); // 3000ms = 3 seconds

  // }, []);

  // Determine which arrow to show based on the state
  const renderArrow = (type) => {
    if (type === 'green-up-arrow') {
      return <img src={GreenUpArrow} alt="Green Up Arrow" className="arrow-icon" />;
    } else if (type === 'red-down-arrow') {
      return <img src={RedDownArrow} alt="Red Down Arrow" className="arrow-icon" />;
    }
    return null;
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const [clickedButton, setClickedButton] = useState(null);

  const handleActionButtonClick = (buttonName) => {
    
  
    setClickedButton(buttonName);
    
    // Reset the button after 1 second
    setTimeout(() => {
      setClickedButton(null);
      // Alert the button name that was clicked
      alert(`${buttonName} button clicked`);
    }, 500); // Reset after 1 second
  };

  // Function to handle keyword click
  const handleKeywordClick = async (keyword) => {
    // Fetch place_id from localStorage
    const place_id = localStorage.getItem('place_id');

    if (!place_id) {
      console.log('Place ID is not available in localStorage during fetching search-keywords');
      return;
    }

    // Construct the URL to call the API
    const url = `${API_URL}/vektordata/search-reviews?keyword=${encodeURIComponent(keyword)}&place_id=${place_id}`;

    try {
      // Make the fetch request to the API
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        // Set modal data and open the modal
        setModalData(data);
        setIsModalOpen(true);
      } else {
        console.log(data.message || "No reviews found");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      console.log("An error occurred while fetching reviews");
    }
  };
  
  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };



  // const tableData = [
  //   {
  //     placename: "McDonald's, High Street, Watford, UK",
  //     values: [
  //       [5, 3],
  //       [2, 1],
  //       ['', 4],
  //       [3, 2],
  //       [4, 6],
  //     ],
  //   },
  //   {
  //     placename: "McDonald's, Strand, London, UK",
  //     values: [
  //       [2, 3],
  //       [1, 4],
  //       [3, 2],
  //       [1, 1],
  //       ['', 0],
  //     ],
  //   },
  //   {
  //     placename: "McDonald's, High Street, Watford, UK",
  //     values: [
  //       [0, 1],
  //       [0, 2],
  //       [1, 0],
  //       [4, 3],
  //       [2, 5],
  //     ],
  //   },
  // ];

  const placenameFromLocalStorage = localStorage.getItem('place_name') || "Loading..."; // Fallback to the default value if not in localStorage


  // const tableData = [
  //   {
  //     placename: placenameFromLocalStorage,
  //     values: [
  //       [5, 3],
  //       [2, 1],
  //       ['', 4],
  //       [3, 2],
  //       [4, 6],
  //     ],
  //     // Hardcoded dates
  //     dates: ['2024-10-19', '2024-10-20', '2024-10-21', '2024-10-22', '2024-10-23'],
  //   },
  // ];


  // const renderSentiment = (value) => {
  //   if (value === 1) {
  //     return <span className="emoji happy">😊</span>;
  //   } else if (value === 2) {
  //     return <span className="emoji neutral">😐</span>;
  //   } else if (value === 3) {
  //     return <span className="emoji sad">☹️</span>;
  //   } else {
  //     return null;
  //   }
  // };


  const renderSentiment = (value) => {
    if (value === 1) {
      return <img src={LikeIcon} alt="Like" className="emoji" />;
    } else if (value === 2) {
      return <span className="emoji neutral">😐</span>; // You can leave this as is for neutral sentiment
    } else if (value === 3) {
      return <img src={DislikeIcon} alt="Dislike" className="emoji" />;
    } else {
      return null;
    }
  };


  // Modal to show reviews
  const renderModal = () => {
    if (!isModalOpen || !modalData) return null;

    return (
      <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Reviews for Keyword</h3>

          {/* Scrollable container for reviews */}
          <div className="review-modals-container">
            {modalData.length > 0 ? (
              modalData.map((review, index) => (
                <div key={index} className="review-modal-card">
                  <div className="review-modal-header">
                    <img
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      className="profile-pic"
                    />
                    <div className="review-modal-author">
                      <div className="author-name">{review.author_name}</div>
                      <div className="review-modal-rating">Rating: {review.rating}</div>
                      <div className="relative-time">{review.relative_time_description}</div>
                    </div>
                  </div>
                  <p className="review-modal-text">{review.text}</p>
                  <div className="separator-line"></div>
                </div>
              ))
            ) : (
              <p>No reviews found for this keyword.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  
  return (
    <div className="dashboard-main-container">
      {/* Top Buttons */}
      <div className="button-group">
        <div className="date-buttons">
          <button
            className={activeButton === 'Last Month' ? 'active' : ''}
            onClick={() => handleButtonClick('Last Month')}
          >
            Last Month
          </button>
          <button
            className={activeButton === 'Custom Date Range' ? 'active' : ''}
            onClick={() => handleButtonClick('Custom Date Range')}
          >
            Custom Date Range
          </button>
        </div>
        <div className="action-buttons">
          <button
            className={`action-button ${clickedButton === 'send' ? 'clicked' : ''}`}
            onClick={() => handleActionButtonClick('send')}
          >
            Send
          </button>
          <button
            className={`action-button ${clickedButton === 'download' ? 'clicked' : ''}`}
            onClick={() => handleActionButtonClick('download')}
          >
            Download
          </button>
        </div>
      </div>

      {/* Custom Date Range Picker Modal */}
      {showCustomDateRange && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="date-range-container">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
              />
              <div className="submit-container">
                <button onClick={handleDateSubmit} className="submit-button">
                  Submit
                </button>
                {dateError && <span className="error">{dateError}</span>}
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Containers Grid */}
      <div className="content-grid">
        {/* Reviews Card */}
        {/* <Card> */}
        <Card title="Reviews">
          <div className="rating-container">
            <div className="rating-left">
              {/* Use fetched overall rating */}
              <div className="rating-value">{overallRating !== null ? overallRating : '-'}</div>
              <div className="rating-text">Overall Rating</div>
            
              <div className="rating-description">
                {renderArrow(iconTypeOverallRating)} {starCountOverall} stars in a post week.
              </div>
            </div>

            <div className="rating-right" style={{ width: "60%", height: "100px" }}>
            <LineGraph yValues={yValues} labels={xLabels} />
              {/* <LineGraph yValues={yValues} /> */}
              {/* <LineGraph
                yValues={[3, 4, 5, 6, 7, 8, 9]}
                labels={["January", "February", "March", "April", "May", "June", "July"]}
              /> */}

            </div>

          </div>
        </Card>

        {/* Google Ratings Card */}
        <Card title="Google Rating">
          <div className="rating-container">
            <div className="rating-left">
                <div className="rating-value">{googleRating !== null ? googleRating : '-'}</div>
                <div className="rating-text">
                {/* <div className="rating-value">4.9</div>
                <div className="rating-text"> */}
                  <span className="rating-text-content">
                    on Google
                  </span>
                  <div className="google-icon-container">
                    <img src={GoogleIcon} alt="Google Logo" className="google-icon" />
                  </div>
                </div>
                <div className="rating-description">
                  {renderArrow(iconTypeGoogleRating)} {starCountGoogle} stars in a post week.
                </div>
            </div>
            <div className="rating-right" style={{ width: "60%", height: "100px" }}>
            <LineGraph yValues={yValues} labels={xLabels} />
              {/* <LineGraph yValues={yValues} /> */}
              {/* <LineGraph
                yValues={[3, 4, 5, 6, 7, 8, 9]}
                labels={["January", "February", "March", "April", "May", "June", "July"]}
              /> */}
            </div>
          </div>
        </Card>

        

        {/* <Card>
          <div className="keywords-container">
            <div className="keywords-title">Positive Keywords</div>
              <ul className="indented-list">
                <p className="positive-content">18 Food</p>
                <p className="positive-content">11 Location</p>
                <p className="positive-content">5 Delivery</p>
              </ul>
          </div>
        </Card> */}

        {/* Positive Keywords Card */}
        <Card>
          <div className="keywords-container">
            <div className="keywords-title">Positive Keywords</div>
            {/* {errorMessage && <div className="error-message">{errorMessage}</div>} */}
            {errorMessage && <div className="error-message"></div>}
            <ul className="indented-list">
              {positiveKeywords.length > 0 ? (
                positiveKeywords.map((keyword, index) => (
                  // <p key={index} className="positive-content">{`${index + 1} ${keyword}`}</p>
                  <p key={index} className="positive-content" onClick={() => handleKeywordClick(keyword)}>
                    {`${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`}</p>   
                ))
              ) : (
                <p className="positive-content">Loading...</p>
              )}
            </ul>
          </div>
        </Card>

        {/* Negative Keywords */}
        {/* <Card>
          <div className="keywords-container">
          
            <div className="keywords-title">Negative Keywords</div>
            <ul className="indented-list">
              <p className="negative-content">5 Closing time</p>
              <p className="negative-content">2 Staff</p>
              <p className="negative-content">1 Location</p>
            </ul>
          </div>
        </Card> */}

        {/* Negative Keywords Card */}
        <Card>
          <div className="keywords-container">
            <div className="keywords-title">Negative Keywords</div>
            {/* {errorMessage && <div className="error-message">{errorMessage}</div>} */}
            {errorMessage && <div className="error-message"></div>}
            <ul className="indented-list">
              {negativeKeywords.length > 0 ? (
                negativeKeywords.map((keyword, index) => (
                  // <p key={index} className="negative-content">{`${index + 1} ${keyword}`}</p>
                  <p key={index} className="negative-content" onClick={() => handleKeywordClick(keyword)}>
                    {`${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`}</p>
                ))
              ) : (
                <p className="negative-content">Loading...</p>
              )}
            </ul>
          </div>
        </Card>

        {renderModal()}

      {/* Table Container */}
      {/* <Card title="Review Profile" spanTwoColumns={true}> */}
      <Card spanTwoColumns={true}>
        <div className="table-container">
          <table className="review-table">
            <thead>
              <tr>
                <th>Review Profile for last 4 weeks</th>
                  {tableData.length > 0 && tableData[0].dates.map((date, index) => (
                    <th key={index}>{date}</th>
                  ))}
              </tr>
            </thead>
            <thead>
              <tr>
                <th> &nbsp; </th>
                {tableData.length > 0 && tableData[0].dates.map((_, index) => (
                  <th key={index}>
                    <div className="split-cell">
                      {renderSentiment(1)}
                      <span className="divider"></span>
                      {renderSentiment(3)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  {/* <td>{row.placename}</td> */}
                  <td> {placenameFromLocalStorage} </td>
                  {row.values.map((value, idx) => (
                    <td key={idx}>
                      <div className="split-cell">
                        {value[0] !== '' ? value[0] : '-'}
                        <span className="divider"></span>
                        {value[1] !== '' ? value[1] : '-'}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      </div>
    </div>
  );
};

export default Dashboard;
