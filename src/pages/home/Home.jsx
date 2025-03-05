import React, { useState, useEffect } from 'react';
import './home.css';
import Navbar from '../../components/Navbar'
import esthetic from '../../assets/main1ethinic.jpg';
import darkbottle from '../../assets/main2glassbottle.png';
import opener from '../../assets/main3opener.png';
import red from '../../assets/CataRed.png';
import white from '../../assets/CataWhite.png';
import rose from '../../assets/CataRose.png';
import spark from '../../assets/CataSparkling.png';
import sweet from '../../assets/CataSweet.png';
import moffer1 from '../../assets/mainoffer1.png';
import moffer2 from '../../assets/mainoffer2.png';
import acces from '../../assets/CataAccessories.png';
import frat from '../../assets/BestFratelli(1).png';
import best2 from '../../assets/BestSpade(2).png';
import best3 from '../../assets/BestChardonney(3).png';
import best4 from '../../assets/BestZampa(4).png';
import arriv1 from '../../assets/ArriBigBanyan(1).png';
import arriv2 from '../../assets/ArriRuinat(2).png';
import arriv3 from '../../assets/ArriTrefethen(3).png';
import arriv4 from '../../assets/ArriStella(4).png';
import BasicModal from '../../components/BasicModal';
import FloatingRecommendButton from '../../components/FloatingRecommendButton';
import WineRecommendationModal from '../../components/WineRecommendationModal';
import NewArrivals from '../../components/NewArrivals';
import BestSellers from '../../components/BestSellers';
import WineRecommendationForm from '../../components/WineRecommendationForm';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import config from '../../config';
import { useNavigate } from 'react-router-dom';


