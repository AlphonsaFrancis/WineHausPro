import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Header from "../../components/Navbar";

import "react-toastify/dist/ReactToastify.css";
import "./UserProfile.css"; // Import the CSS file
import axios from "axios";
import config from "../../config/config";

const UserProfile = () => {
const storedUser = localStorage.getItem("user");
const user = JSON.parse(storedUser);
  
  const [name, setName] = useState(user.name);
  const [walletBalance, setWalletBalance] = useState(1000);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newPassword, setNewPassword] = useState("");
  const [walletAmount, setWalletAmount] = useState();

  useEffect(()=>{
    axios.get(`${config.BASE_URL}api/v1/auth/get-user-wallet/${user?.id}/`)
    .then((response)=>{
        console.log("response",response)
        setWalletAmount(response?.data?.balance)
    })
    .catch((err)=>{
        console.log("error",err)
    })


  },[])

  const handleNameEdit = () => {
    if (isEditingName) {
      setName(newName);
      toast.success("Name updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setIsEditingName(!isEditingName);
  };

  const handlePasswordEdit = () => {
    if (isEditingPassword) {
      // Add logic to update password (e.g., API call)
      toast.success("Password updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setNewPassword("");
    }
    setIsEditingPassword(!isEditingPassword);
  };

  return (
    <div >
      <Header />

      <div className="user-profile">
        <h2>User Profile</h2>
        <div className="profile-field">
          <label>Name:</label>
          {isEditingName ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          ) : (
            <span>{user?.name}</span>
          )}
          {/* <button onClick={handleNameEdit}>
            {isEditingName ? "Save" : "Edit"}
          </button> */}
        </div>
        <div className="profile-field">
          <label>Wallet Balance:</label>
          <span>₹{walletAmount} </span>
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <span>{user?.email}</span>
        </div>
        {/* <div className="profile-field">
          <label>Phone:</label>
          <span>{phone}</span>
        </div> */}
        {/* <div className="profile-field">
          <label>Password:</label>
          {isEditingPassword ? (
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
            />
          ) : (
            <span>••••••••</span>
          )}
          <button onClick={handlePasswordEdit}>
            {isEditingPassword ? "Save" : "Edit"}
          </button>
        </div> */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default UserProfile;
