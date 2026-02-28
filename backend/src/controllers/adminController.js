const { query } = require("../config/database");

// Mock data for development
const mockStats = {
  totalVisitors: 12453,
  todayVisitors: 234,
  totalClicks: 8934,
  todayClicks: 156,
  topAds: [
    { id: 1, title: "BetKing Casino", clicks: 2341 },
    { id: 2, title: "RoyalBet", clicks: 1892 },
    { id: 5, title: "GoldBet", clicks: 1567 },
  ],
  deviceStats: { mobile: 65, desktop: 35 },
};

const mockAds = [
  {
    id: 1,
    title: "BetKing Casino",
    description: "Türkiye'nin en güvenilir casino sitesi",
    bonus: "%150 Hoşgeldin Bonusu",
    bonus_details: "500₺'ye kadar",
    image: "/casinos/betking.png",
    link: "https://example.com/betking",
    position: 1,
    status: "active",
    featured: true,
    click_count: 2341,
    created_at: "2024-01-15",
  },
  {
    id: 2,
    title: "RoyalBet",
    description: "Kraliyet deneyimi yaşayın",
    bonus: "%200 İlk Yatırım",
    bonus_details: "1000₺'ye kadar",
    image: "/casinos/royalbet.png",
    link: "https://example.com/royalbet",
    position: 2,
    status: "active",
    featured: true,
    click_count: 1892,
    created_at: "2024-01-16",
  },
  {
    id: 3,
    title: "SpinPalace",
    description: "En yüksek oranlar burada",
    bonus: "100 Freespin",
    bonus_details: "Kayıt bonusu",
    image: "/casinos/spinpalace.png",
    link: "https://example.com/spinpalace",
    position: 3,
    status: "active",
    featured: false,
    click_count: 1245,
    created_at: "2024-01-17",
  },
  {
    id: 4,
    title: "LuckySlots",
    description: "Şansınızı deneyin",
    bonus: "%100 Bonus",
    bonus_details: "300₺'ye kadar",
    image: "/casinos/luckyslots.png",
    link: "https://example.com/luckyslots",
    position: 4,
    status: "active",
    featured: false,
    click_count: 987,
    created_at: "2024-01-18",
  },
  {
    id: 5,
    title: "GoldBet",
    description: "Altın değerinde kazançlar",
    bonus: "%250 Hoşgeldin",
    bonus_details: "2500₺'ye kadar",
    image: "/casinos/goldbet.png",
    link: "https://example.com/goldbet",
    position: 5,
    status: "active",
    featured: true,
    click_count: 1567,
    created_at: "2024-01-19",
  },
  {
    id: 6,
    title: "MegaCasino",
    description: "Mega ödüller sizi bekliyor",
    bonus: "50 Freespin + %100",
    bonus_details: "Kombine bonus",
    image: "/casinos/megacasino.png",
    link: "https://example.com/megacasino",
    position: 6,
    status: "active",
    featured: false,
    click_count: 756,
    created_at: "2024-01-20",
  },
  {
    id: 7,
    title: "DiamondBet",
    description: "Elmas gibi parlayan fırsatlar",
    bonus: "%175 Yatırım Bonusu",
    bonus_details: "750₺'ye kadar",
    image: "/casinos/diamondbet.png",
    link: "https://example.com/diamondbet",
    position: 7,
    status: "active",
    featured: false,
    click_count: 654,
    created_at: "2024-01-21",
  },
  {
    id: 8,
    title: "VegasOnline",
    description: "Vegas deneyimini evine getir",
    bonus: "%300 Mega Bonus",
    bonus_details: "3000₺'ye kadar",
    image: "/casinos/vegasonline.png",
    link: "https://example.com/vegasonline",
    position: 8,
    status: "active",
    featured: true,
    click_count: 1123,
    created_at: "2024-01-22",
  },
];

