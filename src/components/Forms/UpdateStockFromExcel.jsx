import React, { useState } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, Upload, Image } from 'lucide-react';
import './ProductExcelUpload.css';
import config from '../../config/config';

const ProductExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile?.type === 'application/vnd.ms-excel') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid Excel file (.xlsx or .xls)');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);
    setResponse(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${config.BASE_URL}api/v1/products/import-products/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponse(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <Upload size={20} /> Import Products from Excel
        </h2>
      </div>
      <div className="card-content">
        <div className="alert info">
          <Image className="icon" />
          <div>
            <h3 className="alert-title">Excel Format Requirements</h3>
            <p className="alert-description">
              Your Excel file should include these columns:
              <ul>
                <li>Required: pid, name, category, made-of, country, description, price, stock, quantity</li>
                <li>Optional: image_url (direct URL or local file path)</li>
              </ul>
            </p>
          </div>
        </div>
        <input type="file" onChange={handleFileChange} accept=".xlsx,.xls" className="file-input" />
        <button onClick={handleUpload} disabled={!file || uploading} className="upload-button">
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
        {error && (
          <div className="alert error">
            <AlertCircle className="icon" />
            <div>
              <h3 className="alert-title">Error</h3>
              <p className="alert-description">{error}</p>
            </div>
          </div>
        )}
        {response && (
          <div className="alert success">
            <CheckCircle className="icon" />
            <div>
              <h3 className="alert-title">Success</h3>
              <p className="alert-description">
                {response.message}
                <div>
                  <strong>Imported Products:</strong>
                  <ul>
                    {response?.products_created?.map((product, index) => (
                      <li key={index}>{product.name} - {product.image_status}</li>
                    ))}
                  </ul>
                </div>
                {response.errors && (
                  <div>
                    <strong>Errors:</strong>
                    <ul>
                      {response.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {response.image_errors && (
                  <div>
                    <strong>Image Processing Errors:</strong>
                    <ul>
                      {response.image_errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductExcelUpload;
