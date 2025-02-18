import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Header from "../../components/Navbar";
import "react-toastify/dist/ReactToastify.css";
import "./UserProfile.css";
import axios from "axios";
import config from "../../config/config";
import { FaWallet, FaUser, FaEnvelope } from 'react-icons/fa';

const UserProfile = () => {
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  
  const [walletAmount, setWalletAmount] = useState(0);

  useEffect(() => {
    axios.get(`${config.BASE_URL}api/v1/auth/get-user-wallet/${user?.id}/`)
      .then((response) => {
        setWalletAmount(response?.data?.balance)
      })
      .catch((err) => {
        console.log("error", err)
      });
  }, [user?.id]);

  return (
    <div>
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h1>{user?.name}</h1>
        </div>

        <div className="profile-content">
          <div className="profile-card info-card">
            <div className="card-header">
              <FaUser className="card-icon" />
              <h2>Profile Information</h2>
            </div>
            <div className="card-content">
              <div className="info-item">
                <FaUser className="info-icon" />
                <div className="info-text">
                  <label>Name</label>
                  <span>{user?.name}</span>
                </div>
              </div>
              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <div className="info-text">
                  <label>Email</label>
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-card wallet-card">
            <div className="card-header">
              <FaWallet className="card-icon" />
              <h2>Wallet Balance</h2>
            </div>
            <div className="card-content">
              <div className="wallet-amount">
                <span className="currency">₹</span>
                <span className="amount">{walletAmount}</span>
              </div>
              <p className="wallet-description">
                Available balance in your wallet
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserProfile;
