const jwt = require("jsonwebtoken");
const logger = require("../Utils/logger");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization || req.header?.("Authorization");

    if (!authHeader) {
      const error = new Error("No token, authorization denied");
      error.statusCode = 401;
      logger.warn(error.message);
      return next(error);
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      const error = new Error("Malformed token");
      error.statusCode = 401;
      logger.warn(error.message);
      return next(error);
    }

    const token = parts[1];

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    logger.info({ userId: decoded.id }, "Token verified successfully");
    next();
  } catch (error) {
    logger.error(error, "Auth middleware error");
    error.statusCode = 401; // Unauthorized
    next(error); // Pass to global error handler
  }
};

module.exports = authMiddleware;
