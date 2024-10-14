import React, { useState } from 'react';
import './Navbar.css';
import logo from '../assets/logomain.png';
import cart from '../assets/cart.png';
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown'; // Import the Dropdown component
import user from '../assets/user.png';
import { useNavigate } from 'react-router-dom';



function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const username = ''; // Example username, replace with actual user data

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout functionality here
    localStorage.removeItem('authToken');
    navigate('/');
    console.log('Logged out');
  };

  const user = JSON.parse(localStorage.getItem('user'));
  console.log("***",user)
  return (
    <div className='navbar-container'>
      <div className='left-section'>
        <div className="logo">
          <img src={logo} alt="logo" />
          <h2><b>WineHaus</b></h2>
        </div>
      </div>

      <div className='right-section'>
      {(user.is_superuser === false && user.is_staff === false) && (
  <div className="nav-links">
    <div className="nav-link">
      <Link to="/home"><b>Home</b></Link>
    </div>
    <div className="nav-link">
      <Link to="/accessories"><b>About</b></Link>
    </div>
    <div className="nav-link">
      <Link to="/products"><b>Products</b></Link>
    </div>
  </div>
)}
        <div className="icon-links">
          <div className="icon">
            <img src={cart} alt="cart" />
          </div>
          {/* Combined user icon and dropdown into one component */}
          <div className="icon">
            <UserDropdown 
              isOpen={isDropdownOpen}
              toggleDropdown={toggleDropdown}
              handleLogout={handleLogout}
              username={username}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const UserDropdown = ({ isOpen, toggleDropdown, handleLogout, username }) => (
  <>
    <div className="user-icon" onClick={toggleDropdown}>
      <img src={user} alt="user" />
    </div>
    {isOpen && (
      <Dropdown 
        toggleDropdown={toggleDropdown}
        handleLogout={handleLogout}
        username={username}
      />
    )}
  </>
);

export default Navbar;


