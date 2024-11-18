import React from 'react';
import './card.css';

const Card = ({ title, children, spanTwoColumns }) => {
  return (
    <div className={`card-container ${spanTwoColumns ? 'span-two' : ''}`}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
