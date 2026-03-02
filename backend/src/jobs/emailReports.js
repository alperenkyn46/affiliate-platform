const cron = require("node-cron");
const { query } = require("../config/database");
const { sendEmail, generateDailyReportHtml, generateWeeklyReportHtml, generateAnomalyAlertHtml } = require("../services/emailService");

function setupEmailJobs() {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.log("ADMIN_EMAIL not set, email reports disabled");
    return;
  }

  cron.schedule("0 8 * * *", async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const [visitors] = await query("SELECT COUNT(*) as count FROM visitors WHERE DATE(created_at) = ?", [today]);
      const [clicks] = await query("SELECT COUNT(*) as count FROM clicks WHERE DATE(created_at) = ?", [today]);

      const html = generateDailyReportHtml({
        todayVisitors: visitors.count,
        todayClicks: clicks.count,
      });

      await sendEmail({ to: adminEmail, subject: `CasinoHub Günlük Rapor - ${today}`, html });
    } catch (error) {
      console.error("Daily report error:", error);
    }
  });

  cron.schedule("0 9 * * 1", async () => {
    try {
      const [visitors] = await query("SELECT COUNT(*) as count FROM visitors WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
      const [clicks] = await query("SELECT COUNT(*) as count FROM clicks WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");

      const html = generateWeeklyReportHtml({
        weeklyVisitors: visitors.count,
        weeklyClicks: clicks.count,
      });

      await sendEmail({ to: adminEmail, subject: "CasinoHub Haftalık Rapor", html });
    } catch (error) {
      console.error("Weekly report error:", error);
    }
  });

  cron.schedule("0 * * * *", async () => {
    try {
      const [currentHour] = await query("SELECT COUNT(*) as count FROM visitors WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)");
      const [avgHour] = await query("SELECT AVG(hourly_count) as avg_count FROM (SELECT COUNT(*) as hourly_count FROM visitors WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(created_at), HOUR(created_at)) as hourly");

      const avg = avgHour.avg_count || 0;
      if (avg > 0 && currentHour.count > avg * 1.5) {
        const html = generateAnomalyAlertHtml("Ziyaretçi Sayısı", currentHour.count, Math.round(avg));
        await sendEmail({ to: adminEmail, subject: "⚠️ CasinoHub Anomali Uyarısı", html });
      }
    } catch (error) {
      console.error("Anomaly check error:", error);
    }
  });

  console.log("Email report cron jobs scheduled");
}

module.exports = { setupEmailJobs };
