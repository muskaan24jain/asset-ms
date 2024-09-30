
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./changeHistory.css";

const ChangeHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/change_history")
      .then((response) => setHistory(response.data))
      .catch((error) => console.error("Error fetching change history:", error));
  }, []);

  return (
    <div className="container">
      <h2>Change History</h2>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Action Type</th>
              <th>Asset ID</th>
              <th>Old Value</th>
              <th>New Value</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.user_id}</td>
                <td>{item.action_type}</td>
                <td>{item.asset_id}</td>
                <td>{item.old_value}</td>
                <td>{item.new_value}</td>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChangeHistory;
