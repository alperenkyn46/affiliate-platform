const cron = require("node-cron");
const { query } = require("../config/database");

function setupDailyStatsJob() {
  cron.schedule("5 0 * * *", async () => {
    console.log("Running daily stats aggregation...");
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split("T")[0];

      const [visitors] = await query(
        "SELECT COUNT(*) as total FROM visitors WHERE DATE(created_at) = ?",
        [dateStr]
      );
      const [uniqueVisitors] = await query(
        "SELECT COUNT(DISTINCT ip) as total FROM visitors WHERE DATE(created_at) = ?",
        [dateStr]
      );
      const [clicks] = await query(
        "SELECT COUNT(*) as total FROM clicks WHERE DATE(created_at) = ?",
        [dateStr]
      );
      const [mobileVisitors] = await query(
        "SELECT COUNT(*) as total FROM visitors WHERE DATE(created_at) = ? AND device = 'mobile'",
        [dateStr]
      );
      const [desktopVisitors] = await query(
        "SELECT COUNT(*) as total FROM visitors WHERE DATE(created_at) = ? AND device = 'desktop'",
        [dateStr]
      );

      await query(
        `INSERT INTO daily_stats (date, total_visitors, unique_visitors, total_clicks, mobile_visitors, desktop_visitors)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         total_visitors = VALUES(total_visitors),
         unique_visitors = VALUES(unique_visitors),
         total_clicks = VALUES(total_clicks),
         mobile_visitors = VALUES(mobile_visitors),
         desktop_visitors = VALUES(desktop_visitors)`,
        [dateStr, visitors.total, uniqueVisitors.total, clicks.total, mobileVisitors.total, desktopVisitors.total]
      );

      console.log(`Daily stats for ${dateStr} saved successfully`);
    } catch (error) {
      console.error("Daily stats job error:", error);
    }
  });

  console.log("Daily stats cron job scheduled (00:05 daily)");
}

module.exports = { setupDailyStatsJob };
