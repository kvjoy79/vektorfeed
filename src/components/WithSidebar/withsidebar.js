// src/components/WithSidebar/withsidebar.js
import React from 'react';
import Sidebar from '../Sidebar/sidebar';
import './withsidebar.css'; 

const WithSidebar = ({ children }) => {
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
