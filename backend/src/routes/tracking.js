const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/trackingController");

// Redirect route
router.get("/go/:id", trackingController.handleRedirect);

// Record visitor
router.post("/visitors", trackingController.recordVisitor);

module.exports = router;
