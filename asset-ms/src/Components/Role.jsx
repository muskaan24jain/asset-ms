import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Role = () => {
  const [roles, setRoles] = useState([]);

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

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Role List</h3>
      </div>
      <Link to="/dashboard/add_role" className="btn btn-success">
        Add Role
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Role;
