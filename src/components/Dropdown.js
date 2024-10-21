import React from 'react';
import { Link } from 'react-router-dom';
// import './Dropdown.css';
import { MdAccountCircle } from 'react-icons/md';

const Dropdown = ({ toggleDropdown, handleLogout, username }) => (
  <div className="dropdown-container">
    {/* <div className="dropbtn">
      <MdAccountCircle size={0} />
      <span className="icon-label">{username}</span>
    </div> */}
    <div className="dropdown-content">
      <Link to="/profile" onClick={toggleDropdown}>Edit Profile</Link>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  </div>
);

export default Dropdown;
