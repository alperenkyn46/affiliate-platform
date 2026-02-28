const express = require("express");
const router = express.Router();
const { query } = require("../config/database");

// Public route - no auth required
router.get("/", async (req, res) => {
  try {
    const settings = await query("SELECT key_name, value FROM site_settings");
    
    // Convert array to object
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key_name] = s.value;
    });

    res.json({ 
      success: true, 
      data: {
        siteName: settingsObj.site_name || "CasinoHub",
        siteDescription: settingsObj.site_description || "",
        primaryColor: settingsObj.primary_color || "#d4af37",
        secondaryColor: settingsObj.secondary_color || "#1a1a1a",
        footerText: settingsObj.footer_text || "",
        socialDiscord: settingsObj.social_discord || "#",
        socialTelegram: settingsObj.social_telegram || "#",
        socialTwitch: settingsObj.social_twitch || "#",
        socialKick: settingsObj.social_kick || "#",
        socialYoutube: settingsObj.social_youtube || "#",
      }
    });
  } catch (error) {
    console.error("Get public settings error:", error);
    // Return defaults on error
    res.json({ 
      success: true, 
      data: {
        siteName: "CasinoHub",
        primaryColor: "#d4af37",
        secondaryColor: "#1a1a1a",
        socialDiscord: "#",
        socialTelegram: "#",
        socialTwitch: "#",
        socialKick: "#",
        socialYoutube: "#",
      }
    });
  }
});

module.exports = router;
