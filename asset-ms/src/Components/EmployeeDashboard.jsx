import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [selectedFields, setSelectedFields] = useState([
    "category_id",
    "quantity",
    "price",
    "address",
    "address1",
    "address2",
    "status",
    "installation_date",
  ]);

  const navigate = useNavigate();
  const location = useLocation();

  const isDashboardRoute = location.pathname === "/employee/dashboard";
  const isProfileRoute = location.pathname.startsWith(
    "/employee/dashboard/profile"
  );
  const isAssetManagementRoute =
    location.pathname.startsWith("/employee/dashboard/edit_asset") ||
    location.pathname.startsWith("/employee/dashboard/add_asset") ||
    location.pathname.startsWith("/employee/dashboard/asset_details");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const result = await axios.get("http://localhost:3000/employee/asset");
        if (result.data.Status) {
          setAssets(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      } catch (err) {
        console.error("An error occurred while fetching the assets:", err);
        alert("An error occurred while fetching the assets.");
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        const result = await axios.get(
          "http://localhost:3000/employee/dashboard/profile"
        );
        if (result.data.Status) {
          setProfile(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      } catch (err) {
        console.error(
          "An error occurred while fetching the profile information:",
          err
        );
        alert("An error occurred while fetching the profile information.");
      }
    };

    fetchAssets();
    fetchProfile();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        const result = await axios.delete(
          `http://localhost:3000/employee/delete_asset/${id}`
        );
        if (result.data.Status) {
          setAssets(assets.filter((asset) => asset.id !== id));
        } else {
          alert(result.data.Error);
        }
      } catch (err) {
        console.error("Error deleting asset:", err);
        alert("An error occurred while deleting the asset.");
      }
    }
  };

  const handleLogout = () => {
    axios
      .post("http://localhost:3000/employee/employee_logout")
      .then((result) => {
        console.log("Logout Response:", result.data);
        if (result.data.Status) {
          navigate("/employee_login");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((error) => {
        console.error("There was an error logging out!", error);
        alert("An error occurred while logging out.");
      });
  };

  const handleEditClick = (id) => {
    navigate(`/employee/dashboard/edit_asset/${id}`);
  };

  const handleAddClick = () => {
    navigate("/employee/dashboard/add_asset");
  };

  const handleViewDetails = (id) => {
    navigate(`/employee/dashboard/employee_asset_details/${id}`);
  };

  const handleFieldChange = (e) => {
    const field = e.target.value;
    setSelectedFields((prevFields) =>
      prevFields.includes(field)
        ? prevFields.filter((f) => f !== field)
        : [...prevFields, field]
    );
  };

  const allFields = [
    "category_id",
    "quantity",
    "price",
    "address",
    "address1",
    "address2",
    "status",
    "installation_date",
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {isDashboardRoute && (
          <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
              <Link
                to="/employee/dashboard"
                className="d-flex align-items-center pb-3 mb-md-1 my-md-3 me-md-auto text-white text-decoration-none"
              >
                <span className="fs-5 fw-bolder d-none d-sm-inline">
                  Employee Dashboard
                </span>
              </Link>
              <ul
                className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
                id="menu"
              >
                <li className="w-100">
                  <Link
                    to="/employee/dashboard"
                    className="nav-link text-white px-0 align-middle"
                  >
                    <i className="fs-4 bi-speedometer2 ms-2"></i>
                    <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                  </Link>
                </li>
                <li className="w-100">
                  <Link
                    to="#"
                    className="nav-link px-0 align-middle text-white"
                    onClick={handleAddClick}
                  >
                    <i className="fs-4 bi-people ms-2"></i>
                    <span className="ms-2 d-none d-sm-inline">
                      Manage Assets
                    </span>
                  </Link>
                </li>
                <li className="w-100">
                  <Link
                    to="/employee/dashboard/generate_report"
                    className="nav-link px-0 align-middle text-white"
                  >
                    <i className="fs-4 bi-file-earmark-text ms-2"></i>
                    <span className="ms-2 d-none d-sm-inline">
                      Generate Report
                    </span>
                  </Link>
                </li>
                <li className="w-100">
                  <Link
                    to="/employee/dashboard/profile"
                    className="nav-link px-0 align-middle text-white"
                  >
                    <i className="fs-4 bi-person ms-2"></i>
                    <span className="ms-2 d-none d-sm-inline">Profile</span>
                  </Link>
                </li>
                <li className="w-100">
                  <Link
                    to="#"
                    onClick={handleLogout}
                    className="nav-link px-0 align-middle text-white"
                  >
                    <i className="fs-4 bi-power ms-2"></i>
                    <span className="ms-2 d-none d-sm-inline">Logout</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="col p-0 m-0">
          {isDashboardRoute && !isProfileRoute && !isAssetManagementRoute && (
            <>
              <div className="p-2 d-flex justify-content-center shadow">
                <h4>Employee Dashboard</h4>
              </div>
              <div className="px-5 mt-3">
                <h3>Welcome to the Employee Dashboard!</h3>
                <p>
                  Here you can manage your assets, view your profile, and more.
                  Select an option from the menu to get started.
                </p>
              </div>
              <div className="px-5 mt-3">
                <div className="d-flex justify-content-center">
                  <h3>Asset List</h3>
                </div>
                <button className="btn btn-success" onClick={handleAddClick}>
                  Add Asset
                </button>
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
                          <label htmlFor={field}>{field}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <table className="table table-striped mt-3">
                  <thead>
                    <tr>
                      {selectedFields.includes("category_id") && (
                        <th scope="col">Category</th>
                      )}
                      {selectedFields.includes("quantity") && (
                        <th scope="col">Quantity</th>
                      )}
                      {selectedFields.includes("price") && (
                        <th scope="col">Price</th>
                      )}
                      {selectedFields.includes("address") && (
                        <th scope="col">Address</th>
                      )}
                      {selectedFields.includes("address1") && (
                        <th scope="col">Address 1</th>
                      )}
                      {selectedFields.includes("address2") && (
                        <th scope="col">Address 2</th>
                      )}
                      {selectedFields.includes("status") && (
                        <th scope="col">Status</th>
                      )}
                      {selectedFields.includes("installation_date") && (
                        <th scope="col">Installation Date</th>
                      )}
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => (
                      <tr key={asset.id}>
                        {selectedFields.includes("category_id") && (
                          <td>{asset.category_id}</td>
                        )}
                        {selectedFields.includes("quantity") && (
                          <td>{asset.quantity}</td>
                        )}
                        {selectedFields.includes("price") && (
                          <td>{asset.price}</td>
                        )}
                        {selectedFields.includes("address") && (
                          <td>{asset.address}</td>
                        )}
                        {selectedFields.includes("address1") && (
                          <td>{asset.address1}</td>
                        )}
                        {selectedFields.includes("address2") && (
                          <td>{asset.address2}</td>
                        )}
                        {selectedFields.includes("status") && (
                          <td>{asset.status}</td>
                        )}
                        {selectedFields.includes("installation_date") && (
                          <td>{asset.installation_date}</td>
                        )}
                        <td>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEditClick(asset.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-info btn-sm mx-2"
                            onClick={() => handleViewDetails(asset.id)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(asset.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
