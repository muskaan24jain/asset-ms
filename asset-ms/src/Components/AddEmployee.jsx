
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddEmployee.css";

const AddEmployee = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleEmailVerification = () => {
    setLoading(true);
    axios
      .post("http://localhost:3000/employee/verify-email", { email })
      .then((result) => {
        setLoading(false);
        if (result.data.Status) {
          alert("Verification email sent. Please check your email.");
          setEmailVerified(true);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        alert("An error occurred while sending the verification email.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !role || !emailVerified) {
      alert("All fields are required and email must be verified!");
      return;
    }

    setLoading(true);

    axios
      .post("http://localhost:3000/employee/add", {
        name,
        email,
        role,
      })
      .then((result) => {
        setLoading(false);
        if (result.data.Status) {
          navigate("/dashboard/employee");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        alert("An error occurred while adding the employee.");
      });
  };

  return (
    <div className="container mt-3">
      <h3>Add Employee</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailVerification}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <select
            className="form-select"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="" disabled>
              Select Role
            </option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-success"
          disabled={loading || !emailVerified}
        >
          {loading ? "Processing..." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
