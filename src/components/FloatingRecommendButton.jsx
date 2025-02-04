import React from 'react';
import { Button } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import './FloatingRecommendButton.css';

const FloatingRecommendButton = ({ onClick }) => {
    return (
        <Button 
            className="floating-recommend-button"
            type="primary"
            shape="circle"
            icon={<BulbOutlined />}
            onClick={onClick}
            size="large"
        />
    );
};

export default FloatingRecommendButton; 