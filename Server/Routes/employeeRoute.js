
import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import {

  employeeLogin,
  employeeSignup,
  employeeLogout,
  fetchAssets,
  fetchAssetById,
  addOrUpdateAsset,
  updateAsset,
  deleteAsset,
  fetchEmployeeProfile,
  getEmployeeProfile,
  updateEmployeeProfile,
} from "../controllers/employeeController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  sendVerificationEmail,
  resetPassword,
  resetPasswordGET,
} from "./emailController.js";
import con from "../utils/db.js";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.post("/verify-email", sendVerificationEmail);
router.post("/reset-password/:token", resetPassword);
router.get("/reset-password/:token", resetPasswordGET);

router.get("/employee", fetchEmployeeProfile)
router.post("/employee_login", employeeLogin);
router.get("/dashboard/profile/:id", getEmployeeProfile);

// Route to update employee profile by ID
router.put("/dashboard/profile/:id", updateEmployeeProfile);

router.post("/employee_signup", employeeSignup);
router.post("/employee_logout", authenticateToken, employeeLogout);

router.get("/asset", fetchAssets);
router.get("/asset/:id", fetchAssetById);

// Use multer middleware in route definitions
router.post("/employee/asset", upload.array("receipts"), addOrUpdateAsset);
router.post("/asset", upload.array("receipts"), addOrUpdateAsset);
router.put("/asset/:id", upload.array("receipts"), updateAsset);
router.delete("/delete_asset/:id", deleteAsset);

router.get("/list", (req, res) => {
  const sql = "SELECT id, name, email, role FROM employee";
  con.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Status: false, Error: "Database query error" });
    }
    return res.json({ Status: true, Result: result });
  });
});
router.get("/list", (req, res) => {
  const sql = "SELECT id, name, email, role FROM employee";
  con.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Status: false, Error: "Database query error" });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Status: false, Error: "Database query error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Status: false, Error: "Employee not found" });
    }
    return res.json({ Status: true });
  });
});

router.post("/add", (req, res) => {
  const { name, email, password, role } = req.body;
  const sql =
    "INSERT INTO employee (name, email, role) VALUES (?, ?, ?)";
  con.query(sql, [name, email, role], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Status: false, Error: "Database query error" });
    }
    return res.json({ Status: true, id: result.insertId });
  });
});

router.put("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  if (!name || !email || !role) {
    return res
      .status(400)
      .json({ Status: false, Error: "Missing required fields" });
  }
  const sql = "UPDATE employee SET name = ?, email = ?, role = ? WHERE id = ?";
  con.query(sql, [name, email, role, id], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Database query error: " + err.message });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Status: false, Error: "Employee not found" });
    }
    return res.json({ Status: true });
  });
});

router.get("/employee/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Database query error" });
    }
    if (result.length === 0) {
      return res
        .status(404)
        .json({ Status: false, Error: "Employee not found" });
    }
    return res.json({ Status: true, Result: result[0] });
  });
});

router.get("/generate_report", (req, res) => {
  const { start_date, end_date, fields } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({
      Status: false,
      Error: "Start date and end date are required",
    });
  }

  // Handle selected fields
  const selectedFields = fields ? fields.split(",") : [];
  const sqlFields = selectedFields.map((field) => `a.${field}`).join(", ");

  // Construct SQL query
  const sql = `
    SELECT 
      ${sqlFields},
      c.name AS category_name
    FROM asset a
    JOIN category c ON a.category_id = c.id
    WHERE a.installation_date BETWEEN ? AND ?
  `;

  // Query database
  con.query(sql, [start_date, end_date], (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ Status: false, Error: "No data found" });
    }

    // Calculate the total number of assets
    const totalAssets = result.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    // Convert the data to CSV
    const json2csvParser = new Parser({ fields: selectedFields });
    const csv = json2csvParser.parse(result);

    // Write the CSV to a file
    const fileName = `asset_report_${Date.now()}.csv`;
    const filePath = path.join(__dirname, fileName);

    fs.writeFile(filePath, csv, (err) => {
      if (err) {
        console.error("Error writing CSV file:", err);
        return res.status(500).json({
          Status: false,
          Error: "Error generating CSV file",
        });
      }

      res.status(200).json({
        Status: true,
        Message: "Report generated successfully",
        DownloadUrl: `/download_report?file=${encodeURIComponent(
          filePath
        )}&name=${encodeURIComponent(fileName)}`,
        ReportData: result, 
        TotalAssets: totalAssets,
      });
    });
  });
});

// Download report route
router.get("/download_report", (req, res) => {
  const file = req.query.file;
  const fileName = req.query.name || "asset_report.csv";

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

  const fileStream = fs.createReadStream(file);
  fileStream.pipe(res);

  fileStream.on("end", () => {
    fs.unlink(file, (err) => {
      if (err) {
        console.error("Error deleting the file:", err);
      }
    });
  });
});

export default router;
