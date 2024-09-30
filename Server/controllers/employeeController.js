import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

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

// Initialize router after multer setup
const router = express.Router();

dotenv.config();

export const addOrUpdateAsset = (req, res) => {
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
};
export const fetchAssets = (req, res) => {
  const sql = "SELECT * FROM asset";
  con.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Status: false, Error: "Database query error" });
    }
    return res.json({ Status: true, Result: result });
  });
};

export const fetchAssetById = (req, res) => {
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
};

export const updateAsset = (req, res) => {
  const { id } = req.params;
  const { category_id, quantity, price, address, status } = req.body;
  const receipt = req.file ? req.file.filename : req.body.receipt; 
  const sql =
    "UPDATE asset SET category_id = ?, quantity = ?, price = ?, address = ?, status = ?, receipt = ? WHERE id = ?";
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
};

export const deleteAsset = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM asset WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Result: result });
  });
};

export const addEmployee = async (req, res) => {
  const { name, email, role, password } = req.body;

  if (!name || !email || !role || !password) {
    return res
      .status(400)
      .json({ Status: false, Error: "All fields are required!" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the employee data into the database
    const insertSql =
      "INSERT INTO employee (name, email, role, password) VALUES (?, ?, ?, ?)";
    await con.query(insertSql, [name, email, role, hashedPassword]);

    res
      .status(201)
      .json({ Status: true, Result: "Employee added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Status: false,
      Error: "An error occurred while adding the employee.",
    });
  }
};

export const employeeLogin = (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM employee WHERE email = ?";

  con.query(sql, [email], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ loginStatus: false, Error: "Database query error" });
    }

    if (result.length > 0) {
      const user = result[0];
      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          return res
            .status(500)
            .json({ loginStatus: false, Error: "Error comparing passwords" });
        }

        if (match) {
          const token = jwt.sign(
            { role: "employee", email: user.email, id: user.id },
            process.env.EMPLOYEE_SECRET_KEY,
            { expiresIn: "1d" }
          );
          const loginTimestamp = new Date().toISOString();
          const updateLoginTimestampSql =
            "UPDATE employee SET last_login = ? WHERE id = ?";

          con.query(
            updateLoginTimestampSql,
            [loginTimestamp, user.id],
            (err) => {
              if (err) {
                return res
                  .status(500)
                  .json({ loginStatus: false, Error: "Database update error" });
              }

              res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
              });
              return res.json({ loginStatus: true, id: user.id });
            }
          );
        } else {
          return res
            .status(401)
            .json({ loginStatus: false, Error: "Incorrect password" });
        }
      });
    } else {
      return res
        .status(404)
        .json({ loginStatus: false, Error: "Email not found" });
    }
  });
};

export const employeeSignup = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM employee WHERE email = ?";
  con.query(sql, [email], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ signupStatus: false, Error: "Database query error" });
    }

    if (result.length > 0) {
      return res
        .status(409)
        .json({ signupStatus: false, Error: "Email already in use" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res
          .status(500)
          .json({ signupStatus: false, Error: "Error hashing password" });
      }

      const insertSql = "INSERT INTO employee (email, password) VALUES (?, ?)";
      con.query(insertSql, [email, hashedPassword], (err) => {
        if (err) {
          return res
            .status(500)
            .json({ signupStatus: false, Error: "Database insert error" });
        }
        return res.json({ signupStatus: true });
      });
    });
  });
};

export const employeeLogout = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ Status: false, Error: "No token provided" });
  }

  jwt.verify(token, process.env.EMPLOYEE_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ Status: false, Error: "Failed to authenticate token" });
    }

    const logoutTimestamp = new Date().toISOString();
    const updateLogoutTimestampSql =
      "UPDATE employee SET last_logout = ? WHERE id = ?";

    con.query(
      updateLogoutTimestampSql,
      [logoutTimestamp, decoded.id],
      (err) => {
        if (err) {
          return res
            .status(500)
            .json({ Status: false, Error: "Database update error" });
        }

        res.clearCookie("token");
        return res.json({ Status: true });
      }
    );
  });
};

// export const fetchEmployeeData = (req, res) => {
//   const { email } = req.query;
//   const sql =
//     "SELECT id, email, role , last_login, last_logout FROM employee WHERE email = ?";

//   con.query(sql, [email], (err, result) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ Status: false, Error: "Database query error" });
//     }
//     if (result.length === 0) {
//       return res
//         .status(404)
//         .json({ Status: false, Error: "Employee not found" });
//     }
//     return res.json({ Status: true, Result: result[0] });
//   });
// };
// Controller to fetch employee profile by ID
export const fetchEmployeeProfile = async (employeeId) => {
  try {
    const token = localStorage.getItem("token"); 
    const response = await axios.get(`/employee/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    throw error;
  }
};

// Controller to update an employee profile by ID
export const updateEmployeeProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const result = await con.query(
      "UPDATE employee SET name = ?, email = ?, role = ? WHERE id = ?",
      [name, email, role, id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Profile updated successfully" });
    } else {
      res.status(404).json({ error: "Employee not found or no changes made" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the employee profile" });
  }
};
export const getEmployeeProfile = (req, res) => {
  const { id } = req.params; 
  const sql =
    "SELECT id, email, role, last_login, last_logout FROM employee WHERE id = ?";

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
};

const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (
    !process.env.JWT_SECRET ||
    !process.env.EMAIL ||
    !process.env.EMAIL_PASSWORD
  ) {
    return res.status(500).json({
      Status: false,
      Error: "Required environment variables are not defined",
    });
  }

  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset your password",
      text: `Click the link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ Status: true, Message: "Verification email sent." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      Status: false,
      Error: "Error sending verification email.",
      Details: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { password } = req.body; 
  const { token } = req.params;

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password in the database
    const query = `UPDATE employee SET password = ? WHERE email = ?`;
    con.query(query, [hashedPassword, email], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({
          Status: false,
          Error: "Database update error",
        });
      }

      if (result.affectedRows > 0) {
        return res.json({
          Status: true,
          Message: "Password reset successfully.",
        });
      } else {
        return res.status(404).json({
          Status: false,
          Error: "Email not found",
        });
      }
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        Status: false,
        Error: "Invalid or expired token",
      });
    } else {
      return res.status(500).json({
        Status: false,
        Error: "An error occurred while resetting the password",
      });
    }
  }
};
