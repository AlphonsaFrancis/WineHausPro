import React, { useState } from "react";
import "./adminNavbar.css";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";


function AdminNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'))

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleLogout = () => {
    localStorage.clear('user')
    navigate("/");
    console.log("Logged out");

  };

 
  return (
    <div className="admin-navbar-container">
      <div className="user-info">
        <span style={{color:'green'}}>Hi,</span> {user?.email}
      </div>
   <div className="admin-nav-user-icon" onClick={toggleDropdown}>
      <FaUser  style={{fontSize:'24px'}}/>
      {isDropdownOpen && (
        <div className="admin-nav-user-menu">
          <div className="admin-nav-user-menu-item">Edit Profile</div>
          <div className="admin-nav-user-menu-item" onClick={handleLogout}>
            Logout
          </div>
        </div>
      )}
    </div>
     
    </div>
  );
}

export default AdminNavbar;
