
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./DownloadReport.css";

const DownloadReport = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fileUrl = decodeURIComponent(params.get("file")); 

    if (fileUrl) {
      fetch(fileUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }
          return response.text();
        })
        .then((csvText) => {
          const parsedData = Papa.parse(csvText, { header: true });
          setHeaders(parsedData.meta.fields || []);
          setCsvData(parsedData.data);
        })
        .catch((error) => {
          setError("Error fetching or parsing CSV file.");
          console.error("Error fetching or parsing CSV file:", error);
        });
    }
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Asset Report</h2>
      <table border="1">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {csvData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DownloadReport;
