import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Assuming token is stored in cookies

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized! Invalid token" });
    }

    // Save the adminId and role in the request object for further use
    req.admin = { id: decoded.adminId, role: decoded.role };

    next(); // Continue to the next middleware or route handler
  });
};

export default verifyToken;
