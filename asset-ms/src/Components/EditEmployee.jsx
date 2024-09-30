import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch roles
    axios
      .get("http://localhost:3000/auth/role")
      .then((result) => {
        if (result.data.Status) {
          setRoles(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Fetch employee data
    axios
      .get(`http://localhost:3000/employee/employee/${id}`)
      .then((result) => {
        const data = result.data.Result;
        setEmployee({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        setError("An error occurred while fetching employee data.");
        setLoading(false);
        console.log(err);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!employee.name || !employee.email || !employee.role) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);

    axios
      .put(`http://localhost:3000/employee/edit/${id}`, {
        name: employee.name,
        email: employee.email,
        role: employee.role,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.Status) {
          navigate("/dashboard/employee");
        } else {
          alert(response.data.Error);
        }
      })
      .catch((err) => {
        setLoading(false);
        alert("An error occurred while updating the employee.");
        console.log(err);
      });
  };

  if (loading) return <div>Loading...</div>; 

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Employee</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={employee.name}
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputEmail" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail"
              placeholder="Enter Email"
              autoComplete="off"
              value={employee.email}
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              name="role"
              id="role"
              className="form-select"
              value={employee.role}
              onChange={(e) =>
                setEmployee({ ...employee, role: e.target.value })
              }
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-success w-100 rounded-0 mb-2"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
