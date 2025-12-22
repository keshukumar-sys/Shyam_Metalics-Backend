const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { createBlog, getBlog, deleteById } = require("../Controllers/BlogConroller");
router.get("/testing" , (req , res)=>{
    console.log("Blogs route working well...");
    return res.send("Hello welcome to the blog route");
});

router.post("/create_blog" , upload.single("img"), createBlog);
router.get("/get_blog" ,getBlog);
router.delete("/delete" , deleteById);

module.exports = router;