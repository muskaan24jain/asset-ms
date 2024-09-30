
import axios from "axios";
import React, { useState } from "react";
import { Dropdown, DropdownButton, Form } from "react-bootstrap";
import "./GenerateReport.css"; 

const GenerateReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [fileName, setFileName] = useState("asset_report.csv");
  const [message, setMessage] = useState("");
  const [selectedFields, setSelectedFields] = useState({
    category_id: true,
    quantity: true,
    price: true,
    address: true,
    address1: true,
    address2: true,
    installation_date: true,
    receipt: true,
  });

  const handleFieldChange = (field) => {
    setSelectedFields((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleGenerateReport = () => {
    const fields = Object.keys(selectedFields)
      .filter((field) => selectedFields[field])
      .join(",");

    axios
      .get("http://localhost:3000/employee/generate_report", {
        params: {
          start_date: startDate,
          end_date: endDate,
          fields: fields,
        },
      })
      .then((response) => {
        if (response.data.Status) {
          setReportData(response.data.ReportData);
          setTotalAssets(response.data.TotalAssets);

          setMessage("Report generated and downloaded successfully!");

          setTimeout(() => {
            const downloadUrl = `${
              response.data.DownloadUrl
            }&name=${encodeURIComponent(fileName)}`;
            window.location.href = downloadUrl;
          }, 500);
        } else {
          setMessage(response.data.Error || "Error generating report.");
        }
      })
      .catch((err) => {
        console.error("Error generating report:", err);
        setMessage("Error generating report.");
      });
  };

  return (
    <div className="container mt-3">
      <h3 className="text-center">Generate Asset Report</h3>
      <div className="d-flex justify-content-center">
        <div className="p-3 border rounded">
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fileName" className="form-label">
              File Name
            </label>
            <input
              type="text"
              id="fileName"
              className="form-control"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Select Fields:</label>
            <DropdownButton
              id="dropdown-custom-components"
              title="Select Fields"
              className="dropdown-custom"
              drop="end"
            >
              {Object.keys(selectedFields).map((field) => (
                <Dropdown.Item
                  key={field}
                  as="button"
                  onClick={() => handleFieldChange(field)}
                >
                  <Form.Check
                    type="checkbox"
                    label={field.replace("_", " ").toUpperCase()}
                    checked={selectedFields[field]}
                    onChange={() => handleFieldChange(field)}
                    custom
                  />
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
          <button
            className="btn btn-primary w-100"
            onClick={handleGenerateReport}
          >
            Generate Report
          </button>
          {message && <div className="mt-3 alert alert-info">{message}</div>}
        </div>
      </div>

      {reportData.length > 0 && (
        <div className="mt-4">
          <h4 className="text-center">Report Details</h4>
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                {selectedFields.category_id && <th>Category ID</th>}
                {selectedFields.quantity && <th>Quantity</th>}
                {selectedFields.price && <th>Price</th>}
                {selectedFields.address && <th>Address</th>}
                {selectedFields.address1 && <th>Address 1</th>}
                {selectedFields.address2 && <th>Address 2</th>}
                {selectedFields.installation_date && <th>Installation Date</th>}
                {selectedFields.receipt && <th>Receipt</th>}
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  {selectedFields.category_id && <td>{item.category_id}</td>}
                  {selectedFields.quantity && <td>{item.quantity}</td>}
                  {selectedFields.price && <td>{item.price}</td>}
                  {selectedFields.address && <td>{item.address}</td>}
                  {selectedFields.address1 && <td>{item.address1}</td>}
                  {selectedFields.address2 && <td>{item.address2}</td>}
                  {selectedFields.installation_date && (
                    <td>{item.installation_date}</td>
                  )}
                  {selectedFields.receipt && (
                    <td>
                      {item.receipt && (
                        <img
                          src={`http://localhost:3000/uploads/${item.receipt}`} 
                          className="asset_image"
                          alt="Asset"
                          style={{ width: "100px", height: "auto" }} 
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center mt-3">
            <strong>Total Assets: {totalAssets}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateReport;
