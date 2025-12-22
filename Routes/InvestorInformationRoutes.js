const express = require("express");
const router = express.Router();
const {addInvestorInformationDetail, getInvestorInformationDetails, deleteById } = require("../Controllers/InvestorInformationController");
const upload = require("../middleware/upload");
// testing route
router.get("inInf" , (req , res)=>{
    res.send("This is investor information testing route");
});

router.post("/add_investor_information",upload.single("file"), addInvestorInformationDetail);
router.get("/get_investor_information/:option",  getInvestorInformationDetails);
router.delete("/delete" , deleteById);

module.exports = router;