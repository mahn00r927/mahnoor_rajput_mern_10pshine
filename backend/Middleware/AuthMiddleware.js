const jwt = require("jsonwebtoken");
const logger = require("../Utils/logger");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization || req.header?.("Authorization");
    
    // No token case
    if (!authHeader) {
      logger.warn("Auth failed: no token provided");
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Malformed token case
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      logger.warn("Auth failed: malformed token");
      return res.status(401).json({ message: "Malformed token" });
    }

    // Verify token SYNCHRONOUSLY (no callback)
    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ← Synchronous!
    
    req.user = decoded;
    logger.info({ userId: decoded.id }, "Token verified successfully");
    next(); // Success case - call next()
    
  } catch (error) {
    // JWT verification errors OR other errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      logger.warn({ err: error }, "Auth failed: invalid token");
      return res.status(401).json({ message: "Token is not valid" });
    }
    
    logger.error({ err: error }, "Auth middleware unexpected error");
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = authMiddleware;