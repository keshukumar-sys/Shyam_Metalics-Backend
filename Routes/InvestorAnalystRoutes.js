const express = require("express");
const { createInvestorAnalyst, getInvestorAnalyst, deleteById } = require("../Controllers/InvestorAnalystController");
const upload = require("../middleware/upload");
const router = express.Router();

// Testing route
router.get('/ia', (req, res) => {
  res.send("Welcome to the Investor/Analyst route");
});

// Create / add investor analyst details
router.post("/add_investor_analyst",upload.single("investor_analyst_file"), createInvestorAnalyst);

// Get all investor analyst details
router.get("/get_investor_analyst", getInvestorAnalyst);
router.delete("/delete" , deleteById);
module.exports = router;
