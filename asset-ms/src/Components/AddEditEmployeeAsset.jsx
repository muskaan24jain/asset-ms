
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import MapComponent from "./MapComponent";
import EditMapComponent from "./EditMapComponent";
import "./AddEditEmployeeAsset.css";

const AddEditEmployeeAsset = () => {
  const [asset, setAsset] = useState({
    category_id: "",
    quantity: "",
    price: "",
    address: "",
    address1: "",
    address2: "",
    status: "",
    receipts: [], // Array of files
    installation_date: new Date().toISOString().split("T")[0],
  });
  const [category, setCategory] = useState([]);
  const [statusOptions, setStatusOptions] = useState([
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "maintenance", label: "Maintenance" },
    { value: "retired", label: "Retired" },
  ]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/employee/asset/${id}`)
        .then((result) => {
          if (result.data.Status) {
            setAsset(result.data.Result);
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }

    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("An error occurred while fetching the categories.");
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category_id", asset.category_id);
    formData.append("quantity", asset.quantity);
    formData.append("price", asset.price);
    formData.append("address", asset.address);
    formData.append("address1", asset.address1);
    formData.append("address2", asset.address2);
    formData.append("status", asset.status);
    formData.append("installation_date", asset.installation_date);
    
    const axiosRequest = id
      ? axios.put(`http://localhost:3000/employee/asset/${id}`, formData)
      : axios.post("http://localhost:3000/employee/asset", formData);

    axiosRequest
      .then((result) => {
        if (result.data.Status) {
          navigate("/employee/temp");
          setTimeout(() => {
            navigate("/employee/dashboard");
          }, 100);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsset({ ...asset, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + asset.receipts.length > 3) {
      alert("You can upload a maximum of 3 files.");
      return;
    }
    setAsset((prev) => ({
      ...prev,
      receipts: [...prev.receipts, ...files],
    }));
    
    e.target.value = null;
    setFileInputKey(Date.now());
  };

  const setAddressField = (address) => {
    setAsset({ ...asset, address });
  };

  return (
    <div className="d-flex justify-content-center align-items-start vh-100">
      <div className="form-container p-3 rounded border flex-grow-1">
        <form className="w-100" onSubmit={handleSubmit}>
          <h2>{id ? "Edit Asset" : "Add Asset"}</h2>

          {/* Category */}
          <div className="mb-3">
            <label htmlFor="category_id" className="form-label">
              Category
            </label>
            <select
              className="form-control"
              id="category_id"
              name="category_id"
              value={asset.category_id}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {category.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">
              Quantity
            </label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              name="quantity"
              value={asset.quantity}
              onChange={handleChange}
              required
            />
          </div>

          {/* Price */}
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={asset.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address */}
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={asset.address}
              onChange={handleChange}
              required
              placeholder="Click on the map to select the address"
              readOnly
            />
          </div>

          {/* Status */}
          <div className="mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              className="form-control"
              id="status"
              name="status"
              value={asset.status}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select status
              </option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

         
          {!id && (
            <>
              {/* Address1 */}
              <div className="mb-3">
                <label htmlFor="address1" className="form-label">
                  Address 1
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address1"
                  name="address1"
                  value={asset.address1}
                  onChange={handleChange}
                  placeholder="Enter Address Line 1"
                />
              </div>

              {/* Address2 */}
              <div className="mb-3">
                <label htmlFor="address2" className="form-label">
                  Address 2
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address2"
                  name="address2"
                  value={asset.address2}
                  onChange={handleChange}
                  placeholder="Enter Address Line 2"
                />
              </div>

              {/* Installation Date */}
              <div className="col-12">
                <label htmlFor="inputDate" className="form-label">
                  Installation Date
                </label>
                <input
                  type="date"
                  className="form-control rounded-0"
                  id="inputDate"
                  value={asset.installation_date}
                  onChange={(e) =>
                    setAsset({ ...asset, installation_date: e.target.value })
                  }
                />
              </div>

              {/* Receipts */}
              <div className="col-12 mb-3">
                <label className="form-label" htmlFor="inputGroupFile01">
                  Select Receipts (Max 3 files, each up to 500 MB)
                </label>
                <input
                  type="file"
                  className="form-control rounded-0"
                  id="inputGroupFile01"
                  key={fileInputKey} 
                  multiple
                  onChange={handleFileChange}
                />
                {asset.receipts.length > 0 && (
                  <ul>
                    {asset.receipts.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary">
            {id ? "Update Asset" : "Add Asset"}
          </button>
        </form>
      </div>

      {/* Map Component */}
      <div className="map-container p-3 ms-3 flex-shrink-1">
        <EditMapComponent setAddressField={setAddressField} />
      </div>
    </div>
  );
};

export default AddEditEmployeeAsset;
