const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../Model/UserModel");
const { requireRole } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// middleware to authenticate token for routes inside this router
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Authorization required" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid authorization format" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password required" });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, role: user.role, email: user.email });
});

// create uploader (only admin allowed)
router.post("/create-uploader", async (req, res) => {
  try {
    const adminAuth = req.headers.authorization;
    if (!adminAuth) return res.status(401).json({ error: "Authorization required" });
    const adminToken = adminAuth.split(" ")[1];
    const adminPayload = jwt.verify(adminToken, JWT_SECRET);
    const admin = await User.findById(adminPayload.id);
    if (!admin || admin.role !== "admin") return res.status(403).json({ error: "Only admin can create uploaders" });

    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User already exists" });
    const newUser = await User.create({ email, password, role: "uploader" });
    res.json({ success: true, email: newUser.email, role: newUser.role });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired admin token" });
  }
});

// List all users (admin only)
router.get("/users", authenticate, requireRole(["admin"]), async (req, res) => {
  try {
    const users = await User.find({}).select("_id email role createdAt").sort({ createdAt: -1 });
    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Update user role (admin only)
router.put("/users/:id", authenticate, requireRole(["admin"]), async (req, res) => {
  try {
    const { role } = req.body || {};
    const { id } = req.params;
    if (!role) return res.status(400).json({ error: "role required" });
    // prevent admin from demoting themselves
    if (req.user._id.toString() === id && role !== "admin") {
      return res.status(400).json({ error: "Cannot change your own role" });
    }
    const usr = await User.findByIdAndUpdate(id, { role }, { new: true }).select("_id email role");
    if (!usr) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, data: usr });
  } catch (err) {
    res.status(500).json({ error: "Failed to update role" });
  }
});

// Delete user (admin only)
router.delete("/users/:id", authenticate, requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    // prevent admin from deleting themselves
    if (req.user._id.toString() === id) return res.status(400).json({ error: "Cannot delete your own account" });
    const usr = await User.findByIdAndDelete(id).select("_id email role");
    if (!usr) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, data: usr });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
