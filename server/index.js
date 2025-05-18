// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB connected"); // Alert when MongoDB connects
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err); // Error log if connection fails
});

// Test route to confirm server is running
app.get("/", (req, res) => {
  res.send("✅ Server is running"); // Alert when the server responds
});

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const messageRoutes = require("./routes/messages");
app.use("/api/messages", messageRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`); // Alert when server starts successfully
});
