import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ Status: false, Error: "No token provided" });

  jwt.verify(token, process.env.EMPLOYEE_SECRET_KEY, (err, decoded) => {
    if (err)
      return res
        .status(401)
        .json({ Status: false, Error: "Failed to authenticate token" });
    req.user = decoded;
    next();
  });
};
