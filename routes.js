const express = require("express");
const upload = require("./middleware/upload");

// Import Controllers
const {
  addCorporateAnnouncement,
  getCorporateAnnouncement,
} = require("./Controllers/CorporateAnnouncementController");

const {
  createEnvironment,
  getEnvironment,
} = require("./Controllers/EnvironmentController");

const { createFamiliar, getFamiliar } = require("./Controllers/FamiliarController");

const {
  addFinancialDetail,
  getFinancialDetails,
} = require("./Controllers/FinancialContoller");

const {
  createInvestorAnalyst,
  getInvestorAnalyst,
} = require("./Controllers/InvestorAnalystController");

const {
  addInvestorInformationDetail,
  getInvestorInformationDetails,
} = require("./Controllers/InvestorInformationController");

const { createOther, getOtherDetails } = require("./Controllers/OtherController");

const {
  createPolicy,
  getAllPolicies,
} = require("./Controllers/PolicyController");

const { createSebi, getSebi } = require("./Controllers/SebiController");

const {
  addComplianceDetail,
  getComplianceDetails,
} = require("./Controllers/StockExchangeComplianceController");

const { createTds, getTds } = require("./Controllers/TdsContoller");

// Initialize router
const router = express.Router();

// ==========================================
// POLICY ROUTES - /policy
// ==========================================
router.get("/policy/p", (req, res) => {
  res.send("welcome to the policy route");
});
router.post("/policy/add_policy", upload.single("policy_file"), createPolicy);
router.get("/policy/get_policy", getAllPolicies);

// ==========================================
// ENVIRONMENT ROUTES - /environment
// ==========================================
router.get("/environment/en", (req, res) => {
  res.send("This is the environment testing route");
});
router.post(
  "/environment/create_environment",
  upload.single("detail_file"),
  createEnvironment
);
router.get("/environment/get_environment", getEnvironment);

// ==========================================
// TDS ROUTES - /tds
// ==========================================
router.get("/tds/tds", (req, res) => {
  res.send("This is the tds route");
});
router.post("/tds/create_tds", upload.single("tds_file"), createTds);
router.get("/tds/get_tds", getTds);

// ==========================================
// SEBI ROUTES - /sebi
// ==========================================
router.get("/sebi/s", (req, res) => {
  res.send("Welcome to the SEBI route");
});
router.post("/sebi/add_sebi", upload.single("sebi_file"), createSebi);
router.get("/sebi/get_sebi", getSebi);

// ==========================================
// FAMILIAR ROUTES - /familiar
// ==========================================
router.get("/familiar/f", (req, res) => {
  res.send("Welcome to the Familiar route");
});
router.post(
  "/familiar/add_familiar",
  upload.single("familiar_file"),
  createFamiliar
);
router.get("/familiar/get_familiar", getFamiliar);

// ==========================================
// FINANCIAL ROUTES - /financial
// ==========================================
router.get("/financial/fin", (req, res) => {
  res.send("Welcome to the Financial route");
});
router.post("/financial/add_detail", upload.single("file"), addFinancialDetail);
router.get("/financial/get_detail/:option", getFinancialDetails);

// ==========================================
// CORPORATE ANNOUNCEMENT ROUTES - /corporate
// ==========================================
router.get("/corporate/ca", (req, res) => {
  res.send("Welcome to Corporate Announcement route");
});
router.post(
  "/corporate/add",
  upload.single("file"),
  addCorporateAnnouncement
);
router.get("/corporate/get/:option", getCorporateAnnouncement);

// ==========================================
// STOCK EXCHANGE COMPLIANCE ROUTES - /stock
// ==========================================
router.get("/stock/test", (req, res) => {
  res.send("Welcome to Stock Exchange Compliance route");
});
router.post("/stock/add", upload.single("file"), addComplianceDetail);
router.get("/stock/get/:option", getComplianceDetails);

// ==========================================
// INVESTOR ANALYST ROUTES - /investor-analyst
// ==========================================
router.get("/investor-analyst/ia", (req, res) => {
  res.send("Welcome to the Investor/Analyst route");
});
router.post(
  "/investor-analyst/add_investor_analyst",
  upload.single("investor_analyst_file"),
  createInvestorAnalyst
);
router.get("/investor-analyst/get_investor_analyst", getInvestorAnalyst);

// ==========================================
// INVESTOR INFORMATION ROUTES - /investor-information
// ==========================================
router.get("/investor-information/inInf", (req, res) => {
  res.send("This is investor information testing route");
});
router.post(
  "/investor-information/add_investor_information",
  upload.single("file"),
  addInvestorInformationDetail
);
router.get(
  "/investor-information/get_investor_information",
  getInvestorInformationDetails
);

// ==========================================
// OTHER ROUTES - /other
// ==========================================
router.get("/other/ot", (req, res) => {
  res.send("This is the other testing route");
});
router.post("/other/add_other", upload.single("file"), createOther);
router.get("/other/get_other", getOtherDetails);

module.exports = router;
