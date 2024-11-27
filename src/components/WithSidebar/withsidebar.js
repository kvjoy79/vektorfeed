// src/components/WithSidebar/withsidebar.js
import React, { useEffect } from 'react';
import Sidebar from '../Sidebar/sidebar';
import './withsidebar.css'; 

const WithSidebar = ({ children }) => {
  
  // useEffect hook to log when the component is loaded
  useEffect(() => {
    console.log("withsidebar is loaded");
  }, []); // The empty array ensures this runs only once when the component mounts.


  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default WithSidebar;
