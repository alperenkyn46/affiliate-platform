const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// All admin routes require authentication
router.use(authMiddleware);

// Dashboard
router.get("/dashboard", adminController.getDashboard);

// Ads Management
router.get("/ads", adminController.getAllAds);
router.post("/ads", adminController.createAd);
router.put("/ads/:id", adminController.updateAd);
router.delete("/ads/:id", adminController.deleteAd);
router.put("/ads/:id/position", adminController.updateAdPosition);

// Analytics
router.get("/analytics", adminController.getAnalytics);
router.get("/analytics/clicks", adminController.getClickAnalytics);
router.get("/analytics/visitors", adminController.getVisitorAnalytics);

// Settings
router.get("/settings", adminController.getSettings);
router.put("/settings", adminController.updateSettings);

module.exports = router;
