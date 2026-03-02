const { query } = require("../config/database");

function apiLogger(req, res, next) {
  const startTime = Date.now();

  const originalEnd = res.end;
  res.end = function (...args) {
    const responseTime = Date.now() - startTime;
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.connection?.remoteAddress || "unknown";

    try {
      query(
        "INSERT INTO api_logs (endpoint, method, ip, status_code, response_time) VALUES (?, ?, ?, ?, ?)",
        [req.path, req.method, ip, res.statusCode, responseTime]
      ).catch(() => {});
    } catch {
      // silently fail
    }

    originalEnd.apply(res, args);
  };

  next();
}

module.exports = apiLogger;
