const jwt = require("jsonwebtoken");
const logger = require("../Utils/logger");

const authMiddleware = (req, res, next) => {
  try {
    // ✅ Express-safe header access (real + tests)
    const authHeader =
      req.headers?.authorization || req.header?.("Authorization");

    // ❌ NO TOKEN
    if (!authHeader) {
      logger.warn("Access denied: No token provided");
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }

    // ✅ Expect "Bearer <token>"
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      logger.warn("Access denied: Malformed token");
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }

    const token = parts[1];

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id }

    logger.info({ userId: decoded.id }, "Token verified successfully");

    return next();
  } catch (error) {
    logger.error(error, "Invalid token");
    return res.status(401).json({
      message: "Token is not valid",
    });
  }
};

module.exports = authMiddleware;
