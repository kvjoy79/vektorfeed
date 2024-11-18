import React, { useState } from 'react';
import Card from '../../components/Card/card';
import './DashboardPage.css';

const Dashboard = () => {
  const [activeButton, setActiveButton] = useState('Week');

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

  return (
    <div className="dashboard-main-container">
      {/* Top Buttons */}
      <div className="button-group">
        <div className="date-buttons">
          <button
            className={activeButton === 'Day' ? 'active' : ''}
            onClick={() => handleButtonClick('Day')}
          >
            Day
          </button>
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
        <Card>
          <div className="rating-container">
            <div className="rating-left">
              <div className="rating-value">4.8</div>
              <div className="rating-text">overall rating</div>
              <p></p>
              <div className="rating-description">10 visitor in a post week.</div>
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
        <Card>
          <div className="rating-container">
            <div className="rating-left">
              <div className="rating-value">4.9</div>
              <div className="rating-text">on Google</div>
              <p></p>
              <div className="rating-description">9 visitor in a post week.</div>
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

        {/* Positive Keywords */}
        <Card>
          <div className="keywords-container">
            <div className="keywords-title">Positive Keywords</div>
            <p className="positive-content">18 Food</p>
            <p className="positive-content">11 Location</p>
            <p className="positive-content">5 Delivery</p>
          </div>
        </Card>

        {/* Negative Keywords */}
        <Card>
          <div className="keywords-container">
            <div className="keywords-title">Negative Keywords</div>
            <p className="negative-content">5 Closing time</p>
            <p className="negative-content">2 Staff</p>
            <p className="negative-content">1 Location</p>
          </div>
        </Card>

        {/* Table Container */}
        <Card title="Table Data" spanTwoColumns={true}>
          <p>Table content goes here.</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
