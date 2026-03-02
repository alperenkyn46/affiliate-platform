const express = require("express");
const router = express.Router();
const { query } = require("../config/database");

router.get("/:adId", async (req, res) => {
  try {
    const reviews = await query(
      "SELECT id, ad_id, author_name, rating, comment, created_at FROM reviews WHERE ad_id = ? AND status = 'approved' ORDER BY created_at DESC",
      [req.params.adId]
    );
    const [avg] = await query(
      "SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE ad_id = ? AND status = 'approved'",
      [req.params.adId]
    );
    res.json({ success: true, data: { reviews, avgRating: avg.avg_rating || 0, total: avg.total } });
  } catch (error) {
    res.json({ success: true, data: { reviews: [], avgRating: 0, total: 0 } });
  }
});

router.post("/", async (req, res) => {
  try {
    const { ad_id, author_name, author_email, rating, comment } = req.body;
    if (!ad_id || !author_name || !rating) {
      return res.status(400).json({ success: false, error: "Ad ID, name and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: "Rating must be between 1 and 5" });
    }

    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.connection?.remoteAddress || "unknown";

    const [existing] = await query(
      "SELECT COUNT(*) as count FROM reviews WHERE ad_id = ? AND ip = ? AND DATE(created_at) = CURDATE()",
      [ad_id, ip]
    ).catch(() => [{ count: 0 }]);

    if (existing.count >= 3) {
      return res.status(429).json({ success: false, error: "Günlük yorum limitine ulaştınız" });
    }

    await query(
      "INSERT INTO reviews (ad_id, author_name, author_email, rating, comment, ip) VALUES (?, ?, ?, ?, ?, ?)",
      [ad_id, author_name, author_email || "", rating, comment || "", ip]
    );

    res.status(201).json({ success: true, message: "Yorumunuz onay bekliyor" });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ success: false, error: "Failed to create review" });
  }
});

module.exports = router;
