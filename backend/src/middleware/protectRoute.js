// middleware/protectRoute.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    console.log("Token found:", token ? "Yes" : "No");

    if (!token) {
      return res.status(401).json({
        error: "Not authorized, no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log("Decoded userId:", decoded.userId);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        error: "Not authorized, user not found",
      });
    }

    req.adminId = user._id;
    req.user = user;

    console.log("User authenticated:", user.email);

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }

    res.status(401).json({ error: "Not authorized" });
  }
};
