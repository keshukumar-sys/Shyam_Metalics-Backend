const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createQip,
  getQip,
  deleteById,
  updateQipById
} = require("../Controllers/QipController");

// Test route
router.get("/test", (req, res) => {
  res.status(200).send("QIP route working");
});

// Create QIP
router.post("/add_qip", upload.single("file"), createQip);

// Get all QIPs
router.get("/get_qip", getQip);

// Delete QIP
router.delete("/delete", deleteById);

// Update QIP
router.put("/update/:id", upload.single("file"), updateQipById);

module.exports = router;
