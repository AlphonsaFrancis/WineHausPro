import React, { useState } from "react";
import axios from "axios";
import "./forms.css";
import config from "../../config/config";

const AddCountryForm = ({ onCancel, onConfirm }) => {
  const [countryData, setCountryData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCountryData({ ...countryData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = { name: "", description: "" };
    let isValid = true;

    if (!countryData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!countryData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    Object.keys(countryData).forEach((key) => {
      formData.append(key, countryData[key]);
    });

    axios
      .post(`${config.BASE_URL}api/v1/products/country-create/`, formData)
      .then((res) => {
        alert("Country Added!");
        onConfirm();
        onCancel();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="form-container">
      <h3>Add New Country</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="head">
            <span>Country Details</span>
          </div>

          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={countryData.name}
            onChange={handleInputChange}
          />
          {errors.name && <div className="error">{errors.name}</div>}

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={countryData.description}
            onChange={handleInputChange}
          />
          {errors.description && (
            <div className="error">{errors.description}</div>
          )}

          <div className="form-actions">
            <button type="submit" className="save-btn">
              Save Country
            </button>
            <button type="reset" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AddCountryForm;
