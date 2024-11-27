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

  useEffect(() => {
    const placeId = localStorage.getItem('place_id');
    const requiredNumberOfReviews = 9; // You can adjust this based on your needs

    if (!placeId) {
      toast.error("No place_id found. Please select a location.");
    } else {
      fetchReviews(placeId, requiredNumberOfReviews);
    }
  }, []);

  const fetchReviews = async (placeId, requiredNumberOfReviews) => {
    try {
      
      // const response = await fetch(`${API_URL}/serpapi/place-review-details-extended?place_id=${placeId}&required_number_of_reviews=${requiredNumberOfReviews}`);
      const response = await fetch(`${API_URL}/serpapi/get-review-details?place_id=${placeId}&required_number_of_reviews=${requiredNumberOfReviews}`);

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      console.log("Fetched reviews data:", data); // Log the response to check its structure
  
      // Ensure reviews are in the correct structure (data.reviews.reviews)
      if (Array.isArray(data.reviews?.reviews)) {
        setReviewsData(data.reviews.reviews || []); // Correctly set reviews data from data.reviews.reviews
      } else {
        toast.error('No reviews found for the given place.');
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

  return (
    <div className="reviews-page">
      <ToastContainer />
      <h2>Reviews</h2>
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
