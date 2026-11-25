require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("Todo API Server Running Successfully");
});

// Todo Routes
app.use("/api/todos", todoRoutes);

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
