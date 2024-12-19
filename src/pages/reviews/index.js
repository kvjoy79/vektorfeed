import React, { useState, useEffect } from 'react';
import './ReviewsPage.css';
import ReactPaginate from 'react-paginate';
import { API_URL } from '../../config/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reviews = () => {
  const [reviewsData, setReviewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 5;
  const [placeId, setPlaceId] = useState(localStorage.getItem('place_id')); // Initialize from localStorage

  const [activeButton, setActiveButton] = useState('Last Month');
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');

  // useEffect(() => {
  //   const placeId = localStorage.getItem('place_id');

  //   if (!placeId) {
  //     toast.error("No place_id found. Please select a location.");
  //   } else {
  //     fetchReviews(placeId);
  //   }
  // }, []);

  // const fetchReviews = async (placeId) => {
  //   try {
  //     const response = await fetch(`${API_URL}/serpapi/place-review-details?place_id=${placeId}`);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch reviews');
  //     }
  //     const data = await response.json();
  //     console.log(data.reviews);
  //     setReviewsData(data.reviews || []); // Assuming the API returns reviews in data.reviews
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  //last month methods
  useEffect(() => {

    const status = localStorage.getItem('dateButtonStatus');

    if (status === 'last-month') {
      console.log("Set to Last Month!");
      setActiveButton('Last Month');
    }

    if (status === 'date-range') {
      console.log("Set to Custom Date Range!");
      setActiveButton('Custom Date Range');
    }

  }, []);

  useEffect(() => {
    // const requiredNumberOfReviews = 9; // You can adjust this based on your needs

    if (!placeId) {
      toast.error("No place_id found. Please select a location.");
    } else {
      // fetchReviews(placeId, requiredNumberOfReviews);
      setPlaceId(placeId); // Sync with state
      fetchReviews(placeId);
    }
  }, []);

  // const fetchReviews = async (placeId, requiredNumberOfReviews) => {
  //   try {
      
  //     const response = await fetch(`${API_URL}/serpapi/place-review-details-extended?place_id=${placeId}&required_number_of_reviews=${requiredNumberOfReviews}`);

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch reviews');
  //     }
  //     const data = await response.json();
  //     console.log("Fetched reviews data:", data); // Log the response to check its structure
  
  //     // Ensure reviews are in the correct structure (data.reviews.reviews)
  //     if (Array.isArray(data.reviews?.reviews)) {
  //       setReviewsData(data.reviews.reviews || []); // Correctly set reviews data from data.reviews.reviews
  //     } else {
  //       toast.error('No reviews found for the given place.');
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  const fetchReviews = async (reviewId) => {
    try {
      // Construct the URL with the new route and review_id
      const response = await fetch(`${API_URL}/serpapi/get-review-details?review_id=${reviewId}`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch review details');
      }
  
      const data = await response.json();
      console.log("Fetched review data:", data); // Log the response to check its structure
  
      // Ensure the review data is correctly structured
      if (Array.isArray(data.reviews?.reviews)) {
        setReviewsData(data.reviews.reviews || []); // Set the reviews data from data.reviews.reviews
      } else {
        toast.error('Review not found.');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Calculate the reviews for the current page
  const offset = currentPage * reviewsPerPage;
  const currentPageData = reviewsData.slice(offset, offset + reviewsPerPage);
  const pageCount = Math.ceil(reviewsData.length / reviewsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };


  // Handle button click for "Last Month" and "Custom Date Range"
  const handleButtonClick = async (button) => {
    setActiveButton(button);

    if (button === 'Last Month') {
      try {
        toast.success("Set to Last Month!");

        const placeIdFromLocalStorage = localStorage.getItem('orig_place_id');
        if (!placeIdFromLocalStorage) {
          console.error('Place ID is missing in localStorage.');
          toast.error('Place ID is missing.');
          return;
        }

        // Fetch review details for "Last Month"
        const dateRange = 'last-month'; // Define the date range for "Last Month"
        const response = await fetch(
          `${API_URL}/serpapi/place-review-details-date-range?place_id=${placeIdFromLocalStorage}&date_range=${dateRange}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching reviews:', errorData.error || 'Unknown error');
          return;
        }

        const reviewData = await response.json();
        console.log('Review details fetched:', reviewData);
        setReviewsData(reviewData.reviews || []);

        // Optionally remove items from localStorage if needed
        const itemsToRemove = ['googleRating', 'negativeKeywords', 'positiveKeywords', 'tableData'];
        itemsToRemove.forEach((item) => {
          localStorage.removeItem(item);
        });

        window.location.reload();
      } catch (error) {
        toast.error("Failed to Set to Last Month!");
      }

      // Store the new date button status in localStorage
      localStorage.setItem('dateButtonStatus', 'last-month');
    }

    if (button === 'Custom Date Range') {
      setShowCustomDateRange(true);
      localStorage.setItem('dateButtonStatus', 'date-range');
    } else {
      setShowCustomDateRange(false);
    }
  };

  // Handle custom date range form submission
  const handleDateSubmit = () => {
    if (!startDate || !endDate) {
      setDateError('Please select both start and end dates.');
      return;
    }
    setDateError('');
    // Call the API or perform the necessary action with the selected date range
    console.log(`Fetching reviews from ${startDate} to ${endDate}`);
    setShowCustomDateRange(false);
  };

  return (
    <div className="reviews-page-container">
      <ToastContainer />
      <h2>Reviews</h2>
      <div className="button-group">
        {/* <div className="date-buttons">
          <button
            className="active"  // Update this for dynamic active class toggling
            onClick={() => handleButtonClick('Last Month')}
          >
            Last Month
          </button>
          <button
            onClick={() => handleButtonClick('Custom Date Range')}
          >
            Custom Date Range
          </button>
        </div> */}

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

      </div>

      <div className="filters">
        <input type="text" placeholder="Search reviews" />
        <button>Search</button>
      </div>

      <div className="reviews-list">
        {currentPageData.map((review, index) => (
          <div key={index} className="review-item">
            <div className="review-rating">
              {'⭐'.repeat(review.rating)} {review.rating} / 5
            </div>
            <div className="review-details">
              <div className="review-author">
                <img src={review.profile_photo_url} alt={review.author_name} className="review-author-photo" />
                <span className="review-author-name">{review.author_name}</span>
              </div>
              <p>Posted: {review.relative_time_description}</p>
              <p>{review.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Date Range Picker Modal */}
      {showCustomDateRange && (
        <div className="modal-backdrop" onClick={() => setShowCustomDateRange(false)}>
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


      {/* Pagination Component */}
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
};

export default Reviews;
