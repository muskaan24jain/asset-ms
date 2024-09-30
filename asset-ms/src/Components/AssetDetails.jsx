
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AssetDetails = () => {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/asset/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setAsset(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.error("Error fetching asset details:", err));
  }, [id]);

  if (!asset) return <div>Loading...</div>;

  return (
    <div className="asset-details-container px-5 mt-3">
      <h3>Asset Details</h3>
      <table className="table mt-3">
        <tbody>
          <tr>
            <th>Category ID</th>
            <td>{asset.category_id}</td>
          </tr>
          <tr>
            <th>Quantity</th>
            <td>{asset.quantity}</td>
          </tr>
          <tr>
            <th>Price</th>
            <td>{asset.price}</td>
          </tr>
          <tr>
            <th>Address</th>
            <td>{asset.address}</td>
          </tr>
          <tr>
            <th>Address 1</th>
            <td>{asset.address1}</td>
          </tr>
          <tr>
            <th>Address 2</th>
            <td>{asset.address2}</td>
          </tr>
          <tr>
            <th>Installation Date</th>
            <td>{new Date(asset.installation_date).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>{asset.status ? "Active" : "Inactive"}</td>
          </tr>
          <tr>
            <th>Receipt</th>
            <td>
              {asset.receipt && (
                <img
                  src={`http://localhost:3000/uploads/${asset.receipt}`} 
                  className="asset_image"
                  alt="Asset"
                  style={{ width: "200px", height: "auto" }} 
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AssetDetails;
