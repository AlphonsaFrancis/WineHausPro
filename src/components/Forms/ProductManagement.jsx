import React, { useState } from 'react';
import { Upload, Plus } from 'lucide-react';
import './ProductManagement.css';
import ProductExcelUpload from './UpdateStockFromExcel';
import AddProductForm from './AddProductFrom';


const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState("single");
  const [formKey, setFormKey] = useState(0);

  const handleSuccess = () => {
    setFormKey(prevKey => prevKey + 1);
  };

  return (
    <div className="product-management-container">
      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'single' ? 'active' : ''}`}
            onClick={() => setActiveTab('single')}
          >
            <Plus size={20} />
            Add Single Product
          </button>
          <button 
            className={`tab-button ${activeTab === 'bulk' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulk')}
          >
            <Upload size={20} />
            Bulk Import
          </button>
        </div>
        
        <div className={`tab-content ${activeTab === 'single' ? 'active' : ''}`}>
          <AddProductForm
            key={formKey}
            onCancel={() => setActiveTab("bulk")}
            onConfirm={handleSuccess}
          />
        </div>
        
        <div className={`tab-content ${activeTab === 'bulk' ? 'active' : ''}`}>
          <ProductExcelUpload onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;