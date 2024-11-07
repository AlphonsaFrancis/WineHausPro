import React, { useEffect, useState } from "react";
import "./ProductDashboard.css";
import DataTable from "../../../components/DataTable";
import BasicModal from "../../../components/BasicModal";
import axios from "axios";
import { format } from "date-fns";
import {
  getBrandById,
  findInactiveItems,
} from "../helper";
import AddBrandForm from "../../../components/Forms/AddBrandForm";
import EditBrandForm from "../../../components/Forms/EditBrandForm";

function BrandsDashboard() {
  const [brands, SetBrands] = useState();
  const [brandResponse, setBrandResponse] = useState();
  const [selectedBrand, setSelectedBrand] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const inactiveItems = findInactiveItems(brandResponse);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);


  useEffect(() => {
    getAllBrands();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      setFilteredProducts(
        brands.filter(
          (product) =>
            product.name.toLowerCase().includes(lowercasedTerm) ||
            product.description.toLowerCase().includes(lowercasedTerm)
        )
      );
    } else {
      setFilteredProducts(brands);
    }
  }, [searchTerm, brands]);

  const getAllBrands = () => {
    axios
      .get("http://127.0.0.1:8000/api/v1/products/brand-list/")
      .then((response) => {
        setBrandResponse(response.data);
        const transformedData = transformBrandData(response.data);
        SetBrands(transformedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const transformBrandData = (brandDataArray) => {
    return brandDataArray.map((brandData) => ({
      brand_id: brandData.brand_id,
      name: brandData.name,
      description: brandData.description,
      created_at: format(new Date(brandData.created_at), "yyyy-MM-dd HH:mm"),
      updated_at: format(new Date(brandData.updated_at), "yyyy-MM-dd HH:mm"),
      isActive: brandData.is_active,
    }));
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
  };

  const handleEdit = (row) => {
    const brand = getBrandById(row?.brand_id, brands);
    setSelectedBrand(brand);
    setShowEditForm(true);
  };
  const handleDelete = (row) => {
    setSelectedBrand(row);
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const deleteBrand = () => {
    axios
      .delete(
        `http://127.0.0.1:8000/api/v1/products/brand-delete/${selectedBrand?.brand_id}/`
      )
      .then((response) => {
        alert("Brand deleted");
        setDeleteModalOpen(false);
        SetBrands((prevBrands) =>
          prevBrands.filter(
            (brand) => brand.brand_id !== selectedBrand.brand_id
          )
        );
        getAllBrands();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisableBrand = (row) => {
    axios
      .post(
        `http://127.0.0.1:8000/api/v1/products/disable-enable-brand/${row?.brand_id}/`
      )
      .then((response) => {
        getAllBrands();
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  };

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "brand_id" },
      {
        Header: "Brand",
        accessor: "name",
        Cell: ({ row }) => (
          <div>
            <strong>{row.original.name}</strong>
            <div className="admin-table-subtext">
              {row.original.description}
            </div>
          </div>
        ),
      },
      { Header: "Created On", accessor: "created_at" },
      { Header: "Updated On", accessor: "updated_at" },
      {
        Header: "Status",
        accessor: "isActive",
        Cell: ({ value }) => (value ? "Active" : "Inactive"),
      },
    ],
    []
  );

  return (
    <div className="product-main-container">
      <div className="short-infos">
        <div className="info">
          <div className="info-title">Total Brands</div>
          <div className="info-value success">{brands?.length}</div>
        </div>
        <div className="info">
          <div className="info-title">Inactive Brands</div>
          <div className="info-value warning">{inactiveItems?.length}</div>
        </div>
      </div>

      <div className="add-product-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search Brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="add-product-button" onClick={() => setIsShowForm(true)}>
          Add Brand
        </div>
      </div>

      <div className="product-table">
        <DataTable
          columns={columns}
          data={filteredProducts ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleDisableBrand}
        />
      </div>
      <BasicModal
        open={deleteModalOpen}
        isConfirmModal={true}
        setOpen={handleDeleteModalClose}
        onConfirm={deleteBrand}
        heading={`Delete Brand`}
        content={"Are you sure you want to delete this item?"}
      />

      <BasicModal
        open={isShowForm}
        setOpen={handleCloseForm}
        content={
          <AddBrandForm onCancel={handleCloseForm} onConfirm={getAllBrands} />
        }
      />

      <BasicModal
        open={showEditForm}
        setOpen={handleEditFormClose}
        content={
          <EditBrandForm
            onCancel={handleEditFormClose}
            onConfirm={getAllBrands}
            initialBrandData={selectedBrand}
          />
        }
      />
    </div>
  );
}

export default BrandsDashboard;
