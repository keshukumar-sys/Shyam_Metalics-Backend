const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createAwards,
  getAwards,
} = require("../Controllers/AwardController");

// Test route
router.get("/test", (req, res) => {
  res.status(200).send("Awards route working");
});

// Create award
router.post("/create_awards", upload.single("image"), createAwards);

// Get awards
router.get("/get_awards", getAwards);

module.exports = router;
