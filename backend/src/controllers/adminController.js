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
        
        // MySQL BOOLEAN'ı JavaScript boolean'a çevir
        const formattedAds = ads.map(ad => ({
          ...ad,
          featured: ad.featured === 1 || ad.featured === true,
          tags: typeof ad.tags === 'string' ? JSON.parse(ad.tags || '[]') : (ad.tags || [])
        }));
        
        res.json({ success: true, data: formattedAds });
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
      const { title, description, bonus, bonus_details, image, link, position, status, featured, rating, tags, start_date, end_date } =
        req.body;

      if (!title || !link) {
        return res.status(400).json({ success: false, error: "Title and link are required" });
      }

      try {
        const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : (tags || '[]');
        
        const result = await query(
          `INSERT INTO ads (title, description, bonus, bonus_details, image, link, position, status, featured, rating, tags, start_date, end_date, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            title,
            description || "",
            bonus || "",
            bonus_details || "",
            image || "",
            link,
            position || 999,
            status || "active",
            featured ? 1 : 0,
            rating || 4.5,
            tagsJson,
            start_date || null,
            end_date || null,
          ]
        );

        res.status(201).json({
          success: true,
          data: { id: result.insertId, ...req.body },
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
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
      const { title, description, bonus, bonus_details, image, link, position, status, featured, rating, tags, start_date, end_date } =
        req.body;

      try {
        const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : (tags || '[]');
        
        await query(
          `UPDATE ads SET 
           title = ?, description = ?, bonus = ?, bonus_details = ?, 
           image = ?, link = ?, position = ?, status = ?, featured = ?,
           rating = ?, tags = ?,
           start_date = ?, end_date = ?,
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
            featured ? 1 : 0,
            rating || 4.5,
            tagsJson,
            start_date || null,
            end_date || null,
            id,
          ]
        );

        res.json({ success: true, message: "Ad updated successfully" });
      } catch (dbError) {
        console.error("Database error:", dbError);
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
          promotionAdId: settingsObj.promotion_ad_id || "",
          promotionTitle: settingsObj.promotion_title || "",
          promotionDescription: settingsObj.promotion_description || "",
          exitPopupAdId: settingsObj.exit_popup_ad_id || "",
          exitPopupTitle: settingsObj.exit_popup_title || "",
          exitPopupDescription: settingsObj.exit_popup_description || "",
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
        ["promotion_ad_id", req.body.promotionAdId],
        ["promotion_title", req.body.promotionTitle],
        ["promotion_description", req.body.promotionDescription],
        ["exit_popup_ad_id", req.body.exitPopupAdId],
        ["exit_popup_title", req.body.exitPopupTitle],
        ["exit_popup_description", req.body.exitPopupDescription],
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

  async getBlogPosts(req, res) {
    try {
      const posts = await query("SELECT bp.*, au.username as author_name FROM blog_posts bp LEFT JOIN admin_users au ON bp.author_id = au.id ORDER BY bp.created_at DESC");
      res.json({ success: true, data: posts });
    } catch (error) {
      console.error("Get blog posts error:", error);
      res.json({ success: true, data: [] });
    }
  },

  async createBlogPost(req, res) {
    try {
      const { title, slug, excerpt, content, cover_image, category, tags, status, meta_title, meta_description } = req.body;
      if (!title || !content) {
        return res.status(400).json({ success: false, error: "Title and content are required" });
      }
      const postSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const publishedAt = status === "published" ? new Date() : null;

      const result = await query(
        `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author_id, category, tags, status, meta_title, meta_description, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, postSlug, excerpt || "", content, cover_image || "", req.user.id, category || "", JSON.stringify(tags || []), status || "draft", meta_title || title, meta_description || excerpt || "", publishedAt]
      );

      res.status(201).json({ success: true, data: { id: result.insertId, slug: postSlug } });
    } catch (error) {
      console.error("Create blog post error:", error);
      res.status(500).json({ success: false, error: "Failed to create post" });
    }
  },

  async updateBlogPost(req, res) {
    try {
      const { id } = req.params;
      const { title, slug, excerpt, content, cover_image, category, tags, status, meta_title, meta_description } = req.body;

      let publishedAtClause = "";
      const params = [title, slug, excerpt, content, cover_image || "", category || "", JSON.stringify(tags || []), status, meta_title || title, meta_description || excerpt || ""];
      
      if (status === "published") {
        publishedAtClause = ", published_at = COALESCE(published_at, NOW())";
      }

      params.push(id);
      await query(
        `UPDATE blog_posts SET title = ?, slug = ?, excerpt = ?, content = ?, cover_image = ?, category = ?, tags = ?, status = ?, meta_title = ?, meta_description = ?${publishedAtClause} WHERE id = ?`,
        params
      );

      res.json({ success: true, message: "Post updated" });
    } catch (error) {
      console.error("Update blog post error:", error);
      res.status(500).json({ success: false, error: "Failed to update post" });
    }
  },

  async getConversionAnalytics(req, res) {
    try {
      const data = await query(`
        SELECT a.id, a.title, 
               COUNT(DISTINCT c.id) as clicks,
               COUNT(DISTINCT cv.id) as conversions,
               ROUND(COUNT(DISTINCT cv.id) / NULLIF(COUNT(DISTINCT c.id), 0) * 100, 2) as conversion_rate,
               COALESCE(SUM(cv.value), 0) as revenue
        FROM ads a
        LEFT JOIN clicks c ON a.id = c.ad_id
        LEFT JOIN conversions cv ON a.id = cv.ad_id
        WHERE a.status = 'active'
        GROUP BY a.id, a.title
        ORDER BY clicks DESC
      `);
      res.json({ success: true, data });
    } catch (error) {
      res.json({ success: true, data: [] });
    }
  },

  async getFunnelAnalytics(req, res) {
    try {
      const [visitors] = await query("SELECT COUNT(*) as count FROM visitors");
      const [clicks] = await query("SELECT COUNT(*) as count FROM clicks");
      const [conversions] = await query("SELECT COUNT(*) as count FROM conversions");
      
      res.json({
        success: true,
        data: {
          visitors: visitors.count,
          clicks: clicks.count,
          conversions: conversions.count,
          clickRate: visitors.count > 0 ? ((clicks.count / visitors.count) * 100).toFixed(2) : 0,
          conversionRate: clicks.count > 0 ? ((conversions.count / clicks.count) * 100).toFixed(2) : 0,
        },
      });
    } catch (error) {
      res.json({
        success: true,
        data: { visitors: 0, clicks: 0, conversions: 0, clickRate: 0, conversionRate: 0 },
      });
    }
  },

  async deleteBlogPost(req, res) {
    try {
      const { id } = req.params;
      await query("DELETE FROM blog_posts WHERE id = ?", [id]);
      res.json({ success: true, message: "Post deleted" });
    } catch (error) {
      console.error("Delete blog post error:", error);
      res.status(500).json({ success: false, error: "Failed to delete post" });
    }
  },

  async getReviews(req, res) {
    try {
      const reviews = await query(
        "SELECT r.*, a.title as ad_title FROM reviews r JOIN ads a ON r.ad_id = a.id ORDER BY r.created_at DESC"
      );
      res.json({ success: true, data: reviews });
    } catch (error) {
      res.json({ success: true, data: [] });
    }
  },

  async updateReviewStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await query("UPDATE reviews SET status = ? WHERE id = ?", [status, id]);
      res.json({ success: true, message: "Review updated" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update review" });
    }
  },

  async getApiStats(req, res) {
    try {
      const endpointStats = await query(`
        SELECT endpoint, method, COUNT(*) as requests, 
               AVG(response_time) as avg_response_time,
               MAX(response_time) as max_response_time
        FROM api_logs
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        GROUP BY endpoint, method
        ORDER BY requests DESC
        LIMIT 20
      `);

      const hourlyStats = await query(`
        SELECT HOUR(created_at) as hour, COUNT(*) as requests
        FROM api_logs
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        GROUP BY HOUR(created_at)
        ORDER BY hour
      `);

      const [totalRequests] = await query(
        "SELECT COUNT(*) as total FROM api_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)"
      );

      const [avgResponseTime] = await query(
        "SELECT AVG(response_time) as avg_time FROM api_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)"
      );

      res.json({
        success: true,
        data: {
          endpointStats,
          hourlyStats,
          totalRequests: totalRequests.total,
          avgResponseTime: Math.round(avgResponseTime.avg_time || 0),
        },
      });
    } catch (error) {
      res.json({
        success: true,
        data: { endpointStats: [], hourlyStats: [], totalRequests: 0, avgResponseTime: 0 },
      });
    }
  },

  async getAffiliates(req, res) {
    try {
      const affiliates = await query(`
        SELECT a.*, COUNT(ac.id) as total_clicks
        FROM affiliates a
        LEFT JOIN affiliate_clicks ac ON a.id = ac.affiliate_id
        GROUP BY a.id
        ORDER BY a.created_at DESC
      `);
      res.json({ success: true, data: affiliates });
    } catch (error) {
      res.json({ success: true, data: [] });
    }
  },

  async createAffiliate(req, res) {
    try {
      const { name, email, password, commission_rate } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: "Name, email and password are required" });
      }

      const hashedPassword = await require("bcryptjs").hash(password, 10);
      const trackingCode = "AFF" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

      const result = await query(
        "INSERT INTO affiliates (name, email, password, tracking_code, commission_rate, status) VALUES (?, ?, ?, ?, ?, 'active')",
        [name, email, hashedPassword, trackingCode, commission_rate || 0]
      );

      res.status(201).json({ success: true, data: { id: result.insertId, tracking_code: trackingCode } });
    } catch (error) {
      console.error("Create affiliate error:", error);
      res.status(500).json({ success: false, error: "Failed to create affiliate" });
    }
  },

  async updateAffiliate(req, res) {
    try {
      const { id } = req.params;
      const { name, email, commission_rate, status } = req.body;
      await query(
        "UPDATE affiliates SET name = ?, email = ?, commission_rate = ?, status = ? WHERE id = ?",
        [name, email, commission_rate, status, id]
      );
      res.json({ success: true, message: "Affiliate updated" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update affiliate" });
    }
  },

  async deleteAffiliate(req, res) {
    try {
      await query("DELETE FROM affiliates WHERE id = ?", [req.params.id]);
      res.json({ success: true, message: "Affiliate deleted" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to delete affiliate" });
    }
  },

  async getBackups(req, res) {
    try {
      const { listBackups } = require("../jobs/backup");
      const backups = listBackups();
      res.json({ success: true, data: backups });
    } catch (error) {
      res.json({ success: true, data: [] });
    }
  },

  async createBackup(req, res) {
    try {
      const { triggerManualBackup } = require("../jobs/backup");
      const filename = await triggerManualBackup();
      res.json({ success: true, data: { filename } });
    } catch (error) {
      console.error("Manual backup error:", error);
      res.status(500).json({ success: false, error: "Backup failed" });
    }
  },

  // Contact Messages
  async getMessages(req, res) {
    try {
      const messages = await query(
        "SELECT * FROM contact_messages ORDER BY created_at DESC"
      );
      res.json({ success: true, data: messages });
    } catch (error) {
      console.error("Get messages error:", error);
      res.json({ success: true, data: [] });
    }
  },

  async updateMessageStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!["new", "read", "replied"].includes(status)) {
        return res.status(400).json({ success: false, error: "Invalid status" });
      }

      await query("UPDATE contact_messages SET status = ? WHERE id = ?", [status, id]);
      res.json({ success: true, message: "Message status updated" });
    } catch (error) {
      console.error("Update message status error:", error);
      res.status(500).json({ success: false, error: "Failed to update message" });
    }
  },

  async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      await query("DELETE FROM contact_messages WHERE id = ?", [id]);
      res.json({ success: true, message: "Message deleted" });
    } catch (error) {
      console.error("Delete message error:", error);
      res.status(500).json({ success: false, error: "Failed to delete message" });
    }
  },
};

module.exports = adminController;
