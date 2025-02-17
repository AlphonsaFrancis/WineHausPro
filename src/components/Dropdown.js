// import React from 'react';
// import { Link } from 'react-router-dom';
// // import './Dropdown.css';
// import { MdAccountCircle } from 'react-icons/md';

// const Dropdown = ({ toggleDropdown, handleLogout, username }) => (
//   const userId = localStorage.getItem('userId');
//   const token = localStorage.getItem('authToken');



//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userId');
//     setDisplayName("Login");
//     setIsLoggedIn(false); // User is logged out
//     navigate('/login');
//   };
//   <div className="dropdown-container">
//     {/* <div className="dropbtn">
//       <MdAccountCircle size={0} />
//       <span className="icon-label">{username}</span>
//     </div> */}
//     <div className="dropdown-content">
//       <Link to="/profile" onClick={toggleDropdown}>Edit Profile</Link>
//       <button onClick={handleLogout} className="logout-btn">Logout</button>
//     </div>
//   </div>
// );

// export default Dropdown;
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
       
        {userId ?<>
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
