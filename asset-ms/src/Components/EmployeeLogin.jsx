import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EmployeeLogin.css";

const EmployeeAuth = () => {
  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });
  const [signupValues, setSignupValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setError(null);

    axios
      .post("http://localhost:3000/employee/employee_login", loginValues)
      .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem("valid", true);
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("employeeId", result.data.id);

          navigate("/employee/dashboard");
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Login error: ", err);
        setError("An error occurred while logging in. Please try again later.");
      });
  };

  const handleSignupSubmit = (event) => {
    event.preventDefault();
    setError(null);

    axios
      .post("http://localhost:3000/employee/employee_signup", signupValues)
      .then((result) => {
        if (result.data.signupStatus) {
          localStorage.setItem("valid", true);
          navigate("/employee/dashboard");
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Signup error: ", err);
        setError("An error occurred while signing up. Please try again later.");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 authPage">
      <div className="p-3 rounded w-50 border authForm">
        <div className="text-warning">{error && <p>{error}</p>}</div>
        <h2>{isLogin ? "Login Page" : "Sign Up Page"}</h2>
        <form onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email:</strong>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              value={isLogin ? loginValues.email : signupValues.email}
              onChange={(e) =>
                isLogin
                  ? setLoginValues({ ...loginValues, email: e.target.value })
                  : setSignupValues({ ...signupValues, email: e.target.value })
              }
              className="form-control rounded-0"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={isLogin ? loginValues.password : signupValues.password}
              onChange={(e) =>
                isLogin
                  ? setLoginValues({ ...loginValues, password: e.target.value })
                  : setSignupValues({
                      ...signupValues,
                      password: e.target.value,
                    })
              }
              className="form-control rounded-0"
              required
            />
          </div>
          <button className="btn btn-success w-100 rounded-0 mb-2">
            {isLogin ? "Log In" : "Sign Up"}
          </button>
          <div className="mb-1">
            <input type="checkbox" name="tick" id="tick" className="me-2" />
            <label htmlFor="tick">You agree with terms & conditions</label>
          </div>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="btn btn-secondary w-100 rounded-0"
          >
            {isLogin ? "Switch to Sign Up" : "Switch to Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeAuth;
