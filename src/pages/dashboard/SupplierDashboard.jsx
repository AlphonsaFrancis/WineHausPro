import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Table, Alert, Spin } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import config from '../../config/config';
import './SupplierDashboard.css';

const SupplierDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const supplierId = localStorage.getItem('supplierId'); // Get from auth

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(
                `${config.BASE_URL}api/v1/supplier/dashboard/${supplierId}/`
            );
            setDashboardData(response.data);
        } catch (err) {
            setError('Failed to fetch dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spin size="large" />;
    if (error) return <Alert type="error" message={error} />;

    return (
        <div className="supplier-dashboard">
            <h1>Supplier Dashboard</h1>
            
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Card title="Low Stock">
                        <h2>{dashboardData.low_stock_count}</h2>
                        <p>Products running low</p>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Out of Stock">
                        <h2>{dashboardData.out_of_stock_count}</h2>
                        <p>Products out of stock</p>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Active Alerts">
                        <h2>{dashboardData.active_alerts_count}</h2>
                        <p>Requires attention</p>
                    </Card>
                </Col>
            </Row>

            <Row className="chart-section">
                <Col span={24}>
                    <Card title="Monthly Supply Statistics">
                        <BarChart width={800} height={300} data={dashboardData.monthly_stats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total_quantity" fill="#8884d8" name="Total Quantity" />
                            <Bar dataKey="total_products" fill="#82ca9d" name="Total Products" />
                        </BarChart>
                    </Card>
                </Col>
            </Row>

            <Row className="table-section">
                <Col span={24}>
                    <Card title="Low Stock Products">
                        <Table 
                            dataSource={dashboardData.low_stock_products}
                            columns={[
                                {
                                    title: 'Product Name',
                                    dataIndex: ['product', 'name'],
                                    key: 'name',
                                },
                                {
                                    title: 'Current Stock',
                                    dataIndex: ['product', 'stock_quantity'],
                                    key: 'stock',
                                },
                                {
                                    title: 'Supply Price',
                                    dataIndex: 'supply_price',
                                    key: 'price',
                                },
                                {
                                    title: 'Last Supply Date',
                                    dataIndex: 'last_supply_date',
                                    key: 'date',
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SupplierDashboard; 