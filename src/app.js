const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Welcome Routes
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the MarketLink API!",
  });
});

//Health Check route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MarketLink backend is running!",
  });
});

module.exports = app;
