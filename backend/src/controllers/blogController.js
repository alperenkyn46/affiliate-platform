const { query } = require("../config/database");

const blogController = {
  async getPosts(req, res) {
    try {
      const { category, q } = req.query;
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      
      let sql = "SELECT id, title, slug, excerpt, cover_image, category, tags, views, published_at, created_at FROM blog_posts WHERE status = 'published'";
      const params = [];

      if (category) {
        sql += " AND category = ?";
        params.push(category);
      }
      if (q) {
        sql += " AND (title LIKE ? OR excerpt LIKE ?)";
        params.push(`%${q}%`, `%${q}%`);
      }

      sql += ` ORDER BY published_at DESC LIMIT ${limit} OFFSET ${offset}`;

      const posts = await query(sql, params);
      const [countResult] = await query("SELECT COUNT(*) as total FROM blog_posts WHERE status = 'published'");

      res.json({ success: true, data: posts, total: countResult.total });
    } catch (error) {
      console.error("Get posts error:", error);
      res.json({ success: true, data: [], total: 0 });
    }
  },

  async getPostBySlug(req, res) {
    try {
      const { slug } = req.params;
      const posts = await query(
        "SELECT bp.*, au.username as author_name FROM blog_posts bp LEFT JOIN admin_users au ON bp.author_id = au.id WHERE bp.slug = ? AND bp.status = 'published'",
        [slug]
      );

      if (posts.length === 0) {
        return res.status(404).json({ success: false, error: "Post not found" });
      }

      await query("UPDATE blog_posts SET views = views + 1 WHERE slug = ?", [slug]);

      res.json({ success: true, data: posts[0] });
    } catch (error) {
      console.error("Get post error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch post" });
    }
  },

  async getCategories(req, res) {
    try {
      const categories = await query("SELECT * FROM blog_categories ORDER BY name ASC");
      res.json({ success: true, data: categories });
    } catch (error) {
      res.json({ success: true, data: [] });
    }
  },
};

module.exports = blogController;
