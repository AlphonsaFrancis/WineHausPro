import React, { useState, useRef } from 'react';
import './Navbar.css';
import logo from '../assets/logomain.png';
import cart from '../assets/cart.png';
import whishlist from '../assets/wishlist.png';
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';
import user from '../assets/user.png';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaUser, FaCamera, FaImage } from "react-icons/fa";
import { Upload, Modal, message, Spin } from 'antd';
import axios from 'axios';
import config from '../config/config';
import Webcam from 'react-webcam';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageSearchResults, setImageSearchResults] = useState([]);
  const [extractedText, setExtractedText] = useState('');
  const webcamRef = useRef(null);

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

  const handleImageUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `${config.BASE_URL}api/v1/products/search-by-image/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setImageSearchResults(response.data.products);
      setExtractedText(response.data.extracted_text);
      setIsImageModalVisible(true);
      message.success('Image search completed successfully');
    } catch (error) {
      console.error('Error searching by image:', error);
      message.error('Failed to search by image');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      handleImageUpload(file);
      return false;
    },
    showUploadList: false,
  };

  const handleCameraCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const blob = await fetch(imageSrc).then(r => r.blob());
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
      
      setIsCameraModalVisible(false);
      handleImageUpload(file);
    }
  };

  const handleImageSearchResult = (product) => {
    setIsImageModalVisible(false);
    navigate(`/products/${product.product_id}`);
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className='navbar-container'>
      <div className='left-section'>
        <div className="logo">
          <img src={logo} alt="logo" />
          <h2><b>WineHaus</b></h2>
        </div>
      </div>

      <div className="search-section">
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="search-icons">
            <Upload {...uploadProps}>
              <FaImage className="search-icon" title="Upload Image to Search" />
            </Upload>
            <FaCamera 
              className="search-icon" 
              title="Take Photo to Search" 
              onClick={() => setIsCameraModalVisible(true)} 
            />
          </div>
        </form>
      </div>

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
            <FaShoppingCart onClick={gotoCart} fontSize={26}/>
          </div>
          <div className="icon">
            <FaHeart  onClick={gotoWishlist} fontSize={26} color='red' />
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

      {/* Camera Modal */}
      <Modal
        title="Take a Photo"
        open={isCameraModalVisible}
        onCancel={() => setIsCameraModalVisible(false)}
        footer={[
          <button key="capture" onClick={handleCameraCapture} className="capture-button">
            Capture Photo
          </button>
        ]}
      >
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: '100%' }}
        />
      </Modal>

      {/* Search Results Modal */}
      <Modal
        title="Similar Products"
        open={isImageModalVisible}
        onCancel={() => setIsImageModalVisible(false)}
        footer={null}
        width={800}
      >
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <p>Analyzing image and finding similar products...</p>
          </div>
        ) : (
          <>
            {extractedText && (
              <div className="extracted-text">
                <p>Detected text: "{extractedText}"</p>
              </div>
            )}
            <div className="search-results-grid">
              {imageSearchResults.length > 0 ? (
                imageSearchResults.map((product) => (
                  <div 
                    key={product.product_id}
                    className="search-result-item"
                    onClick={() => handleImageSearchResult(product)}
                  >
                    <img 
                      src={`${config.BASE_URL}${product.image}`} 
                      alt={product.name} 
                    />
                    <h4>{product.name}</h4>
                    <p>${product.price}</p>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No similar products found</p>
                </div>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

const UserDropdown = ({ isOpen, toggleDropdown, handleLogout, username }) => (
  <>
    <div className="user-icon" onClick={toggleDropdown}>
      <FaUser fontSize={26}/>
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


