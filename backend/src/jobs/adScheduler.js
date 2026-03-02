const cron = require("node-cron");
const { query } = require("../config/database");

function setupAdSchedulerJob() {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");

      const activated = await query(
        "UPDATE ads SET status = 'active' WHERE status = 'pending' AND start_date IS NOT NULL AND start_date <= ?",
        [now]
      );
      if (activated.affectedRows > 0) {
        console.log(`Ad scheduler: ${activated.affectedRows} ads activated`);
      }

      const deactivated = await query(
        "UPDATE ads SET status = 'inactive' WHERE status = 'active' AND end_date IS NOT NULL AND end_date <= ?",
        [now]
      );
      if (deactivated.affectedRows > 0) {
        console.log(`Ad scheduler: ${deactivated.affectedRows} ads deactivated`);
      }
    } catch (error) {
      console.error("Ad scheduler error:", error);
    }
  });

  console.log("Ad scheduler cron job scheduled (every 5 minutes)");
}

module.exports = { setupAdSchedulerJob };
