// const express = require("express");
// const router = express.Router();
// const verifyToken = require("../Middleware/VerifyToken");

// router.get("/", verifyToken, (req, res) => {
//   res.status(200).json({ message: "Access granted", user: req.user });
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/VerifyToken");
const asyncHandler = require("../Utils/asyncHandler");

router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    // This can throw unexpected errors if something goes wrong
    res.status(200).json({ message: "Access granted", user: req.user });
  })
);

module.exports = router;
