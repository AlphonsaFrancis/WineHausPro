import React, { useState, useEffect } from 'react';
import { Select, Card, Row, Col, Typography, Spin } from 'antd';
import axios from 'axios';
import config from '../config/config';
import './WineRecommender.css';

const { Option } = Select;
const { Title, Text } = Typography;

const WineRecommender = () => {
    const [events, setEvents] = useState([]);
    const [foodPairings, setFoodPairings] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);

    useEffect(() => {
        fetchEvents();
        fetchFoodPairings();
    }, []);

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
            setRecommendations(response.data);
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

    return (
        <div className="wine-recommender">
            <Title level={2}>Wine Recommendations</Title>
            <div className="filters">
                <Select
                    placeholder="Select an Event"
                    style={{ width: 200, marginRight: 16 }}
                    onChange={setSelectedEvent}
                    allowClear
                >
                    {events.map(event => (
                        <Option key={event.id} value={event.id}>{event.name}</Option>
                    ))}
                </Select>

                <Select
                    placeholder="Select Food Pairing"
                    style={{ width: 200 }}
                    onChange={setSelectedFood}
                    allowClear
                >
                    {foodPairings.map(food => (
                        <Option key={food.id} value={food.id}>{food.name}</Option>
                    ))}
                </Select>
            </div>

            {loading ? (
                <div className="loading">
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[16, 16]} className="recommendations">
                    {recommendations.map(rec => (
                        <Col xs={24} sm={12} md={8} key={rec.id}>
                            <Card
                                hoverable
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
                                    <Text strong>${rec.product.price}</Text>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default WineRecommender; 