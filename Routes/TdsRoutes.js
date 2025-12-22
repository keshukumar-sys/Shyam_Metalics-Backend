const express = require('express');
const router = express.Router();


const {createTds, getTds , deleteById} = require("../Controllers/TdsContoller");
const upload = require("../middleware/upload");
// testing tds routes
router.get('tds' , (req,res)=>{
    res.send("This is the tds route");
});

router.post("/create_tds" ,upload.single("tds_file"),  createTds);
router.get("/get_tds" , getTds);
router.delete("/delete" , deleteById);

module.exports = router;