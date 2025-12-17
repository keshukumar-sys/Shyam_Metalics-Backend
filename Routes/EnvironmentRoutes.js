const express = require("express");
const router = express.Router();


const {createEnvironment , getEnvironment} = require("../Controllers/EnvironmentController");
const upload = require("../middleware/upload");
// testing emvironment route
router.get("/en" ,(req , res)=>{
    res.send("This is the environment testing route");
});


router.post("/create_environment" ,upload.single("file"), createEnvironment);
router.get("/get_environment" , getEnvironment);

module.exports = router;