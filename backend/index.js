require("dotenv").config();

const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();

const authRoutes = require("./Routes/Auth");
const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ Connection Error Type:", err.name);
    console.error("❌ Error Message:", err.message);
  });