const adminController = {
  async getDashboard(req, res) {
    try {
      try {
        // Get today's date
        const today = new Date().toISOString().split("T")[0];

        // Total visitors
        const [totalVisitors] = await query("SELECT COUNT(*) as count FROM visitors");

        // Today's visitors
        const [todayVisitors] = await query(
          "SELECT COUNT(*) as count FROM visitors WHERE DATE(created_at) = ?",
          [today]
        );

        // Total clicks
        const [totalClicks] = await query("SELECT COUNT(*) as count FROM clicks");

        // Today's clicks
        const [todayClicks] = await query(
          "SELECT COUNT(*) as count FROM clicks WHERE DATE(created_at) = ?",
          [today]
        );

        // Top ads
        const topAds = await query(`
          SELECT a.id, a.title, COUNT(c.id) as clicks 
          FROM ads a 
          LEFT JOIN clicks c ON a.id = c.ad_id 
          GROUP BY a.id, a.title 
          ORDER BY clicks DESC 
          LIMIT 5
        `);

        // Device stats
        const deviceStats = await query(`
          SELECT device, COUNT(*) as count 
          FROM visitors 
          GROUP BY device
        `);

        const mobileCount = deviceStats.find((d) => d.device === "mobile")?.count || 0;
        const desktopCount = deviceStats.find((d) => d.device === "desktop")?.count || 0;
        const total = mobileCount + desktopCount || 1;

        res.json({
          success: true,
          data: {
            totalVisitors: totalVisitors.count,
            todayVisitors: todayVisitors.count,
            totalClicks: totalClicks.count,
            todayClicks: todayClicks.count,
            topAds,
            deviceStats: {
              mobile: Math.round((mobileCount / total) * 100),
              desktop: Math.round((desktopCount / total) * 100),
            },
          },
        });
      } catch (dbError) {
        console.log("Database not available, using mock stats");
        res.json({ success: true, data: mockStats });
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch dashboard" });
    }
  },

  async getAllAds(req, res) {
    try {
      try {
        const ads = await query(`
          SELECT a.*, COUNT(c.id) as click_count 
          FROM ads a 
          LEFT JOIN clicks c ON a.id = c.ad_id 
          GROUP BY a.id 
          ORDER BY a.position ASC
        `);
        res.json({ success: true, data: ads });
      } catch (dbError) {
        res.json({ success: true, data: mockAds });
      }
    } catch (error) {
      console.error("Get ads error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch ads" });
    }
  },

  async createAd(req, res) {
    try {
      const { title, description, bonus, bonus_details, image, link, position, status, featured } =
        req.body;

      if (!title || !link) {
        return res.status(400).json({ success: false, error: "Title and link are required" });
      }

      try {
        const result = await query(
          `INSERT INTO ads (title, description, bonus, bonus_details, image, link, position, status, featured, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            title,
            description || "",
            bonus || "",
            bonus_details || "",
            image || "",
            link,
            position || 999,
            status || "active",
            featured || false,
          ]
        );

        res.status(201).json({
          success: true,
          data: { id: result.insertId, ...req.body },
        });
      } catch (dbError) {
        res.status(500).json({ success: false, error: "Database not available" });
      }
    } catch (error) {
      console.error("Create ad error:", error);
      res.status(500).json({ success: false, error: "Failed to create ad" });
    }
  },

  async updateAd(req, res) {
    try {
      const { id } = req.params;
      const { title, description, bonus, bonus_details, image, link, position, status, featured } =
        req.body;

      try {
        await query(
          `UPDATE ads SET 
           title = ?, description = ?, bonus = ?, bonus_details = ?, 
           image = ?, link = ?, position = ?, status = ?, featured = ?, 
           updated_at = NOW() 
           WHERE id = ?`,
          [
            title,
            description,
            bonus,
            bonus_details,
            image,
            link,
            position,
            status,
            featured,
            id,
          ]
        );

        res.json({ success: true, message: "Ad updated successfully" });
      } catch (dbError) {
        res.status(500).json({ success: false, error: "Database not available" });
      }
    } catch (error) {
      console.error("Update ad error:", error);
      res.status(500).json({ success: false, error: "Failed to update ad" });
    }
  },

  async deleteAd(req, res) {
    try {
      const { id } = req.params;

      try {
        await query("DELETE FROM ads WHERE id = ?", [id]);
        res.json({ success: true, message: "Ad deleted successfully" });
      } catch (dbError) {
        res.status(500).json({ success: false, error: "Database not available" });
      }
    } catch (error) {
      console.error("Delete ad error:", error);
      res.status(500).json({ success: false, error: "Failed to delete ad" });
    }
  },

  async updateAdPosition(req, res) {
    try {
      const { id } = req.params;
      const { position } = req.body;

      try {
        await query("UPDATE ads SET position = ? WHERE id = ?", [position, id]);
        res.json({ success: true, message: "Position updated" });
      } catch (dbError) {
        res.status(500).json({ success: false, error: "Database not available" });
      }
    } catch (error) {
      console.error("Update position error:", error);
      res.status(500).json({ success: false, error: "Failed to update position" });
    }
  },

  async getAnalytics(req, res) {
    try {
      const { start_date, end_date } = req.query;
      
      // Default: last 30 days
      const defaultEnd = new Date().toISOString().split("T")[0];
      const defaultStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      
      const startDate = start_date || defaultStart;
      const endDate = end_date || defaultEnd;

      try {
        const clicks = await query(
          `SELECT DATE(created_at) as date, COUNT(*) as count 
           FROM clicks 
           WHERE DATE(created_at) BETWEEN ? AND ? 
           GROUP BY DATE(created_at) 
           ORDER BY date ASC`,
          [startDate, endDate]
        );

        const visitors = await query(
          `SELECT DATE(created_at) as date, COUNT(*) as count 
           FROM visitors 
           WHERE DATE(created_at) BETWEEN ? AND ? 
           GROUP BY DATE(created_at) 
           ORDER BY date ASC`,
          [startDate, endDate]
        );

        // Format dates for frontend
        const formattedClicks = clicks.map(c => ({
          date: c.date instanceof Date ? c.date.toISOString().split("T")[0] : c.date,
          count: c.count
        }));
        
        const formattedVisitors = visitors.map(v => ({
          date: v.date instanceof Date ? v.date.toISOString().split("T")[0] : v.date,
          count: v.count
        }));

        res.json({ success: true, data: { clicks: formattedClicks, visitors: formattedVisitors } });
      } catch (dbError) {
        console.error("Analytics DB error:", dbError);
        res.json({
          success: true,
          data: { clicks: [], visitors: [] },
        });
      }
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch analytics" });
    }
  },

  async getClickAnalytics(req, res) {
    try {
      try {
        const data = await query(`
          SELECT a.id, a.title, COUNT(c.id) as clicks,
                 COUNT(DISTINCT DATE(c.created_at)) as active_days
          FROM ads a
          LEFT JOIN clicks c ON a.id = c.ad_id
          GROUP BY a.id, a.title
          ORDER BY clicks DESC
        `);
        res.json({ success: true, data });
      } catch (dbError) {
        res.json({
          success: true,
          data: [
            { id: 1, title: "BetKing Casino", clicks: 2341, active_days: 30 },
            { id: 2, title: "RoyalBet", clicks: 1892, active_days: 28 },
          ],
        });
      }
    } catch (error) {
      console.error("Click analytics error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch click analytics" });
    }
  },

  async getVisitorAnalytics(req, res) {
    try {
      try {
        const countryStats = await query(`
          SELECT country, COUNT(*) as count 
          FROM visitors 
          GROUP BY country 
          ORDER BY count DESC 
          LIMIT 10
        `);

        const deviceStats = await query(`
          SELECT device, COUNT(*) as count 
          FROM visitors 
          GROUP BY device
        `);

        res.json({ success: true, data: { countryStats, deviceStats } });
      } catch (dbError) {
        res.json({
          success: true,
          data: {
            countryStats: [
              { country: "TR", count: 8500 },
              { country: "DE", count: 1200 },
              { country: "NL", count: 800 },
            ],
            deviceStats: [
              { device: "mobile", count: 7800 },
              { device: "desktop", count: 4200 },
            ],
          },
        });
      }
    } catch (error) {
      console.error("Visitor analytics error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch visitor analytics" });
    }
  },

  // Settings
  async getSettings(req, res) {
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
      console.error("Get settings error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch settings" });
    }
  },

  async updateSettings(req, res) {
    try {
      const { 
        siteName, primaryColor, secondaryColor, 
        socialDiscord, socialTelegram, socialTwitch, socialKick, socialYoutube 
      } = req.body;

      // Update each setting
      const updates = [
        ["site_name", siteName],
        ["primary_color", primaryColor],
        ["secondary_color", secondaryColor],
        ["social_discord", socialDiscord],
        ["social_telegram", socialTelegram],
        ["social_twitch", socialTwitch],
        ["social_kick", socialKick],
        ["social_youtube", socialYoutube],
      ];

      for (const [key, value] of updates) {
        if (value !== undefined) {
          await query(
            "INSERT INTO site_settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?",
            [key, value, value]
          );
        }
      }

      res.json({ success: true, message: "Settings updated successfully" });
    } catch (error) {
      console.error("Update settings error:", error);
      res.status(500).json({ success: false, error: "Failed to update settings" });
    }
  },
};

module.exports = adminController;
