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

      try {
        const clicks = await query(
          `SELECT DATE(created_at) as date, COUNT(*) as count 
           FROM clicks 
           WHERE created_at BETWEEN ? AND ? 
           GROUP BY DATE(created_at) 
           ORDER BY date ASC`,
          [start_date || "2024-01-01", end_date || new Date().toISOString().split("T")[0]]
        );

        const visitors = await query(
          `SELECT DATE(created_at) as date, COUNT(*) as count 
           FROM visitors 
           WHERE created_at BETWEEN ? AND ? 
           GROUP BY DATE(created_at) 
           ORDER BY date ASC`,
          [start_date || "2024-01-01", end_date || new Date().toISOString().split("T")[0]]
        );

        res.json({ success: true, data: { clicks, visitors } });
      } catch (dbError) {
        res.json({
          success: true,
          data: {
            clicks: [
              { date: "2024-01-15", count: 45 },
              { date: "2024-01-16", count: 52 },
              { date: "2024-01-17", count: 61 },
            ],
            visitors: [
              { date: "2024-01-15", count: 120 },
              { date: "2024-01-16", count: 145 },
              { date: "2024-01-17", count: 167 },
            ],
          },
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
};

module.exports = adminController;
