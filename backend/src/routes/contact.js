const express = require("express");
const router = express.Router();
const { query } = require("../config/database");

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    try {
      await query(
        "INSERT INTO contact_messages (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, NOW())",
        [name, email, subject, message]
      );
    } catch (dbError) {
      console.log("Contact message not saved - DB not available");
    }

    res.json({ success: true, message: "Message received" });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
});

module.exports = router;
