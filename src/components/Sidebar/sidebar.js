// src/components/Sidebar/sidebar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('');
  const location = useLocation(); // Get the current location to set the active item

  // Set the active item based on the current path
  React.useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Vektordata</h2>
      </div>
      <ul className="sidebar-menu">
        <li className={activeItem === '/dashboard' ? 'active' : ''}>
          <Link to="/dashboard" onClick={() => setActiveItem('/dashboard')}>Dashboard</Link>
        </li>
        <li className={activeItem === '/review-listing' ? 'active' : ''}>
          <Link to="/review-listing" onClick={() => setActiveItem('/review-listing')}>Review Listings</Link>
        </li>
        <li className={activeItem === '/reviews' ? 'active' : ''}>
          <Link to="/reviews" onClick={() => setActiveItem('/reviews')}>Reviews</Link>
        </li>
        <li className={activeItem === '/notifications' ? 'active' : ''}>
          <Link to="/notifications" onClick={() => setActiveItem('/notifications')}>Notifications</Link>
        </li>
        <li className={activeItem === '/review-campaigns' ? 'active' : ''}>
          <Link to="/review-campaigns" onClick={() => setActiveItem('/review-campaigns')}>Review Campaigns</Link>
        </li>
        <li className={activeItem === '/widgets' ? 'active' : ''}>
          <Link to="/widgets" onClick={() => setActiveItem('/widgets')}>Review Widgets</Link>
        </li>
        <li className={activeItem === '/integrations' ? 'active' : ''}>
          <Link to="/integrations" onClick={() => setActiveItem('/integrations')}>Integrations</Link>
        </li>
        <li className={activeItem === '/settings' ? 'active' : ''}>
          <Link to="/settings" onClick={() => setActiveItem('/settings')}>Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
