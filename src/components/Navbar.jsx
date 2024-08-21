import React from 'react'
import './Navbar.css'

function Navbar() {
  return (
    <div className='navbar-container'>
        <div className='left-section'>
            <div className="logo">
                <img src="" alt="logo" />
            </div>
        </div>

        <div className='right-section'>
            <div className="nav-links">
                <div className="nav-link">
                    <a href="#">Home</a>
                </div>
                <div className="nav-link">
                    <a href="#">Products</a>
                </div>
                <div className="nav-link">
                    <a href="#">Accessories</a>
                </div>

            </div>

            <div className="icon-links">
                <div className="icon">
                    <img src="" alt="cart" />
                </div>
                <div className="icon">
                    <img src="" alt="user" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar
