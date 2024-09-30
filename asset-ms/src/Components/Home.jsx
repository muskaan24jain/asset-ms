
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Home.css";

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [assetTotal, setAssetTotal] = useState(0);
  const [priceTotal, setPriceTotal] = useState(0);
  const [activeAssets, setActiveAssets] = useState(0);
  const [inactiveAssets, setInactiveAssets] = useState(0);
  const [maintenanceAssets, setMaintenanceAssets] = useState(0);
  const [retiredAssets, setRetiredAssets] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [editingEmail, setEditingEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      adminCount(),
      employeeCount(),
      assetCount(),
      priceCount(),
      assetStatusCounts(),
      AdminRecords(),
    ]).finally(() => setLoading(false));
  }, []);

  const AdminRecords = () => {
    return axios
      .get("http://localhost:3000/auth/admin_records")
      .then((result) => {
        if (result.data.Status) {
          setAdmins(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const adminCount = () => {
    return axios
      .get("http://localhost:3000/auth/admin_count")
      .then((result) => {
        if (result.data.Status) {
          setAdminTotal(result.data.Result[0].admin);
        }
      })
      .catch((err) => console.log(err));
  };

  const employeeCount = () => {
    return axios
      .get("http://localhost:3000/auth/employee_count")
      .then((result) => {
        if (result.data.Status) {
          setEmployeeTotal(result.data.Result[0].employee);
        }
      })
      .catch((err) => console.log(err));
  };

  const assetCount = () => {
    return axios
      .get("http://localhost:3000/auth/asset_count")
      .then((result) => {
        if (result.data.Status) {
          setAssetTotal(result.data.Result[0].asset);
        }
      })
      .catch((err) => console.log(err));
  };

  const priceCount = () => {
    return axios
      .get("http://localhost:3000/auth/price_count")
      .then((result) => {
        if (result.data.Status) {
          setPriceTotal(result.data.Result[0].priceOFasset);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const assetStatusCounts = () => {
    return axios
      .get("http://localhost:3000/auth/asset_status_counts")
      .then((result) => {
        if (result.data.Status) {
          setActiveAssets(result.data.Result.activeCount);
          setInactiveAssets(result.data.Result.inactiveCount);
          setMaintenanceAssets(result.data.Result.maintenanceCount);
          setRetiredAssets(result.data.Result.retiredCount);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (email) => {
    setEditingEmail(email);
    setNewEmail(email);
  };

  const handleSave = () => {
    if (!newEmail || !validateEmail(newEmail)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (newEmail === editingEmail) {
      alert("The new email address is the same as the old one.");
      return;
    }

    axios
      .post("http://localhost:3000/auth/admin_edit", {
        oldEmail: editingEmail,
        newEmail,
      })
      .then((result) => {
        if (result.data.Status) {
          AdminRecords(); 
          setEditingEmail("");
          setNewEmail("");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (email) => {
    if (
      window.confirm(
        `Are you sure you want to delete the admin with email: ${email}?`
      )
    ) {
      axios
        .post("http://localhost:3000/auth/admin_delete", { email })
        .then((result) => {
          if (result.data.Status) {
            AdminRecords(); 
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="p-3 d-flex justify-content-around mt-3">
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Admin</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{adminTotal}</h5>
          </div>
        </div>

        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Employee</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>

        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Asset</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{assetTotal}</h5>
          </div>
        </div>

        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Price</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>Rs.{priceTotal}</h5>
          </div>
        </div>
      </div>

      <div className="p-3 d-flex justify-content-around mt-3">
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Active Assets</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{activeAssets}</h5>
          </div>
        </div>

        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Inactive Assets</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{inactiveAssets}</h5>
          </div>
        </div>

        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Maintenance Assets</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{maintenanceAssets}</h5>
          </div>
        </div>

        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Retired Assets</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{retiredAssets}</h5>
          </div>
        </div>
      </div>

      <div className="mt-4 px-5 pt-3">
        <h3>List of Admins</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.email}>
                <td>
                  {editingEmail === a.email ? (
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  ) : (
                    a.email
                  )}
                </td>
                <td>
                  {editingEmail === a.email ? (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleEdit(a.email)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(a.email)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
