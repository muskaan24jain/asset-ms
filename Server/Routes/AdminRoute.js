import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Parser } from "json2csv";
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

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

// Admin login
router.post("/adminlogin", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM admin WHERE email = ?";

  con.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ loginStatus: false, Error: "Query error" });
    }

    // Check if admin exists
    if (result.length > 0) {
      const admin = result[0];

      const isPasswordValid = password === admin.password;
      if (isPasswordValid) {
        // Generate JWT with admin ID
        const token = jwt.sign(
          { adminId: admin.id, role: "admin", email: admin.email },
          "jwt_secret_key", 
          { expiresIn: "1d" }
        );

        // Set JWT token in cookie
        res.cookie("token", token, { httpOnly: true });
        return res.json({ loginStatus: true });
      } else {
        return res
          .status(401)
          .json({ loginStatus: false, Error: "Wrong password" });
      }
    } else {
      return res.status(401).json({ loginStatus: false, Error: "Wrong email" });
    }
  });
});


// Fetch categories

router.get("/category", (req, res) => {
  const sql = "SELECT * FROM category";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Result: result });
  });
});

// Add category
router.post("/add_category", (req, res) => {
  const sql = "INSERT INTO category (name) VALUES (?)";
  con.query(sql, [req.body.category], (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true });
  });
});

// Fetch roles
router.get("/role", (req, res) => {
  console.log("Fetching roles...");
  const sql = "SELECT * FROM role";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Query Error: " + err.message });
    }
    console.log("Roles fetched:", result);
    return res.json({ Status: true, Result: result });
  });
});

// Add role
router.post("/add_role", (req, res) => {
  const sql = "INSERT INTO role (name) VALUES (?)";
  con.query(sql, [req.body.role], (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true });
  });
});

// Fetch assets
router.get("/asset", (req, res) => {
  const sql = "SELECT * FROM asset";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Result: result });
  });
});

// Fetch a single asset
router.get("/asset/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM asset WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ Status: false, Error: "Asset not found" });
    }
    return res.json({ Status: true, Result: result[0] });
  });
});

// Add asset
router.post("/add_asset", upload.array("receipts"), (req, res) => {
  if (!req.files) {
    return res.status(400).json({ Status: false, Error: "No files uploaded" });
  }

  console.log("Files:", req.files); 
  console.log("Body:", req.body); 
  const {
    category_id,
    quantity,
    price,
    address,
    address1,
    address2,
    status,
    installation_date,
  } = req.body;

  // Extract filenames from uploaded files
  const receipts = req.files.map((file) => file.filename);

  if (
    !category_id ||
    !quantity ||
    !price ||
    !address ||
    !status ||
    !installation_date
  ) {
    return res
      .status(400)
      .json({ Status: false, Error: "Missing required fields" });
  }

  // Validate installation_date
  const parsedDate = new Date(installation_date);
  if (isNaN(parsedDate.getTime())) {
    return res
      .status(400)
      .json({ Status: false, Error: "Invalid installation_date" });
  }

  const sql =
    "INSERT INTO asset (category_id, quantity, price, address, address1, address2, status, receipts, installation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    category_id,
    quantity,
    price,
    address,
    address1,
    address2,
    status,
    receipts.join(", "), 
    installation_date,
  ];

  con.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === "ER_NO_REFERENCED_ROW_2") {
        return res
          .status(400)
          .json({ Status: false, Error: "Invalid category_id" });
      }
      console.error("Query error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true });
  });
});

// Update asset
router.put("/asset/:id", upload.array("receipts"), (req, res) => {
  const { id } = req.params;
  const { category_id, quantity, price, address, status } = req.body;
  const receipt = req.file ? req.file.filename : req.body.receipt; 

  const sql =
    "UPDATE asset SET category_id = ?, quantity = ?, price = ?, address = ?, status=?, receipt = ? WHERE id = ?";
  const values = [category_id, quantity, price, address, status, receipt, id];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Asset not found" });
    }
    return res.json({ Status: true });
  });
});

// Delete asset
router.delete("/delete_asset/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM asset WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Result: result });
  });
});

