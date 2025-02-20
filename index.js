const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const videoRoutes = require("./routes/videoRoute");
const registerRoutes = require("./routes/regiserRoute");
const courseRoutes = require("./routes/courseRoute");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded videos

// Connect to MongoDB
connectDB();

app.use("/api/videos", videoRoutes);
app.use("/api/users", registerRoutes);
app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
