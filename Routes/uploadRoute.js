const express = require("express")
const router = express.Router();
const upload = require("../middleware/upload");
const uploadtoS3 = require("../config/s3Uploader");
const Upload = require("../Model/ExtraUpload");

router.post("/upload", upload.single("file"), async (req, res) => {
    console.log("Uploading file");
    const { name } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const file = await uploadtoS3(req.file, "extrafiles");
        const newFile = await Upload.create({ name, file });
        return res.status(200).json({ newFile });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to upload file" });
    }
});
router.get("/getupload", async (req, res) => {
    try {
        const files = await Upload.find();
        return res.status(200).json({ files });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch files" });
    }
});

module.exports = router;