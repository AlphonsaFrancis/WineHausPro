import React, { useState } from 'react';
import './forms.css';
import axios from 'axios';

const AddBrandForm = ({ onCancel, onConfirm }) => {
  const [brandData, setBrandData] = useState({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });

  const validateForm = () => {
    const newErrors = { name: '', description: '' };
    let isValid = true;

    if (!brandData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!brandData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBrandData({ ...brandData, [name]: value });

    // Clear the error message when the user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    Object.keys(brandData).forEach((key) => {
      formData.append(key, brandData[key]);
    });

    axios.post("http://127.0.0.1:8000/api/v1/products/brand-create/", formData)
      .then((res) => {
        alert("Brand Added!");
        onCancel();
        onConfirm();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="form-container">
      <h3>Add New Brand</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="head">
            <span>Brand Details</span>
          </div>

          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={brandData.name}
            onChange={handleInputChange}
          />
          {errors.name && <div className="error">{errors.name}</div>}

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={brandData.description}
            onChange={handleInputChange}
          />
          {errors.description && <div className="error">{errors.description}</div>}

          <div className="form-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="reset" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AddBrandForm;
