import React from 'react';

const GradientButton = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`mt-8 w-full max-w-md px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-400 text-white rounded-2xl shadow-lg hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-300 transition ${className}`}
    >
      {children}
    </button>
  );
};

export default GradientButton;
