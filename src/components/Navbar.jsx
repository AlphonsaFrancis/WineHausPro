import React from 'react'
import './Navbar.css'
import logo from '../assets/logomain.png'
import cart from '../assets/cart.png'
import user from '../assets/user.png'
import { Link } from 'react-router-dom'; 

function Navbar() {
  return (
    <div className='navbar-container'>
        <div className='left-section'>
            <div className="logo">
                <img src={logo} alt="logo" />
                <h2><b>WineHaus</b></h2>
            </div>
        </div>


<div className='right-section'>
        <div className="nav-links">
          <div className="nav-link">
            <Link to="/home"><b>Home</b></Link>  {/* Use Link instead of a */}
          </div>
          <div className="nav-link">
            <Link to="/products"><b>Products</b></Link>  {/* Navigate to /products */}
          </div>
          <div className="nav-link">
            <Link to="/accessories"><b>Accessories</b></Link>
          </div>
        </div>


            <div className="icon-links">
                <div className="icon">
                    <img src={cart} alt="cart" />
                </div>
                <div className="icon">
                    <img src={user} alt="user" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar
