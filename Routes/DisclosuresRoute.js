const express = require("express");
const { createDisclosures,  getDisclosures } = require("../Controllers/DisclosuresController.js")
const upload = require("../middleware/upload");
// testing tds routes
const router = express.Router();
router.get('/disclosure', (req, res) => {
    res.send("This is the Disclosure route");
});

router.post("/create_disclosure", upload.single("file"), createDisclosures);
router.get("/get_disclosure", getDisclosures);


module.exports = router;