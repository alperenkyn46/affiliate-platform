const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password required" });
    }

    const users = await query("SELECT * FROM affiliates WHERE email = ? AND status = 'active'", [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, type: "affiliate" }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, tracking_code: user.tracking_code },
      },
    });
  } catch (error) {
    console.error("Affiliate login error:", error);
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, error: "No token" });

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "affiliate") return res.status(403).json({ success: false, error: "Forbidden" });

    const [affiliate] = await query("SELECT id, name, email, tracking_code, commission_rate, total_earnings, created_at FROM affiliates WHERE id = ?", [decoded.id]);
    if (!affiliate) return res.status(404).json({ success: false, error: "Not found" });

    const [totalClicks] = await query("SELECT COUNT(*) as count FROM affiliate_clicks WHERE affiliate_id = ?", [decoded.id]);
    const [todayClicks] = await query("SELECT COUNT(*) as count FROM affiliate_clicks WHERE affiliate_id = ? AND DATE(created_at) = CURDATE()", [decoded.id]);

    const recentClicks = await query(
      "SELECT ac.*, a.title as ad_title FROM affiliate_clicks ac JOIN ads a ON ac.ad_id = a.id WHERE ac.affiliate_id = ? ORDER BY ac.created_at DESC LIMIT 20",
      [decoded.id]
    );

    res.json({
      success: true,
      data: {
        affiliate,
        totalClicks: totalClicks.count,
        todayClicks: todayClicks.count,
        recentClicks,
      },
    });
  } catch (error) {
    console.error("Affiliate dashboard error:", error);
    res.status(500).json({ success: false, error: "Failed to load dashboard" });
  }
});

module.exports = router;
