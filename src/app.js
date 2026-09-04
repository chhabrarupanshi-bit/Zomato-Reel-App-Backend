require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.route");
const cors = require("cors");

const app = express();

// Clean CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowed =
        origin.startsWith("http://localhost:") ||
        origin.endsWith(".vercel.app");

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Payload size limit for media uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Database connection middleware with error safety
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    res.status(500).json({ message: "Database connection failed", error: err.message });
  }
});

app.get("/", (req, res) => {
  res.status(200).send("Hello Everyone! Backend is live and running.");
});

app.use("/api/food", foodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

module.exports = app;