require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const adsRoutes = require("./routes/ads");
const trackingRoutes = require("./routes/tracking");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const settingsRoutes = require("./routes/settings");
const contactRoutes = require("./routes/contact");
const blogRoutes = require("./routes/blog");
const reviewsRoutes = require("./routes/reviews");
const affiliateRoutes = require("./routes/affiliate");

const app = express();
app.set("trust proxy", true);
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc)
      if (!origin) return callback(null, true);
      
      // Allow localhost
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return callback(null, true);
      }
      
      // Allow LAN IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
      if (origin.match(/^https?:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/)) {
        return callback(null, true);
      }
      
      // Allow configured frontend URL
      if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }
      
      callback(null, true); // Development: allow all
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate Limiting (disabled in development)
if (process.env.NODE_ENV === "production") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // Test için artırıldı
    message: { error: "Too many requests, please try again later." },
  });
  app.use("/api/", limiter);
}

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("dev"));

const apiLogger = require("./middleware/apiLogger");
app.use("/api/", apiLogger);

// Routes
app.use("/api/ads", adsRoutes);
app.use("/api", trackingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/affiliate", affiliateRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  
  // Test database connection
  const { testConnection } = require("./config/database");
  await testConnection();

  const { setupDailyStatsJob } = require("./jobs/dailyStats");
  setupDailyStatsJob();

  const { setupEmailJobs } = require("./jobs/emailReports");
  setupEmailJobs();

  const { setupAdSchedulerJob } = require("./jobs/adScheduler");
  setupAdSchedulerJob();

  const { setupBackupJob } = require("./jobs/backup");
  setupBackupJob();
});