// Count admins
router.get("/admin_count", (req, res) => {
  const sql = "SELECT count(id) as admin FROM admin";
  con.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Status: false, Error: "Query Error: " + err.message });
    }
    return res.json({ Status: true, Result: result });
  });
});

// Count employees
router.get("/employee_count", (req, res) => {
  const sql = "SELECT count(id) as employee FROM employee";
  con.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Status: false, Error: "Query Error: " + err.message });
    }
    return res.json({ Status: true, Result: result });
  });
});

// Count assets
router.get("/asset_count", (req, res) => {
  const sql = "SELECT count(id) as asset FROM asset";
  con.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Status: false, Error: "Query Error: " + err.message });
    }
    return res.json({ Status: true, Result: result });
  });
});

// Total price of assets
router.get("/price_count", (req, res) => {
  const sql = "SELECT sum(price) as priceOFasset FROM asset";
  con.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Status: false, Error: "Query Error: " + err.message });
    }
    return res.json({ Status: true, Result: result });
  });
});

// Fetch admin records
router.get("/admin_records", (req, res) => {
  const sql = "SELECT * FROM admin";
  con.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Status: false, Error: "Query Error: " + err.message });
    }
    return res.json({ Status: true, Result: result });
  });
});

// Admin edit
router.post("/auth/admin_edit", (req, res) => {
  const { oldEmail, newEmail } = req.body;
  const sql = "UPDATE admin SET email = ? WHERE email = ?";
  con.query(sql, [newEmail, oldEmail], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Status: false, Error: "Query Error: " + err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Admin not found" });
    }
    return res.json({ Status: true });
  });
});

// Admin delete
router.post("/auth/admin_delete", (req, res) => {
  const { email } = req.body;
  const sql = "DELETE FROM admin WHERE email = ?";
  con.query(sql, [email], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Status: false, Error: "Query Error: " + err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Admin not found" });
    }
    return res.json({ Status: true });
  });
});

router.put("/assets/:id", (req, res) => {
  const { id } = req.params;
  const { new_value, changed_by } = req.body;

  // Fetch old value
  const fetchOldValueQuery = "SELECT value FROM asset WHERE id = ?";
  con.query(fetchOldValueQuery, [id], (err, result) => {
    if (err) {
      console.error("Error fetching old value:", err);
      return res.status(500).json({ error: "Failed to fetch old value" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }

    const old_value = result[0].value;

    // Update asset
    const updateAssetQuery = "UPDATE asset SET value = ? WHERE id = ?";
    con.query(updateAssetQuery, [new_value, id], (err) => {
      if (err) {
        console.error("Error updating asset:", err);
        return res.status(500).json({ error: "Failed to update asset" });
      }

      // Insert into change history
      const insertChangeHistoryQuery = `
        INSERT INTO change_history (asset_id, changed_by, action_type, old_value, new_value)
        VALUES (?, ?, 'UPDATE', ?, ?)
      `;
      con.query(
        insertChangeHistoryQuery,
        [id, changed_by, old_value, new_value],
        (err) => {
          if (err) {
            console.error("Error inserting change history:", err);
            return res
              .status(500)
              .json({ error: "Failed to insert change history" });
          }

          return res.json({
            Status: true,
            message: "Asset updated successfully",
          });
        }
      );
    });
  });
});

// generate report
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

// Status count
router.get("/asset_status_counts", (req, res) => {
  const query = `
    SELECT 
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS activeCount,
      SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactiveCount,
      SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) AS maintenanceCount,
      SUM(CASE WHEN status = 'retired' THEN 1 ELSE 0 END) AS retiredCount
    FROM asset;
  `;

  con.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching asset status counts:", error);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal Server Error" });
    }

  
    //console.log("Query Results:", results);

    // Check the structure of the results
    if (Array.isArray(results) && results.length > 0) {
      res.json({
        Status: true,
        Result: results[0], 
      });
    } else {
      res.json({
        Status: false,
        Result: {},
      });
    }
  });
});
// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

export { router as adminRouter };
