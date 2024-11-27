import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/card';
import './DashboardPage.css';
import LikeIcon from '../../assets/pngs/like-icon.png';
import DislikeIcon from '../../assets/pngs/dislike-icon.png';
import GoogleIcon from '../../assets/svgs/google-icon-logo-svgrepo-com.svg';
import GreenUpArrow from '../../assets/svgs/green-up-arrow.svg';
import RedDownArrow from '../../assets/svgs/red-down-arrow.svg';
import { API_URL } from '../../config/config';

const Dashboard = () => {
  const [activeButton, setActiveButton] = useState('Week');
  const [overallRating, setOverallRating] = useState(null);
  const [starCountOverall, setStarCountOverall] = useState(0.1); // Starting with 0.1 stars
  const [starCountGoogle, setStarCountGoogle] = useState(0.5); // Starting with 0.5 stars
  const [iconTypeOverallRating, setIconTypeOverallRating] = useState(''); // Default to green-up arrow
  const [iconTypeGoogleRating, setIconTypeGoogleRating] = useState(''); // Default to green-up arrow
  const [positiveKeywords, setPositiveKeywords] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');


  // Retrieve the review_id from localStorage
  const reviewId = localStorage.getItem('place_id');

  useEffect(() => {
    if (!reviewId) {
      setErrorMessage('No place_id found in localStorage');
      return;
    }

    const fetchOverallRating = async () => {
      try {
        const response = await fetch(
          `${API_URL}/vektordata/get-overall-rating?period=${activeButton.toLowerCase()}&review_id=${reviewId}`
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


  useEffect(() => {
    if (!reviewId) {
      setErrorMessage('No place_id found in localStorage');
      return;
    }

    const fetchPositiveKeywords = async () => {
      try {
        const response = await fetch(`${API_URL}/langchain-query?vector_store_id=${reviewId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: "give the 3 positive keywords in format ['keyword1','keyword2','keyword3']?",
          }),
        });

        const data = await response.json();

        console.log(data);

        if (response.ok) {
          // Clean up the response string before parsing it
          const cleanedResponse = data.response.replace(/'/g, '"');  // Replace single quotes with double quotes
          const keywords = JSON.parse(cleanedResponse);  // Now safely parse the cleaned response string
          setPositiveKeywords(keywords);
        } else {
          setErrorMessage(data.error || 'Error fetching keywords');
        }
        
      } catch (error) {
        setErrorMessage('An error occurred while fetching data.');
      }
    };

    fetchPositiveKeywords();
  }, []);

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

  const tableData = [
    {
      placename: "McDonald's, High Street, Watford, UK",
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
            className={activeButton === 'Week' ? 'active' : ''}
            onClick={() => handleButtonClick('Week')}
          >
            Week
          </button>
          <button
            className={activeButton === 'Month' ? 'active' : ''}
            onClick={() => handleButtonClick('Month')}
          >
            Month
          </button>
          <button
            className={activeButton === 'Quarter' ? 'active' : ''}
            onClick={() => handleButtonClick('Quarter')}
          >
            Quarter
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

      {/* Containers Grid */}
      <div className="content-grid">
        {/* Reviews Card */}
        {/* <Card> */}
        <Card title="Reviews">
          <div className="rating-container">
            <div className="rating-left">
              {/* Use fetched overall rating */}
              <div className="rating-value">{overallRating !== null ? overallRating : 'Loading...'}</div>
              <div className="rating-text">Overall Rating</div>
              <p></p>
              <div className="rating-description">
                {renderArrow(iconTypeOverallRating)} {starCountOverall} stars in a post week.
              </div>
            </div>
            <div className="rating-right">
              <div className="line-graph-container">
                <svg className="line-graph" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                  <polyline
                    points="0,80 30,60 60,70 90,40 120,50 150,30 180,50"
                    fill="none"
                    stroke="#888"
                    strokeWidth="2"
                  />
                  {Array.from({ length: 7 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={i * 30}
                      cy={[80, 60, 70, 40, 50, 30, 50][i]}
                      r="3"
                      fill="#888"
                    />
                  ))}
                </svg>
                <div className="graph-labels">
                  <span>S</span>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Google Ratings Card */}
        <Card title="Google Rating">
          <div className="rating-container">
            <div className="rating-left">
                <div className="rating-value">4.9</div>
                <div className="rating-text">
                  on Google
                  <div className="google-icon-container">
                    <img src={GoogleIcon} alt="Google Logo" className="google-icon" />
                  </div>
                </div>
                <div className="rating-description">
                  {renderArrow(iconTypeGoogleRating)} {starCountGoogle} stars in a post week.
                </div>
            </div>
            <div className="rating-right">
              <div className="line-graph-container">
                <svg className="line-graph" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                  <polyline
                    points="0,60 30,40 60,50 90,30 120,60 150,50 180,70"
                    fill="none"
                    stroke="#888"
                    strokeWidth="2"
                  />
                  {Array.from({ length: 7 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={i * 30}
                      cy={[60, 40, 50, 30, 60, 50, 70][i]}
                      r="3"
                      fill="#888"
                    />
                  ))}
                </svg>
                <div className="graph-labels">
                  <span>S</span>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                </div>
              </div>
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
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <ul className="indented-list">
              {positiveKeywords.length > 0 ? (
                positiveKeywords.map((keyword, index) => (
                  <p key={index} className="positive-content">{`${index + 1} ${keyword}`}</p>
                ))
              ) : (
                <p className="positive-content">Loading...</p>
              )}
            </ul>
          </div>
        </Card>

        {/* Negative Keywords */}
        <Card>
          <div className="keywords-container">
          
            <div className="keywords-title">Negative Keywords</div>
            <ul className="indented-list">
              <p className="negative-content">5 Closing time</p>
              <p className="negative-content">2 Staff</p>
              <p className="negative-content">1 Location</p>
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
                <th>Review Profile</th>
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
