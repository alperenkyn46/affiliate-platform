const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

// All admin routes require authentication
router.use(authMiddleware);

// Dashboard
router.get("/dashboard", adminController.getDashboard);

// Ads Management
router.get("/ads", adminController.getAllAds);
router.post("/ads", adminController.createAd);
router.put("/ads/:id", adminController.updateAd);
router.delete("/ads/:id", requireRole("super_admin", "admin"), adminController.deleteAd);
router.put("/ads/:id/position", adminController.updateAdPosition);

// Analytics
router.get("/analytics", adminController.getAnalytics);
router.get("/analytics/clicks", adminController.getClickAnalytics);
router.get("/analytics/visitors", adminController.getVisitorAnalytics);

// Advanced Analytics
router.get("/analytics/conversions", adminController.getConversionAnalytics);
router.get("/analytics/funnel", adminController.getFunnelAnalytics);

// Settings
router.get("/settings", requireRole("super_admin", "admin"), adminController.getSettings);
router.put("/settings", requireRole("super_admin", "admin"), adminController.updateSettings);

// Blog Management
router.get("/blog", adminController.getBlogPosts);
router.post("/blog", adminController.createBlogPost);
router.put("/blog/:id", adminController.updateBlogPost);
router.delete("/blog/:id", requireRole("super_admin", "admin"), adminController.deleteBlogPost);

// Reviews
router.get("/reviews", adminController.getReviews);
router.put("/reviews/:id", adminController.updateReviewStatus);

// API Stats
router.get("/api-stats", adminController.getApiStats);

// Affiliate Management
router.get("/affiliates", adminController.getAffiliates);
router.post("/affiliates", adminController.createAffiliate);
router.put("/affiliates/:id", adminController.updateAffiliate);
router.delete("/affiliates/:id", adminController.deleteAffiliate);

// Backups
router.get("/backups", adminController.getBackups);
router.post("/backups", adminController.createBackup);

// Contact Messages
router.get("/messages", adminController.getMessages);
router.put("/messages/:id", adminController.updateMessageStatus);
router.delete("/messages/:id", requireRole("super_admin", "admin"), adminController.deleteMessage);

module.exports = router;
