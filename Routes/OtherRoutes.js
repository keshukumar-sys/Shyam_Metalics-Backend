const express = require("express");
const router = express.Router();
const { createOther, getOtherDetails } = require("../Controllers/OtherController");
const upload = require("../middleware/upload");

// Test route
router.get("/ot", (req, res) => {
    res.send("This is the other testing route");
});

// Create a new Other record
router.post("/add_other",upload.single("file"), createOther);

// Get Other records
router.get("/get_other", getOtherDetails);

module.exports = router;
