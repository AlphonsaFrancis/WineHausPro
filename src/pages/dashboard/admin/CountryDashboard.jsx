import React, { useEffect, useState } from "react";
import "./ProductDashboard.css";
import DataTable from "../../../components/DataTable";
import BasicModal from "../../../components/BasicModal";
import axios from "axios";
import { format } from "date-fns";
import {
  getCountryById,
  getMadeofById,
  getItemById,
  findInactiveItems,
} from "../helper";
import config from "../../../config/config";
import AddcountryForm from "../../../components/Forms/AddcountryFrom";
import EditcountryForm from "../../../components/Forms/Editcountry";

function CountryDashboard() {
  const [countries, setCountries] = useState();
  const [countryResponse, setCountryResponse] = useState();
  const [selectedCountry, setselectedCountry] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const inactiveItems = findInactiveItems(countryResponse);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  console.log("countries", countries);

  useEffect(() => {
    getAllcountries();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      setFilteredProducts(
        countries.filter(
          (product) =>
            product.name.toLowerCase().includes(lowercasedTerm) ||
            product.description.toLowerCase().includes(lowercasedTerm)
        )
      );
    } else {
      setFilteredProducts(countries);
    }
  }, [searchTerm, countries]);

  const getAllcountries = () => {
    axios
      .get(`${config.BASE_URL}api/v1/products/country-list/`)
      .then((response) => {
        setCountryResponse(response.data);
        console.log("response.data", response.data);
        const transformedData = transformData(response.data);
        console.log("transformedData", transformedData);
        setCountries(transformedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const transformData = (countryDataArray) => {
    return countryDataArray.map((countryData) => ({
      country_id: countryData.country_id,
      name: countryData.name,
      description: countryData.description,
      created_at: format(new Date(countryData.created_at), "yyyy-MM-dd HH:mm"),
      updated_at: format(new Date(countryData.updated_at), "yyyy-MM-dd HH:mm"),
      isActive: countryData.is_active,
    }));
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
  };

  const handleEdit = (row) => {
    const country = getCountryById(row?.country_id, countries);
    setselectedCountry(country);
    setShowEditForm(true);
  };
  const handleDelete = (row) => {
    setselectedCountry(row);
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const deletecountry = () => {
    axios
      .delete(
        `${config.BASE_URL}api/v1/products/country-delete/${selectedCountry?.country_id}/`
      )
      .then((response) => {
        alert("country deleted");
        setDeleteModalOpen(false);
        setCountries((prevcountries) =>
          prevcountries.filter(
            (country) => country.country_id !== selectedCountry.country_id
          )
        );
        getAllcountries();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisablecountry = (row) => {
    console.log("row--", row);
    axios
      .post(
        `${config.BASE_URL}api/v1/products/disable-enable-country/${row?.country_id}/`
      )
      .then((response) => {
        getAllcountries();
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  };

  console.log("selectedCountry", selectedCountry);

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "country_id" },
      {
        Header: "country",
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
          <div className="info-title">Total countries</div>
          <div className="info-value success">{countries?.length}</div>
        </div>
        <div className="info">
          <div className="info-title">Inactive countries</div>
          <div className="info-value warning">{inactiveItems?.length}</div>
        </div>
      </div>

      <div className="add-product-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search Countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="add-product-button" onClick={() => setIsShowForm(true)}>
          Add Country
        </div>
      </div>

      <div className="product-table">
        <DataTable
          columns={columns}
          data={filteredProducts ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleDisablecountry}
        />
      </div>
      <BasicModal
        open={deleteModalOpen}
        isConfirmModal={true}
        setOpen={handleDeleteModalClose}
        onConfirm={deletecountry}
        heading={`Delete country`}
        content={"Are you sure you want to delete this item?"}
      />

      <BasicModal
        open={isShowForm}
        setOpen={handleCloseForm}
        content={
          <AddcountryForm
            onCancel={handleCloseForm}
            onConfirm={getAllcountries}
          />
        }
      />

      <BasicModal
        open={showEditForm}
        setOpen={handleEditFormClose}
        content={
          <EditcountryForm
            onCancel={handleEditFormClose}
            onConfirm={getAllcountries}
            initialCountryData={selectedCountry}
          />
        }
      />
    </div>
  );
}

export default CountryDashboard;
