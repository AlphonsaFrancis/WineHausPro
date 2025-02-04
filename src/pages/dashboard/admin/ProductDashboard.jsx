import React, { useEffect, useState } from "react";
import "./ProductDashboard.css";
import DataTable from "../../../components/DataTable";
import BasicModal from "../../../components/BasicModal";
import axios from "axios";
import {
  getBrandById,
  categoryItemById,
  getCountryById,
  getMadeofById,
  getItemById,
  findOutOfStockItems,
  findInactiveItems,
} from "../helper";
import config from "../../../config/config";
import AddProductForm from "../../../components/Forms/AddProductFrom";
import EditProductForm from "../../../components/Forms/EditProductForm";
import { useNavigate } from "react-router-dom";
import ProductManagement from "../../../components/Forms/ProductManagement";

function ProductDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [notApprovedProducts, setNotApprovedProducts] = useState([]);
  const [showNotApprovedProduct, setShowNotApprovedProducts]=useState(false)
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productResponse, setProductResponse] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const outOfStockItems = findOutOfStockItems(productResponse);
  const inactiveItems = findInactiveItems(productResponse);

  const brands = JSON.parse(localStorage.getItem("brands"));
  const categories = JSON.parse(localStorage.getItem("categories"));
  const countries = JSON.parse(localStorage.getItem("countries"));
  const madeOf = JSON.parse(localStorage.getItem("madeOf"));

  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);

  useEffect(() => {
    getAllProducts();
    getNotApprovedProducts()

  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name.toLowerCase().includes(lowercasedTerm) ||
            product.description.toLowerCase().includes(lowercasedTerm) ||
            product.brand.toLowerCase().includes(lowercasedTerm) ||
            product.country.toLowerCase().includes(lowercasedTerm) ||
            product.category.toLowerCase().includes(lowercasedTerm) ||
            product.madeof.toLowerCase().includes(lowercasedTerm)
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  // useEffect(()=>{
  //   // if(user?.is_supplier){
  //     getNotApprovedProducts()
  //   // }
  // },[user])

  const getAllProducts = () => {
    axios
      .get(`${config.BASE_URL}api/v1/products/list/`)
      .then((response) => {
        setProductResponse(response.data);
        const transformedData = transformProductData(response.data);
        setProducts(transformedData);
        setFilteredProducts(transformedData); 
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getNotApprovedProducts = () => {
    axios
      .get(`${config.BASE_URL}api/v1/products/list-not-approved-products/`)
      .then((response) => {
        const transformedData = transformProductData(response.data);
        setNotApprovedProducts(transformedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const transformProductData = (data) => {
    return data.map((product) => ({
      id: product.product_id,
      name: product.name,
      description: product.description,
      price: product.price,
      brand: getBrandById(product.brand, brands)?.name,
      quantity: product.quantity,
      country: getCountryById(product.country, countries)?.name,
      category: categoryItemById(product.category, categories)?.name,
      madeof: getMadeofById(product.made_of, madeOf)?.name,
      stock: product.stock_quantity,
      isActive: product.is_active,
      approved:product.approved
    }));
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
  };

  const handleEdit = (row) => {
    const selectedProduct = getItemById(row?.id, showNotApprovedProduct? notApprovedProducts: products);
    console.log("selectedProduct",selectedProduct)
    setSelectedProduct(selectedProduct);
    setShowEditForm(true);
  };

  const handleDelete = (row) => {
    setSelectedProduct(row);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const deleteProduct = () => {
    axios
      .delete(
        `${config.BASE_URL}api/v1/products/delete/${selectedProduct?.id}/`
      )
      .then((response) => {
        alert("Product deleted");
        setDeleteModalOpen(false);
        setFilteredProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== selectedProduct.id)
        );
        getAllProducts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisableProduct = (row) => {
    axios
      .post(`${config.BASE_URL}api/v1/products/disable-or-enable/${row?.id}/`)
      .then((response) => {
        getAllProducts();
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  };

  const showMoreDetails = (row) => {
    console.log("row", row);
    if (user.is_superuser) {
      navigate(`/admin/products/${row.id}`);
    } else {
      navigate(`/staff/products/${row.id}`);
    }
  };

  // HELPER FUNCTIONS

  const columns = React.useMemo(
    () => [
      {
        Header: "Product",
        accessor: "name",
        Cell: ({ row }) => (
          <div style={{width:'120px'}}>
            <strong>{row.original.name}</strong>
            <div className="admin-table-subtext truncate-text" >
              {row.original.description}
            </div>
          </div>
        ),
      },
      { Header: "Price", accessor: "price" },
      { Header: "Brand", accessor: "brand" },
      { Header: "Qty", accessor: "quantity" },
      { Header: "Country", accessor: "country" },
      { Header: "Category", accessor: "category" },
      { Header: "Madeof", accessor: "madeof" },
      { Header: "Stock", accessor: "stock" },
      {
        Header: "Status",
        accessor: "isActive",
        Cell: ({ row }) => {
          const isActive = row.original.isActive;
          const isApproved = row.original.approved;
          
          return isActive ? 
            `${isApproved ? 'Approved' : 'Not Approved'} - Active` : 
            `${isApproved ? 'Approved' : 'Not Approved'} - Inactive`;
        }
      }
    ],
    []
  );

  return (
    <div className="product-main-container">
      <div className="short-infos">
        <div className="info" onClick={()=>setShowNotApprovedProducts(false)} style={{cursor:'pointer'}}>
          <div className="info-title">Approved Products</div>
          <div className="info-value success">{products?.length}</div>
        </div>
        <div className="info" onClick={()=>setShowNotApprovedProducts(true)} style={{cursor:'pointer'}}>
          <div className="info-title">Not Approved Products</div>
          <div className="info-value error-text">{notApprovedProducts?.length}</div>
        </div>
        <div className="info">
          <div className="info-title">Out of stock</div>
          <div className="info-value warning">{outOfStockItems?.length}</div>
        </div>
        <div className="info">
          <div className="info-title">Inactive Items</div>
          <div className="info-value warning">{inactiveItems?.length}</div>
        </div>
      </div>

      <div className="add-product-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search Products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="add-product-button" onClick={() => setIsShowForm(true)}>
          Add Product
        </div>
      </div>

      <div className="product-table">
        <DataTable
          columns={columns}
          data={showNotApprovedProduct ? notApprovedProducts: filteredProducts ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={ handleDisableProduct}
          showViewMoreIcon={true}
          onShowMoreDetails={showMoreDetails}
          // hideActiveButton={user?.is_staff}
          showDeleteIcon={!user?.is_staff}
          
        />
      </div>
      <BasicModal
        open={deleteModalOpen}
        isConfirmModal={true}
        setOpen={handleDeleteModalClose}
        onConfirm={deleteProduct}
        heading={`Delete Product`}
        content={"Are you sure you want to delete this item?"}
      />

      {isShowForm && (
        <BasicModal
          open={isShowForm}
          setOpen={handleCloseForm}
          content={
            user?.is_supplier ? (
              <ProductManagement />
            ) : (
              <AddProductForm
                onCancel={handleCloseForm}
                onConfirm={getAllProducts}
              />
            )
          }
          customStyle={{
            height: "87vh",
            overflowY: "scroll",
            marginTop: "0px",
          }}
        />
      )}
      {showEditForm && (
        <BasicModal
          open={showEditForm}
          setOpen={handleEditFormClose}
          content={
            <EditProductForm
              onCancel={handleEditFormClose}
              onConfirm={getAllProducts}
              initialProductData={selectedProduct}
            />
          }
          customStyle={{
            height: "87vh",
            overflowY: "scroll",
            marginTop: "0px",
          }}
        />
      )}
    </div>
  );
}

export default ProductDashboard;
