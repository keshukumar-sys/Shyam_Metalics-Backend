const express = require("express");
const { createPolicy, getAllPolicies, deleteById } = require("../Controllers/PolicyController");
const router = express.Router();
const upload = require("../middleware/upload");
// testing route work
router.get('/p' , (req , res)=>{
    res.send("welcome to the policy route");
})


router.post("/add_policy" ,upload.single("file"), createPolicy);
router.get("/get_policy" , getAllPolicies);
router.delete("/delete" , deleteById);

module.exports = router;