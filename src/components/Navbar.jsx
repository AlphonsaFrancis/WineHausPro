import React, { useState } from 'react';
import './Navbar.css';
import logo from '../assets/logomain.png';
import cart from '../assets/cart.png';
import whishlist from '../assets/wishlist.png';
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';
import user from '../assets/user.png';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  const username = '';
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    console.log('Logged out');
  };
  const gotoCart=()=>{
    navigate('/cart')
  }

  const gotoWishlist=()=>{
    navigate('/wishlist')
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${searchQuery}`);
  };

  const user = JSON.parse(localStorage.getItem('user'));
  console.log("***", user);

  return (
    <div className='navbar-container'>
      <div className='left-section'>
        <div className="logo">
          <img src={logo} alt="logo" />
          <h2><b>WineHaus</b></h2>
        </div>
      </div>

        {/* Search bar  */}
        <form className="search-bar" onSubmit={handleSearchSubmit}>
         <input
                type="text"
                id="search-input"
                className="search-input"
                placeholder="Search products..."
                aria-label="Search products, brands"
                value={searchQuery}
                onChange={handleSearchChange}
              />
        </form> 

      <div className='right-section'>
        <div className="nav-links">
          <div className="nav-link">
            <Link to="/"><b>Home</b></Link>
          </div>
          <div className="nav-link">
            <Link to="/products"><b>Products</b></Link>
          </div>
        </div>

        

        <div className="icon-links">
          <div className="icon">
            <img src={cart} alt="cart"  onClick={gotoCart}/>
          </div>
          <div className="icon">
            <img src={whishlist} alt="whishlist" onClick={gotoWishlist} />
          </div>
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


