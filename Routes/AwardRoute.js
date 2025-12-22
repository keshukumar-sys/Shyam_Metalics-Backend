const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createAwards,
  getAwards,
  deleteById
} = require("../Controllers/AwardController");

// Test route
router.get("/test", (req, res) => {
  res.status(200).send("Awards route working");
});

// Create award
router.post("/create_awards", upload.single("image"), createAwards);

// Get awards
router.get("/get_awards", getAwards);
router.delete("/delete" , deleteById);

module.exports = router;
