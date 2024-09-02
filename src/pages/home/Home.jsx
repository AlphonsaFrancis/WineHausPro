import React from 'react';
import './home.css';
import chair from '../../assets/main1ethinic.jpg';


function Home() {
  return (
    <div>
      {/* Header */}

      {/* Hero Section */}
      <section className="wine-banner">
        <div className="main-container">
          <div className="image-item image1">
            <img src="main3opener.png" alt="Wine Glass" />
          </div>
          <div className="image-item image2">
            <img src="main2glassbottle.png" alt="Wine and Flowers" />
          </div>
          <div className="image-item image3">
            <img src={chair} alt="Opening Wine Bottle" />
          </div>
        </div>
        <div className="text-container">
          <h1>Drink Wine Enjoy Life....</h1>
        </div>
      </section>

      {/* Category Section */}
      <section className="category-section">
        <div className="category-item">
          <div className="outer-circle">
            <div className="inner-circle">
              <img src="CataRed.png" alt="Wine and Grapes" />
            </div>
          </div>
          <p>Red</p>
        </div>

        <div className="category-item">
          <div className="outer-circle">
            <div className="inner-circle">
              <img src="CataWhite.png" alt="Wine and Grapes" />
            </div>
          </div>
          <p>White</p>
        </div>

        <div className="category-item">
          <div className="outer-circle">
            <div className="inner-circle">
              <img src="CataRose.png" alt="Wine and Grapes" />
            </div>
          </div>
          <p>Rose</p>
        </div>

        <div className="category-item">
          <div className="outer-circle">
            <div className="inner-circle">
              <img src="CataSparkling.png" alt="Wine and Grapes" />
            </div>
          </div>
          <p>Sparkling</p>
        </div>

        <div className="category-item">
          <div className="outer-circle">
            <div className="inner-circle">
              <img src="CataSweet.png" alt="Wine and Grapes" />
            </div>
          </div>
          <p>Sweet</p>
        </div>

        <div className="category-item">
          <div className="outer-circle">
            <div className="inner-circle">
              <img src="CataAccessories.png" alt="Wine and Grapes" />
            </div>
          </div>
          <p>Accessories</p>
        </div>
      </section>

      {/* Promotional Banners Section */}
      <div className="promotion">
        <div className="section">
          <div className="image">
            <img src="mainoffer1.png" alt="Wine Glasses and Table Setting" />
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
            <img src="mainoffer2.png" alt="Wine Bottles and Grapes" />
          </div>
        </div>
      </div>

      {/* Best Sellers Section */}
      <section className="best-sellers">
        <div className="head-seller">
          <h2>Best Sellers</h2>
        </div>
        <div className="product-container">
          <div className="product-card">
            <div className="product-image">
              <img
                src="BestFratelli(1).png"
                alt="Fratelli Cabernet Sauvignon"
              />
            </div>
            <div className="product-info">
              <h3>Fratelli Cabernet Sauvignon</h3>
              <p>₹ 1300</p>
              <div className="product-meta">
                <span className="badge red">Red</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>

          <div className="product-card">
            <div className="product-image">
              <img src="BestSpade(2).png" alt="Spade & Spar Rows Rose" />
            </div>
            <div className="product-info">
              <h3>Spade & Spar Rows Rose</h3>
              <p>₹ 2000</p>
              <div className="product-meta">
                <span className="badge rose">Rose</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>

          <div className="product-card">
            <div className="product-image">
              <img
                src="BestChardonney(3).png"
                alt="Chardonnay Kendall-Jackson"
              />
            </div>
            <div className="product-info">
              <h3>Chardonnay Kendall-Jackson</h3>
              <p>₹ 900</p>
              <div className="product-meta">
                <span className="badge white">White</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>

          <div className="product-card">
            <div className="product-image">
              <img src="BestZampa(4).png" alt="Zampa Soiree Brut" />
            </div>
            <div className="product-info">
              <h3>Zampa Soiree Brut</h3>
              <p>₹ 1800</p>
              <div className="product-meta">
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
        <div className="product-container">
          <div className="product-card">
            <div className="product-image">
              <img
                src="ArriBigBanyan(1).png"
                alt="Fratelli Cabernet Sauvignon"
              />
            </div>
            <div className="product-info">
              <h3>Fratelli Cabernet Sauvignon</h3>
              <p>₹ 1300</p>
              <div className="product-meta">
                <span className="badge red">Red</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>

          <div className="product-card">
            <div className="product-image">
              <img src="ArriRuinat(2).png" alt="Spade & Spar Rows Rose" />
            </div>
            <div className="product-info">
              <h3>Spade & Spar Rows Rose</h3>
              <p>₹ 2000</p>
              <div className="product-meta">
                <span className="badge rose">Rose</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>

          <div className="product-card">
            <div className="product-image">
              <img
                src="ArriTrefethen(3).png"
                alt="Chardonnay Kendall-Jackson"
              />
            </div>
            <div className="product-info">
              <h3>Chardonnay Kendall-Jackson</h3>
              <p>₹ 900</p>
              <div className="product-meta">
                <span className="badge white">White</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>

          <div className="product-card">
            <div className="product-image">
              <img src="ArriStella(4).png" alt="Zampa Soiree Brut" />
            </div>
            <div className="product-info">
              <h3>Zampa Soiree Brut</h3>
              <p>₹ 1800</p>
              <div className="product-meta">
                <span className="badge sparkling">Sparkling</span>
                <button className="favorite">&#9825;</button>
              </div>
              <button className="buy-now">Buy Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer></footer>
    </div>
  );
}

export default Home;
