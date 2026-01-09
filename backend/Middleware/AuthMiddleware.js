const jwt = require("jsonwebtoken");
const logger = require("../Utils/logger");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      logger.warn("Access denied: No token provided");
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: userId }

    next();
  } catch (error) {
    logger.error(error, "Invalid token");
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
