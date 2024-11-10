// Filter.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config/config'

const Filter = ({ category, setCategory, brand, setBrand, country, setCountry, madeOf, setMadeOf, sortOrder, setSortOrder }) => {
  // const BASE_URL = 'http://127.0.0.1:8000';
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [countries, setCountries] = useState([]);
  const [madeOfOptions, setMadeOfOptions] = useState([]);

  // Fetch filter options
  const fetchFilterOptions = () => {
    // Fetch categories
    axios.get(`${config.BASE_URL}api/v1/products/category-list/`)
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));

    // Fetch brands
    axios.get(`${config.BASE_URL}api/v1/products/brand-list/`)
      .then(response => setBrands(response.data))
      .catch(error => console.error("Error fetching brands:", error));

    // Fetch countries
    axios.get(`${config.BASE_URL}api/v1/products/country-list/`)
      .then(response => setCountries(response.data))
      .catch(error => console.error("Error fetching countries:", error));

    // Fetch madeOf options
    axios.get(`${config.BASE_URL}api/v1/products/madeof-list/`)
      .then(response => setMadeOfOptions(response.data))
      .catch(error => console.error("Error fetching materials:", error));
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  return (
    <aside className="hard-filter-sidebar">
      <h3>Filter & Sort</h3>

      {/* Sort Bar */}
      <div className="hard-sort-bar">
        <label htmlFor="sortOrder">Sort by:</label>
        <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          {/* <option value="rating">Rating</option> */}
        </select>
      </div>

      {/* Category Filter */}
      <div className="hard-filter-group">
        <h4>Category</h4>
        <select id="filterCategory" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div className="hard-filter-group">
        <h4>Brand</h4>
        <select id="filterBrand" value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="all">All</option>
          {brands.map(b => (
            <option key={b.id} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Country Filter */}
      <div className="hard-filter-group">
        <h4>Country</h4>
        <select id="filterCountry" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="all">All</option>
          {countries.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Made Of Filter */}
      <div className="hard-filter-group">
        <h4>Made Of</h4>
        <select id="filterMadeOf" value={madeOf} onChange={(e) => setMadeOf(e.target.value)}>
          <option value="all">All</option>
          {madeOfOptions.map(m => (
            <option key={m.id} value={m.name}>{m.name}</option>
          ))}
        </select>
      </div>
    </aside>
  );
};

export default Filter;






