const { query } = require("../config/database");
const UAParser = require("ua-parser-js");
const geoip = require("geoip-lite");

// Mock ads for fallback (matches frontend mockAds)
const mockAds = [
  { id: 1, link: "https://example.com/betking" },
  { id: 2, link: "https://example.com/royalbet" },
  { id: 3, link: "https://example.com/spinpalace" },
  { id: 4, link: "https://example.com/luckyslots" },
  { id: 5, link: "https://example.com/goldbet" },
  { id: 6, link: "https://example.com/megacasino" },
  { id: 7, link: "https://example.com/diamondbet" },
  { id: 8, link: "https://example.com/vegasonline" },
];

function getClientInfo(req) {
  // Get IP address
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "unknown";

  // Parse User-Agent
  const parser = new UAParser(req.headers["user-agent"]);
  const result = parser.getResult();

  const device = result.device.type || "desktop";
  const browser = result.browser.name || "unknown";
  const os = result.os.name || "unknown";

  // Get country from IP
  let country = "unknown";
  if (ip !== "unknown" && ip !== "::1" && ip !== "127.0.0.1") {
    const geo = geoip.lookup(ip);
    if (geo) {
      country = geo.country;
    }
  }

  return { ip, device, browser, os, country };
}

const trackingController = {
  async handleRedirect(req, res) {
    try {
      const { id } = req.params;
      const clientInfo = getClientInfo(req);
      const referrer = req.headers["referer"] || req.headers["referrer"] || "";

      let adLink = null;

      // Try to get ad from database
      try {
        const ads = await query("SELECT link FROM ads WHERE id = ? AND status = 'active'", [id]);
        if (ads.length > 0) {
          adLink = ads[0].link;

          // Record click
          await query(
            `INSERT INTO clicks (ad_id, ip, device, browser, country, referrer, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [id, clientInfo.ip, clientInfo.device, clientInfo.browser, clientInfo.country, referrer]
          );

          // Track affiliate click
          const ref = req.query.ref;
          if (ref) {
            try {
              const affiliates = await query("SELECT id FROM affiliates WHERE tracking_code = ? AND status = 'active'", [ref]);
              if (affiliates.length > 0) {
                await query(
                  "INSERT INTO affiliate_clicks (affiliate_id, ad_id, ip, country, created_at) VALUES (?, ?, ?, ?, NOW())",
                  [affiliates[0].id, id, clientInfo.ip, clientInfo.country]
                );
              }
            } catch (affErr) {
              console.log("Affiliate click tracking error:", affErr.message);
            }
          }
        }
      } catch (dbError) {
        // Fallback to mock data
        console.log("Database not available, using mock data for redirect");
        const mockAd = mockAds.find((a) => a.id === parseInt(id));
        if (mockAd) {
          adLink = mockAd.link;
        }
      }

      if (!adLink) {
        return res.status(404).json({ success: false, error: "Ad not found" });
      }

      // Redirect to affiliate link
      res.redirect(302, adLink);
    } catch (error) {
      console.error("Error handling redirect:", error);
      res.status(500).json({ success: false, error: "Redirect failed" });
    }
  },

  async recordVisitor(req, res) {
    try {
      const clientInfo = getClientInfo(req);
      const { page_url } = req.body;

      try {
        await query(
          `INSERT INTO visitors (ip, device, browser, country, page_url, created_at) 
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [clientInfo.ip, clientInfo.device, clientInfo.browser, clientInfo.country, page_url || "/"]
        );
      } catch (dbError) {
        console.log("Database not available, visitor not recorded");
      }

      res.json({ success: true, message: "Visitor recorded" });
    } catch (error) {
      console.error("Error recording visitor:", error);
      res.status(500).json({ success: false, error: "Failed to record visitor" });
    }
  },

  async getRecentClicks(req, res) {
    try {
      const clicks = await query(
        `SELECT c.id, a.title as ad_title, c.country, c.created_at 
         FROM clicks c 
         JOIN ads a ON c.ad_id = a.id 
         ORDER BY c.created_at DESC 
         LIMIT 20`
      );
      res.json({ success: true, data: clicks });
    } catch (error) {
      res.json({ success: true, data: [] });
    }
  },
};

module.exports = trackingController;
