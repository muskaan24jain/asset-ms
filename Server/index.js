import Jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import { adminRouter } from "./Routes/AdminRoute.js";
import employeeRouter from "./Routes/employeeRoute.js";
import changeHistory from "./Routes/changeHistory.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser()); 

app.use("/auth", adminRouter);
app.use("/employee", employeeRouter);
app.use("/auth", changeHistory);

app.use(express.static("Public"));

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
      if (err) return res.json({ Status: false, Error: "Wrong Token" });
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    return res.json({ Status: false, Error: "Not autheticated" });
  }
};
app.get("/verify", verifyUser, (req, res) => {
  return res.json({ Status: true, role: req.role, id: req.id });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
