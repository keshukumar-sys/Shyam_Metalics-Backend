const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { createBlog, getBlog, deleteById , updateBlog } = require("../Controllers/BlogConroller");
router.get("/testing" , (req , res)=>{
    console.log("Blogs route working well...");
    return res.send("Hello welcome to the blog route");
});

router.post("/create_blog" , upload.single("img"), createBlog);
router.get("/get_blog" ,getBlog);
router.delete("/delete" , deleteById);
router.put("/update_blog/:id", upload.single("img"), updateBlog);

module.exports = router;