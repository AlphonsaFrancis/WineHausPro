import React, { useState, useEffect } from 'react';
import { Modal, Select, Card, Row, Col, Typography, Spin, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config/config';
import './WineRecommendationModal.css';
import WineBlendRecommend from './WineBlendRecommend';

const { Option } = Select;
const { Text } = Typography;
const { TabPane } = Tabs;

const WineRecommendationModal = ({ visible, onClose }) => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [foodPairings, setFoodPairings] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);

    useEffect(() => {
        if (visible) {
            fetchEvents();
            fetchFoodPairings();
        }
    }, [visible]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${config.BASE_URL}api/v1/products/events/`);
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchFoodPairings = async () => {
        try {
            const response = await axios.get(`${config.BASE_URL}api/v1/products/food-pairings/`);
            setFoodPairings(response.data);
        } catch (error) {
            console.error('Error fetching food pairings:', error);
        }
    };

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.BASE_URL}api/v1/products/recommendations/`, {
                params: {
                    event: selectedEvent,
                    food: selectedFood
                }
            });
            setRecommendations(response.data.recommendations || []);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedEvent || selectedFood) {
            fetchRecommendations();
        }
    }, [selectedEvent, selectedFood]);

    const handleProductClick = (productId) => {
        onClose(); // Close the modal first
        navigate(`/products/${productId}`); // Navigate to product details
    };

    return (
        <Modal
            title="Find Your Perfect Wine"
            open={visible}
            onCancel={onClose}
            width={1000}
            footer={null}
            className="wine-recommendation-modal"
        >
            <Tabs defaultActiveKey="1">
                <TabPane tab="Choose Your Wine for an Occasion" key="1">
                    <div className="recommendation-filters">
                        <Select
                            placeholder="Select an Event"
                            style={{ width: '45%' }}
                            onChange={setSelectedEvent}
                            allowClear
                        >
                            {events.map(event => (
                                <Option key={event.id} value={event.id}>{event.name}</Option>
                            ))}
                        </Select>

                        <Select
                            placeholder="Select Food Pairing"
                            style={{ width: '45%' }}
                            onChange={setSelectedFood}
                            allowClear
                        >
                            {foodPairings.map(food => (
                                <Option key={food.id} value={food.id}>{food.name}</Option>
                            ))}
                        </Select>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Row gutter={[16, 16]} className="recommendations-grid">
                            {Array.isArray(recommendations) && recommendations.map(rec => (
                                <Col xs={24} sm={12} key={rec.id}>
                                    <Card
                                        hoverable
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleProductClick(rec.product.product_id)}
                                        cover={
                                            <img
                                                alt={rec.product.name}
                                                src={`${config.BASE_URL}${rec.product.image}`}
                                            />
                                        }
                                    >
                                        <Card.Meta
                                            title={rec.product.name}
                                            description={rec.recommendation_text}
                                        />
                                        <div className="price">
                                            <Text strong>₹{rec.product.price}</Text>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                            {Array.isArray(recommendations) && recommendations.length === 0 && (
                                <div className="no-recommendations">
                                    <Text>No recommendations found for the selected criteria.</Text>
                                </div>
                            )}
                        </Row>
                    )}
                </TabPane>
                <TabPane tab="Choose Wine for Your Preference" key="2">
                    <div>
                        <h2>Choose Wine for Your Preference</h2>
                        <WineBlendRecommend />
                    </div>
                </TabPane>
            </Tabs>
        </Modal>
    );
};

export default WineRecommendationModal;