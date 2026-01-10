require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const pinoHttp = require("pino-http");

const authRoutes = require("./Routes/Auth");
const logger = require("./Utils/logger");
const forgotPasswordRoutes = require("./Routes/ForgotPassword");
const protectedRoutes = require("./Routes/Protected");
const noteRoutes = require("./Routes/Notes");
const errorHandler = require("./Middleware/ErrorMiddlware");
const app = express()


let users = [];
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
app.use("/api/notes", noteRoutes);
app.use("/api/forgot-password", forgotPasswordRoutes);
// Protected route
app.use("/protected", protectedRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use(errorHandler); 

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

