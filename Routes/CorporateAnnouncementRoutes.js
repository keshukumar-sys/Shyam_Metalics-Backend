const express = require("express");
const {
  addCorporateAnnouncement,
  getCorporateAnnouncement,
} = require("../Controllers/CorporateAnnouncementController");
const upload = require("../middleware/upload");

const router = express.Router();

// Test route
router.get("/ca", (req, res) => {
  res.send("Welcome to Corporate Announcement route");
});

// Add / Append announcement
router.post("/add",upload.single("file"), addCorporateAnnouncement);

// Get all announcement details for a specific option
router.get("/get/:option", getCorporateAnnouncement);

module.exports = router;
