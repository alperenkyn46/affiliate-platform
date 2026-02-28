const { query } = require("../config/database");

// Mock data for development (used when database is not connected)
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
    rating: 4.9,
    tags: ["Yeni", "Popüler"],
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
    rating: 4.8,
    tags: ["VIP"],
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
    rating: 4.7,
    tags: ["Freespin"],
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
    rating: 4.6,
    tags: ["Slot"],
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
    rating: 4.9,
    tags: ["Premium", "VIP"],
  },
];

const adsController = {
  async getAllAds(req, res) {
    try {
      const { status = "active", featured } = req.query;

      // Try database first
      try {
        let sql = "SELECT * FROM ads WHERE status = ? ORDER BY position ASC";
        const params = [status];

        if (featured !== undefined) {
          sql = "SELECT * FROM ads WHERE status = ? AND featured = ? ORDER BY position ASC";
          params.push(featured === "true");
        }

        const ads = await query(sql, params);
        return res.json({ success: true, data: ads });
      } catch (dbError) {
        // Fallback to mock data if database is not available
        console.log("Database not available, using mock data");
        let filteredAds = mockAds.filter((ad) => ad.status === status);
        if (featured !== undefined) {
          filteredAds = filteredAds.filter((ad) => ad.featured === (featured === "true"));
        }
        return res.json({ success: true, data: filteredAds });
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
      res.status(500).json({ success: false, error: "Failed to fetch ads" });
    }
  },

  async getAdById(req, res) {
    try {
      const { id } = req.params;

      try {
        const ads = await query("SELECT * FROM ads WHERE id = ?", [id]);
        if (ads.length === 0) {
          return res.status(404).json({ success: false, error: "Ad not found" });
        }
        return res.json({ success: true, data: ads[0] });
      } catch (dbError) {
        // Fallback to mock data
        const ad = mockAds.find((a) => a.id === parseInt(id));
        if (!ad) {
          return res.status(404).json({ success: false, error: "Ad not found" });
        }
        return res.json({ success: true, data: ad });
      }
    } catch (error) {
      console.error("Error fetching ad:", error);
      res.status(500).json({ success: false, error: "Failed to fetch ad" });
    }
  },
};

module.exports = adsController;
