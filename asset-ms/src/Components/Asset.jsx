
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Asset.css";

const Asset = () => {
  const [assets, setAssets] = useState([]);
  const [selectedFields, setSelectedFields] = useState([
    "category_id",
    "quantity",
    "price",
    "address",
    "address1",
    "address2",
    "installation_date",
    "status",
  ]);

  const allFields = [
    "category_id",
    "quantity",
    "price",
    "address",
    "address1",
    "address2",
    "installation_date",
    "status",
  ];

  useEffect(() => {
    
    const savedFields = JSON.parse(localStorage.getItem("selectedFields"));
    if (savedFields) {
      setSelectedFields(savedFields);
    }

    // Fetch assets
    fetchAssets();
  }, []);

  useEffect(() => {
    
    localStorage.setItem("selectedFields", JSON.stringify(selectedFields));
  }, [selectedFields]);

  const fetchAssets = async () => {
    try {
      const result = await axios.get("http://localhost:3000/auth/asset");
      if (result.data.Status) {
        setAssets(result.data.Result);
      } else {
        alert(result.data.Error);
      }
    } catch (err) {
      console.error("Error fetching assets:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        const result = await axios.delete(
          `http://localhost:3000/auth/delete_asset/${id}`
        );
        if (result.data.Status) {
          
          fetchAssets();
        } else {
          alert(result.data.Error);
        }
      } catch (err) {
        console.error("Error deleting asset:", err);
      }
    }
  };

  const handleFieldChange = (e) => {
    const { value, checked } = e.target;
    setSelectedFields((prevFields) =>
      checked
        ? [...prevFields, value]
        : prevFields.filter((field) => field !== value)
    );
  };

  return (
    <div className="asset-container px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Asset List</h3>
      </div>
      <Link to="/dashboard/add_asset" className="btn btn-success">
        Add Asset
      </Link>
      <div className="asset-dropdown mt-3">
        <button className="btn btn-primary">Select Fields</button>
        <div className="asset-dropdown-content">
          <div className="asset-checkboxes">
            <h4>Select Fields to Display:</h4>
            {allFields.map((field) => (
              <div key={field}>
                <input
                  type="checkbox"
                  id={field}
                  value={field}
                  checked={selectedFields.includes(field)}
                  onChange={handleFieldChange}
                />
                <label htmlFor={field}>
                  {field.replace("_", " ").toUpperCase()}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <table className="table mt-3">
        <thead>
          <tr>
            {selectedFields.map((field) => (
              <th key={field}>{field.replace("_", " ").toUpperCase()}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assets.length > 0 ? (
            assets.map((e) => (
              <tr key={e.id}>
                {selectedFields.includes("category_id") && (
                  <td>{e.category_id}</td>
                )}
                {selectedFields.includes("quantity") && <td>{e.quantity}</td>}
                {selectedFields.includes("price") && <td>{e.price}</td>}
                {selectedFields.includes("address") && <td>{e.address}</td>}
                {selectedFields.includes("address1") && <td>{e.address1}</td>}
                {selectedFields.includes("address2") && <td>{e.address2}</td>}
                {selectedFields.includes("installation_date") && (
                  <td>{new Date(e.installation_date).toLocaleDateString()}</td>
                )}
                {selectedFields.includes("status") && <td>{e.status}</td>}
                <td>
                  <Link
                    to={`/dashboard/asset/${e.id}`}
                    className="btn btn-primary btn-sm me-2"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/dashboard/edit_asset/${e.id}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={selectedFields.length + 1} className="text-center">
                No assets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Asset;
