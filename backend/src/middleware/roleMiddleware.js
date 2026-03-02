function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    if (!roles.includes(req.user.role || "admin")) {
      return res.status(403).json({ success: false, error: "Insufficient permissions" });
    }
    next();
  };
}

module.exports = { requireRole };
