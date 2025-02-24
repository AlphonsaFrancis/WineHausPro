import React, { useState } from "react";
import {
  Slider,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Spin,
  message,
} from "antd";
import axios from "axios";
import config from "../config/config";
import "./WineBlendRecommend.css";

const { Text } = Typography;

const WineBlendRecommend = () => {
  const [taste, setTaste] = useState(1);
  const [acidity, setAcidity] = useState(1);
  const [alcoholContent, setAlcoholContent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [wineDetails, setWineDetails] = useState([]);
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);

  const handleTasteChange = (value) => {
    setTaste(value);
  };

  const handleAcidityChange = (value) => {
    setAcidity(value);
  };

  const handleAlcoholContentChange = (value) => {
    setAlcoholContent(value);
  };

  const fetchWineDetails = async (productId) => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}api/v1/products/details/${productId}/`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching wine details:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${config.BASE_URL}api/v1/products/getWinePredict/`,
        {
          taste: taste,
          acidity: acidity,
          alcohol_content: alcoholContent,
        }
      );

      setRecommendation(response.data);

      if (response.data.blend) {
        const wine1Details = await fetchWineDetails(
          response.data.blend.wine_1.id
        );
        const wine2Details = await fetchWineDetails(
          response.data.blend.wine_2.id
        );
        setWineDetails([wine1Details, wine2Details]);
      }
    } catch (error) {
      console.error("Error fetching wine recommendations:", error);
      message.error("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      console.log("productId", productId);
      await axios.post(`${config.BASE_URL}api/v1/orders/cart-items-create/`, {
        user_id: user?.id,
        product_id: productId,
        quantity: 1,
      });
      message.success("Product added to cart successfully");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      message.error("Failed to add product to cart");
    }
  };
  console.log("recommendation", recommendation);

  return (
    <div className="wine-preference-form">
      <div className="sliders">
        <div className="slider-container">
          <Text strong>Sweetness (1-5)</Text>
          <Slider min={1} max={5} value={taste} onChange={handleTasteChange} />
        </div>
        <div className="slider-container">
          <Text strong>Acidity Scale (1-5)</Text>
          <Slider
            min={1}
            max={5}
            value={acidity}
            onChange={handleAcidityChange}
          />
        </div>
        <div className="slider-container">
          <Text strong>Alcohol Content (0-70%)</Text>
          <Slider
            min={0}
            max={70}
            value={alcoholContent}
            onChange={handleAlcoholContentChange}
          />
        </div>
      </div>
      <Button
        type="primary"
        onClick={handleSubmit}
        loading={loading}
        className="submit-button"
      >
        Find Your Wine
      </Button>

      {loading && <Spin size="large" className="loading-spinner" />}

      {recommendation && (
        <div className="recommendation-results">
          <Text>{recommendation.message}</Text>
          <Text></Text>

          {recommendation.blend && (
            <Row gutter={[16, 16]} className="wine-cards">
              {wineDetails.map((wine, index) => (
                <Col xs={24} sm={12} key={wine?.id || index}>
                  <Card
                    hoverable
                    className="wine-card"
                    cover={
                      wine?.image && (
                        <img
                          alt={wine.name}
                          src={`${config.BASE_URL}${wine.image}`}
                        />
                      )
                    }
                  >
                    <Card.Meta
                      title={wine?.name}
                      description={`Price: ₹${wine?.price}`}
                    />
                    <Text style={{ fontWeight: 700 }}>
                      Blend percentage:{" "}
                      {wine.product_id === recommendation?.blend?.wine_1?.id
                        ? recommendation?.blend?.wine_1?.percentage_1?.toFixed(
                            2
                          )
                        : wine.product_id === recommendation?.blend?.wine_2?.id
                        ? recommendation?.blend?.wine_2?.percentage_2?.toFixed(
                            2
                          )
                        : "0"}
                      %
                    </Text>
                    <Button
                      type="primary"
                      onClick={() => handleAddToCart(wine.product_id)}
                      className="add-to-cart-button"
                    >
                      Add to Cart
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}
    </div>
  );
};

export default WineBlendRecommend;
