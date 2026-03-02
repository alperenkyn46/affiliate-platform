const nodemailer = require("nodemailer");

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendEmail({ to, subject, html }) {
  if (!process.env.SMTP_USER) {
    console.log("SMTP not configured, skipping email:", subject);
    return false;
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${subject} -> ${to}`);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

function generateDailyReportHtml(stats) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 30px; border-radius: 12px;">
      <h1 style="color: #d4af37; margin-bottom: 20px;">Günlük Rapor</h1>
      <p style="color: #999;">Tarih: ${new Date().toLocaleDateString("tr-TR")}</p>
      <div style="margin: 20px 0;">
        <div style="display: inline-block; background: #252525; padding: 15px 25px; border-radius: 8px; margin: 5px;">
          <div style="color: #d4af37; font-size: 24px; font-weight: bold;">${stats.todayVisitors}</div>
          <div style="color: #999; font-size: 12px;">Bugünkü Ziyaretçi</div>
        </div>
        <div style="display: inline-block; background: #252525; padding: 15px 25px; border-radius: 8px; margin: 5px;">
          <div style="color: #d4af37; font-size: 24px; font-weight: bold;">${stats.todayClicks}</div>
          <div style="color: #999; font-size: 12px;">Bugünkü Tıklama</div>
        </div>
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">Bu otomatik bir rapordur - CasinoHub Admin</p>
    </div>
  `;
}

function generateWeeklyReportHtml(stats) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 30px; border-radius: 12px;">
      <h1 style="color: #d4af37; margin-bottom: 20px;">Haftalık Rapor</h1>
      <p style="color: #999;">Hafta: ${new Date().toLocaleDateString("tr-TR")}</p>
      <div style="margin: 20px 0;">
        <div style="display: inline-block; background: #252525; padding: 15px 25px; border-radius: 8px; margin: 5px;">
          <div style="color: #d4af37; font-size: 24px; font-weight: bold;">${stats.weeklyVisitors}</div>
          <div style="color: #999; font-size: 12px;">Haftalık Ziyaretçi</div>
        </div>
        <div style="display: inline-block; background: #252525; padding: 15px 25px; border-radius: 8px; margin: 5px;">
          <div style="color: #d4af37; font-size: 24px; font-weight: bold;">${stats.weeklyClicks}</div>
          <div style="color: #999; font-size: 12px;">Haftalık Tıklama</div>
        </div>
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">Bu otomatik bir rapordur - CasinoHub Admin</p>
    </div>
  `;
}

function generateAnomalyAlertHtml(type, current, average) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 30px; border-radius: 12px;">
      <h1 style="color: #ef4444; margin-bottom: 20px;">⚠️ Anomali Uyarısı</h1>
      <p style="color: #999;">Tarih: ${new Date().toLocaleDateString("tr-TR")} ${new Date().toLocaleTimeString("tr-TR")}</p>
      <div style="background: #252525; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
        <p style="color: #fff; margin: 0;"><strong>${type}</strong> değerinde anormal değişiklik tespit edildi.</p>
        <p style="color: #999; margin: 10px 0 0 0;">Mevcut: <strong style="color: #ef4444;">${current}</strong> | Ortalama: <strong style="color: #d4af37;">${average}</strong></p>
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">Bu otomatik bir uyarıdır - CasinoHub Admin</p>
    </div>
  `;
}

module.exports = {
  sendEmail,
  generateDailyReportHtml,
  generateWeeklyReportHtml,
  generateAnomalyAlertHtml,
};
