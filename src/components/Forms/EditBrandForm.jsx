import React, { useState, useEffect } from 'react';
import './forms.css';
import axios from 'axios';

const EditBrandForm = ({ onCancel, onConfirm, initialBrandData }) => {
  const [brandData, setBrandData] = useState({
    name: '',
    description: '',
  });

  console.log("initialBrandData",initialBrandData)

  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (initialBrandData) {
      setBrandData({
        name: initialBrandData.name,
        description: initialBrandData.description,
      });
    }
  }, [initialBrandData]);

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

    axios.put(`http://127.0.0.1:8000/api/v1/products/brand-update/${initialBrandData.brand_id}/`, formData)
      .then((response) => {
        alert("Brand updated successfully!");
        onCancel()
        onConfirm()
      })
      .catch((error) => {
        console.error("Error updating Brand:", error.response.data);
      });
  };

  return (
    <div className="form-container">
      <h3>Edit Brand</h3>
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
            required
          />
          {errors.name && <div className="error-message">{errors.name}</div>}

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={brandData.description}
            onChange={handleInputChange}
            required
          />
          {errors.description && <div className="error-message">{errors.description}</div>}

          <div className="form-actions">
            <button type="submit" className="save-btn">Update</button>
            <button type="reset" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default EditBrandForm;
