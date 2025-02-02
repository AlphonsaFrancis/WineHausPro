import React, { useState } from "react";
import "./adminNavbar.css";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";


function AdminNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleLogout = () => {
    localStorage.clear('user')
    navigate("/");
    console.log("Logged out");

  };
  const getUserRole =()=>{
    if(user?.is_staff) return 'STAFF';
    if(user?.is_supplier) return 'STOCK-MANAGER';
    if(user?.is_delivery_agent) return 'DELIVERY-PARTNER';
    if(user?.is_admin) return 'ADMIN'
  }

  const userRole = getUserRole()

 
  return (
    <div className="admin-navbar-container">
      <div className="user-info">
        <span style={{color:'green'}}>Hi,</span> {user?.email}
      </div>
      <div className="admin-nav-right-section">
        <div className="admin-nav-user-role">{userRole}</div>
        <div className="admin-nav-user-icon" onClick={toggleDropdown}>
        <FaUser  style={{fontSize:'24px'}}/>
        {isDropdownOpen && (
          <div className="admin-nav-user-menu">
            {/* <div className="admin-nav-user-menu-item">Edit Profile</div> */}
            <div className="admin-nav-user-menu-item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>

      </div>
  
     
    </div>
  );
}

export default AdminNavbar;
