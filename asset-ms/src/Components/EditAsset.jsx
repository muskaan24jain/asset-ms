
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditMapComponent from "./EditMapComponent";

const EditAsset = () => {
  const { id } = useParams();
  const [asset, setAsset] = useState({
    category_id: "",
    quantity: "",
    price: "",
    address: "",
    status: "", 
  });
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Fetch asset
    axios
      .get(`http://localhost:3000/auth/asset/${id}`)
      .then((result) => {
        if (result.data.Status) {
          const data = result.data.Result;
          setAsset({
            category_id: data.category_id || "",
            quantity: data.quantity || "",
            price: data.price || "",
            address: data.address || "",
            status: data.status || "", 
          });
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category_id", asset.category_id);
    formData.append("quantity", asset.quantity);
    formData.append("price", asset.price);
    formData.append("address", asset.address);
    formData.append("status", asset.status); 

    axios
      .put(`http://localhost:3000/auth/asset/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        if (response.data.Status) {
          
          navigate("/dashboard/asset");
        } else {
          alert(response.data.Error);
        }
      })
      .catch((err) => console.log("Error:", err));
  };

  const setAddressField = (address) => {
    setAsset({ ...asset, address });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Asset</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              name="category"
              id="category"
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
            <label htmlFor="inputStatus" className="form-label">
              Status
            </label>
            <select
              name="status"
              id="inputStatus"
              className="form-select"
              value={asset.status}
              onChange={(e) => setAsset({ ...asset, status: e.target.value })}
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-success w-100 rounded-0 mb-2"
            >
              Update Asset
            </button>
          </div>
        </form>
      </div>
      <div className="map-container p-3 rounded border">
        <EditMapComponent setAddressField={setAddressField} />
      </div>
    </div>
  );
};

export default EditAsset;
