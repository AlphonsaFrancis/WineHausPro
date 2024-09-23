import React, { useState } from 'react';
import axios from 'axios';

import './forms.css';

const AddOrderForm = ({onCancel}) => {
  const [orderData, setOrderData] = useState({
    user_id: '',
    order_date: '',
    order_status: '1',
    tax_amount: '',
    total_amount: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order data:', orderData);
    const formData = new FormData();
    Object.keys(orderData).forEach((key) => {
      formData.append(key, orderData[key]);
    });
    axios.post("http://127.0.0.1:8000/api/v1/orders/list/",formData)
    .then((res)=>{
      alert("orderData Added !")
      window.location.reload()

    })
    .catch((err)=>{
      console.log(err)
    })
  };

  return (
    <div className="form-container">
      <h3>Add New Order</h3>
      <form onSubmit={handleSubmit}>
        <div className="head">
          <span>Order Details</span>
        </div>

        <label htmlFor="user_id">User</label>
        <input
          type="text"
          id="user_id"
          name="user_id"
          value={orderData.user_id}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="order_date">Order Date</label>
        <input
          type="date"
          id="order_date"
          name="order_date"
          value={orderData.order_date}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="order_status">Order Status</label>
        <select
          id="order_status"
          name="order_status"
          value={orderData.order_status}
          onChange={handleInputChange}
        >
          <option value="1">Order Placed</option>
          <option value="2">Pending</option>
          <option value="3">Dispatched</option>
          <option value="4">Delivered</option>
          <option value="5">Canceled</option>
        </select>

        <label htmlFor="tax_amount">Tax Amount</label>
        <input
          type="text"
          id="tax_amount"
          name="tax_amount"
          value={orderData.tax_amount}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="total_amount">Total Amount</label>
        <input
          type="text"
          id="total_amount"
          name="total_amount"
          value={orderData.total_amount}
          onChange={handleInputChange}
          required
        />

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save Order
          </button>
          <button type="reset" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrderForm;
