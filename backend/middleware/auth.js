const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"] || req.headers["Authorization"];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // Handle "Bearer <token>" format if sent by some frontend setups
  // If multiple headers are sent, they get merged with commas. We take the first one.
  let actualToken = token;
  if (actualToken.includes(",")) {
    actualToken = actualToken.split(",")[0].trim();
  }
  if (actualToken.startsWith("Bearer ")) {
    actualToken = actualToken.substring(7); // "Bearer ".length === 7
  }

  if (!actualToken || actualToken === "null" || actualToken === "undefined") {
    return res.status(401).json({ message: "Access denied. Invalid token format." });
  }

  try {
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };
