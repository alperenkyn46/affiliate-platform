const cron = require("node-cron");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

function setupBackupJob() {
  const backupDir = process.env.BACKUP_DIR || path.join(__dirname, "../../backups");
  const retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS || "30");

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Daily backup at 02:00
  cron.schedule("0 2 * * *", () => {
    runBackup(backupDir, retentionDays);
  });

  console.log(`Backup cron job scheduled (02:00 daily, retention: ${retentionDays} days)`);
}

function runBackup(backupDir, retentionDays) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `backup_${timestamp}.sql`;
  const filepath = path.join(backupDir, filename);

  const dbHost = process.env.DB_HOST || "localhost";
  const dbPort = process.env.DB_PORT || "3306";
  const dbUser = process.env.DB_USER || "root";
  const dbPass = process.env.DB_PASSWORD || "";
  const dbName = process.env.DB_NAME || "affiliate_db";

  const passFlag = dbPass ? `-p${dbPass}` : "";
  const cmd = `mysqldump -h ${dbHost} -P ${dbPort} -u ${dbUser} ${passFlag} ${dbName} > "${filepath}"`;

  exec(cmd, (error) => {
    if (error) {
      console.error(`Backup failed: ${error.message}`);
      return;
    }
    console.log(`Backup created: ${filename}`);
    cleanOldBackups(backupDir, retentionDays);
  });
}

function cleanOldBackups(backupDir, retentionDays) {
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

  try {
    const files = fs.readdirSync(backupDir).filter(f => f.startsWith("backup_") && f.endsWith(".sql"));
    for (const file of files) {
      const filePath = path.join(backupDir, file);
      const stat = fs.statSync(filePath);
      if (stat.mtimeMs < cutoff) {
        fs.unlinkSync(filePath);
        console.log(`Old backup deleted: ${file}`);
      }
    }
  } catch (error) {
    console.error("Backup cleanup error:", error);
  }
}

function listBackups() {
  const backupDir = process.env.BACKUP_DIR || path.join(__dirname, "../../backups");
  if (!fs.existsSync(backupDir)) return [];

  return fs.readdirSync(backupDir)
    .filter(f => f.startsWith("backup_") && f.endsWith(".sql"))
    .map(f => {
      const stat = fs.statSync(path.join(backupDir, f));
      return { filename: f, size: stat.size, created: stat.mtime };
    })
    .sort((a, b) => b.created.getTime() - a.created.getTime());
}

function triggerManualBackup() {
  const backupDir = process.env.BACKUP_DIR || path.join(__dirname, "../../backups");
  const retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS || "30");

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `backup_manual_${timestamp}.sql`;
    const filepath = path.join(backupDir, filename);

    const dbHost = process.env.DB_HOST || "localhost";
    const dbPort = process.env.DB_PORT || "3306";
    const dbUser = process.env.DB_USER || "root";
    const dbPass = process.env.DB_PASSWORD || "";
    const dbName = process.env.DB_NAME || "affiliate_db";

    const passFlag = dbPass ? `-p${dbPass}` : "";
    const cmd = `mysqldump -h ${dbHost} -P ${dbPort} -u ${dbUser} ${passFlag} ${dbName} > "${filepath}"`;

    exec(cmd, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(filename);
    });
  });
}

module.exports = { setupBackupJob, listBackups, triggerManualBackup };
