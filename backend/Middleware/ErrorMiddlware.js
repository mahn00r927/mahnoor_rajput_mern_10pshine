const logger = require("../Utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(
    {
      method: req.method,
      url: req.url,
      err,
    },
    "Unhandled error"
  );

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;

