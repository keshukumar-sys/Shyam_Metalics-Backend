const express = require("express");
const { addFinancialDetail, getFinancialDetails } = require("../Controllers/FinancialContoller");
const upload = require("../middleware/upload");
const router = express.Router();

// Test route
router.get("/fin", (req, res) => {
  res.send("Welcome to the Financial route");
});

// Add / Append financial details
router.post("/add_detail",upload.single("file"), addFinancialDetail);

// Get all financial details for a specific option
router.get("/get_detail/:option", getFinancialDetails);

module.exports = router;
