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
    {
      placename: "McDonald's, Strand, London, UK",
      values: [
        [2, 3],
        [1, 4],
        [3, 2],
        [1, 1],
        ['', 0],
      ],
    },
    {
      placename: "McDonald's, High Street, Watford, UK",
      values: [
        [0, 1],
        [0, 2],
        [1, 0],
        [4, 3],
        [2, 5],
      ],
    },
  ];

  const renderSentiment = (value) => {
    if (value === 1) {
      return <span className="emoji happy">😊</span>;
    } else if (value === 2) {
      return <span className="emoji neutral">😐</span>;
    } else if (value === 3) {
      return <span className="emoji sad">☹️</span>;
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
              <div className="rating-description">10 visitors in a post week.</div>
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
              <div className="rating-description">9 visitors in a post week.</div>
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
              <ul className="indented-list">
                <p className="positive-content">18 Food</p>
                <p className="positive-content">11 Location</p>
                <p className="positive-content">5 Delivery</p>
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
