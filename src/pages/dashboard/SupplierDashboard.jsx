import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Table, Alert, Spin, Button, Modal, Form, Input, message } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import config from '../../config/config';
import './SupplierDashboard.css';

const SupplierDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [requestModalVisible, setRequestModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [form] = Form.useForm();
    const supplierId = localStorage.getItem('userId');

    useEffect(() => {
        fetchDashboardData();
        fetchProducts();
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

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${config.BASE_URL}api/v1/products/list/`);
            setProducts(response.data);
        } catch (error) {
            message.error('Failed to fetch products');
        }
    };

    const handleRequestStock = (product) => {
        setSelectedProduct(product);
        setRequestModalVisible(true);
        form.setFieldsValue({
            current_quantity: product.stock_quantity,
            requested_quantity: ''
        });
    };

    const handleSubmitRequest = async (values) => {
        try {
            await axios.post(`${config.BASE_URL}api/v1/supplier/request-stock/`, {
                supplier_id: supplierId,
                product_id: selectedProduct.id,
                current_quantity: values.current_quantity,
                requested_quantity: values.requested_quantity
            });
            message.success('Stock request submitted successfully');
            setRequestModalVisible(false);
        } catch (error) {
            message.error('Failed to submit stock request');
        }
    };

    if (loading) return <Spin size="large" />;
    if (error) return <Alert type="error" message={error} />;

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Current Stock',
            dataIndex: 'stock_quantity',
            key: 'stock',
            render: (stock) => (
                <span style={{ color: stock < 10 ? 'red' : 'green' }}>
                    {stock}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button 
                    type="primary"
                    onClick={() => handleRequestStock(record)}
                    disabled={record.stock_quantity >= 10}
                >
                    Request Stock
                </Button>
            ),
        },
    ];

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

            <Card title="Stock Management">
                <Table 
                    dataSource={products}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                />
            </Card>

            <Modal
                title="Request Stock"
                open={requestModalVisible}
                onCancel={() => setRequestModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleSubmitRequest}
                    layout="vertical"
                >
                    <Form.Item
                        name="current_quantity"
                        label="Current Stock"
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="requested_quantity"
                        label="Requested Quantity"
                        rules={[
                            { required: true, message: 'Please input requested quantity!' },
                            { type: 'number', min: 1, message: 'Quantity must be greater than 0!' }
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit Request
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SupplierDashboard; 