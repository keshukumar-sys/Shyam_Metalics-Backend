const express = require("express");
const router = express.Router();


const { createEnvironment, getEnvironment, deleteById ,updateEnvironment } = require("../Controllers/EnvironmentController");
const upload = require("../middleware/upload");
// testing emvironment route
router.get("/en" ,(req , res)=>{
    res.send("This is the environment testing route");
});


router.post("/create_environment" ,upload.single("file"), createEnvironment);
router.get("/get_environment" , getEnvironment);
router.delete("/delete" , deleteById);
router.put("/update_environment/:id", upload.single("file"), updateEnvironment);

module.exports = router;