import React, { useState } from 'react';
import './ReviewsPage.css';
import ReactPaginate from 'react-paginate';

const reviewsData = [
  {
    id: 1,
    rating: 2.0,
    platform: 'Google Maps',
    reviewer: 'Priyanka Shukla',
    date: 'Oct 31, 2024',
    content: '...',
  },
  {
    id: 2,
    rating: 5.0,
    platform: 'Google Maps',
    reviewer: 'Poonam Khanvilkar',
    date: 'Oct 24, 2024',
    content: 'Went there for breakfast buffet...',
  },
  {
    id: 3,
    rating: 4.0,
    platform: 'Google Maps',
    reviewer: 'John Doe',
    date: 'Oct 15, 2024',
    content: 'Great service...',
  },
  {
    id: 4,
    rating: 1.0,
    platform: 'Google Maps',
    reviewer: 'Jane Doe',
    date: 'Oct 12, 2024',
    content: 'Poor experience...',
  },
  {
    id: 5,
    rating: 3.0,
    platform: 'Google Maps',
    reviewer: 'Alex Smith',
    date: 'Oct 10, 2024',
    content: 'Average food...',
  },
  {
    id: 6,
    rating: 5.0,
    platform: 'Google Maps',
    reviewer: 'Sara Taylor',
    date: 'Oct 05, 2024',
    content: 'Amazing ambiance...',
  },
];

const Reviews = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 5;

  // Calculate the reviews for the current page
  const offset = currentPage * reviewsPerPage;
  const currentPageData = reviewsData.slice(offset, offset + reviewsPerPage);
  const pageCount = Math.ceil(reviewsData.length / reviewsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="reviews-page">
      <h2>Reviews</h2>
      <div className="filters">
        <input type="text" placeholder="Search reviews" />
        <button>Search</button>
      </div>

      <div className="reviews-list">
        {currentPageData.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-rating">
              {'⭐'.repeat(Math.round(review.rating))} {review.rating} / 5
            </div>
            <div className="review-details">
              <p><strong>By:</strong> {review.reviewer}</p>
              <p><strong>Platform:</strong> {review.platform}</p>
              <p><strong>Posted on:</strong> {review.date}</p>
              <p>{review.content}</p>
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
