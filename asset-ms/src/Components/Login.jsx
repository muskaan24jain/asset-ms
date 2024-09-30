import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3000/auth/adminlogin", values)
      .then((response) => {
        if (response.data.loginStatus) {
          navigate("/dashboard");
        } else {
          setError(response.data.Error);
        }
      })
      .catch((error) => {
        setError("An error occurred. Please try again.");
        console.error("Error:", error.message);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginpage">
      <div className="p-3 rounded w-25 border loginform">
        {error && <div className="text-warning mb-3">{error}</div>}
        <h2>Login Page</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email:</strong>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <input
              type="password"
              autoComplete="on"
              name="password"
              placeholder="Enter Password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-0"
            />
          </div>
          <button className="btn btn-success w-100 rounded-0 mb-2">
            Log in
          </button>
          <div className="mb-1">
            <input type="checkbox" name="tick" id="tick" />
            <label htmlFor="tick">
              <strong>You Are Agree with our terms & conditions</strong>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