function Home() {
  const [showAgeAlert,setShowAgeAlert] = useState(true)
  const isAgeVerified = localStorage.getItem('isAgeVerified')
  const verifyAge=()=>{
    setShowAgeAlert(false)
    localStorage.setItem('isAgeVerified',true)
  }

  const [showRecommendations, setShowRecommendations] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [showRecommendationForm, setShowRecommendationForm] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [blendingSuggestions, setBlendingSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleGetRecommendations = async (preferences) => {
    try {
      console.log("Sending preferences:", preferences);
      const response = await axios.post(
        `${config.BASE_URL}products/getWinePredict/`,
        preferences,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log("Response:", response.data);
      
      if (response.data.status === 'success') {
        setRecommendations(response.data.recommendations);
        setBlendingSuggestions(response.data.blending_suggestions || []);
        toast.success('Recommendations found!');
      } else if (response.data.message) {
        toast.info(response.data.message);
      }
      setShowRecommendationForm(false);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast.error(error.response?.data?.message || 'Failed to get recommendations');
    }
  };

  return (
    <div>
      <Toaster position="top-center" />
      {/* Header */}
      <Navbar></Navbar>
      {/* Hero Section */}
      <section className="wine-banner">
        <div className="main-container">
          <div className="image-item image1">
            <img src={esthetic} alt="Wine Glass" />
          </div>
          <div className="image-item image2">
            <img src={darkbottle} alt="Wine and Flowers" />
          </div>
          <div className="image-item image3">
            <img src={opener} alt="Opening Wine Bottle" />
          </div>
        </div>
        <div className="text-container">
          <h1>Drink Wine Enjoy Life....</h1>
        </div>
      </section>
      <section className="wine-recommendation-section">
        <div className="recommendation-header">
          <h2>Find Your Perfect Wine</h2>
          <p>Tell us your preferences and we'll recommend the perfect wine for you</p>
          <button 
            className="get-recommendation-btn"
            onClick={() => setShowRecommendationForm(true)}
          >
            Get Wine Recommendations
          </button>
        </div>

        {showRecommendationForm && (
          <WineRecommendationForm 
            onSubmit={handleGetRecommendations}
            onClose={() => setShowRecommendationForm(false)}
          />
        )}

        {recommendations.length > 0 && (
          <div className="recommendations-container">
            <h3>Recommended Wines</h3>
            <div className="recommendations-grid">
              {recommendations.map((wine, index) => (
                <div 
                  key={index} 
                  className="recommendation-card"
                  onClick={() => navigate(`/products/${wine.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="wine-item">
                    {wine.image && (
                      <img 
                        src={wine.image} 
                        alt={wine.name}
                        className="wine-image"
                      />
                    )}
                    <div className="wine-text">
                      <h5>{wine.name}</h5>
                      <p>₹{wine.price}</p>
                      <p>Match Score: {wine.similarity_score}%</p>
                      <div className="wine-characteristics">
                        <p>Taste: {wine.characteristics.taste}/5</p>
                        <p>Acidity: {wine.characteristics.acidity}/5</p>
                        <p>Alcohol: {wine.characteristics.alcohol_content}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {blendingSuggestions.length > 0 && (
              <div className="blending-suggestions">
                <h3>Try These Wine Blends</h3>
                <div className="blends-grid">
                  {blendingSuggestions.map((blend, index) => (
                    <div key={index} className="blend-card">
                      <h4>Suggested Blend {index + 1}</h4>
                      <div className="blend-wines">
                        <div className="blend-wine">
                          <h5>{blend.wine1.name} ({blend.wine1.percentage}%)</h5>
                          <div className="wine-details">
                            <p>Taste: {blend.wine1.characteristics.taste}/5</p>
                            <p>Acidity: pH {blend.wine1.characteristics.acidity}</p>
                            <p>Alcohol: {blend.wine1.characteristics.alcohol_content}%</p>
                          </div>
                        </div>
                        <div className="blend-plus">+</div>
                        <div className="blend-wine">
                          <h5>{blend.wine2.name} ({blend.wine2.percentage}%)</h5>
                          <div className="wine-details">
                            <p>Taste: {blend.wine2.characteristics.taste}/5</p>
                            <p>Acidity: pH {blend.wine2.characteristics.acidity}</p>
                            <p>Alcohol: {blend.wine2.characteristics.alcohol_content}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="blend-result">
                        <h5>Resulting Blend Characteristics:</h5>
                        <div className="blend-characteristics">
                          <p>Taste: {blend.blend_characteristics.taste}/5</p>
                          <p>Acidity: pH {blend.blend_characteristics.acidity}</p>
                          <p>Alcohol: {blend.blend_characteristics.alcohol_content}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Add New Arrivals section after the banner */}
      <NewArrivals />

      {/* Category Section */}
      <section className="category-section">
        <div className="category-item">
          <div className="outer-circle">
            <div className="inner-circle">
              <img src={red} alt="Wine and Grapes" />
            </div>
          </div>
          <p>Red</p>
        </div>

        <div className="category-item">
          <div className="outer-circle">
            <div className="inner-circle">
              <img src={white} alt="Wine and Grapes" />
            </div>
          </div>
          <p>White</p>
        </div>

        <div className="category-item">
          <div className="outer-circle">
            <div className="inner-circle">
              <img src={rose} alt="Wine and Grapes" />
            </div>
          </div>
          <p>Rose</p>
        </div>

        <div className="category-item">
          <div className="outer-circle">
            <div className="inner-circle">
              <img src={spark} alt="Wine and Grapes" />
            </div>
          </div>
          <p>Sparkling</p>
        </div>

        <div className="category-item">
          <div className="outer-circle">
            <div className="inner-circle">
              <img src={sweet} alt="Wine and Grapes" />
            </div>
          </div>
          <p>Sweet</p>
        </div>

        <div className="category-item">
          <div className="outer-circle">
            <div className="inner-circle">
              <img src={acces} alt="Wine and Grapes" />
            </div>
          </div>
          <p>Accessories</p>
        </div>
      </section>

      {/* Promotional Banners Section */}
      <div className="promotion">
        <div className="section">
          <div className="image">
            <img src={moffer1} alt="Wine Glasses and Table Setting" />
          </div>
          <div className="text-content">
            <h2>
              Elevate your wine tasting experience with{' '}
              <span className="highlight">WineHaus STEM ZERO</span>
            </h2>
            <p>
              The revolutionary wine glass range by WineHaus Glass, crafted from
              the world's toughest, yet finest, lead-free crystal glass.
            </p>
            <button className="order-btn">Proceed to Order &gt;</button>
          </div>
        </div>

        <div className="section">
          <div className="text-content">
            <h2>
              Best deal of{' '}
              <span className="highlight">WineHaus Classy Set of Wines</span>
            </h2>
            <p>
              Enjoy the large quantity of Wines with friends and family.
              Complete your party with the perfect set of Wines. (Red, White,
              Sparkling)
            </p>
            <button className="order-btn">Proceed to Order &gt;</button>
          </div>
          <div className="image">
            <img src={moffer2} alt="Wine Bottles and Grapes" />
          </div>
        </div>
      </div>

      {/* Best Sellers Section */}
      <BestSellers />

      

      {/* Add this before the Footer section */}
      

      {!isAgeVerified &&

      <BasicModal
        open={showAgeAlert}
        isConfirmModal={true}
        setOpen={verifyAge}
        onConfirm={verifyAge}
        heading={`Verify Your Age`}
        content={"To proceed, you must be at least 21 years old."}
        showCancel={false}
      />
    }

      {/* Footer Section */}
      <footer></footer>

      {user && (
        <>
          <FloatingRecommendButton 
            onClick={() => setShowRecommendations(true)} 
          />
          <WineRecommendationModal 
            visible={showRecommendations}
            onClose={() => setShowRecommendations(false)}
          />
        </>
      )}
    </div>
  );
}

export default Home;
