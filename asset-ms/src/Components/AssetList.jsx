import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AssetList = () => {
  const { statusType } = useParams();
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/assets?status=${statusType}`)
      .then((response) => {
        if (response.data.Status) {
          setAssets(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      })
      .catch((error) => console.log(error));
  }, [statusType]);

  return (
    <div className="px-5 pt-3">
      <h3>{statusType.charAt(0).toUpperCase() + statusType.slice(1)} Assets</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Price</th>
            <th>Installation Date</th>
           
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.id}</td>
              <td>{asset.name}</td>
              <td>{asset.category}</td>
              <td>{asset.status}</td>
              <td>Rs.{asset.price}</td>
              <td>{new Date(asset.installation_date).toLocaleDateString()}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetList;
