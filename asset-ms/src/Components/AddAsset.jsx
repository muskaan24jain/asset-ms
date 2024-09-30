import "./AddAsset.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapComponent from "./MapComponent";

const AddAsset = () => {
  const [asset, setAsset] = useState({
    category_id: "",
    quantity: "",
    price: "",
    address: "",
    address1: "",
    address2: "",
    status: "",
    receipts: [], // Array to handle multiple files
    installation_date: new Date().toISOString().split("T")[0],
  });

  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Key to reset file input

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status && Array.isArray(result.data.Result)) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

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

    asset.receipts.forEach((file, index) => {
      formData.append("receipts", file); 
    });

    axios
      .post("http://localhost:3000/auth/add_asset", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/asset");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Error:", err.response || err.message || err);
      });
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
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Asset</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="category_id" className="form-label">
              Category
            </label>
            <select
              name="category_id"
              id="category_id"
              className="form-select"
              value={asset.category_id}
              onChange={(e) =>
                setAsset({ ...asset, category_id: e.target.value })
              }
            >
              <option value="" disabled>
                Select Category
              </option>
              {category.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label htmlFor="inputQuantity" className="form-label">
              Quantity
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputQuantity"
              placeholder="Enter Quantity"
              value={asset.quantity}
              onChange={(e) => setAsset({ ...asset, quantity: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPrice" className="form-label">
              Price
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputPrice"
              placeholder="Input Price"
              autoComplete="off"
              value={asset.price}
              onChange={(e) => setAsset({ ...asset, price: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="1234 main st"
              autoComplete="off"
              value={asset.address}
              onChange={(e) => setAsset({ ...asset, address: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputAddress1" className="form-label">
              Address Line 1
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress1"
              placeholder="Address Line 1"
              autoComplete="off"
              value={asset.address1}
              onChange={(e) => setAsset({ ...asset, address1: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputAddress2" className="form-label">
              Address Line 2
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress2"
              placeholder="Address Line 2"
              autoComplete="off"
              value={asset.address2}
              onChange={(e) => setAsset({ ...asset, address2: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputStatus" className="form-label">
              Status
            </label>
            <select
              name="status"
              id="status"
              className="form-select"
              value={asset.status}
              onChange={(e) => setAsset({ ...asset, status: e.target.value })}
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

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

          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="inputGroupFile01">
              Select Receipts (Max 3 files, each up to 500 MB)
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroupFile01"
              key={fileInputKey} // Key to reset input
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

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-success w-100 rounded-0 mb-2"
            >
              Add Asset
            </button>
          </div>
        </form>
      </div>
      <div className="map-container p-2 rounded border">
        <MapComponent setAddressField={setAddressField} />
      </div>
    </div>
  );
};

export default AddAsset;
