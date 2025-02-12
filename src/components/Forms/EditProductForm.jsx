import React, { useEffect, useState } from "react";
import axios from "axios";
import "./forms.css";
import { findActiveItems } from "../../pages/dashboard/helper";
import config from "../../config/config";

const EditProductForm = ({ onCancel, onConfirm, initialProductData }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [countries, setCountries] = useState([]);
  const [madeOf, setMadeOfs] = useState([]);
  const [errors, setErrors] = useState({});
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    brand: "",
    country: "",
    made_of: "",
    stock_quantity: 1,
    image: null,
    approved: false,
  });

  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);

  console.log("---User--",user)


  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [brandsRes, categoriesRes, countriesRes, madeOfRes] = await Promise.all([
          axios.get(`${config.BASE_URL}api/v1/products/brand-list/`),
          axios.get(`${config.BASE_URL}api/v1/products/category-list/`),
          axios.get(`${config.BASE_URL}api/v1/products/country-list/`),
          axios.get(`${config.BASE_URL}api/v1/products/madeof-list/`)
        ]);

        if (brandsRes.status === 200) setBrands(findActiveItems(brandsRes.data));
        if (categoriesRes.status === 200) setCategories(findActiveItems(categoriesRes.data));
        if (countriesRes.status === 200) setCountries(findActiveItems(countriesRes.data));
        if (madeOfRes.status === 200) setMadeOfs(findActiveItems(madeOfRes.data));
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  // Set initial form data after dropdown data is fetched
  useEffect(() => {
    if (initialProductData && brands.length > 0 && categories.length > 0 && countries.length > 0 && madeOf.length > 0) {
      // Find IDs for brand, category, country, and made_of
      const brandId = brands.find((b) => b.name === initialProductData.brand)?.brand_id || "";
      const categoryId = categories.find((c) => c.name === initialProductData.category)?.id || "";
      const countryId = countries.find((c) => c.name === initialProductData.country)?.country_id || "";
      const madeOfId = madeOf.find((m) => m.name === initialProductData.madeof)?.madeof_id || "";

      setProductData({
        name: initialProductData.name || "",
        description: initialProductData.description || "",
        price: initialProductData.price || "",
        quantity: initialProductData.quantity || "",
        category: categoryId,
        brand: brandId,
        country: countryId,
        made_of: madeOfId,
        stock_quantity: initialProductData.stock || 1,
        image: null,
        approved: initialProductData.approved === "true" || initialProductData.approved === true,
      });
    }
  }, [initialProductData, brands, categories, countries, madeOf]);

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    let processedValue;
  
    if (type === "checkbox") {
      processedValue = checked;
    } else if (["category", "brand", "country", "made_of"].includes(name)) {
      processedValue = Number(value) || "";
    } else {
      processedValue = value;
    }
  
    setProductData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleFileChange = (e) => {
    setProductData((prev) => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const validateForm = () => {
    const validationErrors = {};
    const changedFields = getChangedFields();

    // Only validate fields that have been changed
    if (changedFields.name && !productData.name.trim()) {
      validationErrors.name = "Name is required.";
    }
    
    // Quantity validation for format like "750 ml" or "1.5 L"
    if (changedFields.quantity) {
      const quantityPattern = /^\d+(\.\d+)?\s*(ml|L)$/i;
      if (!productData.quantity || !quantityPattern.test(productData.quantity.trim())) {
        validationErrors.quantity = "Quantity must be in format: '750 ml' or '1.5 L'";
      }
    }

    if (changedFields.description && !productData.description.trim()) validationErrors.description = "Description is required.";
    if (changedFields.category && !productData.category) validationErrors.category = "Category is required.";
    if (changedFields.brand && !productData.brand) validationErrors.brand = "Brand is required.";
    if (changedFields.country && !productData.country) validationErrors.country = "Country is required.";
    if (changedFields.made_of && !productData.made_of) validationErrors.made_of = "Material is required.";
    
    if (changedFields.price && (!productData.price || isNaN(productData.price) || Number(productData.price) <= 0)) {
      validationErrors.price = "Price must be a positive number.";
    }

    if (changedFields.stock_quantity && (!productData.stock_quantity || isNaN(productData.stock_quantity) || Number(productData.stock_quantity) < 0)) {
      validationErrors.stock_quantity = "Stock Quantity must be a non-negative number.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const getChangedFields = () => {
    const changedFields = {};
    Object.keys(productData).forEach(key => {
      if (initialProductData[key] !== productData[key]) {
        changedFields[key] = productData[key];
      }
    });
    return changedFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    const changedFields = getChangedFields();

    // Only send changed fields to the backend
    Object.entries(changedFields).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append(key, value);
      } else if (key === "approved") {
        // Convert to boolean before sending to backend
        formData.append(key, value ? "true" : "false");
      } else if (key !== "image") {
        formData.append(key, value);
      }
    });

    try {
      await axios.put(
        `${config.BASE_URL}api/v1/products/update/${initialProductData.id}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      alert("Product updated successfully!");
      onCancel();
      onConfirm();
    } catch (error) {
      console.error("Error updating product:", error.response?.data);
      alert("Error updating product. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h3>Edit Product</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="head">
            <span>Product Details</span>
          </div>

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}

          <label>Description</label>
          <input
            type="text"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
          />
          {errors.description && <span className="error">{errors.description}</span>}

          <label>Category</label>
          <select
            name="category"
            value={productData.category}
            onChange={handleInputChange}
          >
            <option value="">Select Category</option>
            {categories?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.category && <span className="error">{errors.category}</span>}

          <label>Brand</label>
          <select
            name="brand"
            value={productData.brand}
            onChange={handleInputChange}
          >
            <option value="">Select Brand</option>
            {brands?.map((item) => (
              <option key={item.brand_id} value={item.brand_id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.brand && <span className="error">{errors.brand}</span>}

          <label>Price</label>
          <input
            type="text"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
          />
          {errors.price && <span className="error">{errors.price}</span>}

          <label>Quantity (e.g., 750 ml, 1.5 L)</label>
          <input
            type="text"
            name="quantity"
            value={productData.quantity}
            onChange={handleInputChange}
            placeholder="e.g., 750 ml"
          />
          {errors.quantity && <span className="error">{errors.quantity}</span>}

          <label>Country</label>
          <select
            name="country"
            value={productData.country}
            onChange={handleInputChange}
          >
            <option value="">Select Country</option>
            {countries?.map((item) => (
              <option key={item.country_id} value={item.country_id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.country && <span className="error">{errors.country}</span>}

          <label>Made Of</label>
          <select
            name="made_of"
            value={productData.made_of}
            onChange={handleInputChange}
          >
            <option value="">Select Material</option>
            {madeOf?.map((item) => (
              <option key={item.madeof_id} value={item.madeof_id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.made_of && <span className="error">{errors.made_of}</span>}

          <label>Stock Quantity</label>
          <input
            type="number"
            name="stock_quantity"
            value={productData.stock_quantity}
            onChange={handleInputChange}
          />
          {errors.stock_quantity && <span className="error">{errors.stock_quantity}</span>}

          {(user?.is_superuser || user?.is_supplier) &&

          <div className="checkbox-container">
            <input
              type="checkbox"
              name="approved"
              checked={productData.approved}
              onChange={handleInputChange}
              id="approved"
            />
            <label htmlFor="approved">Approved Product</label>
          </div>
          }

          <label>Product Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
              Update Product
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default EditProductForm;
