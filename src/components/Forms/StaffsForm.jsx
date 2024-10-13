import React, { useState, useEffect } from "react";
import axios from "axios";
import "./forms.css";
import { formatDateForInput } from "../../pages/dashboard/helper";

const AddStaffForm = ({ onCancel, initialStaffData, isEdit }) => {
  const [staffData, setStaffData] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    phone: "",
    designation: "",
    hire_date: "",
    salary: "",
    is_active: "",
  });

  useEffect(() => {
    if (initialStaffData) {
      setStaffData({
        user_id: initialStaffData?.user_id,
        first_name: initialStaffData?.first_name,
        last_name: initialStaffData?.last_name,
        phone: initialStaffData?.phone,
        designation: initialStaffData?.designation,
        hire_date: formatDateForInput(initialStaffData?.hire_date),
        salary: initialStaffData?.salary,
        is_active: initialStaffData?.is_active,
      });
    }
  }, [initialStaffData]);
  console.log("staff---", staffData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffData({ ...staffData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Staff data:", staffData);
    const formData = new FormData();
    Object.keys(staffData).forEach((key) => {
      formData.append(key, staffData[key]);
    });

    if (isEdit) {
      // Update existing product
      axios
        .put(
          `http://127.0.0.1:8000/api/v1/staffs/update/${initialStaffData.staff_id}/`,
          formData,
          {}
        )
        .then((response) => {
          alert("staff updated successfully!");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating staff:", error.response.data);
        });
    } else {
      axios
        .post("http://127.0.0.1:8000/api/v1/staffs/create/", formData)
        .then((res) => {
          alert("staffData Added !");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="form-container">
      <h3> {isEdit ? "Edit Staff" : "Add New Staff"} </h3>
      <form onSubmit={handleSubmit}>
        <div className="head">
          <span>Staff Details</span>
        </div>

        <label htmlFor="user_id">User</label>
        <input
          type="text"
          id="user_id"
          name="user_id"
          value={staffData.user_id}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="first_name">First Name</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={staffData.first_name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="last_name">Last Name</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={staffData.last_name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="phone">Phone</label>
        <input
          type="number"
          id="phone"
          name="phone"
          value={staffData.phone}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="designation">Designation</label>
        <input
          type="text"
          id="designation"
          name="designation"
          value={staffData.designation}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="status">Status</label>
        <select
          id="is_active"
          name="is_active"
          value={staffData.is_active}
          onChange={(e) =>
            handleInputChange({
              target: { name: "is_active", value: e.target.value === "true" },
            })
          }
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <label htmlFor="hire_date">Hire Date</label>
        <input
          type="date"
          id="hire_date"
          name="hire_date"
          value={staffData.hire_date}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="salary">Salary</label>
        <input
          type="text"
          id="salary"
          name="salary"
          value={staffData.salary}
          onChange={handleInputChange}
          required
        />

        {/* <label htmlFor="totalAmount">Total Amount</label>
        <input
          type="text"
          id="totalAmount"
          name="totalAmount"
          value={staffData.totalAmount}
          onChange={handleInputChange}
          required
        /> */}

        <div className="form-actions">
          <button type="submit" className="save-btn">
            {isEdit ? "Update Staff" : "Save Staff"}
          </button>
          <button type="reset" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaffForm;
