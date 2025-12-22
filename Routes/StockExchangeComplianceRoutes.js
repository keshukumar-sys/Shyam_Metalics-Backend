const express = require("express");
const {
  addComplianceDetail,
  getComplianceDetails,
  deleteById } = require("../Controllers/StockExchangeComplianceController");
const upload = require('../middleware/upload.js');
const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.send("Welcome to Stock Exchange Compliance route");
});

// Add / Append compliance details
router.post("/add", upload.single("file"), addComplianceDetail);

// Get all compliance details for a selected option
router.get("/get/:option", getComplianceDetails);
router.delete("/delete" , deleteById);
module.exports = router;
