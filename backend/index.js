require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const pinoHttp = require("pino-http");

const authRoutes = require("./Routes/Auth");
const logger = require("./Utils/logger");

const noteRoutes = require("./Routes/Notes");
const app = express();

/* ================= MIDDLEWARES ================= */
app.use(cors());
app.use(express.json());

app.use(
  pinoHttp({
    logger,
  })
);

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  logger.error(
    {
      method: req.method,
      url: req.url,
      err,
    },
    "Unhandled error"
  );

  res.status(500).json({ message: "Internal Server Error" });
});

/* ================= DB + SERVER ================= */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("✅ Connected to MongoDB Atlas");

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(err, "❌ MongoDB connection failed");
  });
