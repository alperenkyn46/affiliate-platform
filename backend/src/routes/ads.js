const express = require("express");
const router = express.Router();
const adsController = require("../controllers/adsController");

// Public routes
router.get("/", adsController.getAllAds);
router.get("/:id", adsController.getAdById);

module.exports = router;
