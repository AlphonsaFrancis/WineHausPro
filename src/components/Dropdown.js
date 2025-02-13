
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';

const Dropdown = ({ toggleDropdown, username }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAgeVerified')

    navigate('/');
  };
  const handleLogin = () => {
    navigate('/login');
  }
  const handleorders = () => {
    navigate('/userorder');
  }

  const handleProfile = ()=>{
    navigate('/profile')
  }

  return (
    <div className="dropdown-container">
      <div className="dropdown-content">

      {userId ?
      <>
        <button onClick={handleorders} className="logout-btn">Orders</button>
        <button onClick={handleProfile} className="logout-btn">Profile</button>
       
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
          :
          <button onClick={handleLogin} className="logout-btn">Login</button>
        }


      </div>
    </div>
  );
};

export default Dropdown;
