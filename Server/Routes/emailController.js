import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import con from "../utils/db.js";
import { promisify } from "util";


const query = promisify(con.query).bind(con);

dotenv.config(); 

const router = express.Router();
export const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  // Check if necessary environment variables are defined
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

  // Generate a verification token
  let token;
  try {
    token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({
      Status: false,
      Error: "Error generating token.",
      Details: error.message,
    });
  }

  // Define the reset link
  const resetLink = `http://localhost:3000/employee/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465, 
    secure: true, // use TLS if port 587
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 60000, 
    greetingTimeout: 60000, 
    socketTimeout: 60000, 
  });

  // Test the transporter
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP connection test failed:", error);
    } else {
      console.log("SMTP connection test successful");
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email, 
    subject: "Verify your email address",
    text: `Please click the link to verify your email and reset your password: ${resetLink}`,
  };

  try {
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

export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Hash the new password
    // const hashedPassword = await bcrypt.hash(password, 10);
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        const hashedPassword = hash;
        const query = `UPDATE employee SET password = ? WHERE email = ?`;
        await con.query(query, [hashedPassword, email]);

        res.json({ Status: true, Message: "Password reset successfully." });
      });
    });

    // Update the password in the database
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      Status: false,
      Error: "Error resetting password.",
      Details: error.message,
    });
  }
};
export const resetPasswordGET = async (req, res) => {
  const { token } = req.params;

  // Verify token before rendering the form
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.send(`
      <form action="/employee/reset-password/${token}" method="POST">
        <label for="password">New Password:</label>
        <input type="password" name="password" required/>
        <button type="submit">Reset Password</button>
      </form>
    `);
  } catch (error) {
    res.status(400).send("Invalid or expired token");
  }
};
