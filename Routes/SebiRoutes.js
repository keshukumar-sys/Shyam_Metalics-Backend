const express = require("express");
const { createSebi, getSebi } = require("../Controllers/SebiController");
const upload = require("../middleware/upload");
const router = express.Router();

// testing route
router.get('/s', (req, res) => {
  res.send("Welcome to the SEBI route");
});

// create sebi
router.post("/add_sebi",upload.single("sebi_file"), createSebi);

// get all sebi details
router.get("/get_sebi", getSebi);

module.exports = router;
