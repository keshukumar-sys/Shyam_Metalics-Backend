const express = require("express");
const { createPolicy, getAllPolicies } = require("../Controllers/PolicyController");
const router = express.Router();
const upload = require("../middleware/upload");
// testing route work
router.get('/p' , (req , res)=>{
    res.send("welcome to the policy route");
})


router.post("/add_policy" ,upload.single("policy_file"), createPolicy);
router.get("/get_policy" , getAllPolicies);


module.exports = router;