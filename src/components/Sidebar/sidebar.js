// src/components/Sidebar/sidebar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css';
import VektordataLogo from '../../assets/svgs/vektordata-banner.svg'; // Import vektordaa logo


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
        {/* <h2>Vektordata</h2> */}
        <img src={VektordataLogo} alt="Vektordata Logo" className="sidebar-logo" />
      </div>
      <ul className="sidebar-menu">
        <li className={activeItem === '/dashboard' ? 'active' : ''}>
          <Link to="/dashboard" onClick={() => setActiveItem('/dashboard')}>Overview</Link>
        </li>
        <li className={activeItem === '/reviews' ? 'active' : ''}>
          <Link to="/reviews" onClick={() => setActiveItem('/reviews')}>Reviews</Link>
        </li>
        <li className={activeItem === '/feedbackgpt' ? 'active' : ''}>
          <Link to="/vektorgpt" onClick={() => setActiveItem('/vektorgpt')}>VektorGPT</Link>
        </li>
        <li className={activeItem === '/notifications' ? 'active' : ''}>
          <Link to="/notifications" onClick={() => setActiveItem('/notifications')}>Notifications</Link>
        </li>
        <li className={activeItem === '/settings' ? 'active' : ''}>
          <Link to="/settings" onClick={() => setActiveItem('/settings')}>Settings</Link>
        </li>
        <li className={activeItem === '/logout' ? 'active' : ''}>
          <Link to="/logout" onClick={() => setActiveItem('/logout')}>Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
