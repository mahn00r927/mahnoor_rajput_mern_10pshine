const express = require('express');
const cors = require('cors');
require('dotenv').config();

const noteRoutes = require("./Routes/Notes");
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



app.use("/api/notes", noteRoutes);
