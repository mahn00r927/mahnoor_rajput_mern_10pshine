const logger = require("../Utils/logger");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      logger.warn("Auth failed: no token provided");
      return res.status(401).json({ message: "Token is not valid" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      logger.warn("Auth failed: malformed token");
      return res.status(401).json({ message: "Token is not valid" });
    }

    const token = parts[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.warn(`Auth failed: invalid token - ${err.message}`);
        return res.status(401).json({ message: "Token is not valid" });
      }

      req.user = decoded;
      next(); // Only call next() if token is valid
    });
  } catch (err) {
    logger.error(`VerifyToken middleware error: ${err.message}`);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = verifyToken;
