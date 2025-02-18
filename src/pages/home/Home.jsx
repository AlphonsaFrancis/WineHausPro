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


function Home() {
  const [showAgeAlert,setShowAgeAlert] = useState(true)
  const isAgeVerified = localStorage.getItem('isAgeVerified')
  const verifyAge=()=>{
    setShowAgeAlert(false)
    localStorage.setItem('isAgeVerified',true)
  }

  const [showRecommendations, setShowRecommendations] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
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
      <section className="best-sellers">
        <div className="head-seller">
          <h2>Best Sellers</h2>
        </div>
        <div className="home-product-container">
          <div className="home-product-card">
            <div className="home-product-image">
              <img
                src={frat}
                alt="Fratelli Cabernet Sauvignon"
              />
            </div>
            <div className="home-product-info">
              <h3>Fratelli Cabernet Sauvignon</h3>
              <p>₹ 1300</p>
              <div className="home-product-meta">
                <span className="badge red">Red</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>

          <div className="home-product-card">
            <div className="home-product-image">
              <img src={best2} alt="Spade & Spar Rows Rose" />
            </div>
            <div className="home-product-info">
              <h3>Spade & Spar Rows Rose</h3>
              <p>₹ 2000</p>
              <div className="home-product-meta">
                <span className="badge rose">Rose</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>

          <div className="home-product-card">
            <div className="home-product-image">
              <img
                src={best3}
                alt="Chardonnay Kendall-Jackson"
              />
            </div>
            <div className="home-product-info">
              <h3>Chardonnay Kendall-Jackson</h3>
              <p>₹ 900</p>
              <div className="home-product-meta">
                <span className="badge white">White</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>

          <div className="home-product-card">
            <div className="home-product-image">
              <img src={best4} alt="Zampa Soiree Brut" />
            </div>
            <div className="home-product-info">
              <h3>Zampa Soiree Brut</h3>
              <p>₹ 1800</p>
              <div className="home-product-meta">
                <span className="badge sparkling">Sparkling</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="best-sellers">
        <div className="head-seller">
          <h2>New Arrivals</h2>
        </div>
        <div className="home-product-container">
          <div className="home-product-card">
            <div className="home-product-image">
              <img
                src={arriv1}
                alt="Big Benyan Merot"
              />
            </div>
            <div className="home-product-info">
              <h3>Big Benyan Merot</h3>
              <p>₹ 800</p>
              <div className="home-product-meta">
                <span className="badge red">Red</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>

          <div className="home-product-card">
            <div className="home-product-image">
              <img src={arriv2} alt="Spade & Spar Rows Rose" />
            </div>
            <div className="home-product-info">
              <h3>Ruinat Rose Champage Brut</h3>
              <p>₹ 2500</p>
              <div className="home-product-meta">
                <span className="badge sparkling">Sparkling</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>

          <div className="home-product-card">
            <div className="home-product-image">
              <img
                src={arriv3}
                alt="Chardonnay Kendall-Jackson"
              />
            </div>
            <div className="home-product-info">
              <h3>Riesling Trafethan</h3>
              <p>₹ 1500</p>
              <div className="home-product-meta">
                <span className="badge white">White</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>

          <div className="home-product-card">
            <div className="home-product-image">
              <img src={arriv4} alt="Zampa Soiree Brut" />
            </div>
            <div className="home-product-info">
              <h3>Stella Rose Splash</h3>
              <p>₹ 1500</p>
              <div className="home-product-meta">
                <span className="badge rose">Rose</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>
        </div>
      </section>

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
