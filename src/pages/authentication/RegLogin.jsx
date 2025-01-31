import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';

const RegLogin = () => {
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        try {
            const response = await axios.post(`${config.BASE_URL}api/v1/auth/login/`, values);
            if (response.data.user.is_superuser) {
                navigate('/admin');
            } else if (response.data.user.is_staff) {
                navigate('/staff');
            } else if (response.data.user.is_supplier) {
                navigate('/supplier');
            } else if (response.data.user.is_delivery_agent) {
                navigate('/order-delivery');
            } else {
                navigate('/');
            }
            // ... rest of the login logic
        } catch (error) {
            // ... error handling
        }
    };

    return (
        <div>
            {/* Render your login form here */}
        </div>
    );
};

export default RegLogin; 