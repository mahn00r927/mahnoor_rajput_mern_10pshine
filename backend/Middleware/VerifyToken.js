const logger = require("../Utils/logger");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      const error = new Error("No token provided");
      error.statusCode = 401;
      logger.warn("Auth failed: no token provided");
      return next(error);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      const error = new Error("No token provided");
      error.statusCode = 401;
      logger.warn("Auth failed: token missing");
      return next(error);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        const error = new Error("Invalid token");
        error.statusCode = 401;
        logger.warn(err, "Auth failed: invalid token");
        return next(error);
      }

      req.user = decoded;
      next();
    });
  } catch (err) {
    logger.error(err, "Auth middleware error");
    next(err); 
  }
};
