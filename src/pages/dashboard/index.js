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
  const [starCountGoogle, setStarCountGoogle] = useState(0.5); // Starting with 0.5 stars
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


  const yValues = [1, 2, 3, 4, 5, 6, 10]; // Data for each day of the week (Sunday to Saturday)


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
    if (activeButton === 'Custom Date Range') {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
    }
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

      try {
        const response = await fetch(`${API_URL}/google/get-place-rating?place_id=${placeId}`);
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setGoogleRating(data.rating);

          // Set the arrow based on the rating
          if (data.rating >= 4.5) {
            setIconTypeGoogleRating('green-up-arrow');
          } else if (data.rating < 3.5) {
            setIconTypeGoogleRating('red-down-arrow');
          } else {
            setIconTypeGoogleRating(''); // No arrow for ratings between 3.5 and 4.5
          }
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
    fetchKeywords("give the 3 positive keywords in format ['keyword1','keyword2','keyword3']?", setPositiveKeywords, 'positiveKeywords');
    fetchKeywords("give the 3 negative keywords in format ['keyword1','keyword2','keyword3']?", setNegativeKeywords, 'negativeKeywords');

  }, [reviewId]);

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


  const tableData = [
    {
      placename: placenameFromLocalStorage,
      values: [
        [5, 3],
        [2, 1],
        ['', 4],
        [3, 2],
        [4, 6],
      ],
    },
  ];


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
              <LineGraph yValues={yValues} />
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
              <LineGraph yValues={yValues} />
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
            {errorMessage && <div className="error-message">-</div>}
            <ul className="indented-list">
              {positiveKeywords.length > 0 ? (
                positiveKeywords.map((keyword, index) => (
                  // <p key={index} className="positive-content">{`${index + 1} ${keyword}`}</p>
                  <p key={index} className="positive-content">{`${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`}</p>   
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
            {errorMessage && <div className="error-message">-</div>}
            <ul className="indented-list">
              {negativeKeywords.length > 0 ? (
                negativeKeywords.map((keyword, index) => (
                  // <p key={index} className="negative-content">{`${index + 1} ${keyword}`}</p>
                  <p key={index} className="negative-content">{`${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`}</p>
                ))
              ) : (
                <p className="negative-content">Loading...</p>
              )}
            </ul>
          </div>
        </Card>

        {/* Table Container */}
      {/* <Card title="Review Profile" spanTwoColumns={true}> */}
      <Card spanTwoColumns={true}>
        <div className="table-container">
          <table className="review-table">
            <thead>
              <tr>
                <th>Review Profile for last 4 weeks</th>
                <th>2024-10-19</th>
                <th>2024-10-20</th>
                <th>2024-10-21</th>
                <th>2024-10-22</th>
                <th>2024-10-23</th>
              </tr>
            </thead>
            <thead>
              <tr>
                <th> &nbsp; </th>
                <th>
                  <div className="split-cell">
                    {renderSentiment(1)}
                    <span className="divider"></span>
                    {renderSentiment(3)}
                  </div>
                </th>
                <th>
                  <div className="split-cell">
                    {renderSentiment(1)}
                    <span className="divider"></span>
                    {renderSentiment(3)}
                  </div>
                </th>
                <th>
                  <div className="split-cell">
                    {renderSentiment(1)}
                    <span className="divider"></span>
                    {renderSentiment(3)}
                  </div>
                </th>
                <th>
                  <div className="split-cell">
                    {renderSentiment(1)}
                    <span className="divider"></span>
                    {renderSentiment(3)}
                  </div>
                </th>
                <th>
                  <div className="split-cell">
                    {renderSentiment(1)}
                    <span className="divider"></span>
                    {renderSentiment(3)}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.placename}</td>
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
