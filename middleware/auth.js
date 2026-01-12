const jwt = require("jsonwebtoken");
const User = require("../Model/UserModel");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

const authMiddleware = async (req, res, next) => {
  if (req.method === "GET") return next(); // GET requests are free
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Authorization required" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid authorization format" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const requireRole = (roles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
  next();
};

module.exports = { authMiddleware, requireRole };
