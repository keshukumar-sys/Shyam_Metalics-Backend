const express = require("express");
const { createSebi, getSebi, deleteById ,updateSebiById } = require("../Controllers/SebiController");
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
router.delete("/delete" , deleteById);
router.put("/update_sebi/:id", upload.single("sebi_file"), updateSebiById);

module.exports = router;
