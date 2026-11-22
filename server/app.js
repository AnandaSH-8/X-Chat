const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Parse incoming JSON request bodies.
app.use(express.json());

// Parse URL-encoded request bodies.
app.use(express.urlencoded({ extended: true }));

// Parse cookies from incoming requests.
app.use(cookieParser());

// Configure CORS.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Health-check endpoint.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Private Chat API is running",
  });
});

// Register API routes.
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);

// Handle unknown routes.
app.use(notFound);

// Centralized error handler.
app.use(errorHandler);

module.exports = app;
